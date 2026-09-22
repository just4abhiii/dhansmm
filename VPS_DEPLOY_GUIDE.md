# DhanSMM — VPS Deployment Guide
**Hostinger VPS | Ubuntu 24.04 LTS | IP: 200.234.34.179 | Domain: dhansmm.site**

---

## Zaruri cheezein pehle

- VPS ka root password (Hostinger dashboard mein "Change" pe click karke set karo)
- `dhansmm-deploy.tar.gz` file (Replit project ke root mein hai — download karo)
- Apne Replit secrets ke values (SESSION_SECRET, SUPABASE_*, TELEGRAM_*, ZAPUPI_API_KEY)

---

## Step 1 — Deploy package VPS pe upload karo

Apne PC ke terminal/command prompt mein ye command likho:

```bash
scp dhansmm-deploy.tar.gz root@200.234.34.179:/root/
```

Password maangega — VPS ka root password daalo.

---

## Step 2 — VPS mein SSH karo

```bash
ssh root@200.234.34.179
```

---

## Step 3 — Package extract karo

```bash
cd /root
tar -xzf dhansmm-deploy.tar.gz
ls  # in files dikhne chahiye
```

---

## Step 4 — Setup script chalaao (sab auto install hoga)

```bash
bash vps-setup.sh
```

> ⏳ 5-10 minute lagenge — Node.js, PostgreSQL, Nginx, PM2, Certbot install hoga.
> Koi error nahi aana chahiye. Agar aaye toh mujhe screenshot bhejo.

---

## Step 5 — Database import karo

```bash
# PostgreSQL mein import
sudo -u postgres psql dhansmm < /root/dhansmm_dump.sql
```

> ⏳ 1-2 minute lagenge (44MB data hai).

Verify karo:
```bash
sudo -u postgres psql dhansmm -c "\dt" | head -20
```
> Tables ki list dikhni chahiye.

---

## Step 6 — .env.production file banao aur fill karo

```bash
cp /root/.env.production.template /var/www/dhansmm/backend/.env.production
nano /var/www/dhansmm/backend/.env.production
```

**Nano editor mein in values fill karo:**

| Variable | Value kahan milegi |
|---|---|
| `DATABASE_URL` | Already filled — bas password change karo agar badla ho |
| `SESSION_SECRET` | Replit → Secrets mein dekho |
| `SUPABASE_PROJECT_URL` | Replit → Secrets mein dekho |
| `SUPABASE_ANON_KEY` | Replit → Secrets mein dekho |
| `SUPABASE_SERVICE_ROLE_KEY` | Replit → Secrets mein dekho |
| `TELEGRAM_BOT_TOKEN` | Replit → Secrets mein dekho |
| `TELEGRAM_ADMIN_CHAT_ID` | Replit → Secrets mein dekho |
| `ZAPUPI_API_KEY` | Replit → Secrets mein dekho |

**Save karo:** `Ctrl+O` → Enter → `Ctrl+X`

---

## Step 7 — Backend files copy karo

```bash
cp -r /root/backend/dist /var/www/dhansmm/backend/
cp /root/ecosystem.config.cjs /var/www/dhansmm/backend/
```

---

## Step 8 — Frontend files copy karo

```bash
cp -r /root/frontend/dist/public/* /var/www/dhansmm/frontend/
ls /var/www/dhansmm/frontend/  # index.html dikhna chahiye
```

---

## Step 9 — Nginx configure karo

```bash
cp /root/nginx-dhansmm.conf /etc/nginx/sites-available/dhansmm

# Enable karo
ln -s /etc/nginx/sites-available/dhansmm /etc/nginx/sites-enabled/dhansmm

# Default config hatao
rm -f /etc/nginx/sites-enabled/default

# Test karo
nginx -t
```

> Agar output mein `syntax is ok` aur `test is successful` dikh raha hai — bilkul sahi hai.

**Abhi SSL certificate nahi hai toh HTTP pe temporarily serve karo:**
```bash
# Sirf port 80 wala section active rakho — SSL wale ko comment karo temporarily
# Ya SSL cert pehle lo (Step 11)
systemctl reload nginx
```

---

## Step 10 — Backend server start karo (PM2)

```bash
cd /var/www/dhansmm/backend
pm2 start ecosystem.config.cjs
```

Verify karo:
```bash
pm2 status
pm2 logs dhansmm-api --lines 20
```

> `status: online` dikhna chahiye. Agar error aaye toh `pm2 logs dhansmm-api` pe dekho.

---

## Step 11 — SSL Certificate lo (HTTPS)

**Pehle dhansmm.site DNS set karo:**
> Hostinger DNS Manager mein jao → A record banao:
> - Name: `@` → Points to: `200.234.34.179`
> - Name: `www` → Points to: `200.234.34.179`
> DNS propagate hone mein 5-30 minute lagta hai.

DNS set hone ke baad:
```bash
certbot --nginx -d dhansmm.site -d www.dhansmm.site
```

Email maangega — apna email daalo. "Agree" ke liye `A` type karo.

Certbot automatically Nginx config mein SSL add kar dega.

```bash
nginx -t && systemctl reload nginx
```

---

## Step 12 — PM2 auto-start on reboot

```bash
pm2 save
pm2 startup
```

`pm2 startup` ek command output karega — use copy karke run karo (sudo wali command).

---

## Step 13 — Test karo 🎉

Browser mein kholo: **https://dhansmm.site**

Admin login: apna existing admin email/password

API test:
```bash
curl https://dhansmm.site/api/
# Response aana chahiye (404 ya JSON — dono OK hai)
```

---

## Agar kuch kaam na kare

**Backend start nahi ho raha:**
```bash
pm2 logs dhansmm-api --lines 50
# Error dekho aur mujhe screenshot bhejo
```

**Nginx error:**
```bash
cat /var/log/nginx/dhansmm.error.log | tail -20
```

**Database connection error:**
```bash
# .env.production mein DATABASE_URL check karo
sudo -u postgres psql -c "\l"  # databases list
```

**Site nahi khul raha:**
```bash
systemctl status nginx
pm2 status
```

---

## Update kaise karein (future mein)

Jab Replit mein code change karo aur VPS update karna ho:
1. Replit mein build karo (ye files automatic build ho jati hain deploy package mein)
2. Naya `dhansmm-deploy.tar.gz` banao
3. `scp` se upload karo
4. VPS pe:
```bash
tar -xzf dhansmm-deploy.tar.gz
cp -r /root/backend/dist /var/www/dhansmm/backend/
cp -r /root/frontend/dist/public/* /var/www/dhansmm/frontend/
pm2 restart dhansmm-api
```

---

*Guide generated by DhanSMM deployment system — Aug 2026*
