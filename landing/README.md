# Landing Page - NBS Helper

## 📋 Visão Geral

Landing page moderna e leve para divulgação do NBS Helper em mídias sociais e campanhas de marketing.

## ✨ Características

### Design

- 🎨 **Design moderno** com gradientes e animações suaves
- 📱 **Totalmente responsivo** (mobile-first)
- ⚡ **Leve e rápido** (<100KB total)
- 🎭 **Animações CSS** sem dependências JavaScript pesadas
- 🌈 **Paleta de cores vibrante** para chamar atenção

### Seções

1. **Hero** - Título impactante com CTAs principais
2. **Social Proof** - Números que impressionam (1.237 códigos, 100% gratuito)
3. **Features** - 6 benefícios principais em cards visuais
4. **How it Works** - 3 passos simples
5. **CTA Final** - Chamada para ação secundária
6. **Footer** - Links úteis e contato

### SEO & Social Media

✅ Meta tags otimizadas para SEO
✅ Open Graph (Facebook, LinkedIn)
✅ Twitter Cards
✅ Descrições atraentes
✅ Imagens para compartilhamento (og-image.png)

## 🚀 Como Usar

### Desenvolvimento Local

```bash
# 1. Navegue até a pasta
cd landing

# 2. Abra no navegador (método simples)
# Opção 1: Abrir diretamente o index.html
open index.html

# Opção 2: Usar servidor local (recomendado)
python3 -m http.server 8080
# Acesse: http://localhost:8080

# Opção 3: Usar npx (Node.js)
npm serve -s .
```

### Build para Produção

#### 1. Otimizar Tailwind CSS

Em produção, substitua o CDN do Tailwind por build local:

```bash
# Instalar Tailwind CLI
npm install -D tailwindcss

# Criar arquivo de configuração
npx tailwindcss init

# Gerar CSS otimizado
npx tailwindcss -o ./styles.css --minify
```

#### 2. Minificar HTML

```bash
# Usar html-minifier
npm install -g html-minifier

html-minifier index.html \
  --collapse-whitespace \
  --remove-comments \
  --minify-css true \
  --minify-js true \
  -o index.min.html
```

#### 3. Otimizar Imagens

Crie as imagens necessárias:

```bash
# Criar og-image.png (1200x630px) para social media
# Pode usar Canva, Figma ou Photoshop

# Otimizar com ImageOptim, TinyPNG ou:
npx imagemin og-image.png --out-dir=./
```

## 📦 Deploy

### Opção 1: Vercel (Recomendado)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
cd landing
vercel --prod

# Configurar domínio customizado na dashboard Vercel
```

### Opção 2: Netlify

```bash
# 1. Instalar Netlify CLI
npm i -g netlify-cli

# 2. Deploy
cd landing
netlify deploy --prod --dir=.
```

### Opção 3: GitHub Pages

```bash
# 1. Criar branch gh-pages
git checkout -b gh-pages

# 2. Copiar arquivos da landing
cp -r landing/* .

# 3. Commit e push
git add .
git commit -m "feat: add landing page"
git push origin gh-pages

# 4. Configurar no GitHub:
# Settings > Pages > Source: gh-pages branch
```

### Opção 4: Integrar com App Principal

```bash
# Mover landing para /public/landing do app principal
mv landing ../apps/web/public/landing

# Acessar em: https://seudominio.com/landing
```

## 🎨 Customização

### Cores

As cores principais usam Tailwind CSS:

```html
<!-- Azul -->
<div class="bg-blue-600"></div>

<!-- Roxo -->
<div class="bg-purple-600"></div>

<!-- Rosa -->
<div class="bg-pink-600"></div>
```

### Gradientes

```css
/* Gradiente principal */
.gradient-blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Gradiente no texto */
.gradient-text {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

### Animações

```css
/* Fade In Up */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Float */
@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}
```

## 📊 Analytics

### Google Analytics 4

Adicione antes do `</head>`:

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

### Meta Pixel (Facebook)

```html
<!-- Meta Pixel Code -->
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

## 🖼️ Assets Necessários

### Criar as seguintes imagens:

1. **og-image.png** (1200x630px)
   - Imagem para compartilhamento social
   - Incluir logo + slogan
   - Fundo atrativo

2. **icon-192.png** (192x192px)
   - Ícone PWA pequeno

3. **icon-512.png** (512x512px)
   - Ícone PWA grande

### Template Canva

Use este template como referência:

- Fundo: Gradiente azul → roxo
- Logo: Ícone de livro + "NBS Helper"
- Texto: "Encontre Códigos NBS 2.0 em Segundos!"
- Subtexto: "100% Gratuito | Offline | Sem Cadastro"

## 📱 Compartilhamento Social

### Textos Prontos

#### LinkedIn

```
🚀 Acabei de descobrir o NBS Helper!

Ferramenta GRATUITA para buscar códigos NBS 2.0 na emissão de notas fiscais.

✅ 1.237 códigos indexados
✅ Busca instantânea
✅ Funciona offline
✅ Sem cadastro

Teste agora: [link]

#NBS #NotaFiscal #NFSe #Contabilidade
```

#### Facebook

```
💡 Dica para Contadores e Prestadores de Serviço!

Pare de perder tempo procurando códigos NBS 2.0.

O NBS Helper é uma ferramenta 100% gratuita que encontra o código certo em segundos!

🔍 Busca inteligente
⚡ Resultados instantâneos
📱 Funciona no celular
💾 Offline

Acesse grátis: [link]
```

#### Twitter/X

```
🔥 NBS Helper: encontre códigos NBS 2.0 em segundos!

✅ Gratuito
✅ 1.237 códigos
✅ Offline
✅ Sem login

👉 [link]

#NBS #NotaFiscal #Dev
```

#### WhatsApp

```
Olá! 👋

Conhece o NBS Helper?

É uma ferramenta gratuita que encontra códigos NBS 2.0 para nota fiscal em segundos!

🎯 Super rápida
💯 Totalmente grátis
📱 Funciona offline

Teste aqui: [link]
```

## 🎯 Call-to-Actions (CTAs)

Botões testados e otimizados:

1. **"Começar a Buscar Agora"** (Principal)
2. **"Acessar Gratuitamente"** (Secundário)
3. **"Saiba Mais"** (Informativo)
4. **"Acessar App"** (Header)

## 🔧 Melhorias Futuras

- [ ] Adicionar vídeo demo (30s)
- [ ] Seção de depoimentos
- [ ] FAQ expandida
- [ ] Comparação com outras ferramentas
- [ ] Blog integrado
- [ ] Formulário de newsletter
- [ ] Chat ao vivo
- [ ] Testes A/B de CTAs

## 📈 Métricas para Acompanhar

- Taxa de conversão (visitantes → usuários app)
- Taxa de rejeição
- Tempo médio na página
- Origem do tráfego (social media)
- Cliques nos CTAs
- Compartilhamentos sociais

## 🆘 Troubleshooting

### Tailwind CSS não carrega

- Verifique se o CDN está acessível
- Em produção, use build local

### Imagens não aparecem

- Verifique os caminhos relativos
- Certifique-se que og-image.png existe

### Animações não funcionam no Safari

- Adicione prefixos webkit
- Use fallback sem animações

## 📞 Suporte

Dúvidas ou sugestões:

- Email: harlem.claumann@gmail.com
- WhatsApp: (11) 96774-5351

---

**Última atualização:** 06/02/2026  
**Versão:** 1.0.0  
**Status:** ✅ Pronta para produção
