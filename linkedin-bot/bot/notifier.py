"""Optional Telegram notifier for daily summaries."""
from __future__ import annotations

import requests

from .logger import log


class TelegramNotifier:
    def __init__(self, token: str, chat_id: str):
        self.token = token
        self.chat_id = chat_id
        self.enabled = bool(token and chat_id)

    def send(self, text: str) -> None:
        if not self.enabled:
            return
        try:
            resp = requests.post(
                f"https://api.telegram.org/bot{self.token}/sendMessage",
                json={"chat_id": self.chat_id, "text": text, "parse_mode": "HTML"},
                timeout=10,
            )
            if resp.status_code != 200:
                log.warning(f"Telegram send failed: {resp.status_code} {resp.text[:200]}")
        except requests.RequestException as e:
            log.warning(f"Telegram error: {e}")
