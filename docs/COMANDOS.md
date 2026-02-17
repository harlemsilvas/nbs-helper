# 🚀 Comandos Rápidos - NBS Helper

## Desenvolvimento

### Iniciar Webapp
```bash
npm run dev:web
# ou
cd apps/web && npm run dev
```
**URL:** http://localhost:5173

### Iniciar API
```bash
npm run dev:api
# ou
cd apps/api && npm run dev
```
**URL:** http://localhost:3001

### Processar Dados NBS
```bash
# Importar CSV + Gerar índice
npm run prepare:data

# Ou separado:
npm run import:nbs     # Importa CSV
npm run build:index    # Gera índice
```

---

## Build e Deploy

### Build Webapp
```bash
cd apps/web
npm run build
# Output: dist/

# Preview do build
npm run preview
```

### Deploy Vercel (Frontend)
```bash
cd apps/web
npm run build
vercel --prod
```

### Deploy Render/Railway (Backend)
```bash
cd apps/api
# Configurar no painel do Render/Railway
# Comando de build: npm install
# Comando de start: npm start
```

---

## Dados

### Atualizar CSV NBS
```bash
# Baixar nova versão
curl -L -o data/raw/NBSa_2-0.csv \
  "https://www.gov.br/mdic/pt-br/images/REPOSITORIO/scs/decos/NBS/NBSa_2-0.csv"

# Reprocessar
npm run prepare:data

# Copiar para webapp
cp data/generated/index.json apps/web/public/
```

### Verificar Dados
```bash
# Total de códigos
cat data/generated/index.json | grep -o '"code"' | wc -l

# Ver primeiro item
cat data/generated/index.json | head -30

# Buscar código específico
cat data/generated/nbs.json | grep -i "software"
```

---

## Testes e Debug

### Console do Navegador
```
F12 → Console (ver erros)
F12 → Network (ver requests)
F12 → Application → LocalStorage (ver favoritos)
```

### Testar API
```bash
# Health check
curl http://localhost:3001/health

# Buscar
curl "http://localhost:3001/search?q=software&limit=5"

# Item específico
curl http://localhost:3001/item/1.0101

# Metadados
curl http://localhost:3001/meta | jq
```

---

## Manutenção

### Limpar Cache
```bash
# Node modules
rm -rf node_modules apps/*/node_modules
npm install

# Build cache
rm -rf apps/web/dist apps/web/.vite

# Dados gerados
rm -rf data/generated/*
npm run prepare:data
```

### Verificar Erros
```bash
# ESLint (se configurado)
cd apps/web
npm run lint

# TypeScript (se usar)
npm run type-check
```

### Atualizar Dependências
```bash
# Ver outdated
npm outdated

# Atualizar todas (cuidado!)
npm update

# Atualizar específica
npm install react@latest
```

---

## Git

### Commit Changes
```bash
git add .
git commit -m "feat: implementar busca NBS"
git push origin main
```

### Branches
```bash
# Nova feature
git checkout -b feature/extensao

# Voltar para main
git checkout main

# Merge
git merge feature/extensao
```

---

## Monorepo

### Executar em Workspace Específico
```bash
# Web
npm --workspace apps/web run build

# API
npm --workspace apps/api start

# Shared
npm --workspace packages/shared test
```

### Instalar em Workspace
```bash
# Adicionar dependência no web
npm install --workspace apps/web lucide-react

# Adicionar na API
npm install --workspace apps/api express
```

---

## Produção

### Variáveis de Ambiente
```bash
# Copiar exemplo
cp .env.example .env

# Editar
nano .env

# Usar
source .env
npm run dev:api
```

### Build Otimizado
```bash
cd apps/web

# Build com análise
npm run build -- --mode production

# Verificar tamanho
ls -lh dist/
```

---

## Backup

### Backup Completo
```bash
# Criar backup
tar -czf nbs-helper-backup-$(date +%Y%m%d).tar.gz \
  --exclude=node_modules \
  --exclude=dist \
  .

# Restaurar
tar -xzf nbs-helper-backup-20260203.tar.gz
npm install
```

### Apenas Dados
```bash
# Backup dados
cp -r data/ data-backup-$(date +%Y%m%d)/

# Restaurar
cp -r data-backup-20260203/ data/
```

---

## Performance

### Análise Bundle
```bash
cd apps/web
npm run build -- --mode analyze
```

### Lighthouse
```bash
# Chrome DevTools
F12 → Lighthouse → Analyze
```

### Monitor de Recursos
```bash
# Uso de memória
top -p $(pgrep node)

# Uso de disco
du -sh apps/web/dist/
```

---

## Úteis

### Ver Estrutura
```bash
tree -L 3 -I 'node_modules|dist'
```

### Contar Linhas de Código
```bash
find apps/web/src -name '*.jsx' -o -name '*.js' | xargs wc -l
```

### Buscar em Código
```bash
# Grep simples
grep -r "useState" apps/web/src/

# Com contexto
grep -rn -A 2 -B 2 "Fuse" apps/web/src/
```

---

## Atalhos VSCode

```
Ctrl+P          Abrir arquivo
Ctrl+Shift+P    Command Palette
Ctrl+`          Terminal
Ctrl+B          Toggle sidebar
F5              Debug
```

---

## Quick Reference

| Comando | O que faz |
|---------|-----------|
| `npm run dev:web` | Inicia webapp |
| `npm run dev:api` | Inicia API |
| `npm run prepare:data` | Processa CSV |
| `npm run build:web` | Build produção |
| `F12` | DevTools |
| `Ctrl+C` | Para servidor |

---

**Comandos mais usados:**
1. `npm run dev:web` ⭐
2. `npm run prepare:data`
3. `curl http://localhost:3001/health`
4. `git add . && git commit -m "..."`
5. `npm run build:web`
