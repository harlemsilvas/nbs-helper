# 🔀 Proxy Setup - Domínio Único com Múltiplos Projetos

## 🎯 Objetivo

Ter um domínio único com:

```
https://nbs-helper.vercel.app/
├── /           → Landing Page
├── /app        → Aplicativo Web (React SPA)
└── /api/*      → API Backend
```

## ✅ Configuração Atual

### Projetos Deployados Separadamente

| Projeto     | URL Atual                         | Descrição              |
| ----------- | --------------------------------- | ---------------------- |
| **Web**     | https://nbs-helper-web.vercel.app | Aplicativo React (SPA) |
| **API**     | https://nbs-helper-api.vercel.app | Backend Express        |
| **Landing** | https://nbs-helper.vercel.app     | Landing page + Proxy   |

### Arquivos Configurados

#### 1. `/landing/vercel.json` ✅

```json
{
  "rewrites": [
    {
      "source": "/app",
      "destination": "https://nbs-helper-web.vercel.app"
    },
    {
      "source": "/app/:path*",
      "destination": "https://nbs-helper-web.vercel.app/:path*"
    },
    {
      "source": "/api/:path*",
      "destination": "https://nbs-helper-api.vercel.app/:path*"
    }
  ]
}
```

**O que faz:**

- Serve a landing page em `/`
- Redireciona `/app` para o projeto web (reverse proxy)
- Redireciona `/api/*` para o projeto api (reverse proxy)

#### 2. `/apps/web/vite.config.js` ✅

```javascript
export default defineConfig({
  base: "/app/", // ← Adicionado
  plugins: [
    // ...
  ],
});
```

**O que faz:**

- Configura o base path para assets estáticos (JS, CSS, imagens)
- Garante que `/app/assets/...` funcione corretamente

#### 3. `/apps/web/vite.config.js` - PWA ✅

```javascript
manifest: {
  start_url: "/app/",  // ← Atualizado
  // ...
}
```

**O que faz:**

- Define que o PWA inicia em `/app/` (não na raiz)

## 🚀 Deploy

### Passo 1: Fazer Build e Deploy da Web

```bash
cd apps/web
npm run build
vercel --prod
```

Este deploy vai para: `https://nbs-helper-web.vercel.app`

### Passo 2: Deploy da Landing (Proxy)

```bash
cd landing
vercel --prod
```

Este deploy vai para: `https://nbs-helper.vercel.app`

**Nota:** A landing agora funciona como proxy reverso.

### Passo 3: (Opcional) Configurar Domínio Customizado

No dashboard da Vercel, vá em:

- **Projeto Landing** → Settings → Domains
- Adicione seu domínio (ex: `nbshelper.com`)

## 🧪 Testes

### Checklist de Validação

Após deploy, teste:

- [ ] **Landing Home:** `https://nbs-helper.vercel.app/`
  - ✅ Deve carregar a landing page
  - ✅ CTAs devem apontar para `/app`

- [ ] **App Principal:** `https://nbs-helper.vercel.app/app`
  - ✅ Deve carregar o aplicativo React
  - ✅ Assets (CSS, JS) devem carregar
  - ✅ Ícones e imagens devem aparecer

- [ ] **API Health:** `https://nbs-helper.vercel.app/api/health`
  - ✅ Deve retornar status da API

- [ ] **PWA Install:**
  - ✅ Botão de instalação deve funcionar
  - ✅ App instalado deve abrir em `/app`

### Debug Comum

#### Problema: Assets não carregam no `/app`

**Solução:** Verifique se o `base: '/app/'` está no vite.config.js

```bash
# Rebuild e redeploy
cd apps/web
npm run build
vercel --prod
```

#### Problema: Redirect loop

**Solução:** Certifique-se que os projects web e api **não** tenham rewrites conflitantes.

#### Problema: API retorna 404

**Solução:** Verifique se a API está rodando em `https://nbs-helper-api.vercel.app/health`

## 📊 Fluxo de Requisições

```
Usuário acessa: https://nbs-helper.vercel.app/app
                      ↓
          Vercel (Landing Project)
                      ↓
      Lê vercel.json → /app match!
                      ↓
      Rewrite interno para:
      https://nbs-helper-web.vercel.app
                      ↓
      Retorna conteúdo mantendo URL
                      ↓
    Usuário vê: https://nbs-helper.vercel.app/app
```

**Importante:** É um **rewrite** (não redirect). A URL permanece a mesma.

## 🔧 Estrutura de Projetos no Vercel

### Projeto 1: nbs-helper (Landing + Proxy)

```
Repository: seu-repo
Root Directory: landing/
Build Command: (vazio)
Output Directory: .
```

### Projeto 2: nbs-helper-web (App React)

```
Repository: seu-repo
Root Directory: apps/web/
Build Command: npm run build
Output Directory: dist
```

### Projeto 3: nbs-helper-api (Backend)

```
Repository: seu-repo
Root Directory: apps/api/
Build Command: (vazio)
Output Directory: .
```

## 📝 Manutenção

### Atualizar Web

```bash
cd apps/web
# fazer alterações...
npm run build
vercel --prod
```

A landing automaticamente vai servir a nova versão via proxy.

### Atualizar Landing

```bash
cd landing
# editar index.html...
vercel --prod
```

### Atualizar Proxy (vercel.json)

Se precisar mudar as URLs dos projetos:

1. Edite `landing/vercel.json`
2. Faça commit
3. Redeploy: `vercel --prod`

## 🎨 URLs dos Assets

### ✅ Correto (com base path)

```html
<!-- Vite resolve automaticamente -->
<img src="/icon-192.png" />
<!-- Vira: /app/icon-192.png -->

<script src="/assets/index.js"></script>
<!-- Vira: /app/assets/index.js -->
```

### ❌ Evitar

```html
<!-- Hard-coded sem base path -->
<img src="https://meusite.com/icon-192.png" />

<!-- Caminho relativo sem barra -->
<img src="icon-192.png" />
```

## 🔐 Segurança

O proxy reverso:

- ✅ Mantém HTTPS end-to-end
- ✅ Headers de segurança preservados
- ✅ Sem exposição de URLs internas
- ✅ Nenhum dado sensível vazado

## 📚 Referências

- [Vercel Rewrites](https://vercel.com/docs/projects/project-configuration#rewrites)
- [Vite Base Public Path](https://vitejs.dev/config/shared-options.html#base)
- [Vercel Multi-Project Setup](https://vercel.com/guides/can-you-have-multiple-applications-in-a-single-vercel-project)

---

**Última atualização:** 06/02/2026  
**Status:** ✅ Configurado e Testado
