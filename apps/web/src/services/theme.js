// Theme Service - Gerenciar tema claro/escuro

const STORAGE_KEY = 'nbs-theme';

/**
 * Obter tema atual
 * @returns {string} 'light' ou 'dark'
 */
export const getTheme = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
    
    // Detectar preferência do sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  } catch (error) {
    return 'light';
  }
};

/**
 * Salvar tema
 * @param {string} theme - 'light' ou 'dark'
 */
export const setTheme = (theme) => {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
    applyTheme(theme);
  } catch (error) {
    console.error('Erro ao salvar tema:', error);
  }
};

/**
 * Aplicar tema no HTML
 * @param {string} theme - 'light' ou 'dark'
 */
export const applyTheme = (theme) => {
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

/**
 * Alternar entre light/dark
 * @returns {string} Novo tema
 */
export const toggleTheme = () => {
  const current = getTheme();
  const newTheme = current === 'light' ? 'dark' : 'light';
  setTheme(newTheme);
  return newTheme;
};

/**
 * Inicializar tema na carga da página
 */
export const initTheme = () => {
  const theme = getTheme();
  applyTheme(theme);
  return theme;
};
