/**
 * Exportar favoritos para CSV
 */
export function exportToCSV(favorites) {
  if (!favorites || favorites.length === 0) {
    alert('Nenhum favorito para exportar');
    return;
  }

  // Cabeçalho CSV
  const header = 'Código,Descrição,Nível,Palavras-chave\n';
  
  // Linhas de dados
  const rows = favorites.map(fav => {
    const keywords = (fav.keywords || []).join('; ');
    // Escapar aspas duplas e envolver campos com vírgula em aspas
    const description = `"${fav.description.replace(/"/g, '""')}"`;
    return `${fav.code},${description},${fav.level},"${keywords}"`;
  }).join('\n');

  const csv = header + rows;
  
  // Criar blob e download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `nbs-favoritos-${timestamp}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Exportar favoritos para JSON
 */
export function exportToJSON(favorites) {
  if (!favorites || favorites.length === 0) {
    alert('Nenhum favorito para exportar');
    return;
  }

  const data = {
    exportedAt: new Date().toISOString(),
    version: '1.0',
    count: favorites.length,
    favorites: favorites
  };

  const json = JSON.stringify(data, null, 2);
  
  // Criar blob e download
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  const timestamp = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `nbs-favoritos-${timestamp}.json`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Importar favoritos de arquivo JSON
 */
export async function importFromJSON(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // Validar estrutura
        if (!data.favorites || !Array.isArray(data.favorites)) {
          reject(new Error('Arquivo JSON inválido'));
          return;
        }
        
        // Validar cada favorito
        const validFavorites = data.favorites.filter(fav => 
          fav.code && fav.description && fav.level
        );
        
        if (validFavorites.length === 0) {
          reject(new Error('Nenhum favorito válido encontrado'));
          return;
        }
        
        resolve(validFavorites);
      } catch (error) {
        reject(new Error('Erro ao processar arquivo JSON'));
      }
    };
    
    reader.onerror = () => reject(new Error('Erro ao ler arquivo'));
    reader.readAsText(file);
  });
}
