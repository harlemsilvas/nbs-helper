# 🚀 Guia de Deploy - Landing Page NBS Helper

## Deploy Rápido (5 minutos)

### Opção 1: Vercel ⚡ (Recomendada)

```bash
# 1. Instalar Vercel CLI (uma vez)
npm i -g vercel

# 2. Deploy com um comando
cd landing
vercel --prod

# 3. Pronto! URL: https://seu-projeto.vercel.app
```

**Vantagens:**

- ✅ Deploy em segundos
- ✅ SSL grátis
- ✅ CDN global
- ✅ Domínio customizado grátis
- ✅ Preview automático de PRs

**Domínio Customizado:**

```bash
# Adicionar domínio
vercel domains add nbshelper.com

# Seguir instruções para configurar DNS
```

---

### Opção 2: Netlify 🎯

```bash
# 1. Instalar Netlify CLI
npm i -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
cd landing
netlify deploy --prod --dir=.

# 4. URL: https://seu-site.netlify.app
```

**Vantagens:**

- ✅ Formulários integrados
- ✅ Functions serverless
- ✅ Split testing A/B
- ✅ SSL grátis

---

### Opção 3: GitHub Pages 📄

```bash
# 1. Criar repositório no GitHub
git init
git add .
git commit -m "Initial commit: landing page"

# 2. Adicionar remote
git remote add origin https://github.com/seu-usuario/nbs-helper-landing.git

# 3. Push
git push -u origin main

# 4. Criar branch gh-pages
git checkout -b gh-pages
git push origin gh-pages

# 5. Configurar no GitHub
# Settings > Pages > Source: gh-pages branch
# URL: https://seu-usuario.github.io/nbs-helper-landing
```

**Vantagens:**

- ✅ Grátis ilimitado
- ✅ Direto do GitHub
- ✅ CI/CD automático

---

### Opção 4: Firebase Hosting 🔥

```bash
# 1. Instalar Firebase CLI
npm i -g firebase-tools

# 2. Login
firebase login

# 3. Inicializar
firebase init hosting

# Configurações:
# - Public directory: .
# - Single-page app: No
# - Set up automatic builds: No

# 4. Deploy
firebase deploy --only hosting

# URL: https://seu-projeto.web.app
```

---

## Deploy com Domínio Próprio

### 1. Registrar Domínio

Opções recomendadas:

- **Registro.br** (R$ 40/ano) - Para .com.br
- **Namecheap** ($8/ano) - Para .com
- **Google Domains** ($12/ano)

### 2. Configurar DNS

#### Para Vercel:

```
Tipo: A
Nome: @
Valor: 76.76.21.21

Tipo: CNAME
Nome: www
Valor: cname.vercel-dns.com
```

#### Para Netlify:

```
Tipo: A
Nome: @
Valor: 75.2.60.5

Tipo: CNAME
Nome: www
Valor: seu-site.netlify.app
```

#### Para GitHub Pages:

```
Tipo: A
Nome: @
Valor: 185.199.108.153
      185.199.109.153
      185.199.110.153
      185.199.111.153

Tipo: CNAME
Nome: www
Valor: seu-usuario.github.io
```

### 3. Aguardar Propagação DNS

Pode levar de 1 hora a 48 horas (geralmente 4-6 horas).

Verificar propagação:

- https://dnschecker.org

---

## Otimizações Antes do Deploy

### 1. Minificar HTML

```bash
npm install -g html-minifier

html-minifier index.html \
  --collapse-whitespace \
  --remove-comments \
  --minify-css true \
  --minify-js true \
  -o index.min.html
```

### 2. Otimizar CSS

```bash
# Gerar Tailwind CSS otimizado
npx tailwindcss -o ./styles.css --minify
```

Depois altere no HTML:

```html
<!-- Remover CDN -->
<!-- <script src="https://cdn.tailwindcss.com"></script> -->

<!-- Adicionar CSS local -->
<link rel="stylesheet" href="styles.css" />
```

### 3. Comprimir Imagens

Crie as imagens:

**og-image.png** (1200x630px):

