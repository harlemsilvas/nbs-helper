/**
 * Configurações do Google AdSense
 */

export const ADSENSE_CONFIG = {
  // Substituir pelo seu ID de publisher do AdSense
  // Formato: ca-pub-XXXXXXXXXXXXXXXX
  publisherId: 'ca-pub-XXXXXXXXXXXXXXXX',
  
  // IDs dos slots de anúncios (criar no painel do AdSense)
  slots: {
    headerBanner: '1234567890',      // Banner horizontal no topo
    footerBanner: '0987654321',      // Banner horizontal no rodapé
    sidebarBanner: '1122334455',     // Banner vertical na sidebar
    inFeedAd: '5544332211',          // Anúncio entre resultados
    squareAd: '6677889900',          // Anúncio quadrado
  },
  
  // Configurações de exibição
  settings: {
    // Mostrar anúncios apenas em produção
    enableInDevelopment: false,
    
    // Frequência de anúncios in-feed (a cada X resultados)
    inFeedFrequency: 10,
    
    // Exibir anúncios - DESATIVADO até ter Publisher ID válido
    showHeaderBanner: false,
    showFooterBanner: false,
    showSidebarBanner: false,
    showInFeedAds: false,
  }
};

/**
 * Verifica se os anúncios devem ser exibidos
 */
export function shouldShowAds() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return !isDevelopment || ADSENSE_CONFIG.settings.enableInDevelopment;
}

/**
 * Retorna a configuração do slot
 */
export function getAdSlot(slotName) {
  return ADSENSE_CONFIG.slots[slotName] || '';
}
