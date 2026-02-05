import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../config/firebase';
import { trackEvent } from './analytics';

/**
 * Fazer login com Google
 */
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Verificar se é o primeiro login do usuário
    const userDocRef = doc(db, 'users', user.uid);
    const userDoc = await getDoc(userDocRef);
    
    if (!userDoc.exists()) {
      // Primeiro login - criar documento com dados do Google
      await setDoc(userDocRef, {
        uid: user.uid,
        fullName: user.displayName || '',
        email: user.email,
        photoURL: user.photoURL || '',
        createdAt: new Date().toISOString(),
        provider: 'google.com',
        lastLoginAt: new Date().toISOString(),
      });
      
      trackEvent('user_created', {
        method: 'google',
        user_id: user.uid
      });
    } else {
      // Atualizar último login
      await setDoc(userDocRef, {
        lastLoginAt: new Date().toISOString(),
      }, { merge: true });
    }
    
    trackEvent('login', {
      method: 'google',
      user_id: user.uid
    });
    
    return user;
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
