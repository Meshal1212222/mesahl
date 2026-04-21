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

    # Support Railway/Docker: the whole YAML can be passed via env var.
    inline = os.getenv("CONFIG_YAML_CONTENT", "").strip()
    if inline:
        cfg = yaml.safe_load(inline)
    elif cfg_path.exists():
        with open(cfg_path, "r", encoding="utf-8") as f:
            cfg = yaml.safe_load(f)
    elif EXAMPLE_CONFIG_PATH.exists():
        raise FileNotFoundError(
            "config.yaml not found. Either copy config.example.yaml to "
            "config.yaml, or set CONFIG_YAML_CONTENT env var with the YAML body."
        )
    else:
        raise FileNotFoundError(f"Config file not found: {cfg_path}")

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
