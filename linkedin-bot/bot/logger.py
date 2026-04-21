import sys
from pathlib import Path

from loguru import logger

LOG_DIR = Path(__file__).resolve().parent.parent / "logs"
LOG_DIR.mkdir(exist_ok=True)


def setup_logger():
    logger.remove()
    logger.add(
        sys.stdout,
        level="INFO",
        format="<green>{time:HH:mm:ss}</green> | <level>{level: <8}</level> | <cyan>{message}</cyan>",
    )
    logger.add(
        LOG_DIR / "bot_{time:YYYY-MM-DD}.log",
        level="DEBUG",
        rotation="1 day",
        retention="14 days",
        encoding="utf-8",
    )
    return logger


log = setup_logger()
