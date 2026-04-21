"""Chrome launch + anti-detection stealth patches."""
from __future__ import annotations

import random
from pathlib import Path

import undetected_chromedriver as uc
from selenium.webdriver.remote.webdriver import WebDriver


# Realistic desktop user agents (rotated per run). Keep Chrome major in sync with UC.
USER_AGENTS = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
]


STEALTH_JS = r"""
// Hide webdriver flag
Object.defineProperty(navigator, 'webdriver', { get: () => undefined });

// Plugins spoof
Object.defineProperty(navigator, 'plugins', {
  get: () => [1, 2, 3, 4, 5].map(i => ({ name: 'Plugin' + i, filename: 'p' + i }))
});

// Languages
Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en', 'ar'] });

// Chrome runtime
window.chrome = window.chrome || { runtime: {}, loadTimes: function(){}, csi: function(){} };

// Permissions
const origQuery = window.navigator.permissions && window.navigator.permissions.query;
if (origQuery) {
  window.navigator.permissions.query = (p) => (
    p.name === 'notifications'
      ? Promise.resolve({ state: Notification.permission })
      : origQuery(p)
  );
}

// WebGL vendor/renderer spoof
const getParameter = WebGLRenderingContext.prototype.getParameter;
WebGLRenderingContext.prototype.getParameter = function(parameter) {
  if (parameter === 37445) return 'Intel Inc.';
  if (parameter === 37446) return 'Intel Iris OpenGL Engine';
  return getParameter.apply(this, [parameter]);
};

// Hairline feature consistency
Object.defineProperty(navigator, 'hardwareConcurrency', { get: () => 8 });
Object.defineProperty(navigator, 'deviceMemory', { get: () => 8 });

// navigator.platform alignment with UA is handled by undetected-chromedriver
"""


def build_driver(cfg_browser: dict) -> WebDriver:
    options = uc.ChromeOptions()

    profile_dir = Path(cfg_browser.get("profile_dir", "./chrome_profile")).resolve()
    profile_dir.mkdir(parents=True, exist_ok=True)
    options.add_argument(f"--user-data-dir={profile_dir}")

    ua = cfg_browser.get("user_agent") or random.choice(USER_AGENTS)
    options.add_argument(f"--user-agent={ua}")

    width, height = cfg_browser.get("window_size", [1400, 900])
    options.add_argument(f"--window-size={width},{height}")

    # Stability/stealth flags
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--no-first-run")
    options.add_argument("--no-default-browser-check")
    options.add_argument("--disable-popup-blocking")
    options.add_argument("--disable-notifications")
    options.add_argument("--lang=en-US,en;q=0.9,ar;q=0.8")

    if cfg_browser.get("headless"):
        # Chrome 124+ "new" headless is harder to fingerprint than old headless
        options.add_argument("--headless=new")
        options.add_argument("--disable-gpu")

    driver = uc.Chrome(options=options, use_subprocess=True)
    driver.set_window_size(width, height)

    # Inject stealth JS on every new document
    try:
        driver.execute_cdp_cmd(
            "Page.addScriptToEvaluateOnNewDocument", {"source": STEALTH_JS}
        )
    except Exception:
        pass

    # Slightly slow down network timing to appear less aggressive
    driver.set_page_load_timeout(60)
    driver.implicitly_wait(0)
    return driver
