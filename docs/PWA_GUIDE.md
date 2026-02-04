# 📱 PWA (Progressive Web App) - NBS Helper

## ✅ Funcionalidades Implementadas

### 1. App Instalável
- ✅ Manifest configurado (`vite.config.js`)
- ✅ Ícones 192x192 e 512x512
- ✅ Theme color: `#2563eb` (azul)
- ✅ Display: `standalone` (fullscreen)
- ✅ Start URL: `/`

### 2. Service Worker
- ✅ Registro automático (`autoUpdate`)
- ✅ Cache de assets estáticos (JS, CSS, HTML, ícones)
- ✅ Cache de Google Fonts (1 ano)
- ✅ Estratégia: `CacheFirst` para performance

### 3. Prompt de Instalação
- ✅ Banner deslizante (bottom)
- ✅ Aparece apenas 1x (localStorage)
- ✅ Responsivo (mobile/desktop)
- ✅ Dark mode support
- ✅ Animação suave

### 4. Offline Support
- ✅ App funciona offline após 1ª visita
- ✅ Dados NBS em cache
- ✅ Interface completa em cache

---

## 🎯 Como Funciona

### 1. Desktop (Chrome/Edge)

Quando um usuário visita o site:
1. Banner aparece no canto inferior
2. Botão "Instalar" → Abre prompt nativo do navegador
3. Após instalar → Ícone na barra de tarefas
4. Abre como app separado (sem barra de endereço)

### 2. Mobile (Android)

1. Chrome mostra banner automático após 2 visitas
2. Ou menu → "Adicionar à tela inicial"
3. Ícone aparece com outros apps
4. Abre em fullscreen

### 3. Mobile (iOS)

Safari não suporta prompt automático:
1. Usuário deve ir em: Compartilhar → "Adicionar à Tela de Início"
2. Banner customizado não funciona
3. Manifest funciona normalmente

---

## 📊 Métricas PWA

### Lighthouse Score Esperado:
- ✅ **PWA**: 100/100
- ✅ **Performance**: 95+
- ✅ **Accessibility**: 95+
- ✅ **Best Practices**: 100
- ✅ **SEO**: 100

### Critérios PWA Atendidos:
- ✅ HTTPS (Vercel)
- ✅ Service Worker registrado
- ✅ Manifest válido
- ✅ Ícones em múltiplos tamanhos
- ✅ Theme color
- ✅ Display standalone
- ✅ Offline fallback

---

## 🧪 Como Testar

### 1. Desenvolvimento (localhost)

```bash
npm run dev:web
```

Abra `http://localhost:5173`:
- Banner deve aparecer após alguns segundos
- Clique "Instalar" → Veja no Chrome Apps

### 2. Produção (Vercel)

Deploy automático:
```bash
git push
```

Chrome DevTools:
1. F12 → Application → Manifest
2. Verifique ícones, nome, cores
3. Application → Service Workers
4. Veja se está "activated and running"

### 3. Lighthouse Audit

Chrome DevTools:
1. F12 → Lighthouse
2. Marque "Progressive Web App"
3. "Generate report"
4. Veja checklist PWA

---

## 🔧 Configuração

### Manifest (vite.config.js)

```javascript
{
  name: 'NBS Helper - Busca de Códigos NBS 2.0',
  short_name: 'NBS Helper',
  description: 'Ferramenta gratuita para busca de códigos NBS 2.0 para emissão de NFS-e',
  theme_color: '#2563eb',
  background_color: '#ffffff',
  display: 'standalone',
  start_url: '/',
  icons: [...]
}
```

### Service Worker (Workbox)

```javascript
workbox: {
  globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-cache',
        expiration: {
          maxAgeSeconds: 60 * 60 * 24 * 365 // 1 ano
        }
      }
    }
  ]
}
```

---

## 📱 Ícones

### Gerados com Canvas API

- **192x192px**: Tela inicial Android
- **512x512px**: Splash screen Android
- **Design**: Fundo azul `#2563eb` + texto "NBS" branco

### Como regenerar:

Abra `http://localhost:5173/create-icons.html` e clique nos botões.

---

## 🚀 Melhorias Futuras

### Fase 2 (Opcional):
- [ ] Push notifications (favoritos atualizados)
- [ ] Background sync (sincronizar offline → online)
- [ ] Share Target API (compartilhar códigos)
- [ ] Shortcuts (atalhos de contexto)
- [ ] Badge API (notificações visuais)

### Fase 3 (Avançado):
- [ ] Web Share API
- [ ] File System Access API
- [ ] Periodic Background Sync
- [ ] Contact Picker API

---

## 🔒 Segurança

### Service Worker Scope:
- ✅ Registrado na raiz `/`
- ✅ Acesso a todos recursos
- ✅ Cache apenas recursos do domínio
- ✅ HTTPS obrigatório (exceto localhost)

### Cache Strategy:
- **Static assets**: Cache First (performance)
- **API calls**: Network First (dados frescos)
- **Fonts**: Cache First (1 ano)

---

## 📈 Benefícios

### Para Usuários:
- ✅ **+40% engajamento** (dados Google)
- ✅ **+20% conversão** (add to home screen)
- ✅ **Acesso offline** completo
- ✅ **Carregamento instantâneo** (2ª visita)
- ✅ **Menos dados móveis** (cache)

### Para o Negócio:
- ✅ **SEO boost** (PWA = ranking melhor)
- ✅ **Menos bounce rate**
- ✅ **Mais páginas/sessão**
- ✅ **App nativo sem custo**
- ✅ **Push notifications** (futuro)

---

## 🐛 Troubleshooting

### Banner não aparece:

1. Certifique-se que está em HTTPS (ou localhost)
2. Verifique se já não instalou antes
3. Limpe localStorage: `localStorage.removeItem('pwa-install-dismissed')`
4. Chrome: chrome://flags → Enable PWA install prompt

### Service Worker não registra:

1. DevTools → Application → Clear storage
2. Reload (Ctrl+Shift+R)
3. Verifique console por erros
4. Veja se vite.config.js tem plugin PWA

### Ícones não aparecem:

1. Verifique `/public/icon-192.png` e `/public/icon-512.png`
2. Build novamente: `npm run build`
3. DevTools → Application → Manifest → Icons

---

## 📚 Recursos

- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Vite Plugin PWA](https://vite-pwa-org.netlify.app/)
- [Web App Manifest](https://web.dev/add-manifest/)

---

**Status:** ✅ PWA completo e funcional!

**Lighthouse Score:** Execute audit para confirmar 100/100
