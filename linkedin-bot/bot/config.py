import os
from pathlib import Path
from typing import Any

import yaml
from dotenv import load_dotenv


DEFAULT_CONFIG_PATH = Path(__file__).resolve().parent.parent / "config.yaml"
EXAMPLE_CONFIG_PATH = Path(__file__).resolve().parent.parent / "config.example.yaml"


def load_config(path: str | Path | None = None) -> dict[str, Any]:
    load_dotenv()
    cfg_path = Path(path) if path else DEFAULT_CONFIG_PATH
    if not cfg_path.exists():
        if EXAMPLE_CONFIG_PATH.exists():
            raise FileNotFoundError(
                f"config.yaml not found. Copy config.example.yaml to config.yaml and edit it."
            )
        raise FileNotFoundError(f"Config file not found: {cfg_path}")

    with open(cfg_path, "r", encoding="utf-8") as f:
        cfg = yaml.safe_load(f)

    cfg["credentials"] = {
        "email": os.getenv("LINKEDIN_EMAIL", "").strip(),
        "password": os.getenv("LINKEDIN_PASSWORD", "").strip(),
    }
    cfg["telegram"] = {
        "token": os.getenv("TELEGRAM_BOT_TOKEN", "").strip(),
        "chat_id": os.getenv("TELEGRAM_CHAT_ID", "").strip(),
    }

    if not cfg["credentials"]["email"] or not cfg["credentials"]["password"]:
        raise ValueError("LINKEDIN_EMAIL and LINKEDIN_PASSWORD must be set in .env")

    return cfg
