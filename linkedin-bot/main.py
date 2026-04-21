"""Entry point: run the LinkedIn Easy Apply bot once, or on a daily schedule."""
from __future__ import annotations

import argparse
import random
import sys
import time
from datetime import datetime

from apscheduler.schedulers.blocking import BlockingScheduler
from apscheduler.triggers.cron import CronTrigger

from bot import load_config
from bot.linkedin_bot import LinkedInBot
from bot.logger import log


def run_once() -> None:
    cfg = load_config()
    bot = LinkedInBot(cfg)
    stats = bot.run()
    log.info(f"Run finished: {stats}")


def run_daily(hour: int, minute: int, jitter_min: int = 45) -> None:
    """Daily scheduler with randomized jitter so we don't hit LinkedIn at the same
    time every day (patterns are easier to detect)."""
    sched = BlockingScheduler(timezone="UTC")

    def job():
        # Random sleep 0..jitter_min minutes before starting
        delay = random.randint(0, jitter_min * 60)
        log.info(f"Scheduled run: sleeping {delay}s jitter before start …")
        time.sleep(delay)
        try:
            run_once()
        except Exception as e:
            log.exception(f"Scheduled run crashed: {e}")

    trigger = CronTrigger(hour=hour, minute=minute)
    sched.add_job(job, trigger=trigger, name="linkedin_daily_apply")
    next_run = sched.get_jobs()[0].next_run_time
    log.info(f"Daily scheduler armed. Next run around: {next_run} (UTC) + up to {jitter_min}m jitter")
    try:
        sched.start()
    except (KeyboardInterrupt, SystemExit):
        log.info("Scheduler stopped by user.")


def main() -> int:
    parser = argparse.ArgumentParser(description="LinkedIn Easy Apply bot")
    parser.add_argument("--once", action="store_true", help="Run once and exit")
    parser.add_argument(
        "--daily",
        nargs="?",
        const="09:30",
        help="Run daily at HH:MM UTC (default 09:30)",
    )
    parser.add_argument(
        "--jitter",
        type=int,
        default=45,
        help="Random startup jitter in minutes (default 45)",
    )
    args = parser.parse_args()

    if args.daily:
        try:
            hh, mm = args.daily.split(":")
            run_daily(int(hh), int(mm), jitter_min=args.jitter)
        except ValueError:
            print("--daily expects HH:MM (24h UTC)", file=sys.stderr)
            return 2
        return 0

    run_once()
    return 0


if __name__ == "__main__":
    sys.exit(main())
