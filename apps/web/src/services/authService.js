import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider } from '../config/firebase';
import { trackEvent } from './analytics';

/**
 * Fazer login com Google
 */
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    trackEvent('login', {
      method: 'google',
      user_id: result.user.uid
    });
    return result.user;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    trackEvent('login_error', {
      error_code: error.code,
      error_message: error.message
    });
    throw error;
  }
}

/**
 * Fazer logout
 */
export async function logout() {
  try {
    await signOut(auth);
    trackEvent('logout');
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    throw error;
  }
}

/**
 * Observar mudanças de autenticação
 * @param {Function} callback - Função chamada quando o estado muda
 */
export function onAuthChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Obter usuário atual
 */
export function getCurrentUser() {
  return auth.currentUser;
}
