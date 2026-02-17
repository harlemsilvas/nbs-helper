import AdSense from './AdSense';

/**
 * Banner de anúncio horizontal responsivo
 * Ideal para topo ou rodapé da página
 */
export function HorizontalAdBanner({ className = '' }) {
  return (
    <div className={`w-full max-w-7xl mx-auto px-4 py-4 ${className}`}>
      <AdSense 
        slot="1234567890" // Substituir pelo slot do banner horizontal
        format="horizontal"
        responsive={true}
      />
    </div>
  );
}

/**
 * Banner de anúncio vertical
 * Ideal para sidebar
 */
export function VerticalAdBanner({ className = '' }) {
  return (
    <div className={`${className}`}>
      <AdSense 
        slot="0987654321" // Substituir pelo slot do banner vertical
        format="vertical"
        responsive={true}
      />
    </div>
  );
}

/**
 * Anúncio quadrado/retangular
 * Ideal para entre conteúdos
 */
export function SquareAdBanner({ className = '' }) {
  return (
    <div className={`${className}`}>
      <AdSense 
        slot="1122334455" // Substituir pelo slot do banner quadrado
        format="rectangle"
        responsive={true}
      />
    </div>
  );
}

/**
 * Anúncio in-feed (entre resultados)
 * Se integra naturalmente ao conteúdo
 */
export function InFeedAd({ className = '' }) {
  return (
    <div className={`${className}`}>
      <AdSense 
        slot="5544332211" // Substituir pelo slot do in-feed
        format="fluid"
        responsive={true}
      />
    </div>
  );
}
