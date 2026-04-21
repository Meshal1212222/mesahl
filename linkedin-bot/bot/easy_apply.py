"""Easy Apply form handler: walks multi-step modal, answers questions, submits."""
from __future__ import annotations

import re
from typing import Any

from selenium.common.exceptions import (
    NoSuchElementException,
    StaleElementReferenceException,
    TimeoutException,
)
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait

from . import human
from .logger import log


MODAL = (By.CSS_SELECTOR, "div.jobs-easy-apply-modal")
CONTENT = (By.CSS_SELECTOR, "div.jobs-easy-apply-content")
NEXT_BTN = (By.CSS_SELECTOR, "button[aria-label='Continue to next step']")
REVIEW_BTN = (By.CSS_SELECTOR, "button[aria-label='Review your application']")
SUBMIT_BTN = (By.CSS_SELECTOR, "button[aria-label='Submit application']")
DISMISS_BTN = (By.CSS_SELECTOR, "button[aria-label='Dismiss']")
DISCARD_BTN = (By.XPATH, "//button[.//span[text()='Discard']]")
FOLLOW_CHK = (By.CSS_SELECTOR, "label[for='follow-company-checkbox']")


class ApplyOutcome:
    SUBMITTED = "submitted"
    SKIPPED = "skipped"
    FAILED = "failed"
    ALREADY = "already_applied"


