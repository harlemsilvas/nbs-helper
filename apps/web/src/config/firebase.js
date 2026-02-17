import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuração do Firebase (usando variáveis de ambiente)
const firebaseConfig = {
  apiKey:
    import.meta.env.VITE_FIREBASE_API_KEY ||
    "AIzaSyChNdq0R6b8uqAA1sKuS6kj29WC3FYATiw",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "nbs-helper.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "nbs-helper",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "nbs-helper.firebasestorage.app",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "822777010807",
  appId:
    import.meta.env.VITE_FIREBASE_APP_ID ||
    "1:822777010807:web:b762fa0e67680f05de0472",
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Serviços
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

// Configurar provider
googleProvider.setCustomParameters({
  prompt: "select_account",
});
