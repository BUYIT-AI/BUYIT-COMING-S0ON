# Environment Variables & Deployment Guide

## Quick Summary

**TL;DR:** You need a `.env.local` file with your secrets. The `NODE_ENV` is usually handled automatically by your hosting platform.

---

## What is NODE_ENV?

`NODE_ENV` is a special variable that tells your app whether it's running in **development** or **production** mode.

| Setting | What It Does |
|---------|------------|
| `development` | Console logs are VISIBLE, debugging is easier |
| `production` | Console logs are HIDDEN, security is strict |

---

## Do I Need to Manually Set NODE_ENV?

### ✅ NO - Most Hosting Platforms Set It Automatically

When you deploy to platforms like **Vercel, Railway, Heroku, etc.**, they automatically set `NODE_ENV=production`.

### ✅ YES - Only If Deploying Manually

If you're running your own server, set it in your deployment command:

```bash
# For production
NODE_ENV=production npm start

# For development (local)
NODE_ENV=development npm run dev
```

---

## Setting Up Your .env.local File

### Step 1: Create `.env.local` in your project root

```bash
# In /myapp directory
touch .env.local
```

### Step 2: Add these variables

```env
# Database
DATABASE_URL="your-database-url"

# JWT Secret (generate a random strong key)
JWT_SECRET="at-least-32-characters-long-random-string"

# AI API
GROQ_API_KEY="your-groq-api-key"

# Optional (usually automatic)
NODE_ENV="development"
```

### Step 3: ⚠️ NEVER commit .env.local to git!

The `.gitignore` already protects it, but double-check:

```bash
git status  # Should NOT show .env.local
```

---

## How NODE_ENV Affects Your App

### In Development (NODE_ENV="development")
```typescript
// logger.ts checks NODE_ENV
const isDevelopment = process.env.NODE_ENV === "development";

logger.error("This message WILL show") // Shows in console
```

### In Production (NODE_ENV="production")
```typescript
const isDevelopment = process.env.NODE_ENV === "development"; // false

logger.error("This message will NOT show") // Hidden from console
```

---

## Deployment Setup by Platform

### ✅ Vercel (Recommended for Next.js)
1. Connect your GitHub repo
2. Add environment variables in **Settings → Environment Variables**
3. Vercel automatically sets `NODE_ENV=production`

### ✅ Railway
1. Link your repo
2. Add environment variables in **Variables tab**
3. Railway automatically sets `NODE_ENV=production`

### ✅ Heroku
1. Add buildpacks for Node.js
2. Set environment variables with: `heroku config:set KEY=VALUE`
3. Heroku automatically sets `NODE_ENV=production`

### ✅ AWS / Azure / Custom Server
1. Set environment variables manually
2. Run: `NODE_ENV=production npm start`

---

## Example .env.local for Local Development

```env
# Database (use your development database)
DATABASE_URL="postgresql://postgres:password@localhost:5432/buyit"

# JWT Secret (can be any string for development)
JWT_SECRET="dev-secret-key-change-in-production-12345678"

# AI API
GROQ_API_KEY="gsk_your_groq_key_here"

# Development mode
NODE_ENV="development"
```

---

## Example Environment Variables for Production

**In Vercel/Railway/Hosting Dashboard:**

| Key | Value |
|-----|-------|
| `DATABASE_URL` | `postgresql://prod_user:secure_password@prod-server:5432/buyit` |
| `JWT_SECRET` | `a-very-long-random-secure-string-at-least-32-chars` |
| `GROQ_API_KEY` | `your-groq-api-key` |
| `NODE_ENV` | `production` (usually automatic) |

---

## Generating a Strong JWT_SECRET

Run this in your terminal:

```bash
# On Mac/Linux
openssl rand -hex 32

# On Windows (PowerShell)
[Convert]::ToHexString((1..32 | ForEach-Object {Get-Random -Maximum 256}))

# Or with Node.js (any OS)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

---

## Security Checklist

- ✅ `.env.local` is in `.gitignore` (not committed)
- ✅ Never hardcode secrets in your code
- ✅ `JWT_SECRET` is different for development and production
- ✅ In production, use secure, random values
- ✅ Rotate `JWT_SECRET` periodically in production
- ✅ Use strong `DATABASE_URL` with secure passwords

---

## Testing Locally

```bash
# Install dependencies
npm install

# Create .env.local with your values
# Then run:

npm run dev

# Your app runs at http://localhost:3000
# NODE_ENV will be "development"
# Console logs will be VISIBLE
```

---

## Deploying to Production

```bash
# 1. Push to GitHub
git add .
git commit -m "Deploy to production"
git push origin main

# 2. On Vercel/Railway/Hosting:
#    - Connect your GitHub repo
#    - Add environment variables (without NODE_ENV, it's automatic)
#    - Deploy!

# NODE_ENV will be automatically set to "production"
# Console logs will be HIDDEN
# Security will be STRICT
```

---

## Summary

| Scenario | NODE_ENV | What to Do |
|----------|----------|-----------|
| Running locally | `development` | Add to `.env.local` |
| Deploying to Vercel/Railway | (automatic) | Don't set, platform does it |
| Running own server | `production` | Set in startup command or .env |

**Bottom line:** Create `.env.local` with your secrets, and let your hosting platform handle `NODE_ENV` automatically! 🚀