- Use Canva Template: "Facebook Post"
- Fundo: Gradiente azul → roxo
- Texto: "NBS Helper - Códigos NBS 2.0 em Segundos"
- Logo + ícones

**icon-192.png** e **icon-512.png**:

- Use Canva ou Figma
- Ícone de livro estilizado
- Cores: Azul/Roxo

Otimizar:

```bash
# Via TinyPNG (online)
# https://tinypng.com

# Ou via CLI
npx imagemin *.png --out-dir=./optimized
```

---

## Configurar Analytics

### Google Analytics 4

1. Criar propriedade em https://analytics.google.com
2. Copiar ID de medição (G-XXXXXXXXXX)
3. Adicionar no `<head>` do index.html:

```html
<!-- Google tag (gtag.js) -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "G-XXXXXXXXXX");
</script>
```

### Meta Pixel (Facebook Ads)

1. Criar pixel em https://business.facebook.com
2. Copiar Pixel ID
3. Adicionar código:

```html
<!-- Meta Pixel -->
<script>
  !(function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = !0;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = !0;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js",
  );
  fbq("init", "YOUR_PIXEL_ID");
  fbq("track", "PageView");
</script>
```

---

## Checklist Final

Antes de fazer deploy, verifique:

### Design & Conteúdo

- [ ] Todas as seções estão visíveis
- [ ] Links funcionando
- [ ] Botões com ações corretas
- [ ] Imagens carregando
- [ ] Cores e fontes consistentes
- [ ] Animações suaves

### Responsividade

- [ ] Mobile (< 640px)
- [ ] Tablet (640px - 1024px)
- [ ] Desktop (> 1024px)
- [ ] Testado no Chrome
- [ ] Testado no Safari
- [ ] Testado no Firefox

### SEO

- [ ] Title tag otimizado
- [ ] Meta description
- [ ] Open Graph tags
- [ ] Twitter Cards
- [ ] Favicon presente
- [ ] URLs amigáveis

### Performance

- [ ] Imagens otimizadas
- [ ] CSS minificado
- [ ] HTML minificado
- [ ] Fontes otimizadas
- [ ] Sem console errors

### Analytics & Tracking

- [ ] Google Analytics configurado
- [ ] Meta Pixel (se usar Facebook Ads)
- [ ] Eventos de conversão

---

## URLs de Deploy Recomendadas

### Estrutura Ideal:

**Landing Principal:**

```
https://nbshelper.com
ou
https://nbshelper.com.br
```

**App:**

```
https://app.nbshelper.com
ou
https://nbshelper.com/app
```

**Alternativas (se domínio principal indisponível):**

```
https://nbshelper.vercel.app (temporário)
https://buscanbs.com.br
https://codigonbs.com.br
https://nbsbrasil.com
```

---

## Monitoramento Pós-Deploy

### 1. Google Search Console

https://search.google.com/search-console

- Submeter sitemap
- Monitorar indexação
- Verificar erros de rastreamento

### 2. PageSpeed Insights

https://pagespeed.web.dev

- Meta: Score > 90
- Otimizações sugeridas

### 3. Uptime Monitoring

- **UptimeRobot** (grátis): https://uptimerobot.com
- Verificar se site está no ar 24/7

---

## Troubleshooting

### Site não carrega

```bash
# Verificar status do deploy
vercel logs

# Ou
netlify logs
```

### CSS não aplica

- Verifique caminho do styles.css
- Force refresh: Ctrl+F5
- Limpe cache do CDN

### Imagens quebradas

- Verifique caminhos relativos
- Use caminhos absolutos em produção

---

## Scripts Automáticos

### Deploy com Versionamento

```bash
#!/bin/bash
# deploy.sh

echo "🚀 Iniciando deploy da Landing Page..."

# 1. Incrementar versão
npm version patch

# 2. Build otimizado
npm run build

# 3. Deploy Vercel
vercel --prod

# 4. Commit
git add .
git commit -m "chore: deploy landing v$(node -p "require('./package.json').version")"
git push

echo "✅ Deploy concluído!"
```

Tornar executável:

```bash
chmod +x deploy.sh
./deploy.sh
```

---

**Pronto para lançar!** 🎉

Qualquer dúvida, consulte o README.md ou entre em contato.
