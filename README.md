# Body Analytics — Next.js + PostgreSQL + Vercel

A modern full-stack fitness dashboard system. Users fill a 3-step form, get an instant visual dashboard, receive a PDF report by email, and their data is stored in PostgreSQL.

---

## 🏗 Stack

| Layer       | Technology                          |
|-------------|--------------------------------------|
| Frontend    | Next.js 14 · TypeScript · Tailwind  |
| Database    | PostgreSQL via **Neon** (serverless) |
| ORM         | Prisma                               |
| Email       | Nodemailer (Gmail SMTP)              |
| Hosting     | **Vercel**                           |

---

## 📁 Project Structure

```
body-analytics/
├── app/
│   ├── page.tsx                    ← Multi-step form (landing page)
│   ├── dashboard/[id]/page.tsx     ← Generated dashboard (server component)
│   ├── api/
│   │   ├── submit/route.ts         ← POST: save data + send email
│   │   └── dashboard/[id]/route.ts ← GET: fetch profile by ID
│   └── globals.css
├── components/
│   ├── form/
│   │   ├── StepBar.tsx
│   │   ├── StepIdentity.tsx        ← Step 1: personal + contact info
│   │   ├── StepMeasurements.tsx    ← Step 2: 10 body measurements
│   │   └── StepReview.tsx          ← Step 3: review + submit
│   └── dashboard/
│       └── DashboardClient.tsx     ← Full dashboard with all sections
├── lib/
│   ├── db.ts                       ← Prisma client singleton
│   ├── calculations.ts             ← BMI, body fat, ratios, roadmap
│   ├── email.ts                    ← Nodemailer HTML email
│   ├── types.ts                    ← Shared TypeScript types
│   └── utils.ts                    ← Helpers (formatting, countdown)
├── prisma/
│   └── schema.prisma               ← DB schema (Profile, Measurement, Metric, Report)
├── .env.example                    ← Environment variable template
└── package.json
```

---

## 🚀 Setup — Step by Step

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/body-analytics.git
cd body-analytics
npm install
```

### 2. Set up Neon PostgreSQL (free)

1. Go to **neon.tech** → Create account → New project
2. Name it `body-analytics`
3. Click **Connection Details** → copy the connection strings
4. You'll get two URLs: `DATABASE_URL` and `DIRECT_URL`

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="postgresql://..."    # from Neon
DIRECT_URL="postgresql://..."      # from Neon (same or pooler URL)
SMTP_USER=your-gmail@gmail.com
SMTP_PASS=your-app-password        # Gmail App Password (16 chars)
APP_URL=http://localhost:3000
```

**Gmail App Password:**
1. myaccount.google.com → Security
2. Enable 2-Step Verification
3. App passwords → Generate → Copy the 16-char password

### 4. Push database schema

```bash
npm run db:push
```

This creates all 4 tables in your Neon database.

### 5. Run locally

```bash
npm run dev
```

Open http://localhost:3000

---

## ☁️ Deploy to Vercel

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/body-analytics.git
git push -u origin main
```

### Step 2 — Connect to Vercel

1. Go to **vercel.com** → Add New Project
2. Import your GitHub repo
3. Framework: **Next.js** (auto-detected)
4. Click **Deploy** (it'll fail — we need env vars first)

### Step 3 — Add environment variables

In Vercel → Project → **Settings → Environment Variables**, add:

| Key            | Value                          |
|----------------|--------------------------------|
| `DATABASE_URL` | Your Neon connection string    |
| `DIRECT_URL`   | Your Neon direct URL           |
| `SMTP_HOST`    | `smtp.gmail.com`               |
| `SMTP_PORT`    | `587`                          |
| `SMTP_USER`    | your-gmail@gmail.com           |
| `SMTP_PASS`    | Your 16-char app password      |
| `SENDER_NAME`  | `Body Analytics`               |
| `APP_URL`      | `https://your-app.vercel.app`  |

### Step 4 — Redeploy

Go to Vercel → Deployments → click the latest → **Redeploy**

Or trigger a new deploy:

```bash
git commit --allow-empty -m "trigger deploy"
git push
```

---

## 🗄 Database Schema

```
Profile          ← One row per submission
  └── Measurement[]   ← Monthly measurement snapshots
  └── Metric[]        ← Calculated health metrics
  └── Report[]        ← Email delivery status
```

To explore your data:

```bash
npm run db:studio
```

Opens Prisma Studio at http://localhost:5555 — a visual DB browser.

---

## 🔁 How It Works

```
User fills 3-step form
    ↓  POST /api/submit
Calculates metrics (BMI, BF%, WHR, shape, targets, roadmap)
    ↓
Saves to PostgreSQL (Profile + Measurement + Metric + Report)
    ↓
Redirects to /dashboard/[id]   ← instant, from DB
    ↓  (background, non-blocking)
Sends HTML email with report
Updates Report.emailStatus = "sent"
```

---

## 🧩 Adding Features Later

**Multiple months tracking:**
- Form adds `monthNumber: 2` Measurement row to existing Profile
- Dashboard shows progress charts across months

**Admin panel:**
- New route `/admin` with auth
- Lists all profiles, email statuses, filter by country

**WhatsApp notifications:**
- Add Twilio/WhatsApp Business API call in `api/submit/route.ts`
- Trigger only if `profile.whatsapp === true`

---

## ⚠️ Important Notes

- Never commit `.env.local` to GitHub — it's in `.gitignore`
- The `DIRECT_URL` is needed for Prisma migrations on Neon (vs. pooled connection)
- Vercel functions have a 30s timeout — set in `vercel.json`
- Email sending is non-blocking (user sees dashboard instantly)
