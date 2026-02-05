import { useState } from 'react';
import { LogIn, LogOut, User, Loader2, Mail, ChevronDown } from 'lucide-react';
import { loginWithGoogle, logout } from '../services/authService';
import AuthModal from './AuthModal';

export default function LoginButton({ user, onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      if (onLoginSuccess) onLoginSuccess();
    } catch (error) {
      alert('Erro ao fazer login. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (confirm('Deseja realmente sair? Seus favoritos permanecerão salvos na nuvem.')) {
      setLoading(true);
      try {
        await logout();
      } catch (error) {
        alert('Erro ao fazer logout. Tente novamente.');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <button 
        disabled
        className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-400 rounded-lg cursor-not-allowed"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="hidden sm:inline text-sm">Aguarde...</span>
      </button>
    );
  }

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {/* User Avatar */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 rounded-lg">
          {user.photoURL ? (
            <img 
              src={user.photoURL} 
              alt={user.displayName} 
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          )}
          <span className="text-xs text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
            {user.displayName || user.email}
          </span>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors text-sm"
          title="Sair"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden xs:inline">Sair</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 rounded-lg transition-colors text-sm shadow-sm"
          title="Opções de login"
        >
          <LogIn className="w-4 h-4" />
          <span className="hidden sm:inline">Entrar</span>
          <ChevronDown className={`w-4 h-4 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
        </button>

        {/* Dropdown Menu */}
        {showDropdown && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-10" 
              onClick={() => setShowDropdown(false)}
            />
            
            {/* Menu */}
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 overflow-hidden">
              {/* Google Login */}
              <button
                onClick={() => {
                  setShowDropdown(false);
                  handleLogin();
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    Entrar com Google
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Rápido e seguro
                  </div>
                </div>
              </button>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-gray-700" />

              {/* Email/Password Login */}
              <button
                onClick={() => {
                  setShowDropdown(false);
                  setShowAuthModal(true);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
              >
                <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                  <Mail className="w-3 h-3 text-white" />
                </div>
                <div>
                  <div className="font-medium text-gray-900 dark:text-gray-100">
                    Entrar com Email
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    Login ou cadastro
                  </div>
                </div>
              </button>
            </div>
          </>
        )}
      </div>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={onLoginSuccess}
      />
    </>
  );
}
