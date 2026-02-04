import ResultItem from "./ResultItem";
import { InFeedAd } from "./AdBanner";
import { ADSENSE_CONFIG } from "../config/adsense";
import { Loader2, SearchX } from "lucide-react";

export default function ResultsList({ results, loading, favorites, onToggleFavorite }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 dark:text-blue-400 animate-spin" />
        <span className="ml-3 text-gray-600 dark:text-gray-300">Buscando...</span>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500 dark:text-gray-400">
        <SearchX className="w-16 h-16 mb-4" />
        <p className="text-lg font-medium">Nenhum resultado encontrado</p>
        <p className="text-sm mt-2">Tente buscar com outros termos</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((item, index) => (
        <div key={item.code}>
          <ResultItem
            item={item}
            isFavorite={favorites.some((f) => f.code === item.code)}
            onToggleFavorite={onToggleFavorite}
          />
          
          {/* Inserir anúncio in-feed a cada N resultados */}
          {ADSENSE_CONFIG.settings.showInFeedAds && 
           (index + 1) % ADSENSE_CONFIG.settings.inFeedFrequency === 0 && 
           index !== results.length - 1 && (
            <InFeedAd className="my-4" />
          )}
        </div>
      ))}
    </div>
  );
}
