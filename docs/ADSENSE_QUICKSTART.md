# 🚀 Quick Start - Google AdSense

## Passos Rápidos para Ativar Monetização

### 1️⃣ Criar Conta AdSense (5 min)
1. Acesse [google.com/adsense](https://www.google.com/adsense)
2. Faça login
3. Cadastre o site: `https://nbs-helper.vercel.app`
4. Aguarde aprovação (1-14 dias)

### 2️⃣ Obter Publisher ID (2 min)
Após aprovação:
- Formato: `ca-pub-XXXXXXXXXXXXXXXX`
- Local: Painel AdSense → Conta → Informações

### 3️⃣ Criar Unidades de Anúncio (10 min)

**No painel do AdSense:**

#### Header Banner
- Tipo: Display Responsivo
- Nome: `NBS Helper - Header`
- Formato: Horizontal
- ✅ Copie o Slot ID

#### Footer Banner
- Tipo: Display Responsivo
- Nome: `NBS Helper - Footer`
- Formato: Horizontal
- ✅ Copie o Slot ID

#### In-Feed Ad
- Tipo: In-feed
- Nome: `NBS Helper - Results`
- Layout: Native
- ✅ Copie o Slot ID

### 4️⃣ Configurar no Código (5 min)

#### Arquivo 1: `/apps/web/index.html`
```html
<!-- Linha 74 - Substituir XXXXXXXXXXXXXXXX -->
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
        crossorigin="anonymous"></script>
```

#### Arquivo 2: `/apps/web/src/config/adsense.js`
```javascript
export const ADSENSE_CONFIG = {
  publisherId: 'ca-pub-XXXXXXXXXXXXXXXX', // SEU ID AQUI
  
  slots: {
    headerBanner: '1234567890',     // SEU SLOT HEADER
    footerBanner: '0987654321',     // SEU SLOT FOOTER
    inFeedAd: '5544332211',         // SEU SLOT IN-FEED
  },
  // ... resto fica igual
};
```

#### Arquivo 3: `/apps/web/src/components/AdSense.jsx`
```javascript
// Linha 36
data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // SEU ID AQUI
```

#### Arquivo 4: `/apps/web/src/components/AdBanner.jsx`
```javascript
// Atualizar cada função com os slots corretos:

export function HorizontalAdBanner({ className = '' }) {
  return (
    <div className={`w-full max-w-7xl mx-auto px-4 py-4 ${className}`}>
      <AdSense 
        slot="1234567890" // SLOT HEADER/FOOTER AQUI
        format="horizontal"
        responsive={true}
      />
    </div>
  );
}

export function InFeedAd({ className = '' }) {
  return (
    <div className={`${className}`}>
      <AdSense 
        slot="5544332211" // SLOT IN-FEED AQUI
        format="fluid"
        responsive={true}
      />
    </div>
  );
}
```

### 5️⃣ Deploy (2 min)

```bash
git add -A
git commit -m "feat: adicionar Google AdSense para monetização"
git push
```

Vercel fará deploy automático em ~2 minutos.

### 6️⃣ Verificar (24h depois)

1. Acesse seu site em produção
2. Abra DevTools (F12) → Console
3. Verifique se não há erros do AdSense
4. Aguarde 24-48h para primeiros anúncios aparecerem
5. Monitore painel do AdSense

## ⚠️ Avisos Importantes

### NÃO faça:
- ❌ Clicar nos próprios anúncios (banimento!)
- ❌ Pedir cliques para amigos/família
- ❌ Usar tráfego falso/bots
- ❌ Modificar código JavaScript do AdSense

### Faça:
- ✅ Aguarde tráfego orgânico real
- ✅ Monitore métricas no painel
- ✅ Mantenha conteúdo de qualidade
- ✅ Respeite políticas do Google

## 📊 O Que Esperar

### Primeiros Dias
- Anúncios podem não aparecer imediatamente
- Google está aprendendo sobre seu site
- Podem aparecer anúncios genéricos de baixo valor

### Primeira Semana
- Anúncios começam a aparecer consistentemente
- CPC ainda baixo (aprendizado)

### Primeiro Mês
- Anúncios otimizados para seu nicho
- RPM estabiliza
- Primeiras estatísticas confiáveis

### Primeiro Pagamento
- Mínimo: R$ 70 acumulados
- Pode levar meses (depende do tráfego)
- Pago via transferência bancária

## 🎯 Configuração Opcional

### Ajustar Frequência de Anúncios

Em `/apps/web/src/config/adsense.js`:

```javascript
settings: {
  inFeedFrequency: 10,  // Mudar para 5, 15, 20, etc.
  showHeaderBanner: true,  // false para desativar
  showFooterBanner: true,  // false para desativar
  showInFeedAds: true,     // false para desativar
}
```

### Testar sem Deploy

Altere temporariamente:
```javascript
enableInDevelopment: true, // Mostra placeholders em localhost
```

## 📞 Precisa de Ajuda?

Consulte a documentação completa: [docs/ADSENSE_GUIA.md](./ADSENSE_GUIA.md)

---

**Tempo total: ~25 minutos + aguardar aprovação**
