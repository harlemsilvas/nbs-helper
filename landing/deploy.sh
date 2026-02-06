#!/bin/bash

# 🚀 Script de Deploy - Landing Page NBS Helper
# Uso: ./deploy.sh [ambiente]
# Ambientes: dev, staging, prod

set -e

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções de log
log_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

log_success() {
    echo -e "${GREEN}✔${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

log_error() {
    echo -e "${RED}✖${NC} $1"
}

# Banner
echo ""
echo "╔════════════════════════════════════════╗"
echo "║   🚀 NBS Helper - Landing Deploy      ║"
echo "╚════════════════════════════════════════╝"
echo ""

# Determinar ambiente
ENVIRONMENT=${1:-dev}
log_info "Ambiente: $ENVIRONMENT"

# Navegar para pasta da landing
cd "$(dirname "$0")"
log_info "Diretório: $(pwd)"

# 1. Verificar dependências
log_info "Verificando dependências..."

if ! command -v node &> /dev/null; then
    log_error "Node.js não encontrado. Instale: https://nodejs.org"
    exit 1
fi

if ! command -v git &> /dev/null; then
    log_error "Git não encontrado. Instale: https://git-scm.com"
    exit 1
fi

log_success "Dependências OK"

# 2. Verificar mudanças não commitadas
if [[ -n $(git status -s) ]] && [[ "$ENVIRONMENT" == "prod" ]]; then
    log_warning "Existem mudanças não commitadas!"
    read -p "Deseja continuar? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_error "Deploy cancelado."
        exit 1
    fi
fi

# 3. Verificar se index.html existe
if [ ! -f "index.html" ]; then
    log_error "index.html não encontrado!"
    exit 1
fi

log_success "Arquivo index.html encontrado"

# 4. Otimizações (apenas em staging e prod)
if [ "$ENVIRONMENT" != "dev" ]; then
    log_info "Executando otimizações..."
    
    # Verificar se html-minifier está instalado
    if command -v html-minifier &> /dev/null; then
        log_info "Minificando HTML..."
        html-minifier index.html \
            --collapse-whitespace \
            --remove-comments \
            --minify-css true \
            --minify-js true \
            -o index.min.html
        log_success "HTML minificado: index.min.html"
    else
        log_warning "html-minifier não encontrado. Pulando minificação."
        log_info "Instale com: npm install -g html-minifier"
    fi
    
    # Gerar Tailwind CSS otimizado (se tailwind.config.js existir)
    if [ -f "tailwind.config.js" ]; then
        if command -v npx &> /dev/null; then
            log_info "Gerando Tailwind CSS otimizado..."
            npx tailwindcss -o ./styles.css --minify 2>/dev/null || log_warning "Erro ao gerar Tailwind CSS"
            log_success "CSS otimizado gerado"
        fi
    fi
fi

# 5. Deploy por ambiente
case $ENVIRONMENT in
    dev)
        log_info "Iniciando servidor local..."
        log_success "Servidor rodando em http://localhost:8080"
        log_info "Pressione Ctrl+C para parar"
        python3 -m http.server 8080
        ;;
        
    staging)
        log_info "Fazendo deploy para Vercel (preview)..."
        
        if ! command -v vercel &> /dev/null; then
            log_error "Vercel CLI não encontrado!"
            log_info "Instale com: npm i -g vercel"
            exit 1
        fi
        
        vercel
        log_success "Deploy de staging concluído!"
        ;;
        
    prod)
        log_info "Fazendo deploy para produção..."
        
        # Escolher plataforma
        echo ""
        echo "Escolha a plataforma de deploy:"
        echo "1) Vercel (recomendado)"
        echo "2) Netlify"
        echo "3) Firebase"
        echo "4) Cancelar"
        read -p "Opção: " -n 1 -r PLATFORM
        echo ""
        
        case $PLATFORM in
            1)
                if ! command -v vercel &> /dev/null; then
                    log_error "Vercel CLI não encontrado!"
                    log_info "Instale com: npm i -g vercel"
                    exit 1
                fi
                
                log_info "Fazendo deploy na Vercel..."
                vercel --prod
                log_success "Deploy concluído! 🎉"
                ;;
                
            2)
                if ! command -v netlify &> /dev/null; then
                    log_error "Netlify CLI não encontrado!"
                    log_info "Instale com: npm i -g netlify-cli"
                    exit 1
                fi
                
                log_info "Fazendo deploy na Netlify..."
                netlify deploy --prod --dir=.
                log_success "Deploy concluído! 🎉"
                ;;
                
            3)
                if ! command -v firebase &> /dev/null; then
                    log_error "Firebase CLI não encontrado!"
                    log_info "Instale com: npm i -g firebase-tools"
                    exit 1
                fi
                
                log_info "Fazendo deploy no Firebase..."
                firebase deploy --only hosting
                log_success "Deploy concluído! 🎉"
                ;;
                
            *)
                log_error "Deploy cancelado."
                exit 1
                ;;
        esac
        
        # Incrementar versão (opcional)
        if [ -f "package.json" ]; then
            log_info "Incrementando versão..."
            npm version patch --no-git-tag-version
            NEW_VERSION=$(node -p "require('./package.json').version")
            log_success "Nova versão: $NEW_VERSION"
            
            # Commit
            git add package.json
            git commit -m "chore: bump landing version to $NEW_VERSION" 2>/dev/null || log_warning "Nada para commitar"
        fi
        ;;
        
    *)
        log_error "Ambiente inválido: $ENVIRONMENT"
        log_info "Use: ./deploy.sh [dev|staging|prod]"
        exit 1
        ;;
esac

echo ""
log_success "Deploy finalizado com sucesso! 🚀"
echo ""
