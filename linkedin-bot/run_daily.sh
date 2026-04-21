#!/usr/bin/env bash
# تشغيل البوت يومياً. ضيفه لـ cron مثلاً:
#   crontab -e
#   30 9 * * *  /home/user/mesahl/linkedin-bot/run_daily.sh >> /home/user/mesahl/linkedin-bot/logs/cron.log 2>&1
set -euo pipefail
cd "$(dirname "$0")"
source .venv/bin/activate 2>/dev/null || python3 -m venv .venv && source .venv/bin/activate
pip install -q -r requirements.txt
# delay عشوائي 0..40 دقيقة قبل البدء حتى لا نكون دائماً في نفس الدقيقة
SLEEP_MIN=$((RANDOM % 40))
echo "[run_daily] sleeping ${SLEEP_MIN} min jitter before start …"
sleep "${SLEEP_MIN}m"
python main.py --once
