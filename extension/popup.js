// Estado global
let dataset = null;
let favorites = [];
let searchTimeout = null;

// Elementos DOM
const searchInput = document.getElementById('searchInput');
const clearSearchBtn = document.getElementById('clearSearch');
const searchResults = document.getElementById('searchResults');
const favoritesList = document.getElementById('favoritesList');
const favCountBadge = document.getElementById('favCount');
const loading = document.getElementById('loading');
const openAppBtn = document.getElementById('openApp');
const tabs = document.querySelectorAll('.tab');
const tabContents = document.querySelectorAll('.tab-content');

// Constantes
const APP_URL = 'https://nbs-helper-web.vercel.app';
const DATA_URL = `${APP_URL}/index.json`;
const FAVORITES_KEY = 'nbs-favorites';

// Inicialização
document.addEventListener('DOMContentLoaded', init);

async function init() {
  loadFavorites();
  await loadDataset();
  setupEventListeners();
  renderFavorites();
}

// Carregar dataset
async function loadDataset() {
  if (dataset) return;

  showLoading(true);
  try {
    const response = await fetch(DATA_URL);
    const data = await response.json();
    dataset = data.items;
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    showError('Erro ao carregar dados. Verifique sua conexão.');
  } finally {
    showLoading(false);
  }
}

// Carregar favoritos do storage
function loadFavorites() {
  chrome.storage.local.get([FAVORITES_KEY], (result) => {
    favorites = result[FAVORITES_KEY] || [];
    updateFavCount();
  });
}

// Salvar favoritos no storage
function saveFavorites() {
  chrome.storage.local.set({ [FAVORITES_KEY]: favorites }, () => {
    updateFavCount();
    renderFavorites();
  });
}

// Atualizar contador de favoritos
function updateFavCount() {
  favCountBadge.textContent = favorites.length;
  if (favorites.length > 0) {
    favCountBadge.style.display = 'inline-block';
  } else {
    favCountBadge.style.display = 'none';
  }
}

// Setup event listeners
function setupEventListeners() {
  // Busca
  searchInput.addEventListener('input', handleSearch);
  clearSearchBtn.addEventListener('click', clearSearch);

  // Abrir app
  openAppBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: APP_URL });
  });

  // Tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const tabName = tab.dataset.tab;
      switchTab(tabName);
    });
  });
}

// Buscar códigos
function handleSearch(e) {
  const query = e.target.value.trim();

  // Mostrar/ocultar botão clear
  clearSearchBtn.style.display = query ? 'block' : 'none';

  // Debounce
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    performSearch(query);
  }, 300);
}

function performSearch(query) {
  if (!dataset) {
    showError('Dados ainda não carregados');
    return;
  }

  if (!query) {
    showEmptySearch();
    return;
  }

  const lowerQuery = query.toLowerCase();
  
  // Busca simples (código ou descrição)
  const results = dataset.filter(item => {
    const code = item.code.toLowerCase();
    const description = item.description.toLowerCase();
    const keywords = item.keywords ? item.keywords.join(' ').toLowerCase() : '';
    
    return code.includes(lowerQuery) || 
           description.includes(lowerQuery) ||
           keywords.includes(lowerQuery);
  }).slice(0, 20); // Limitar a 20 resultados

  renderResults(results);
}

// Renderizar resultados
function renderResults(results) {
  if (results.length === 0) {
    searchResults.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.35-4.35"/>
        </svg>
        <p>Nenhum resultado encontrado</p>
        <small>Tente outro termo de busca</small>
      </div>
    `;
    return;
  }

  searchResults.innerHTML = results.map(item => createResultHTML(item)).join('');

  // Event listeners para favoritos
  document.querySelectorAll('.btn-favorite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const code = btn.dataset.code;
      toggleFavorite(code);
    });
  });
}

// Renderizar favoritos
function renderFavorites() {
  if (favorites.length === 0) {
    favoritesList.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="m12 2-3.09 6.26L2 9.27l5 4.87-1.18 6.88L12 17.77l6.18 3.25-1.18-6.88 5-4.87-6.91-1.01L12 2z"/>
        </svg>
        <p>Nenhum favorito salvo ainda</p>
        <small>Clique na estrela para adicionar</small>
      </div>
    `;
    return;
  }

  favoritesList.innerHTML = favorites.map(item => createResultHTML(item, true)).join('');

  // Event listeners
  document.querySelectorAll('.btn-favorite').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const code = btn.dataset.code;
      toggleFavorite(code);
    });
  });
}

// Criar HTML de resultado
function createResultHTML(item, isFavorite = false) {
  const isInFavorites = isFavorite || favorites.some(fav => fav.code === item.code);

  return `
    <div class="result-item">
      <div class="result-header">
        <span class="result-code">${item.code}</span>
        <button class="btn-favorite ${isInFavorites ? 'active' : ''}" data-code="${item.code}" title="${isInFavorites ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m12 2-3.09 6.26L2 9.27l5 4.87-1.18 6.88L12 17.77l6.18 3.25-1.18-6.88 5-4.87-6.91-1.01L12 2z"/>
          </svg>
        </button>
      </div>
      <div class="result-description">${item.description}</div>
      ${item.level ? `<span class="result-level">${item.level}</span>` : ''}
    </div>
  `;
}

// Toggle favorito
function toggleFavorite(code) {
  const existingIndex = favorites.findIndex(fav => fav.code === code);

  if (existingIndex !== -1) {
    // Remover
    favorites.splice(existingIndex, 1);
  } else {
    // Adicionar
    const item = dataset.find(d => d.code === code);
    if (item) {
      favorites.push(item);
    }
  }

  saveFavorites();

  // Atualizar UI
  if (searchInput.value.trim()) {
    performSearch(searchInput.value.trim());
  }
}

// Limpar busca
function clearSearch() {
  searchInput.value = '';
  clearSearchBtn.style.display = 'none';
  showEmptySearch();
  searchInput.focus();
}

// Mostrar estado vazio de busca
function showEmptySearch() {
  searchResults.innerHTML = `
    <div class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.35-4.35"/>
      </svg>
      <p>Digite para buscar códigos NBS</p>
    </div>
  `;
}

// Mostrar erro
function showError(message) {
  searchResults.innerHTML = `
    <div class="empty-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p>${message}</p>
    </div>
  `;
}

// Trocar aba
function switchTab(tabName) {
  tabs.forEach(tab => {
    if (tab.dataset.tab === tabName) {
      tab.classList.add('active');
    } else {
      tab.classList.remove('active');
    }
  });

  tabContents.forEach(content => {
    if (content.id === `${tabName}Tab`) {
      content.classList.add('active');
    } else {
      content.classList.remove('active');
    }
  });

  // Atualizar conteúdo se necessário
  if (tabName === 'favorites') {
    renderFavorites();
  }
}

// Mostrar/ocultar loading
function showLoading(show) {
  loading.style.display = show ? 'flex' : 'none';
}
