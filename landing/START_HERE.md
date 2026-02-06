# 🚀 START HERE - Landing Page NBS Helper

## Início Rápido (2 minutos)

### 1. Visualizar Localmente

```bash
cd landing
python3 -m http.server 8080
```

Abra: http://localhost:8080

### 2. Customizar

Edite [index.html](index.html):

- **Linha 8:** Título da página
- **Linha 9:** Descrição META
- **Linha 36-40:** Hero principal
- **Linha 64:** Link do botão CTA

### 3. Deploy

```bash
./deploy.sh prod
```

Escolha plataforma:

1. Vercel (mais rápido)
2. Netlify
3. Firebase

**Pronto!** 🎉

---

## 📚 Documentação Completa

| Arquivo                                    | Descrição                         |
| ------------------------------------------ | --------------------------------- |
| [README.md](README.md)                     | Documentação técnica completa     |
| [DEPLOY.md](DEPLOY.md)                     | Guia detalhado de deploy          |
| [SOCIAL_MEDIA_KIT.md](SOCIAL_MEDIA_KIT.md) | Textos prontos para redes sociais |

---

## 📁 Estrutura dos Arquivos

```
landing/
├── index.html              ← Página principal (EDITE AQUI)
├── README.md              ← Docs técnicas
├── DEPLOY.md              ← Guia de deploy
├── SOCIAL_MEDIA_KIT.md    ← Kit de divulgação
├── START_HERE.md          ← Este arquivo
├── deploy.sh              ← Script automático de deploy
├── package.json           ← Dependências
├── tailwind.config.js     ← Config Tailwind
└── .gitignore            ← Arquivos ignorados
```

---

## ✅ Checklist Pré-Lançamento

### Design

- [ ] Logo/ícone criado
- [ ] Cores ajustadas ao brand
- [ ] Textos revisados
- [ ] CTAs testados

### Conteúdo

- [ ] Título chamativo
- [ ] Descrição clara da proposta de valor
- [ ] Benefícios destacados
- [ ] Seção "Como funciona"
- [ ] Contato/suporte

### Técnico

- [ ] Links funcionando
- [ ] Responsivo (mobile/tablet/desktop)
- [ ] Meta tags SEO
- [ ] Open Graph (social sharing)
- [ ] Favicon

### Marketing

- [ ] Google Analytics configurado
- [ ] Meta Pixel (se usar Facebook Ads)
- [ ] Textos para redes sociais prontos
- [ ] Imagens para compartilhamento

---

## 🎨 Criar Assets Necessários

### OG Image (1200x630px)

Use [Canva](https://canva.com):

1. Template: "Facebook Post"
2. Redimensionar: 1200 x 630px
3. Design:
   - Fundo: Gradiente azul → roxo
   - Logo: Ícone livro
   - Texto: "NBS Helper"
   - Subtítulo: "Códigos NBS 2.0 em Segundos"
   - Badge: "100% Gratuito"
4. Exportar: PNG
5. Salvar como: `og-image.png`

### Icons PWA (192x192 e 512x512)

1. Mesmo design do favicon
2. Cores: #2563eb (azul)
3. Salvar como: `icon-192.png` e `icon-512.png`

---

## 🚀 Deploy Rápido por Plataforma

### Vercel (Recomendado)

```bash
npm i -g vercel
cd landing
vercel --prod
```

### Netlify

```bash
npm i -g netlify-cli
cd landing
netlify deploy --prod --dir=.
```

### GitHub Pages

```bash
git checkout -b gh-pages
cp -r landing/* .
git add .
git commit -m "feat: landing page"
git push origin gh-pages
```

---

## 📱 Divulgar nas Redes Sociais

Textos prontos em: [SOCIAL_MEDIA_KIT.md](SOCIAL_MEDIA_KIT.md)

**Plataformas:**

- LinkedIn (profissional)
- Facebook (casual)
- Twitter/X (conciso)
- Instagram (visual)
- WhatsApp (direto)

**Hashtags principais:**

```
#NBS #NotaFiscal #NFSe #Contabilidade #FerramentaGratuita
```

---

## 🆘 Problemas Comuns

### "python3: command not found"

**Solução:** Use outro servidor:

```bash
npx serve -s .
```

### "Links não funcionam"

**Solução:** Verifique se o app está rodando em `/app` ou altere os links no HTML.

### "CSS não aparece"

**Solução:** Verifique se está usando CDN do Tailwind (linha 23 do HTML) ou build local.

---

## 📞 Ajuda

Dúvidas? Consulte:

1. [README.md](README.md) - Documentação completa
2. [DEPLOY.md](DEPLOY.md) - Guia de deploy
3. Email: harlem.claumann@gmail.com
4. WhatsApp: (11) 96774-5351

---

## 🎯 Próximos Passos

Depois do deploy:

1. **Monitorar Analytics**
   - Google Analytics
   - Vercel Analytics
   - Taxa de conversão

2. **Coletar Feedback**
   - Pesquisas com usuários
   - Comentários nas redes
   - Ajustes baseados em dados

3. **Iterar**
   - Testes A/B de CTAs
   - Novos depoimentos
   - Seção de FAQ
   - Blog integrado

---

**Versão:** 1.0.0  
**Última atualização:** 06/02/2026  
**Status:** ✅ Pronta para usar

Bom lançamento! 🎉
