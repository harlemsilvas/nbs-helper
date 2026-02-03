import { useState } from "react";
import { Search, Star, Copy, Check } from "lucide-react";

export default function SearchBar({ onSearch, onShowFavorites }) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="bg-white shadow-sm border-b sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <form onSubmit={handleSubmit} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  onSearch(e.target.value);
                }}
                placeholder="Buscar serviço (ex: desenvolvimento de software, consultoria TI...)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>
          <button
            onClick={onShowFavorites}
            className="flex items-center gap-2 px-4 py-3 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors border border-yellow-200"
          >
            <Star className="w-5 h-5" />
            <span className="hidden sm:inline">Favoritos</span>
          </button>
        </div>
      </div>
    </div>
  );
}
