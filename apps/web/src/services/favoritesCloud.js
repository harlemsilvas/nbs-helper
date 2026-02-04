import { 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  getDocs, 
  query,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { getFavorites as getLocalFavorites } from './favorites';

/**
 * Obter referência da coleção de favoritos do usuário
 */
function getFavoritesRef(userId) {
  return collection(db, 'users', userId, 'favorites');
}

/**
 * Sincronizar favoritos locais para a nuvem
 * @param {string} userId - ID do usuário
 */
export async function syncLocalToCloud(userId) {
  const localFavorites = getLocalFavorites();
  
  if (localFavorites.length === 0) return;
  
  console.log(`Sincronizando ${localFavorites.length} favoritos locais para a nuvem...`);
  
  for (const favorite of localFavorites) {
    try {
      await addFavoriteToCloud(userId, favorite);
    } catch (error) {
      console.error('Erro ao sincronizar favorito:', favorite.code, error);
    }
  }
  
  console.log('Sincronização concluída!');
}

/**
 * Adicionar favorito na nuvem
 * @param {string} userId - ID do usuário
 * @param {Object} item - Item NBS
 */
export async function addFavoriteToCloud(userId, item) {
  const favRef = doc(getFavoritesRef(userId), item.code);
  await setDoc(favRef, {
    code: item.code,
    description: item.description,
    level: item.level,
    keywords: item.keywords || [],
    createdAt: new Date().toISOString()
  });
}

/**
 * Remover favorito da nuvem
 * @param {string} userId - ID do usuário
 * @param {string} code - Código NBS
 */
export async function removeFavoriteFromCloud(userId, code) {
  const favRef = doc(getFavoritesRef(userId), code);
  await deleteDoc(favRef);
}

/**
 * Obter todos os favoritos da nuvem
 * @param {string} userId - ID do usuário
 */
export async function getFavoritesFromCloud(userId) {
  const favoritesRef = getFavoritesRef(userId);
  const q = query(favoritesRef);
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => ({
    code: doc.data().code,
    description: doc.data().description,
    level: doc.data().level,
    keywords: doc.data().keywords || []
  }));
}

/**
 * Observar mudanças em tempo real nos favoritos
 * @param {string} userId - ID do usuário
 * @param {Function} callback - Função chamada quando favoritos mudam
 */
export function watchFavorites(userId, callback) {
  const favoritesRef = getFavoritesRef(userId);
  
  return onSnapshot(favoritesRef, (snapshot) => {
    const favorites = snapshot.docs.map(doc => ({
      code: doc.data().code,
      description: doc.data().description,
      level: doc.data().level,
      keywords: doc.data().keywords || []
    }));
    callback(favorites);
  });
}

/**
 * Limpar todos os favoritos da nuvem
 * @param {string} userId - ID do usuário
 */
export async function clearCloudFavorites(userId) {
  const favoritesRef = getFavoritesRef(userId);
  const snapshot = await getDocs(favoritesRef);
  
  const deletePromises = snapshot.docs.map(doc => deleteDoc(doc.ref));
  await Promise.all(deletePromises);
}
