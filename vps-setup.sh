#!/bin/bash
# ============================================================
# DhanSMM VPS Setup Script
# Ubuntu 24.04 LTS — run as root: bash vps-setup.sh
# ============================================================
set -e

GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; NC='\033[0m'
info()  { echo -e "${GREEN}[✓]${NC} $1"; }
warn()  { echo -e "${YELLOW}[!]${NC} $1"; }
header(){ echo -e "\n${GREEN}══════════════════════════════════════${NC}"; echo -e "${GREEN}  $1${NC}"; echo -e "${GREEN}══════════════════════════════════════${NC}"; }

header "Step 1: System update"
apt-get update -qq && apt-get upgrade -y -qq
info "System updated"

header "Step 2: Install Node.js 20 LTS"
if ! command -v node &>/dev/null; then
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
  apt-get install -y nodejs
fi
node --version && npm --version
info "Node.js installed: $(node --version)"

header "Step 3: Install PM2"
npm install -g pm2 2>/dev/null
info "PM2 installed: $(pm2 --version)"

header "Step 4: Install PostgreSQL 16"
apt-get install -y postgresql postgresql-contrib
systemctl enable postgresql
systemctl start postgresql
info "PostgreSQL installed and running"

header "Step 5: Install Nginx"
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx
info "Nginx installed and running"

header "Step 6: Install Certbot (SSL)"
apt-get install -y certbot python3-certbot-nginx
info "Certbot installed"

header "Step 7: Create PostgreSQL database"
sudo -u postgres psql -c "CREATE USER dhansmm WITH PASSWORD 'dhansmm_db_pass_change_me';" 2>/dev/null || warn "User dhansmm already exists"
sudo -u postgres psql -c "CREATE DATABASE dhansmm OWNER dhansmm;" 2>/dev/null || warn "Database dhansmm already exists"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE dhansmm TO dhansmm;" 2>/dev/null
info "Database 'dhansmm' ready"

header "Step 8: Create app directories"
mkdir -p /var/www/dhansmm/frontend
mkdir -p /var/www/dhansmm/backend
mkdir -p /var/log/dhansmm
info "Directories created"

header "Step 9: Configure firewall"
ufw allow 22/tcp   2>/dev/null || true
ufw allow 80/tcp   2>/dev/null || true
ufw allow 443/tcp  2>/dev/null || true
ufw --force enable 2>/dev/null || true
info "Firewall configured (22, 80, 443 open)"

header "Step 10: Install unzip (for future updates)"
apt-get install -y unzip curl wget
info "Utilities installed"

echo ""
echo -e "${GREEN}╔══════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  ✅  VPS Setup Complete!                 ║${NC}"
echo -e "${GREEN}╚══════════════════════════════════════════╝${NC}"
echo ""
echo "  Next: Follow the VPS_DEPLOY_GUIDE.md steps"
echo "  DB password used: dhansmm_db_pass_change_me"
echo "  CHANGE this password in .env.production!"
