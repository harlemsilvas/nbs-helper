#!/bin/bash

# 🚀 Deploy Completo - Proxy Setup
# Executa deploy de todos os projetos na ordem correta

set -e

# Cores
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo ""
echo "╔════════════════════════════════════════╗"
echo "║   🚀 Deploy Completo - NBS Helper     ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Função de log
log_step() {
    echo -e "${BLUE}▶${NC} $1"
}

log_success() {
    echo -e "${GREEN}✔${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

# Verificar se está na raiz do projeto
if [ ! -d "apps/web" ] || [ ! -d "landing" ]; then
    echo "❌ Execute este script da raiz do projeto!"
    exit 1
fi

# ==========================================
# PASSO 1: Deploy da API
# ==========================================
log_step "Passo 1/3: Deploy da API..."
cd apps/api

if ! vercel --prod; then
    log_warning "API deploy falhou ou foi cancelado"
else
    log_success "API deployada: https://nbs-helper-api.vercel.app"
fi

cd ../..

# ==========================================
# PASSO 2: Deploy da Web App
# ==========================================
log_step "Passo 2/3: Deploy da Web App..."
cd apps/web

# Build
log_step "Building web app..."
npm run build

# Deploy
if ! vercel --prod; then
    log_warning "Web deploy falhou ou foi cancelado"
else
    log_success "Web deployada: https://nbs-helper-web.vercel.app"
fi

cd ../..

# ==========================================
# PASSO 3: Deploy da Landing (Proxy)
# ==========================================
log_step "Passo 3/3: Deploy da Landing (Proxy)..."
cd landing

if ! vercel --prod; then
    log_warning "Landing deploy falhou ou foi cancelado"
else
    log_success "Landing deployada: https://nbs-helper.vercel.app"
fi

cd ..

# ==========================================
# RESUMO
# ==========================================
echo ""
echo "════════════════════════════════════════"
echo "✅ Deploy Completo!"
echo "════════════════════════════════════════"
echo ""
echo "URLs Finais:"
echo "  🏠 Landing:  https://nbs-helper.vercel.app/"
echo "  📱 App:      https://nbs-helper.vercel.app/app"
echo "  🔌 API:      https://nbs-helper.vercel.app/api"
echo ""
echo "URLs Diretas (debug):"
echo "  📱 Web:      https://nbs-helper-web.vercel.app"
echo "  🔌 API:      https://nbs-helper-api.vercel.app"
echo ""
echo "Próximos passos:"
echo "  1. Teste: https://nbs-helper.vercel.app/"
echo "  2. Teste: https://nbs-helper.vercel.app/app"
echo "  3. Teste: https://nbs-helper.vercel.app/api/health"
echo "  4. Configure domínio custom (opcional)"
echo ""
