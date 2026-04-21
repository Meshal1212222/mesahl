"""Core LinkedIn bot: login, search, iterate listings, delegate to EasyApplyHandler."""
from __future__ import annotations

import random
import re
import time
from datetime import datetime
from pathlib import Path
from typing import Any
from urllib.parse import quote_plus

from selenium.common.exceptions import (
    NoSuchElementException,
    StaleElementReferenceException,
    TimeoutException,
    WebDriverException,
)
from selenium.webdriver.common.by import By
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait

from . import human
from .easy_apply import ApplyOutcome, EasyApplyHandler
from .logger import log
from .notifier import TelegramNotifier
from .stealth import build_driver
from .tracker import Tracker


LINKEDIN_HOME = "https://www.linkedin.com/"
LINKEDIN_LOGIN = "https://www.linkedin.com/login"
LINKEDIN_FEED = "https://www.linkedin.com/feed/"
JOB_SEARCH = "https://www.linkedin.com/jobs/search/"


DATE_PARAMS = {
    "past_24_hours": "r86400",
    "past_week": "r604800",
    "past_month": "r2592000",
    "any_time": "",
}

EXPERIENCE_PARAMS = {
    "internship": "1",
    "entry": "2",
    "associate": "3",
    "mid-senior": "4",
    "director": "5",
    "executive": "6",
}

JOB_TYPE_PARAMS = {
    "full-time": "F",
    "part-time": "P",
    "contract": "C",
    "temporary": "T",
    "internship": "I",
    "volunteer": "V",
    "other": "O",
}

REMOTE_PARAMS = {
    "on-site": "1",
    "remote": "2",
    "hybrid": "3",
}


