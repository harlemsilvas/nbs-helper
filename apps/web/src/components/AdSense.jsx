import { useEffect } from 'react';

/**
 * Componente para exibir anúncios do Google AdSense
 * @param {string} slot - ID do slot do anúncio
 * @param {string} format - Formato do anúncio (auto, rectangle, vertical, horizontal)
 * @param {boolean} responsive - Se o anúncio é responsivo
 * @param {string} className - Classes CSS adicionais
 */
export default function AdSense({ 
  slot, 
  format = 'auto', 
  responsive = true,
  className = ''
}) {
  useEffect(() => {
    try {
      // Carregar anúncio quando o componente montar
      if (window.adsbygoogle && process.env.NODE_ENV !== 'development') {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      }
    } catch (error) {
      console.error('Erro ao carregar AdSense:', error);
    }
  }, []);

  // Não exibir anúncios em desenvolvimento
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center ${className}`}>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          [Anúncio AdSense - Slot: {slot}]
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Visível apenas em produção
        </p>
      </div>
    );
  }

  return (
    <div className={className}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Substituir pelo seu ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
}
