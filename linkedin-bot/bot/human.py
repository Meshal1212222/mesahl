"""Human-like interaction helpers to reduce bot detection risk."""
from __future__ import annotations

import math
import random
import time
from typing import Sequence

from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.remote.webdriver import WebDriver
from selenium.webdriver.remote.webelement import WebElement


def sleep(lo: float, hi: float | None = None) -> None:
    if hi is None:
        hi = lo * 1.4
    time.sleep(random.uniform(lo, hi))


def sleep_range(rng: Sequence[float]) -> None:
    lo, hi = rng
    time.sleep(random.uniform(lo, hi))


def micro_pause() -> None:
    time.sleep(random.uniform(0.08, 0.35))


def reading_pause(text_len: int = 200) -> None:
    """Simulate a human reading a chunk of text at ~250 wpm."""
    base = max(0.6, text_len / 900.0)
    time.sleep(base + random.uniform(0.2, 1.2))


def human_type(element: WebElement, text: str, clear_first: bool = True) -> None:
    """Type like a human: variable speed, occasional typos-then-fix."""
    if clear_first:
        element.click()
        micro_pause()
        element.send_keys(Keys.CONTROL, "a")
        micro_pause()
        element.send_keys(Keys.DELETE)
        micro_pause()

    for ch in text:
        # Rare typo simulation (<2% chance) then backspace+fix
        if random.random() < 0.015 and ch.isalpha():
            wrong = random.choice("asdfghjkl")
            element.send_keys(wrong)
            time.sleep(random.uniform(0.08, 0.22))
            element.send_keys(Keys.BACKSPACE)
            time.sleep(random.uniform(0.05, 0.15))
        element.send_keys(ch)
        # Natural typing cadence: faster for common letters, slower for punctuation
        if ch in ".,!?;:":
            time.sleep(random.uniform(0.18, 0.42))
        elif ch == " ":
            time.sleep(random.uniform(0.06, 0.18))
        else:
            time.sleep(random.uniform(0.04, 0.16))


def human_scroll(driver: WebDriver, direction: str = "down", amount: int | None = None) -> None:
    """Smooth, stepwise scroll that mimics a human."""
    if amount is None:
        amount = random.randint(300, 700)
    step = random.randint(40, 90)
    signed = amount if direction == "down" else -amount
    steps = max(1, abs(signed) // step)
    per = signed / steps
    for _ in range(steps):
        driver.execute_script(f"window.scrollBy(0, {int(per + random.randint(-5, 5))});")
        time.sleep(random.uniform(0.03, 0.12))
    time.sleep(random.uniform(0.2, 0.6))


def human_move_to(driver: WebDriver, element: WebElement) -> None:
    """Move mouse along a slight arc before reaching the element."""
    try:
        actions = ActionChains(driver)
        # A couple of jitters before the final move
        for _ in range(random.randint(1, 2)):
            actions.move_by_offset(random.randint(-30, 30), random.randint(-20, 20))
            actions.pause(random.uniform(0.05, 0.15))
        actions.move_to_element(element).pause(random.uniform(0.1, 0.4))
        actions.perform()
    except Exception:
        # move_by_offset can fail if cursor not initialised; ignore silently
        pass


def human_click(driver: WebDriver, element: WebElement) -> None:
    human_move_to(driver, element)
    micro_pause()
    try:
        element.click()
    except Exception:
        driver.execute_script("arguments[0].click();", element)
    micro_pause()


def random_idle(driver: WebDriver, lo: float = 1.5, hi: float = 4.5) -> None:
    """Simulate idle human behaviour: scroll a tiny bit or hover randomly."""
    dur = random.uniform(lo, hi)
    end = time.time() + dur
    while time.time() < end:
        action = random.choice(["scroll", "pause", "pause"])
        if action == "scroll":
            driver.execute_script(
                f"window.scrollBy(0, {random.randint(-80, 80)});"
            )
        time.sleep(random.uniform(0.3, 0.9))


def jitter_viewport(driver: WebDriver) -> None:
    """Small mouse/scroll motion to keep session 'alive'."""
    try:
        driver.execute_script(
            f"window.scrollBy(0, {random.randint(-40, 40)});"
        )
    except Exception:
        pass
    time.sleep(random.uniform(0.2, 0.5))
