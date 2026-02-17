const STORAGE_KEY = "nbs_favorites";

export function getFavorites() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Erro ao carregar favoritos:", e);
    return [];
  }
}

export function saveFavorites(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error("Erro ao salvar favoritos:", e);
  }
}

export function addFavorite(item) {
  const favorites = getFavorites();
  if (!favorites.find((f) => f.code === item.code)) {
    favorites.push(item);
    saveFavorites(favorites);
  }
  return favorites;
}

export function removeFavorite(code) {
  const favorites = getFavorites().filter((f) => f.code !== code);
  saveFavorites(favorites);
  return favorites;
}

export function isFavorite(code) {
  return getFavorites().some((f) => f.code === code);
}

export function clearAllFavorites() {
  saveFavorites([]);
  return [];
}
