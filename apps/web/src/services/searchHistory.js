// Search History Service - Gerenciar histórico de buscas

const STORAGE_KEY = 'nbs-search-history';
const MAX_HISTORY_ITEMS = 10;

/**
 * Obter histórico de buscas
 * @returns {string[]} Array com histórico de buscas
 */
export const getSearchHistory = () => {
  try {
    const history = localStorage.getItem(STORAGE_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    return [];
  }
};

/**
 * Adicionar busca ao histórico
 * @param {string} query - Termo buscado
 */
export const addToHistory = (query) => {
  if (!query || query.trim().length < 2) return;

  try {
    const history = getSearchHistory();
    const cleanQuery = query.trim().toLowerCase();
    
    // Remover duplicatas (case-insensitive)
    const filtered = history.filter(
      item => item.toLowerCase() !== cleanQuery
    );
    
    // Adicionar no início
    const updated = [query.trim(), ...filtered].slice(0, MAX_HISTORY_ITEMS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Erro ao salvar histórico:', error);
    return [];
  }
};

/**
 * Remover item do histórico
 * @param {string} query - Termo a ser removido
 */
export const removeFromHistory = (query) => {
  try {
    const history = getSearchHistory();
    const updated = history.filter(item => item !== query);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (error) {
    console.error('Erro ao remover do histórico:', error);
    return history;
  }
};

/**
 * Limpar todo o histórico
 */
export const clearHistory = () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return [];
  } catch (error) {
    console.error('Erro ao limpar histórico:', error);
    return [];
  }
};

/**
 * Filtrar histórico baseado em query parcial
 * @param {string} query - Termo de busca
 * @returns {string[]} Itens do histórico que correspondem
 */
export const filterHistory = (query) => {
  if (!query || query.trim().length === 0) {
    return getSearchHistory();
  }
  
  const history = getSearchHistory();
  const lowerQuery = query.toLowerCase();
  
  return history.filter(item => 
    item.toLowerCase().includes(lowerQuery)
  );
};
