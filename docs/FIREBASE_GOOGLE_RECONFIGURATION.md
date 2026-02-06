# 🔐 Reconfiguração Firebase & Google - Novo Domínio

## 📋 Overview

Após migração para proxy reverso, as URLs mudaram:

| Antes                                | Depois                                     |
| ------------------------------------ | ------------------------------------------ |
| `https://nbs-helper-web.vercel.app/` | `https://nbs-helper.vercel.app/app`        |
| N/A                                  | `https://nbs-helper.vercel.app/` (landing) |

## 🔥 Firebase Console

### 1. Authentication - Domínios Autorizados

#### Acessar:

https://console.firebase.google.com/project/nbs-helper/authentication/settings

#### Configurar:

**Authorized domains:**

```
✅ nbs-helper.vercel.app          (domínio principal - OBRIGATÓRIO)
✅ nbs-helper.firebaseapp.com     (Firebase default)
✅ localhost                       (desenvolvimento)
```

**REMOVER (domínios antigos/temporários):**

```
❌ nbs-helper-web.vercel.app      (não usar mais para login)
❌ web-ashen-theta-31.vercel.app  (URL temporária)
❌ landing-three-liart.vercel.app (URL temporária)
```

#### Passos:

1. Vá em **Authentication** → **Settings** → **Authorized domains**
2. Clique **Add domain**
3. Digite: `nbs-helper.vercel.app`
4. **Save**
5. Remova domínios antigos (se existirem)

### 2. Google Sign-In - OAuth

#### Acessar:

https://console.cloud.google.com/apis/credentials?project=nbs-helper

#### Configurar OAuth 2.0 Client ID:

**Authorized JavaScript origins:**

```
https://nbs-helper.vercel.app
http://localhost:5173
http://localhost:4173
```

**Authorized redirect URIs:**

```
https://nbs-helper.vercel.app/__/auth/handler
https://nbs-helper.firebaseapp.com/__/auth/handler
http://localhost:5173/__/auth/handler
http://localhost:4173/__/auth/handler
```

#### Passos:

1. Vá em **API & Services** → **Credentials**
2. Clique no **OAuth 2.0 Client ID** (Web client auto created by Google Service)
3. **Authorized JavaScript origins:**
   - Clique **+ ADD URI**
   - Digite: `https://nbs-helper.vercel.app`
   - Remove URIs antigos (web-_, landing-_)
4. **Authorized redirect URIs:**
   - Clique **+ ADD URI**
   - Digite: `https://nbs-helper.vercel.app/__/auth/handler`
   - Remove URIs antigos
5. **Save**

### 3. Firestore Security Rules

Verificar se não há regras baseadas em domínio.

#### Acessar:

https://console.firebase.google.com/project/nbs-helper/firestore/rules

**Geralmente as regras são baseadas em autenticação, não em domínio, então devem estar OK.**

---

## 📊 Google Analytics 4

### Acessar:

https://analytics.google.com/

### Atualizar Property Settings

1. **Admin** → **Property Settings**
2. **Website URL:** `https://nbs-helper.vercel.app`
3. **Save**

### Atualizar Data Stream

1. **Admin** → **Data Streams**
2. Clique no stream web existente
3. **Stream details:**
   - **Website URL:** `https://nbs-helper.vercel.app`
   - **Stream name:** "NBS Helper - Web App"
4. **Enhanced measurement** → Verifique se está habilitado:
   - ✅ Page views
   - ✅ Scrolls
   - ✅ Outbound clicks
   - ✅ File downloads
5. **Save**

### Configurar Referral Exclusions ⚠️ IMPORTANTE

Para evitar que navegação entre landing → /app seja contada como nova sessão:

1. **Admin** → **Data Streams** → Stream → **Configure tag settings**
2. **Show more** → **List unwanted referrals**
3. **Add domain** (cada um separado):
   ```
   landing-three-liart.vercel.app
   nbs-helper-web.vercel.app
   web-ashen-theta-31.vercel.app
   nbs-helper.vercel.app
   ```

Isso garante que:

- Landing → /app = mesma sessão ✅
- /app → landing = mesma sessão ✅
- Sem inflação de tráfego ✅

---

## 🔍 Google Search Console

### Adicionar Property

1. Acessar: https://search.google.com/search-console
2. **Add property** → **URL prefix**
3. Digite: `https://nbs-helper.vercel.app`
4. **Continue**

### Verificar Propriedade

Escolha um método:

**Opção 1: HTML file**

- Download do arquivo de verificação
- Uploade para `/public` no projeto landing
- Redeploy landing
- Clique **Verify**

**Opção 2: HTML tag** (mais fácil)

- Copie a meta tag fornecida
- Adicione no `<head>` do `landing/index.html`
- Redeploy landing
- Clique **Verify**

**Opção 3: Google Analytics**

- Se GA4 já configurado e funcionando
- Selecione esta opção
- Clique **Verify**

### Submeter Sitemaps

Depois de verificar:

1. **Sitemaps** (menu lateral)
2. **Add a new sitemap:**
   ```
   https://nbs-helper.vercel.app/sitemap.xml
   https://nbs-helper.vercel.app/app/sitemap.xml
   ```
