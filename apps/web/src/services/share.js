/**
 * Serviço para compartilhamento de favoritos via URL
 */

/**
 * Gera um link de compartilhamento com favoritos codificados
 * @param {Array} favorites - Array de favoritos a compartilhar
 * @returns {string} URL completa com favoritos codificados
 */
export function generateShareLink(favorites) {
  if (!favorites || favorites.length === 0) {
    throw new Error('Nenhum favorito para compartilhar');
  }

  // Extrair apenas os dados essenciais (code, description)
  const simplifiedFavorites = favorites.map(fav => ({
    code: fav.code,
    description: fav.description,
    level: fav.level,
    keywords: fav.keywords
  }));

  // Criar objeto com metadados
  const shareData = {
    version: '1.0',
    count: favorites.length,
    favorites: simplifiedFavorites,
    sharedAt: new Date().toISOString()
  };

  // Encodar em base64
  const jsonString = JSON.stringify(shareData);
  const base64 = btoa(encodeURIComponent(jsonString));

  // Gerar URL
  const baseUrl = window.location.origin;
  const shareUrl = `${baseUrl}/?share=${base64}`;

  return shareUrl;
}

/**
 * Decodifica favoritos de um link compartilhado
 * @param {string} shareCode - Código base64 do query param
 * @returns {Object} Objeto com metadados e favoritos
 */
export function decodeShareLink(shareCode) {
  try {
    // Decodificar base64
    const jsonString = decodeURIComponent(atob(shareCode));
    const shareData = JSON.parse(jsonString);

    // Validar estrutura
    if (!shareData.version || !shareData.favorites || !Array.isArray(shareData.favorites)) {
      throw new Error('Formato de compartilhamento inválido');
    }

    // Validar favoritos
    const validFavorites = shareData.favorites.filter(fav => 
      fav.code && fav.description
    );

    if (validFavorites.length === 0) {
      throw new Error('Nenhum favorito válido encontrado');
    }

    return {
      version: shareData.version,
      count: validFavorites.length,
      favorites: validFavorites,
      sharedAt: shareData.sharedAt
    };
  } catch (error) {
    console.error('Erro ao decodificar link:', error);
    throw new Error('Link de compartilhamento inválido ou corrompido');
  }
}

/**
 * Copia texto para área de transferência
 * @param {string} text - Texto a copiar
 * @returns {Promise<boolean>} Sucesso da operação
 */
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // Método moderno
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback para navegadores antigos
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      const successful = document.execCommand('copy');
      textArea.remove();
      
      return successful;
    }
  } catch (error) {
    console.error('Erro ao copiar:', error);
    return false;
  }
}

/**
 * Verifica se há favoritos compartilhados na URL atual
 * @returns {string|null} Código de compartilhamento ou null
 */
export function getSharedCodeFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('share');
}

/**
 * Remove o parâmetro de compartilhamento da URL
 */
export function clearShareFromURL() {
  const url = new URL(window.location.href);
  url.searchParams.delete('share');
  window.history.replaceState({}, '', url.pathname + url.search);
}
