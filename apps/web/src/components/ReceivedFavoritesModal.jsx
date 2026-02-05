import { useState } from 'react';
import { Download, X, CheckCircle2, Calendar, Hash, AlertCircle, LogIn } from 'lucide-react';
import { trackEvent } from '../services/analytics';

export default function ReceivedFavoritesModal({ sharedData, onImport, onClose, user, onLoginClick }) {
  const [importing, setImporting] = useState(false);
  const [imported, setImported] = useState(false);

  const handleImport = async () => {
    setImporting(true);

    try {
      await onImport(sharedData.favorites);
      
      // Analytics
      trackEvent('import_shared_favorites', {
        count: sharedData.count,
        success: true
      });

      // Feedback visual
      setImported(true);
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Erro ao importar:', error);
      trackEvent('import_shared_favorites', {
        count: sharedData.count,
        success: false,
        error: error.message
      });
      alert('Erro ao importar favoritos. Tente novamente.');
    } finally {
      setImporting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Data desconhecida';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Download className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Favoritos Compartilhados</h2>
                <p className="text-purple-100 text-sm mt-1">
                  Alguém compartilhou {sharedData.count} {sharedData.count === 1 ? 'código' : 'códigos'} com você
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1"
              disabled={importing}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Metadados */}
          <div className="mb-6 flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Hash className="w-4 h-4" />
              <span>{sharedData.count} {sharedData.count === 1 ? 'código' : 'códigos'}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Compartilhado em {formatDate(sharedData.sharedAt)}</span>
            </div>
          </div>

          {/* Preview dos códigos */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Códigos que você receberá:
            </h3>
            <div className="max-h-80 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
              <div className="space-y-3">
                {sharedData.favorites.map((fav, index) => (
                  <div
                    key={`${fav.code}-${index}`}
                    className="p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg"
                  >
                    <div className="flex items-start gap-3">
                      <code className="font-mono font-semibold text-blue-600 dark:text-blue-400 text-sm whitespace-nowrap">
                        {fav.code}
                      </code>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 dark:text-gray-100">
                          {fav.description}
                        </p>
                        {fav.level && (
                          <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded">
                            {fav.level}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Info Box */}
          <div className="mb-6">
            {!user ? (
              /* Não logado - Aviso para fazer login */
              <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium mb-2">
                      ⚠️ Você não está logado
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-3">
                      Os favoritos serão salvos apenas neste navegador. Para sincronizar na nuvem e acessar de qualquer dispositivo, faça login antes de importar.
                    </p>
                    <button
                      onClick={() => {
                        onClose();
                        onLoginClick?.();
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg text-sm font-medium transition-colors"
                    >
                      <LogIn className="w-4 h-4" />
                      Fazer Login Agora
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* Logado - Info normal */
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg mb-4">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✅ <strong>Você está logado!</strong> Os favoritos serão salvos na nuvem e sincronizados em todos os seus dispositivos.
                </p>
              </div>
            )}
            
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
              <p className="text-sm text-purple-800 dark:text-purple-200">
                💡 <strong>O que acontecerá:</strong> Estes códigos serão{' '}
                <strong>adicionados</strong> aos seus favoritos existentes. Códigos
                duplicados serão ignorados automaticamente.
              </p>
            </div>
          </div>

          {/* Import Button */}
          <button
            onClick={handleImport}
            disabled={importing || imported}
            className={`w-full py-4 rounded-lg font-semibold text-lg transition-all ${
              imported
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:opacity-50'
            }`}
          >
            {imported ? (
              <span className="flex items-center justify-center gap-2">
                <CheckCircle2 className="w-6 h-6" />
                Importado com Sucesso!
              </span>
            ) : importing ? (
              'Importando...'
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Download className="w-6 h-6" />
                Importar Todos os Códigos
              </span>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={onClose}
            disabled={importing}
            className="w-full sm:w-auto px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            {imported ? 'Fechar' : 'Cancelar'}
          </button>
        </div>
      </div>
    </div>
  );
}
