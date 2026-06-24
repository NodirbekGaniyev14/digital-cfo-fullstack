# Digital CFO — UZCLOUD VPS'ga deploy qilish

Express server tayyor frontend (`client/dist`) ni ham, `/api` ni ham bitta domendan
serve qiladi. nginx → Node (4000), SSL esa Let's Encrypt (bepul) orqali.

---

## 1. VPS yaratish (UZCLOUD)

- UZCLOUD panelida **Cloud Server / VPS** yarating:
  - OS: **Ubuntu 22.04** yoki **24.04**
  - RAM: kamida **1 GB** (2 GB tavsiya)
- Yaratilgach sizga **public IP** va **root paroli** beriladi. IP'ni eslab qoling.

## 2. Serverga ulanish (SSH)

Windows'da PowerShell yoki Terminal'da:
```bash
ssh root@<VPS-IP>
```
(Birinchi marta "yes" deb tasdiqlang, parolni kiriting.)

## 3. Kodni serverga olish

**A variant — GitHub orqali (tavsiya, yangilash oson):**
```bash
sudo mkdir -p /var/www && cd /var/www
git clone https://github.com/<foydalanuvchi>/<repo>.git digital-cfo
cd digital-cfo
```

**B variant — to'g'ridan-to'g'ri yuklash (GitHub'siz):**
Lokal kompyuterda loyiha papkasini ZIP qiling (`node_modules` larsiz) va WinSCP yoki
`scp` bilan `/var/www/digital-cfo` ga ko'chiring.

## 4. `.env` yaratish (Telegram)

```bash
cd /var/www/digital-cfo
nano .env
```
Ichiga yozing (token va chat id sizniki):
```
NODE_ENV=production
TELEGRAM_BOT_TOKEN=8609360739:AAH...
TELEGRAM_CHAT_ID=5000431126
```
`Ctrl+O`, `Enter`, `Ctrl+X` — saqlab chiqing.

## 5. Bir martalik sozlash skripti

```bash
bash deploy/setup.sh
```
Bu: Node 22, nginx, certbot, PM2 o'rnatadi → loyihani build qiladi → serverni ishga
tushiradi → nginx'ni sozlaydi. Oxirida PM2 avtoyuklash buyrug'ini bering:
```bash
pm2 startup        # chiqqan buyruqni nusxalab ishlating
pm2 save
```

Tekshirish: brauzerda `http://<VPS-IP>` — sayt ochilishi kerak.

## 6. DNS sozlash (UZCLOUD)

UZCLOUD → **Домены → digitalcfo.uz → DNS** bo'limida:

| Tur | Nomi (Host) | Qiymat |
|-----|-------------|--------|
| A   | `@`         | `<VPS-IP>` |
| A   | `www`       | `<VPS-IP>` |

Saqlang. DNS tarqalishi odatda 15 daqiqadan bir necha soatgacha vaqt oladi.

## 7. SSL (HTTPS) o'rnatish

DNS tarqalgach (domen IP'ga ulangach):
```bash
sudo certbot --nginx -d digitalcfo.uz -d www.digitalcfo.uz
```
Email kiriting, shartlarga rozilik bering. certbot avtomatik HTTPS'ni yoqadi va
80 → 443 yo'naltirishni qo'shadi. Sertifikat har 90 kunda avtomatik yangilanadi.

✅ Tayyor: **https://digitalcfo.uz**

---

## Keyinchalik yangilash (kod o'zgarsa)

```bash
cd /var/www/digital-cfo
git pull            # (A variant bo'lsa)
npm run build
pm2 restart digital-cfo
```

## Foydali buyruqlar

```bash
pm2 status                 # holat
pm2 logs digital-cfo       # loglar (yangi so'rovlar shu yerda ko'rinadi)
pm2 restart digital-cfo    # qayta ishga tushirish
sudo nginx -t              # nginx config tekshirish
sudo systemctl reload nginx
```

> ⚠️ `leads.json` va `uploads/` VPS diskida saqlanadi. Har bir so'rov baribir
> **Telegram'ga** darhol keladi, shuning uchun bular zaxira nusxa.
