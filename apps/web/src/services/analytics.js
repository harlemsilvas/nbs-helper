// Google Analytics Helper

/**
 * Envia evento customizado para o Google Analytics
 * @param {string} eventName - Nome do evento
 * @param {object} params - Parâmetros adicionais do evento
 */
export const trackEvent = (eventName, params = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, params);
  }
};

/**
 * Rastreia busca realizada
 * @param {string} query - Termo buscado
 * @param {number} resultsCount - Número de resultados
 */
export const trackSearch = (query, resultsCount) => {
  trackEvent('search', {
    search_term: query,
    results_count: resultsCount,
  });
};

/**
 * Rastreia código copiado
 * @param {string} code - Código NBS copiado
 * @param {string} type - Tipo: 'code' ou 'description'
 */
export const trackCopy = (code, type) => {
  trackEvent('copy', {
    code: code,
    copy_type: type,
  });
};

/**
 * Rastreia favorito adicionado/removido
 * @param {string} code - Código NBS
 * @param {boolean} added - true = adicionado, false = removido
 */
export const trackFavorite = (code, added) => {
  trackEvent('favorite', {
    code: code,
    action: added ? 'add' : 'remove',
  });
};

/**
 * Rastreia visualização de favoritos
 */
export const trackViewFavorites = () => {
  trackEvent('view_favorites');
};

/**
 * Rastreia mudança de página
 * @param {number} page - Número da página
 */
export const trackPageChange = (page) => {
  trackEvent('page_change', {
    page_number: page,
  });
};
