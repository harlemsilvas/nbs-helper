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

/**
 * Rastreia uso de sugestão do histórico
 * @param {string} query - Termo selecionado do histórico
 */
export const trackHistorySuggestion = (query) => {
  trackEvent('history_suggestion', {
    search_term: query,
  });
};

/**
 * Rastreia limpeza do histórico
 */
export const trackHistoryClear = () => {
  trackEvent('history_clear');
};

/**
 * Rastreia mudança de tema
 * @param {string} theme - Tema selecionado ('light' ou 'dark')
 */
export function trackThemeToggle(theme) {
  trackEvent('theme_toggle', {
    theme: theme
  });
}

/**
 * Rastreia uso de atalho de teclado
 * @param {string} shortcut - Tecla/combinação usada
 * @param {string} action - Ação executada
 */
export function trackKeyboardShortcut(shortcut, action) {
  trackEvent('keyboard_shortcut', {
    shortcut: shortcut,
    action: action
  });
}

/**
 * Rastreia abertura/fechamento do modal de ajuda
 * @param {string} action - 'open' ou 'close'
 */
export function trackHelpModal(action) {
  trackEvent('help_modal', {
    action: action
  });
}

/**
 * Rastreia clique em contato (email/whatsapp)
 * @param {string} type - 'email' ou 'whatsapp'
 */
export function trackContact(type) {
  trackEvent('contact_click', {
    contact_type: type
  });
}
