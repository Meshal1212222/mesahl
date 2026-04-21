# LinkedIn Auto-Apply Bot

بوت تقديم تلقائي يومي على وظائف لينكدان (Easy Apply) مع مقاومة قوية لأنظمة الكشف.

## ⚠️ تحذير مهم

استخدام الأتمتة يخالف **شروط خدمة لينكدان** (قسم Automated Means) وممكن يعرّض حسابك للتعليق أو الحظر الدائم.
هالبوت للاستخدام الشخصي فقط وعلى مسؤوليتك. نصيحة: استخدم حساب ثانوي، وابدأ بحدود منخفضة (10–15 تقديم/يوم) وأرفعها تدريجياً، ولا تشغّل على VPN غير مستقر.

## ميزات مقاومة الكشف

- **undetected-chromedriver** يلغي معظم علامات Selenium
- **stealth JS** يزرق webdriver/WebGL/plugins/languages في كل صفحة جديدة
- **Chrome profile دائم** يحفظ الجلسة والكوكيز (تسجيل دخول مرة واحدة)
- **كتابة بشرية** بسرعات متغيّرة + أخطاء إملائية نادرة + تصحيح
- **حركة ماوس منحنية** بدل القفز المباشر للعناصر
- **تمرير تدريجي** بدل scroll مباشر
- **تأخيرات عشوائية** بين كل فعل (2-6 ث) وبين كل تقديم (30-90 ث)
- **Cooldown إجباري** كل 5 تقديمات (90-180 ث)
- **Jitter يومي** (0-45 د قبل البدء) حتى لا تكون الأوقات منتظمة
- **حدود يومية** صارمة + متعقّب للتكرار
- **كشف الكابتشا/2FA** ويوقف ويبعث إشعار بدل ما يحاول
- **User-Agent دوّار** من قائمة واقعية

## التركيب

```bash
cd linkedin-bot
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env           # عبّي الإيميل والباسورد
cp config.example.yaml config.yaml  # عدّل الكلمات المفتاحية والإجابات
```

## التشغيل

```bash
# تشغيل مرة واحدة (للاختبار)
python main.py --once

# تشغيل يومي بداخل البرنامج (يبقى شغّال)
python main.py --daily 09:30 --jitter 45

# أو عبر cron (مفضّل للسيرفر):
#   30 9 * * *  /path/to/linkedin-bot/run_daily.sh
```

## الإعداد الأدنى

في `.env`:
```
LINKEDIN_EMAIL=you@example.com
LINKEDIN_PASSWORD=your_password
```

في `config.yaml` (الأهم):
- `search.keywords` → الكلمات المفتاحية
- `search.locations` → المدن أو Remote
- `search.filters.easy_apply_only: true` → لازم تكون مفعّلة
- `answers.*` → إجاباتك على الأسئلة الشائعة
- `limits.max_applications_per_day` → ابدأ بـ 10-15

## ملاحظات أمان

1. **أول مرة:** شغّل بـ `headless: false` في config عشان تشوف البوت وتسجّل الدخول يدوياً لو في 2FA. بعدها تقدر تغيّره إلى `true`.
2. **لا تشغّل البوت من سيرفر بعيد إلا بعد ما يكون Chrome profile فيه كوكيز صالحة** — وإلا لينكدان يطلب تحقق.
3. **لا تتجاوز 50 تقديم/يوم**. البوت محدود بـ 25 افتراضياً.
4. **لو طلب تحقق كابتشا:** افتح المتصفح، كمّل يدوياً، البوت يكمل تلقائياً.

## ملفات المشروع

```
linkedin-bot/
├── main.py               # entry point
├── requirements.txt
├── config.example.yaml   # انسخه إلى config.yaml
├── .env.example          # انسخه إلى .env
├── run_daily.sh          # سكربت cron
└── bot/
    ├── linkedin_bot.py   # التحكم الرئيسي
    ├── easy_apply.py     # معالجة نموذج التقديم
    ├── stealth.py        # إعداد Chrome + anti-detection
    ├── human.py          # كتابة/تمرير/نقر بشري
    ├── tracker.py        # تتبع الوظائف المقدّم عليها
    ├── notifier.py       # إشعارات تيليجرام
    ├── config.py         # تحميل الإعدادات
    └── logger.py         # logging
```

## إشعارات تيليجرام (اختياري)

1. كلّم `@BotFather` في تيليجرام واعمل بوت جديد، خذ الـ token.
2. كلّم `@userinfobot` تاخذ chat_id.
3. حطهم في `.env`:
   ```
   TELEGRAM_BOT_TOKEN=...
   TELEGRAM_CHAT_ID=...
   ```
4. راح يوصلك ملخص يومي بعد كل تشغيل، وتنبيه لو طلب لينكدان تحقق.
