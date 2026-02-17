# ✅ Checklist - Configuração Proxy

## 📋 Status Atual

### Arquivos Configurados

- [x] `landing/vercel.json` - Rewrites configurados
- [x] `apps/web/vite.config.js` - Base path `/app/` adicionado
- [x] `apps/web/vite.config.js` - PWA start_url atualizado
- [x] `landing/index.html` - Links apontam para `/app`
- [x] Documentação criada (PROXY_SETUP.md, PROXY_ARCHITECTURE.md)

### Próximos Passos

## 🚀 1. Rebuild e Deploy da Web App

A configuração do `base: '/app/'` requer **rebuild completo**:

```bash
cd apps/web
npm run build
vercel --prod
```

**Por que:** Assets precisam ser gerados com novo base path.

## 🌐 2. Redeploy da Landing

```bash
cd landing
vercel --prod
```

**Por que:** Novos rewrites no vercel.json precisam ser aplicados.

## 🧪 3. Testes

Após deploys, teste **nesta ordem**:

### 3.1 Landing Page

```
✅ URL: https://nbs-helper.vercel.app/
✅ Carrega landing page
✅ CTAs apontam para /app
✅ Links do footer funcionam
```

### 3.2 App via Proxy

```
✅ URL: https://nbs-helper.vercel.app/app
✅ App carrega corretamente
✅ CSS e JS carregam (verificar DevTools)
✅ Imagens aparecem
✅ Busca funciona
✅ Favoritos funcionam
```

### 3.3 App Direto (debug)

```
✅ URL: https://nbs-helper-web.vercel.app
✅ Deve dar erro 404 ou tela branca
⚠️  ISSO É ESPERADO! O app agora roda em /app/
```

### 3.4 API via Proxy

```
✅ URL: https://nbs-helper.vercel.app/api/health
✅ Retorna JSON da API
```

### 3.5 PWA Install

```
✅ Banner de instalação aparece
✅ Instalar PWA
✅ App abre em /app (não na raiz)
✅ Funciona offline
```

## 🐛 Troubleshooting

### Problema: Assets não carregam (404)

**Console mostra:**

```
GET https://nbs-helper.vercel.app/assets/index.js - 404
```

**Solução:**

```bash
cd apps/web
# Verificar vite.config.js tem base: '/app/'
npm run build  # Rebuild obrigatório
vercel --prod
```

### Problema: Tela branca em /app

**DevTools mostra:**

```
Uncaught SyntaxError: Unexpected token '<'
```

**Solução:** Mesmo que acima - rebuild com base path.

### Problema: PWA abre na raiz

**Manifesto incorreto.**

**Solução:**

```javascript
// apps/web/vite.config.js
manifest: {
  start_url: "/app/",  // ← verificar
}
```

Rebuild e redeploy.

### Problema: 404 em /app

**Landing não tem rewrites.**

**Solução:**

```bash
cd landing
vercel --prod  # Aplicar vercel.json
```

## 📊 Comandos Rápidos

### Deploy Completo (Ordem Correta)

```bash
# Da raiz do projeto
./deploy-all.sh
```

Ou manualmente:

```bash
# 1. API
cd apps/api
./deploy.sh

# 2. Web
cd ../web
./deploy.sh

# 3. Landing
cd ../../landing
./deploy.sh
```

### Verificar Build Local

```bash
cd apps/web
npm run build
npm run preview  # Teste local em http://localhost:4173/app
```

**Importante:** Com `base: '/app/'`, o preview local roda em `/app`, não `/`.

## 🎯 Como Saber se Funcionou

### ✅ Sucesso

```
https://nbs-helper.vercel.app/            → Landing
https://nbs-helper-web.vercel.app/        → App funcional
https://nbs-helper-api.vercel.app/health  → API responde

URL na barra permanece a mesma (não muda)
Console sem erros 404
```

### ❌ Ainda não funcionou

```
/app → 404
/app → Tela branca
Assets 404 no console
PWA não instala
```

**Ação:** Rebuildar web e redeploy.

## 📝 Commit das Alterações

```bash
git add landing/vercel.json
git add landing/PROXY_SETUP.md
git add apps/web/vite.config.js
git add docs/PROXY_ARCHITECTURE.md
git add deploy-all.sh

git commit -m "feat: configure reverse proxy for /app and /api"

git push origin main
```

## 🔄 Ordem de Deploy (IMPORTANTE)

Sempre deploy nesta ordem:

1. **API** primeiro (menos dependências)
2. **Web** depois (rebuild com base path)
3. **Landing** por último (proxy aponta para as URLs finais)

## 📚 Documentação

- [PROXY_SETUP.md](../landing/PROXY_SETUP.md) - Guia passo a passo
- [PROXY_ARCHITECTURE.md](../docs/PROXY_ARCHITECTURE.md) - Arquitetura detalhada
- [deploy-all.sh](../deploy-all.sh) - Script automático

---

**Status:** ⏳ Aguardando rebuild e redeploy  
**Próxima ação:** `cd apps/web && npm run build && vercel --prod`
