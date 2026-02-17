# Versionamento PWA - Guia de Atualização

## 📋 Visão Geral

Este documento explica como funciona o sistema de versionamento e atualização automática do PWA (Progressive Web App).

## 🔄 Como Funciona

### 1. **Detecção Automática de Atualizações**

- O service worker verifica por atualizações a cada 60 segundos
- Quando uma nova versão é detectada, o componente `UpdateNotifier` exibe um banner
- O usuário é notificado sobre a disponibilidade de uma nova versão

### 2. **Componentes do Sistema**

#### UpdateNotifier (`/apps/web/src/components/UpdateNotifier.jsx`)

- Monitora mudanças no service worker
- Exibe notificação visual quando nova versão está disponível
- Permite que o usuário atualize manualmente ou feche a notificação
- Verifica atualizações automaticamente a cada minuto

#### Vite PWA Config (`/apps/web/vite.config.js`)

Configurações principais:

```javascript
{
  registerType: 'prompt',          // Permite controle manual da atualização
  cleanupOutdatedCaches: true,     // Remove caches antigos automaticamente
  skipWaiting: false,              // Aguarda confirmação do usuário
  clientsClaim: false              // Não assume controle imediatamente
}
```

### 3. **Versionamento Semântico**

O projeto segue versionamento semântico (SemVer) no `package.json`:

```json
{
  "version": "1.0.0" // MAJOR.MINOR.PATCH
}
```

**Quando incrementar:**

- **MAJOR** (1.x.x): Mudanças incompatíveis ou grandes refatorações
- **MINOR** (x.1.x): Novas funcionalidades compatíveis
- **PATCH** (x.x.1): Correções de bugs e pequenas melhorias

## 🚀 Como Fazer Deploy de Nova Versão

### Passo 1: Atualizar a Versão

```bash
cd apps/web
npm version patch  # ou minor, ou major
```

### Passo 2: Build e Deploy

```bash
npm run build
# Deploy para Vercel (automático via GitHub)
git add .
git commit -m "chore: bump version to x.y.z"
git push
```

### Passo 3: Teste

1. Acesse o app instalado no dispositivo
2. Aguarde até 60 segundos
3. Verifique se o banner de atualização aparece
4. Clique em "Atualizar agora"
5. App será recarregado com nova versão

## 🛠️ Troubleshooting

### Cache Persistente

Se o app continua mostrando versão antiga:

```javascript
// No console do navegador:
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    registrations.forEach((reg) => reg.unregister());
  });
}
caches.keys().then((keys) => {
  keys.forEach((key) => caches.delete(key));
});
location.reload();
```

### Forçar Atualização Imediata

Altere no `vite.config.js`:

```javascript
VitePWA({
  registerType: "autoUpdate", // Atualiza automaticamente sem perguntar
  skipWaiting: true, // Ativa nova versão imediatamente
  clientsClaim: true, // Assume controle dos clientes imediatamente
});
```

### Desabilitar Service Worker em Desenvolvimento

```javascript
VitePWA({
  devOptions: {
    enabled: false, // Desabilita PWA em dev
  },
});
```

## 📱 Experiência do Usuário

### Fluxo Completo

1. ✅ Usuário abre o app instalado
2. 🔍 Service worker verifica por atualizações em background
3. 🆕 Nova versão detectada
4. 📢 Banner animado aparece no canto inferior direito
5. 👆 Usuário clica em "Atualizar agora"
6. 🔄 App recarrega com a nova versão
7. ✨ Usuário vê as novidades

### Características

- Banner não intrusivo (canto inferior direito)
- Animação suave de entrada
- Usuário controla quando atualizar
- Opção de fechar e atualizar depois
- Verificação automática sem intervenção

## 🔒 Boas Práticas

### 1. Sempre Teste Localmente

```bash
npm run build
npm run preview
```

### 2. Mantenha Changelog

Documente mudanças em cada versão no `CHANGELOG.md`

### 3. Teste em Múltiplos Navegadores

- Chrome (Desktop e Mobile)
- Firefox
- Safari (iOS)
- Edge

### 4. Monitore Analytics

Acompanhe taxa de atualização e possíveis erros no service worker

## 📊 Métricas Recomendadas

- Taxa de adoção da nova versão (% usuários atualizados em 24h)
- Tempo médio até atualização
- Erros no registro do service worker
- Taxa de rejeição do banner (cliques em "Fechar")

## 🔗 Recursos Adicionais

- [PWA Guide](/docs/PWA_GUIDE.md)
- [Deploy Guide](/docs/DEPLOY_GUIDE.md)
- [Vite PWA Documentation](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)

---

**Última atualização:** Fevereiro 2026  
**Versão do documento:** 1.0.0