3. **Submit**

---

## 📝 Atualizar Código

### 1. Atualizar Meta Tags no index.html

**Arquivo:** `apps/web/index.html`

```html
<!-- URLs canônicas devem apontar para /app -->
<link rel="canonical" href="https://nbs-helper.vercel.app/app" />

<!-- Open Graph -->
<meta property="og:url" content="https://nbs-helper.vercel.app/app" />

<!-- Schema.org -->
<script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "NBS Helper",
    "url": "https://nbs-helper.vercel.app/app",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "BRL"
    }
  }
</script>
```

### 2. Atualizar Sitemap

**Arquivo:** `apps/web/public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://nbs-helper.vercel.app/</loc>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://nbs-helper.vercel.app/app</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>
```

### 3. Atualizar robots.txt

**Arquivo:** `apps/web/public/robots.txt`

```
User-agent: *
Allow: /

Sitemap: https://nbs-helper.vercel.app/sitemap.xml
```

---

## ✅ Checklist Completo

### Firebase

- [ ] **Authentication** → Authorized domains → Adicionar `nbs-helper.vercel.app`
- [ ] **Authentication** → Remover domínios antigos
- [ ] **Google Cloud** → OAuth origins → Adicionar `https://nbs-helper.vercel.app`
- [ ] **Google Cloud** → OAuth redirects → Adicionar `https://nbs-helper.vercel.app/__/auth/handler`
- [ ] **Google Cloud** → Remover origins antigos
- [ ] **Testar login:** Abrir /app e fazer login com Google

### Google Analytics

- [ ] **Property Settings** → Website URL = `https://nbs-helper.vercel.app`
- [ ] **Data Stream** → URL = `https://nbs-helper.vercel.app`
- [ ] **Referral exclusions** → Adicionar todos domínios Vercel
- [ ] **Testar:** Abrir /app e verificar eventos no Realtime

### Google Search Console

- [ ] **Add property** → `https://nbs-helper.vercel.app`
- [ ] **Verificar propriedade** (HTML tag ou GA)
- [ ] **Submeter sitemap** → `/sitemap.xml`
- [ ] **Monitorar indexação** nos próximos dias

### Código

- [ ] **index.html** → Atualizar canonical para `/app`
- [ ] **index.html** → Atualizar og:url para `/app`
- [ ] **index.html** → Atualizar Schema.org url
- [ ] **sitemap.xml** → Atualizar URLs
- [ ] **robots.txt** → Atualizar sitemap URL
- [ ] **Rebuild:** `cd apps/web && npm run build`
- [ ] **Deploy:** `vercel --prod --yes`

### Proxy (vercel.json)

- [x] **landing/vercel.json** → Usar `nbs-helper-web.vercel.app` ✅
- [ ] **Redeploy landing** → `cd landing && vercel --prod --yes`

### Testes Finais

- [ ] Login com Google em `https://nbs-helper.vercel.app/app`
- [ ] Adicionar favorito → Sincroniza no Firestore
- [ ] Analytics registra pageview
- [ ] PWA instala corretamente
- [ ] Sem erros no console (F12)

---

## 🧪 Script de Teste Rápido

```bash
# 1. Testar login (manual no navegador)
open https://nbs-helper.vercel.app/app

# 2. Testar Analytics
curl "https://nbs-helper.vercel.app/app" | grep "gtag"

# 3. Testar Sitemap
curl https://nbs-helper.vercel.app/sitemap.xml

# 4. Testar Robots
curl https://nbs-helper.vercel.app/robots.txt
```

---

## 🚨 Troubleshooting

### Erro: "auth/unauthorized-domain"

**Causa:** Domínio não está em Firebase → Authorized domains  
**Solução:**

1. https://console.firebase.google.com/project/nbs-helper/authentication/settings
2. Add domain: `nbs-helper.vercel.app`

### Login não abre popup

**Causa:** OAuth origins não configurado  
**Solução:**

1. https://console.cloud.google.com/apis/credentials?project=nbs-helper
2. Edit OAuth client
3. Add origin: `https://nbs-helper.vercel.app`

### Analytics não registra eventos

**Causa:** Measurement ID incorreto ou URL não configurada  
**Solução:**

1. Verificar `G-XXXXXXXXXX` no código
2. Verificar URL no Data Stream

### Favoritos não sincronizam

**Causa:** Firestore rules ou autenticação  
**Solução:**

1. Fazer login primeiro
2. Verificar console de erros (F12)
3. Verificar Firestore rules

### Redirect loop login

**Causa:** Redirect URI não configurado  
**Solução:**

1. Adicionar `https://nbs-helper.vercel.app/__/auth/handler` nos redirects
2. Limpar cookies e tentar novamente

---

## 📞 Links Úteis

- **Firebase Console:** https://console.firebase.google.com/project/nbs-helper
- **Google Cloud Console:** https://console.cloud.google.com/apis/credentials?project=nbs-helper
- **Google Analytics:** https://analytics.google.com/
- **Search Console:** https://search.google.com/search-console

---

**Tempo estimado:** 20-30 minutos  
**Complexidade:** Média  
**Última atualização:** 06/02/2026