class EasyApplyHandler:
    def __init__(self, driver: WebDriver, answers: dict[str, Any], matchers: list[dict]):
        self.driver = driver
        self.answers = answers
        self.matchers = matchers
        self.wait = WebDriverWait(driver, 12)

    # ---------------------------------------------------------------- helpers
    def _find(self, parent: WebElement, by, selector):
        try:
            return parent.find_element(by, selector)
        except NoSuchElementException:
            return None

    def _find_all(self, parent: WebElement, by, selector):
        try:
            return parent.find_elements(by, selector)
        except NoSuchElementException:
            return []

    def _answer_for(self, question_text: str) -> Any | None:
        q = question_text.lower()
        for matcher in self.matchers:
            if all(kw.lower() in q for kw in matcher.get("keywords", [])):
                key = matcher["answer"]
                if key in self.answers:
                    return self.answers[key]
        # heuristic fallback: numeric question → default_number, else default_text
        if re.search(r"how many|years|number|\d", q):
            return self.answers.get("default_number", "2")
        if any(w in q for w in ["yes", "no", "do you", "are you", "have you", "can you"]):
            return True
        return self.answers.get("default_text", "Yes")

    # --------------------------------------------------------- question types
    def _fill_text_input(self, input_el: WebElement, label_text: str) -> bool:
        answer = self._answer_for(label_text)
        if answer is None:
            return False
        value = str(answer) if not isinstance(answer, bool) else ("Yes" if answer else "No")
        try:
            human.human_type(input_el, value)
            return True
        except Exception as e:
            log.debug(f"text fill failed for '{label_text}': {e}")
            return False

    def _fill_textarea(self, area_el: WebElement, label_text: str) -> bool:
        return self._fill_text_input(area_el, label_text)

    def _fill_select(self, select_el: WebElement, label_text: str) -> bool:
        answer = self._answer_for(label_text)
        try:
            sel = Select(select_el)
            options = [o.text.strip() for o in sel.options]
            if not options:
                return False
            # Boolean answers → yes/no option
            target = None
            if isinstance(answer, bool):
                want = "yes" if answer else "no"
                for o in options:
                    if o.lower().strip() == want:
                        target = o
                        break
            # Exact string match
            if target is None and answer is not None:
                for o in options:
                    if str(answer).lower() == o.lower():
                        target = o
                        break
            # Substring match
            if target is None and answer is not None:
                for o in options:
                    if o and str(answer).lower() in o.lower():
                        target = o
                        break
            # Skip "Select an option" (usually index 0)
            if target is None:
                non_placeholder = [o for o in options if o and "select" not in o.lower()]
                if non_placeholder:
                    target = non_placeholder[0]
            if target is None:
                return False
            sel.select_by_visible_text(target)
            human.micro_pause()
            return True
        except Exception as e:
            log.debug(f"select fill failed for '{label_text}': {e}")
            return False

    def _fill_radio(self, container: WebElement, label_text: str) -> bool:
        answer = self._answer_for(label_text)
        try:
            options = container.find_elements(
                By.CSS_SELECTOR, "input[type='radio']"
            )
            if not options:
                return False
            want_yes = (answer is True) or (
                isinstance(answer, str) and answer.lower() in {"yes", "true"}
            )
            want_no = (answer is False) or (
                isinstance(answer, str) and answer.lower() in {"no", "false"}
            )
            chosen = None
            for opt in options:
                label_el = None
                try:
                    label_el = container.find_element(
                        By.CSS_SELECTOR, f"label[for='{opt.get_attribute('id')}']"
                    )
                except NoSuchElementException:
                    pass
                label_txt = (label_el.text if label_el else "").strip().lower()
                if want_yes and label_txt == "yes":
                    chosen = label_el or opt
                    break
                if want_no and label_txt == "no":
                    chosen = label_el or opt
                    break
            if chosen is None:
                # choose first non-disabled option as fallback
                chosen = options[0]
            human.human_click(self.driver, chosen)
            return True
        except Exception as e:
            log.debug(f"radio fill failed for '{label_text}': {e}")
            return False

    def _fill_checkbox(self, container: WebElement, label_text: str) -> bool:
        answer = self._answer_for(label_text)
        try:
            box = container.find_element(By.CSS_SELECTOR, "input[type='checkbox']")
            checked = box.is_selected()
            want = bool(answer) if isinstance(answer, bool) else True
            if want != checked:
                label_el = None
                try:
                    label_el = container.find_element(
                        By.CSS_SELECTOR, f"label[for='{box.get_attribute('id')}']"
                    )
                except NoSuchElementException:
                    pass
                human.human_click(self.driver, label_el or box)
            return True
        except Exception as e:
            log.debug(f"checkbox fill failed for '{label_text}': {e}")
            return False

    # ------------------------------------------------------------- form walker
    def _label_text_for(self, group: WebElement) -> str:
        for sel in [
            "label",
            ".artdeco-text-input--label",
            ".fb-dash-form-element__label",
            "legend",
            "span[data-test-form-builder-radio-button-form-component__title]",
        ]:
            el = self._find(group, By.CSS_SELECTOR, sel)
            if el and el.text.strip():
                return el.text.strip()
        return group.text.split("\n")[0].strip() if group.text else ""

    def _fill_current_step(self, modal: WebElement) -> int:
        """Fill every input on the current Easy Apply step. Returns count filled."""
        filled = 0
        # LinkedIn wraps each question in these containers (class names drift, so
        # we use multiple selectors and dedupe).
        groups: list[WebElement] = []
        for sel in [
            "div.jobs-easy-apply-form-section__grouping",
            "div.fb-dash-form-element",
            "fieldset.fb-dash-form-element",
        ]:
            groups.extend(modal.find_elements(By.CSS_SELECTOR, sel))

        seen = set()
        for group in groups:
            try:
                gid = group.id
            except Exception:
                gid = id(group)
            if gid in seen:
                continue
            seen.add(gid)

            label_text = self._label_text_for(group)
            if not label_text:
                continue

            # Determine control type present in the group
            if self._find_all(group, By.CSS_SELECTOR, "input[type='radio']"):
                if self._fill_radio(group, label_text):
                    filled += 1
                continue
            if self._find_all(group, By.CSS_SELECTOR, "input[type='checkbox']"):
                if self._fill_checkbox(group, label_text):
                    filled += 1
                continue
            sel_el = self._find(group, By.CSS_SELECTOR, "select")
            if sel_el:
                if self._fill_select(sel_el, label_text):
                    filled += 1
                continue
            txt_el = self._find(group, By.CSS_SELECTOR, "input[type='text'], input[type='tel'], input[type='email'], input[type='number']")
            if txt_el:
                # Skip if already filled with the right value
                existing = (txt_el.get_attribute("value") or "").strip()
                if existing and len(existing) > 1:
                    continue
                if self._fill_text_input(txt_el, label_text):
                    filled += 1
                continue
            ta_el = self._find(group, By.CSS_SELECTOR, "textarea")
            if ta_el:
                if (ta_el.get_attribute("value") or "").strip():
                    continue
                if self._fill_textarea(ta_el, label_text):
                    filled += 1
                continue

        # Unfollow company (don't auto-follow everywhere)
        follow = self._find(modal, By.CSS_SELECTOR, "label[for='follow-company-checkbox']")
        if follow:
            try:
                box = modal.find_element(By.ID, "follow-company-checkbox")
                if box.is_selected():
                    human.human_click(self.driver, follow)
            except NoSuchElementException:
                pass

        return filled

    # ------------------------------------------------------------------ apply
    def apply(self) -> str:
        """Run the Easy Apply flow on the currently-open job detail page."""
        try:
            btn = self.wait.until(
                EC.element_to_be_clickable(
                    (By.CSS_SELECTOR, "button.jobs-apply-button[aria-label*='Easy Apply']")
                )
            )
        except TimeoutException:
            # Maybe already applied
            if self.driver.find_elements(By.XPATH, "//*[contains(text(),'Applied')]"):
                return ApplyOutcome.ALREADY
            return ApplyOutcome.SKIPPED

        human.human_click(self.driver, btn)

        try:
            modal = self.wait.until(EC.visibility_of_element_located(MODAL))
        except TimeoutException:
            return ApplyOutcome.FAILED

        human.reading_pause(180)

        max_steps = 12
        for step in range(max_steps):
            try:
                modal = self.driver.find_element(*MODAL)
            except NoSuchElementException:
                return ApplyOutcome.FAILED

            try:
                self._fill_current_step(modal)
            except StaleElementReferenceException:
                pass

            human.sleep(0.6, 1.6)

            # Priority: Submit > Review > Next
            submit = self._find(modal, *SUBMIT_BTN)
            if submit and submit.is_enabled():
                # Uncheck 'follow company' one more time if present
                try:
                    follow_box = modal.find_element(By.ID, "follow-company-checkbox")
                    if follow_box.is_selected():
                        lbl = modal.find_element(*FOLLOW_CHK)
                        human.human_click(self.driver, lbl)
                except NoSuchElementException:
                    pass
                human.human_click(self.driver, submit)
                human.sleep(1.5, 3.0)
                # Close post-submit confirmation
                try:
                    dismiss = self.driver.find_element(*DISMISS_BTN)
                    human.human_click(self.driver, dismiss)
                except NoSuchElementException:
                    pass
                return ApplyOutcome.SUBMITTED

            review = self._find(modal, *REVIEW_BTN)
            if review and review.is_enabled():
                human.human_click(self.driver, review)
                human.sleep(0.8, 1.8)
                continue

            nxt = self._find(modal, *NEXT_BTN)
            if nxt and nxt.is_enabled():
                human.human_click(self.driver, nxt)
                human.sleep(0.8, 1.8)
                # Detect validation error → means some question unanswered
                errors = self.driver.find_elements(
                    By.CSS_SELECTOR, "div.artdeco-inline-feedback--error"
                )
                if errors:
                    log.warning(
                        f"Validation error on step {step+1}: "
                        f"{errors[0].text[:120]} — aborting this application."
                    )
                    self._discard()
                    return ApplyOutcome.SKIPPED
                continue

            # No actionable buttons → discard
            log.debug("No next/review/submit found; discarding.")
            self._discard()
            return ApplyOutcome.SKIPPED

        self._discard()
        return ApplyOutcome.FAILED

    def _discard(self) -> None:
        try:
            dismiss = self.driver.find_element(*DISMISS_BTN)
            human.human_click(self.driver, dismiss)
            human.sleep(0.4, 1.0)
            discard = self.driver.find_element(*DISCARD_BTN)
            human.human_click(self.driver, discard)
        except NoSuchElementException:
            # Try Escape as last resort
            try:
                self.driver.switch_to.active_element.send_keys(Keys.ESCAPE)
            except Exception:
                pass
