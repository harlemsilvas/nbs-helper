import { useState, useEffect } from 'react';
import { Share2, X, Copy, CheckCircle2, Link as LinkIcon } from 'lucide-react';
import { generateShareLink, copyToClipboard } from '../services/share';
import { trackEvent } from '../services/analytics';

export default function ShareModal({ favorites, onClose }) {
  const [shareLink, setShareLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  // Gerar link ao montar o componente
  useEffect(() => {
    generateLink();
  }, []);

  const generateLink = async () => {
    setGenerating(true);
    setError(null);

    try {
      const link = generateShareLink(favorites);
      setShareLink(link);

      // Analytics
      trackEvent('share_favorites', {
        count: favorites.length,
        method: 'link'
      });
    } catch (err) {
      console.error('Erro ao gerar link:', err);
      setError(err.message || 'Erro ao gerar link de compartilhamento');
      trackEvent('share_error', {
        error: err.message
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    const success = await copyToClipboard(shareLink);
    
    if (success) {
      setCopied(true);
      trackEvent('share_copy', {
        count: favorites.length
      });

      // Reset após 2 segundos
      setTimeout(() => setCopied(false), 2000);
    } else {
      alert('Erro ao copiar link. Tente selecionar e copiar manualmente.');
    }
  };

  const handleShare = async () => {
    // Web Share API (se disponível)
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'NBS Helper - Favoritos Compartilhados',
          text: `Confira ${favorites.length} códigos NBS que compartilhei com você!`,
          url: shareLink
        });

        trackEvent('share_native', {
          count: favorites.length
        });
      } catch (err) {
        // Usuário cancelou ou erro
        console.log('Share cancelado:', err);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Share2 className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Compartilhar Favoritos</h2>
                <p className="text-green-100 text-sm mt-1">
                  Compartilhe {favorites.length} {favorites.length === 1 ? 'código' : 'códigos'} com outras pessoas
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Error */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-sm text-red-800 dark:text-red-200">
                ⚠️ {error}
              </p>
            </div>
          )}

          {/* Link de Compartilhamento */}
          {!error && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Link de Compartilhamento
                </label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={shareLink}
                      readOnly
                      className="w-full px-4 py-3 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      onClick={(e) => e.target.select()}
                    />
                    <LinkIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                  <button
                    onClick={handleCopy}
                    disabled={generating || !shareLink}
                    className={`px-6 py-3 rounded-lg font-medium transition-all ${
                      copied
                        ? 'bg-green-500 text-white'
                        : 'bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50'
                    }`}
                  >
                    {copied ? (
                      <span className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5" />
                        Copiado!
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <Copy className="w-5 h-5" />
                        <span className="hidden sm:inline">Copiar</span>
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Native Share Button */}
              {navigator.share && (
                <button
                  onClick={handleShare}
                  className="w-full mb-4 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Share2 className="w-5 h-5" />
                    Compartilhar via...
                  </span>
                </button>
              )}

              {/* Preview dos códigos */}
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Códigos que serão compartilhados:
                </h3>
                <div className="max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-900/50">
                  <div className="space-y-2">
                    {favorites.map((fav) => (
                      <div
                        key={fav.code}
                        className="flex items-start gap-3 text-sm"
                      >
                        <code className="font-mono font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                          {fav.code}
                        </code>
                        <span className="text-gray-700 dark:text-gray-300 line-clamp-1">
                          {fav.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  💡 <strong>Como funciona:</strong> Qualquer pessoa com este link poderá
                  visualizar e importar estes códigos para seus próprios favoritos.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
