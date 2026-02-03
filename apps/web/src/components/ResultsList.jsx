import ResultItem from "./ResultItem";
import { Loader2, SearchX } from "lucide-react";

export default function ResultsList({ results, loading, favorites, onToggleFavorite }) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        <span className="ml-3 text-gray-600">Buscando...</span>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-500">
        <SearchX className="w-16 h-16 mb-4" />
        <p className="text-lg font-medium">Nenhum resultado encontrado</p>
        <p className="text-sm mt-2">Tente buscar com outros termos</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {results.map((item) => (
        <ResultItem
          key={item.code}
          item={item}
          isFavorite={favorites.some((f) => f.code === item.code)}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
}
