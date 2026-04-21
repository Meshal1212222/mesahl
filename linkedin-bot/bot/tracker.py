"""Persistent tracker for applied jobs to avoid duplicates and enforce daily caps."""
from __future__ import annotations

import json
from datetime import datetime, date
from pathlib import Path
from threading import Lock
from typing import Any

TRACKER_PATH = Path(__file__).resolve().parent.parent / "data" / "applied.json"


class Tracker:
    def __init__(self, path: Path = TRACKER_PATH):
        self.path = path
        self.path.parent.mkdir(parents=True, exist_ok=True)
        self._lock = Lock()
        self._data: dict[str, Any] = self._load()

    def _load(self) -> dict[str, Any]:
        if not self.path.exists():
            return {"applied": {}, "daily": {}, "skipped": {}}
        try:
            with open(self.path, "r", encoding="utf-8") as f:
                data = json.load(f)
        except (json.JSONDecodeError, OSError):
            return {"applied": {}, "daily": {}, "skipped": {}}
        data.setdefault("applied", {})
        data.setdefault("daily", {})
        data.setdefault("skipped", {})
        return data

    def _save(self) -> None:
        tmp = self.path.with_suffix(".tmp")
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(self._data, f, ensure_ascii=False, indent=2)
        tmp.replace(self.path)

    def has_applied(self, job_id: str) -> bool:
        with self._lock:
            return job_id in self._data["applied"]

    def is_skipped(self, job_id: str) -> bool:
        with self._lock:
            return job_id in self._data["skipped"]

    def mark_applied(self, job_id: str, meta: dict[str, Any]) -> None:
        today = date.today().isoformat()
        with self._lock:
            self._data["applied"][job_id] = {
                "at": datetime.now().isoformat(timespec="seconds"),
                **meta,
            }
            self._data["daily"][today] = self._data["daily"].get(today, 0) + 1
            self._save()

    def mark_skipped(self, job_id: str, reason: str) -> None:
        with self._lock:
            self._data["skipped"][job_id] = {
                "at": datetime.now().isoformat(timespec="seconds"),
                "reason": reason,
            }
            self._save()

    def applied_today(self) -> int:
        today = date.today().isoformat()
        with self._lock:
            return self._data["daily"].get(today, 0)

    def summary(self) -> dict[str, int]:
        with self._lock:
            return {
                "total_applied": len(self._data["applied"]),
                "total_skipped": len(self._data["skipped"]),
                "applied_today": self.applied_today(),
            }
