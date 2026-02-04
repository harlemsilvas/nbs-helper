import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyChNdq0R6b8uqAA1sKuS6kj29WC3FYATiw",
  authDomain: "nbs-helper.firebaseapp.com",
  projectId: "nbs-helper",
  storageBucket: "nbs-helper.firebasestorage.app",
  messagingSenderId: "822777010807",
  appId: "1:822777010807:web:b762fa0e67680f05de0472"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configurar provider
googleProvider.setCustomParameters({
  prompt: 'select_account'
});