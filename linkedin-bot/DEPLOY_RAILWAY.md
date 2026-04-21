# نشر البوت على Railway

## ⚠️ تحذير قبل ما تكمل

Railway يشغّل حاويتك على IP تابع لـ GCP/Oracle Cloud. لينكدان يعرف هذي الـ IP ranges ويتعامل معها بحذر:

- أول تسجيل دخول من IP جديد = captcha / طلب تحقق بالبريد
- احتمال عالي إن حسابك يتقفل مؤقتاً لو سجّلت من Railway + ما في كوكيز محفوظة

**الحل:** جهّز `chrome_profile/` محلياً أولاً (سجّل دخول مرة من جهازك)، وارفع Volume لـ Railway لحفظ الجلسة.

---

## الخطوات

### 1) ادفع الفرع لـ GitHub (مسوّى خلاص ✓)

البوت موجود على فرع `claude/linkedin-job-bot-efQEB`. ادمجه في `main` أو انشر من الفرع مباشرة.

### 2) أنشئ مشروع جديد في Railway

1. روح [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo**.
2. اختر repo `Meshal1212222/mesahl` والفرع `claude/linkedin-job-bot-efQEB`.
3. في الـ service settings:
   - **Root Directory:** `linkedin-bot`
   - **Builder:** Dockerfile (يُقرأ تلقائياً من `railway.toml`)

### 3) ضف المتغيرات (Variables)

من تبويب **Variables**:

| المتغير | القيمة |
|---|---|
| `LINKEDIN_EMAIL` | إيميلك |
| `LINKEDIN_PASSWORD` | كلمة السر |
| `TELEGRAM_BOT_TOKEN` | (اختياري) من BotFather |
| `TELEGRAM_CHAT_ID` | (اختياري) من @userinfobot |
| `TZ` | `Asia/Riyadh` |

### 4) ارفع `config.yaml` كـ ConfigFile

Railway ما يدعم ملفات خارج Git. عندك خيارين:

**أ) انسخ محتوى config.yaml كمتغير بيئي واحد:**
- حط كل المحتوى في متغير `CONFIG_YAML_CONTENT` وعدّل `bot/config.py` يقرأ منه.

**ب) الأسهل:** أضف `config.yaml` على الفرع بشكل مباشر (بس احذف منه كلمات السر — الاعتمادات تجي من env):
```bash
cp linkedin-bot/config.example.yaml linkedin-bot/config.yaml
# عدّل الكلمات والإجابات
git add -f linkedin-bot/config.yaml
git commit -m "add personal config"
git push
```

### 5) اربط Volume (مهم جداً)

من تبويب **Settings** → **Volumes** → **New Volume**:

| Mount Path | الحجم | الغرض |
|---|---|---|
| `/app/chrome_profile` | 500 MB | جلسة لينكدان + كوكيز (يمنع تسجيل دخول كل مرة) |
| `/app/data` | 100 MB | سجل الوظائف المقدّم عليها |

بدون هذول الحجمين، كل deploy يفقد الجلسة وتبدأ من الصفر (= captcha).

### 6) اختبار أولي (قبل الجدولة)

أول تشغيل استبدل `startCommand` مؤقتاً بـ:
```
python main.py --once
```
وراقب الـ logs عشان تتأكد الأمور تمام. لو طلب captcha، شف قسم "حل الـ captcha من بعيد" تحت.

بعد ما يشتغل مرة بنجاح، رجّع:
```
python main.py --daily 06:30 --jitter 45
```

### 7) الجدولة

Railway يشغّل الحاوية 24/7 والـ APScheduler الداخلي يشعل البوت الساعة 06:30 UTC (= 09:30 بتوقيت الرياض) + jitter عشوائي 0-45 دقيقة.

لو تبي وقت مختلف عدّل في `railway.toml` أو من Variables:
```
STARTUP_CMD=python main.py --daily 12:00 --jitter 30
```

---

## حل الـ captcha من بعيد

لو Railway طلب تحقق ما تقدر تفتح المتصفح. الحل:

1. **سجّل دخول محلياً أول:**
   ```bash
   cd linkedin-bot
   python main.py --once    # headless: false في config
   # كمّل 2FA في المتصفح، البوت يحفظ الكوكيز
   ```
2. **ارفع `chrome_profile/` للـ volume:**
   - إما عبر `railway run cp -r chrome_profile /app/chrome_profile`
   - أو ضمّ المجلد مؤقتاً في Docker image (ما يُنصح لأنه يحتوي كوكيز حسّاسة).

---

## مراقبة التشغيل

- **Logs:** تبويب Deployments → View Logs
- **إشعارات تيليجرام:** راح توصلك يومياً بعد كل تشغيل
- **Screenshots:** محفوظة في `/app/screenshots` (اربط volume لو تبي تاخذها)

## الإيقاف

من Railway → Settings → **Remove Service**. أو عطّل الـ deployment مؤقتاً.
