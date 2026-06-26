#!/usr/bin/env bash
# Digital CFO — UZCLOUD VPS (Ubuntu) uchun bir martalik sozlash skripti.
# Ishlatish:  bash deploy/setup.sh
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
DOMAIN="digitalcfo.uz"

echo "==> Loyiha papkasi: $APP_DIR"
cd "$APP_DIR"

# 1 GB RAM serverda build (vite) xotira yetmay yiqilmasligi uchun 2GB swap.
if [ "$(free -m | awk '/^Swap:/ {print $2}')" = "0" ]; then
  echo "==> Swap (2GB) yaratish — kam RAM uchun"
  sudo fallocate -l 2G /swapfile 2>/dev/null || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
  sudo chmod 600 /swapfile
  sudo mkswap /swapfile
  sudo swapon /swapfile
  echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab >/dev/null
fi

echo "==> 1/6  Node.js 22 o'rnatish"
if ! command -v node >/dev/null 2>&1; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
  sudo apt-get install -y nodejs
fi
node --version

echo "==> 2/6  nginx, certbot, git, python3 o'rnatish"
sudo apt-get update -y
sudo apt-get install -y nginx certbot python3-certbot-nginx git python3 python3-pip

echo "==> 3/6  PM2 o'rnatish"
sudo npm install -g pm2

echo "==> 4/6  Loyihani build qilish (server+client deps + frontend)"
npm run build

echo "==> Python tahlil yadrosi (engine) kutubxonalari"
pip3 install --break-system-packages -r "$APP_DIR/server/engine/requirements.txt" 2>/dev/null \
  || pip3 install -r "$APP_DIR/server/engine/requirements.txt"

if [ ! -f "$APP_DIR/.env" ]; then
  echo "!!  DIQQAT: $APP_DIR/.env topilmadi."
  echo "!!  Telegram bildirishnoma uchun .env yarating (DEPLOY.md 5-qadam)."
fi

echo "==> 5/6  PM2 bilan ishga tushirish"
pm2 start "$SCRIPT_DIR/ecosystem.config.cjs"
pm2 save
echo "   (Server qayta yuklanganda avtomatik ishga tushishi uchun PM2 quyidagini bering:)"
echo "   pm2 startup    # chiqqan buyruqni nusxalab ishlating"

echo "==> 6/6  nginx sozlash"
sudo cp "$SCRIPT_DIR/nginx-digitalcfo.conf" /etc/nginx/sites-available/digitalcfo
sudo ln -sf /etc/nginx/sites-available/digitalcfo /etc/nginx/sites-enabled/digitalcfo
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx

echo ""
echo "================================================================"
echo "  Server ishga tushdi (http://<VPS-IP> orqali tekshirish mumkin)."
echo ""
echo "  Keyingi qadamlar:"
echo "  1) UZCLOUD DNS: A yozuvi  @  -> shu VPS IP;  A yozuvi  www -> shu VPS IP"
echo "  2) DNS tarqalgach SSL oling:"
echo "       sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
echo "  Shundan so'ng:  https://$DOMAIN"
echo "================================================================"