class LinkedInBot:
    def __init__(self, cfg: dict[str, Any]):
        self.cfg = cfg
        self.driver = build_driver(cfg.get("browser", {}))
        self.wait = WebDriverWait(self.driver, 15)
        self.tracker = Tracker()
        self.notifier = TelegramNotifier(
            cfg.get("telegram", {}).get("token", ""),
            cfg.get("telegram", {}).get("chat_id", ""),
        )
        self.easy_apply = EasyApplyHandler(
            self.driver,
            cfg.get("answers", {}),
            cfg.get("question_matchers", []),
        )
        self.screenshots_dir = Path("./screenshots")
        self.screenshots_dir.mkdir(exist_ok=True)
        self._applied_this_run = 0

    # ----------------------------------------------------------------- public
    def run(self) -> dict[str, int]:
        stats = {"submitted": 0, "skipped": 0, "failed": 0, "already": 0, "seen": 0}
        try:
            self._login()
            for kw in self.cfg["search"]["keywords"]:
                for loc in self.cfg["search"]["locations"]:
                    if self._hit_limits():
                        log.info("Daily/run limit reached — stopping search loop.")
                        break
                    log.info(f"Searching: keyword='{kw}' location='{loc}'")
                    self._search(kw, loc)
                    self._process_results(stats)
                if self._hit_limits():
                    break
        except Exception as e:
            log.exception(f"Fatal error: {e}")
            self._screenshot("fatal_error")
        finally:
            self._report(stats)
            self._shutdown()
        return stats

    # ------------------------------------------------------------------ login
    def _login(self) -> None:
        log.info("Navigating to LinkedIn …")
        self.driver.get(LINKEDIN_HOME)
        human.sleep(2.0, 4.5)

        # If profile cookie is valid, we land on /feed without asking to log in
        if "feed" in self.driver.current_url:
            log.info("Already logged in (cookie restored).")
            human.random_idle(self.driver, 1.0, 2.5)
            return

        self.driver.get(LINKEDIN_LOGIN)
        human.sleep(1.8, 3.6)

        try:
            email_input = self.wait.until(
                EC.visibility_of_element_located((By.ID, "username"))
            )
            pw_input = self.driver.find_element(By.ID, "password")
        except TimeoutException:
            # Already authenticated but on a different page — go to feed
            self.driver.get(LINKEDIN_FEED)
            human.sleep(2.0, 3.5)
            return

        human.human_type(email_input, self.cfg["credentials"]["email"])
        human.sleep(0.4, 1.1)
        human.human_type(pw_input, self.cfg["credentials"]["password"])
        human.sleep(0.5, 1.3)

        submit = self.driver.find_element(By.CSS_SELECTOR, "button[type='submit']")
        human.human_click(self.driver, submit)
        human.sleep(3.0, 6.0)

        # Handle possible checkpoints: 2FA, captcha, security verification
        if self._checkpoint_detected():
            log.warning(
                "LinkedIn security checkpoint detected. Complete it manually in "
                "the open browser. Waiting up to 3 minutes …"
            )
            self._screenshot("checkpoint")
            self.notifier.send(
                "⚠️ LinkedIn طلب تحقق أمان (2FA/captcha). افتح المتصفح وكمل يدوياً."
            )
            ok = self._wait_until(
                lambda d: "feed" in d.current_url or "jobs" in d.current_url,
                timeout=180,
            )
            if not ok:
                raise RuntimeError("Security checkpoint not resolved in time.")

        log.success("Logged in.")
        human.random_idle(self.driver, 2.0, 4.0)

    def _checkpoint_detected(self) -> bool:
        url = self.driver.current_url.lower()
        if any(k in url for k in ["checkpoint", "challenge", "captcha", "add-phone"]):
            return True
        try:
            self.driver.find_element(By.ID, "captcha-internal")
            return True
        except NoSuchElementException:
            pass
        return False

    def _wait_until(self, predicate, timeout: int = 60) -> bool:
        end = time.time() + timeout
        while time.time() < end:
            try:
                if predicate(self.driver):
                    return True
            except WebDriverException:
                pass
            time.sleep(2)
        return False

    # ----------------------------------------------------------------- search
    def _search(self, keywords: str, location: str) -> None:
        params = [
            f"keywords={quote_plus(keywords)}",
            f"location={quote_plus(location)}",
        ]
        f = self.cfg["search"].get("filters", {})

        date = DATE_PARAMS.get(f.get("date_posted", "past_week"))
        if date:
            params.append(f"f_TPR={date}")

        if f.get("easy_apply_only"):
            params.append("f_AL=true")

        exp = [EXPERIENCE_PARAMS[e] for e in f.get("experience_levels", []) if e in EXPERIENCE_PARAMS]
        if exp:
            params.append("f_E=" + ",".join(exp))

        jt = [JOB_TYPE_PARAMS[j] for j in f.get("job_types", []) if j in JOB_TYPE_PARAMS]
        if jt:
            params.append("f_JT=" + ",".join(jt))

        rm = [REMOTE_PARAMS[r] for r in f.get("remote", []) if r in REMOTE_PARAMS]
        if rm:
            params.append("f_WT=" + ",".join(rm))

        params.append("sortBy=DD")  # most recent first

        url = JOB_SEARCH + "?" + "&".join(params)
        self.driver.get(url)
        human.sleep(3.0, 5.5)
        human.human_scroll(self.driver, "down", random.randint(250, 450))
        human.sleep(0.8, 1.8)

    # --------------------------------------------------------- result walking
    def _process_results(self, stats: dict[str, int]) -> None:
        page = 1
        max_pages = 8
        while page <= max_pages:
            if self._hit_limits():
                return
            cards = self._collect_cards()
            if not cards:
                log.info("No job cards on this page. Moving on.")
                return
            log.info(f"Page {page}: {len(cards)} cards.")

            for idx in range(len(cards)):
                if self._hit_limits():
                    return
                # Re-fetch cards each iteration: DOM mutates as we scroll/click.
                cards = self._collect_cards()
                if idx >= len(cards):
                    break
                card = cards[idx]
                try:
                    self._handle_card(card, stats)
                except StaleElementReferenceException:
                    continue
                except Exception as e:
                    log.warning(f"Card error: {e}")
                    self._screenshot(f"card_err_{stats['seen']}")
                    continue

                # Random idle between jobs
                human.sleep_range(
                    self.cfg["limits"].get("delay_between_applications", [30, 90])
                    if stats.get("_last_submitted")
                    else self.cfg["limits"].get("delay_between_actions", [2, 6])
                )
                stats.pop("_last_submitted", None)

            if not self._go_next_page():
                return
            page += 1
            human.sleep(4.0, 8.0)

    def _collect_cards(self) -> list[WebElement]:
        # Scroll the jobs panel to lazy-load everything before reading
        try:
            panel = self.driver.find_element(
                By.CSS_SELECTOR, "div.jobs-search-results-list, div.scaffold-layout__list"
            )
        except NoSuchElementException:
            return []

        last_h = 0
        for _ in range(8):
            self.driver.execute_script(
                "arguments[0].scrollTop = arguments[0].scrollHeight;", panel
            )
            human.sleep(0.6, 1.2)
            new_h = self.driver.execute_script("return arguments[0].scrollHeight;", panel)
            if new_h == last_h:
                break
            last_h = new_h

        self.driver.execute_script("arguments[0].scrollTop = 0;", panel)
        human.sleep(0.4, 0.9)

        return self.driver.find_elements(
            By.CSS_SELECTOR,
            "li.jobs-search-results__list-item, div.job-card-container, li.scaffold-layout__list-item",
        )

    def _handle_card(self, card: WebElement, stats: dict[str, int]) -> None:
        stats["seen"] += 1
        job_id = self._extract_job_id(card)
        title = self._safe_text(card, "a.job-card-list__title, a.job-card-container__link, .job-card-list__title")
        company = self._safe_text(card, ".job-card-container__company-name, .artdeco-entity-lockup__subtitle")
        log.debug(f"Card: id={job_id} | {title} @ {company}")

        if not job_id:
            return
        if self.tracker.has_applied(job_id):
            stats["already"] += 1
            return
        if self.tracker.is_skipped(job_id):
            return

        if self._blacklisted(title, company):
            self.tracker.mark_skipped(job_id, "blacklisted")
            stats["skipped"] += 1
            return

        # Click card to open right-hand detail pane
        try:
            human.human_move_to(self.driver, card)
            human.sleep(0.2, 0.6)
            card.click()
        except Exception:
            self.driver.execute_script("arguments[0].scrollIntoView({block:'center'});", card)
            human.sleep(0.2, 0.6)
            try:
                card.click()
            except Exception:
                return

        human.reading_pause(280)

        # "Already applied" badge on detail pane
        if self.driver.find_elements(
            By.CSS_SELECTOR, "span.artdeco-inline-feedback--success"
        ) and any(
            "Applied" in el.text
            for el in self.driver.find_elements(
                By.CSS_SELECTOR, "span.artdeco-inline-feedback__message"
            )
        ):
            self.tracker.mark_skipped(job_id, "already_applied_badge")
            stats["already"] += 1
            return

        outcome = self.easy_apply.apply()
        meta = {"title": title, "company": company, "job_id": job_id}

        if outcome == ApplyOutcome.SUBMITTED:
            self.tracker.mark_applied(job_id, meta)
            self._applied_this_run += 1
            stats["submitted"] += 1
            stats["_last_submitted"] = True
            log.success(f"✓ Applied: {title} @ {company} (id={job_id})")
            if self._applied_this_run % 5 == 0:
                long_break = random.uniform(90, 180)
                log.info(f"Cooldown break: {long_break:.0f}s")
                time.sleep(long_break)
        elif outcome == ApplyOutcome.ALREADY:
            self.tracker.mark_skipped(job_id, "already_applied")
            stats["already"] += 1
        elif outcome == ApplyOutcome.SKIPPED:
            self.tracker.mark_skipped(job_id, "form_skipped")
            stats["skipped"] += 1
        else:
            stats["failed"] += 1
            self._screenshot(f"fail_{job_id}")

    # ------------------------------------------------------------- navigation
    def _go_next_page(self) -> bool:
        try:
            nxt = self.driver.find_element(
                By.CSS_SELECTOR, "button[aria-label='View next page']"
            )
            if not nxt.is_enabled():
                return False
            human.human_click(self.driver, nxt)
            human.sleep(2.5, 4.5)
            return True
        except NoSuchElementException:
            return False

    # ----------------------------------------------------------------- helpers
    @staticmethod
    def _safe_text(parent: WebElement, css: str) -> str:
        for sel in css.split(","):
            try:
                el = parent.find_element(By.CSS_SELECTOR, sel.strip())
                if el.text.strip():
                    return el.text.strip()
            except NoSuchElementException:
                continue
        return ""

    def _extract_job_id(self, card: WebElement) -> str:
        # From data attribute
        for attr in ("data-job-id", "data-occludable-job-id", "data-entity-urn"):
            val = card.get_attribute(attr)
            if val:
                m = re.search(r"(\d{6,})", val)
                if m:
                    return m.group(1)
        # From link
        try:
            a = card.find_element(By.CSS_SELECTOR, "a[href*='/jobs/view/']")
            href = a.get_attribute("href") or ""
            m = re.search(r"/jobs/view/(\d+)", href)
            if m:
                return m.group(1)
        except NoSuchElementException:
            pass
        return ""

    def _blacklisted(self, title: str, company: str) -> bool:
        bl = self.cfg.get("blacklist", {})
        t = (title or "").lower()
        c = (company or "").lower()
        for kw in bl.get("title_keywords", []):
            if kw.lower() in t:
                return True
        for kw in bl.get("company_keywords", []):
            if kw.lower() in c:
                return True
        return False

    def _hit_limits(self) -> bool:
        lim = self.cfg.get("limits", {})
        if self._applied_this_run >= lim.get("max_applications_per_run", 15):
            return True
        if self.tracker.applied_today() >= lim.get("max_applications_per_day", 25):
            return True
        return False

    def _screenshot(self, label: str) -> None:
        try:
            ts = datetime.now().strftime("%Y%m%d_%H%M%S")
            path = self.screenshots_dir / f"{ts}_{label}.png"
            self.driver.save_screenshot(str(path))
            log.debug(f"Saved screenshot: {path}")
        except Exception:
            pass

    def _report(self, stats: dict[str, int]) -> None:
        msg = (
            f"<b>LinkedIn Bot — {datetime.now().strftime('%Y-%m-%d %H:%M')}</b>\n"
            f"✅ قُدّم: <b>{stats['submitted']}</b>\n"
            f"↩️ تخطيت: {stats['skipped']}\n"
            f"🔁 مقدّم مسبقاً: {stats['already']}\n"
            f"❌ فشل: {stats['failed']}\n"
            f"👀 وظائف شوفت: {stats['seen']}\n"
            f"📊 إجمالي اليوم: {self.tracker.applied_today()}"
        )
        log.info(msg.replace("<b>", "").replace("</b>", ""))
        self.notifier.send(msg)

    def _shutdown(self) -> None:
        try:
            self.driver.quit()
        except Exception:
            pass
