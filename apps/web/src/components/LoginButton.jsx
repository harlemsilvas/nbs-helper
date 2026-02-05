import { useState } from 'react';
import { LogIn, LogOut, User, Loader2 } from 'lucide-react';
import { logout } from '../services/authService';
import AuthModal from './AuthModal';
import ConfirmDialog from './ConfirmDialog';

export default function LoginButton({ user, onLoginSuccess }) {
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogoutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleLogoutConfirm = async () => {
    setShowLogoutConfirm(false);
    setLoading(true);
    try {
      await logout();
    } catch (error) {
      alert('Erro ao fazer logout. Tente novamente.');
    } finally {
      setLoading(false);
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
          onClick={handleLogoutClick}
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
      <button
        onClick={() => setShowAuthModal(true)}
        className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-800 rounded-lg transition-colors text-sm shadow-sm font-medium"
        title="Entrar ou criar conta"
      >
        <LogIn className="w-4 h-4" />
        <span className="hidden sm:inline">Entrar</span>
      </button>

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={onLoginSuccess}
      />

      {/* Logout Confirmation */}
      <ConfirmDialog 
        isOpen={showLogoutConfirm}
        onConfirm={handleLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        title="Confirmar Logout"
        message="Deseja realmente sair? Seus favoritos permanecerão salvos na nuvem."
        confirmText="Sim, sair"
        cancelText="Cancelar"
        type="warning"
      />
    </>
  );
}
