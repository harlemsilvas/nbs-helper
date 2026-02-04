import { useState, useEffect } from 'react';
import { X, Cookie } from 'lucide-react';

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      // Delay de 1 segundo para não aparecer imediatamente
      setTimeout(() => setShowBanner(true), 1000);
    } else if (consent === 'accepted') {
      // Habilitar Google Analytics
      enableAnalytics();
    }
  }, []);

  const enableAnalytics = () => {
    if (window.gtag) {
      window.gtag('consent', 'update', {
        analytics_storage: 'granted'
      });
    }
  };

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    enableAnalytics();
    setShowBanner(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie-consent', 'rejected');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white dark:bg-gray-800 border-t-2 border-gray-200 dark:border-gray-700 shadow-lg animate-slide-up">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Cookie className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              🍪 Aviso de Cookies e Privacidade
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              Usamos cookies para melhorar sua experiência e entender como você usa o NBS Helper. 
              Coletamos dados anônimos de navegação através do Google Analytics para aprimorar nosso serviço.
            </p>

            {showDetails && (
              <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg text-sm text-gray-700 dark:text-gray-200 space-y-2">
                <p className="font-medium">Cookies utilizados:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li><strong>Essenciais:</strong> Favoritos locais (LocalStorage)</li>
                  <li><strong>Analytics:</strong> Google Analytics (GA4) - dados anônimos de uso</li>
                </ul>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  ℹ️ Não coletamos dados pessoais identificáveis. Você pode revogar seu consentimento a qualquer momento limpando os dados do navegador.
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-3 items-center">
              <button
                onClick={handleAccept}
                className="px-4 py-2 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium text-sm"
              >
                Aceitar Cookies
              </button>
              
              <button
                onClick={handleReject}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors font-medium text-sm"
              >
                Recusar
              </button>

              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                {showDetails ? 'Ocultar detalhes' : 'Ver detalhes'}
              </button>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400 mt-3">
              De acordo com a LGPD (Lei Geral de Proteção de Dados) e GDPR.
            </p>
          </div>

          <button
            onClick={handleReject}
            className="flex-shrink-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
