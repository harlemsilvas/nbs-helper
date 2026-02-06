# Como Gerar Imagens de Preview (OG Images)

As imagens de preview para redes sociais (Open Graph e Twitter Cards) foram configuradas nos arquivos:
- `/apps/web/public/og-image.html`
- `/landing/og-image.html`

## Opção 1: Usando Screenshot de Navegador (Mais Fácil)

1. Abra o arquivo HTML no navegador:
   ```bash
   # Para web app
   open apps/web/public/og-image.html
   
   # Para landing
   open landing/og-image.html
   ```

2. Pressione **F12** para abrir DevTools

3. Pressione **Ctrl+Shift+P** (ou **Cmd+Shift+P** no Mac)

4. Digite **"Capture full size screenshot"** e pressione Enter

5. Renomeie o arquivo baixado para **`og-image.png`**

6. Mova para as pastas:
   ```bash
   # Web app
   mv ~/Downloads/og-image.png apps/web/public/
   
   # Landing  
   mv ~/Downloads/og-image.png landing/
   ```

## Opção 2: Usando Ferramenta Online

1. Acesse: **https://hcti.io/playground**

2. Copie o conteúdo do arquivo `og-image.html`

3. Cole no campo **HTML**

4. Ajuste dimensões para **1200x630**

5. Clique em **"Create Image"**

6. Baixe e salve como `og-image.png`

## Opção 3: Usando Puppeteer (Programmaticamente)

```bash
npm install -g capture-website-cli

capture-website apps/web/public/og-image.html \
  --output apps/web/public/og-image.png \
  --width 1200 \
  --height 630

capture-website landing/og-image.html \
  --output landing/og-image.png \
  --width 1200 \
  --height 630
```

## Verificar Imagens

Após gerar as imagens, verifique:

✅ Dimensões: **1200x630 pixels** (recomendado)  
✅ Tamanho: **< 5 MB**  
✅ Formato: **PNG, JPG ou WebP**

## Testar Preview

- **Facebook:** https://developers.facebook.com/tools/debug/
- **Twitter:** https://cards-dev.twitter.com/validator
- **LinkedIn:** https://www.linkedin.com/post-inspector/

Cole a URL: `https://nbs-helper.vercel.app/app`

---

## Meta Tags Configuradas

**Web App (`apps/web/index.html`):**
```html
<meta property="og:image" content="https://nbs-helper.vercel.app/app/og-image.png" />
<meta name="twitter:image" content="https://nbs-helper.vercel.app/app/og-image.png" />
```

**Landing (`landing/index.html`):**
```html
<meta property="og:image" content="https://nbs-helper.vercel.app/og-image.png" />
<meta name="twitter:image" content="https://nbs-helper.vercel.app/og-image.png" />
```

Após gerar e fazer deploy, essas imagens aparecerão automaticamente ao compartilhar o link! 🎉
