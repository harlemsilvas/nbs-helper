import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Search, Star, Clock, X, Trash2 } from "lucide-react";
import { getSearchHistory, addToHistory, removeFromHistory, clearHistory, filterHistory } from "../services/searchHistory";
import { trackHistorySuggestion, trackHistoryClear, trackKeyboardShortcut } from "../services/analytics";

const SearchBar = forwardRef(({ onSearch, onShowFavorites }, ref) => {
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Atualizar sugestões quando query muda
    if (query.trim().length > 0) {
      setSuggestions(filterHistory(query));
    } else {
      setSuggestions(getSearchHistory());
    }
    setSelectedIndex(-1); // Reset selection
  }, [query]);

  useEffect(() => {
    // Fechar sugestões ao clicar fora
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      addToHistory(query);
      onSearch(query);
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    addToHistory(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
    trackHistorySuggestion(suggestion);
  };

  const handleRemoveSuggestion = (e, suggestion) => {
    e.stopPropagation();
    removeFromHistory(suggestion);
    setSuggestions(getSearchHistory());
  };

  const handleClearHistory = () => {
    clearHistory();
    setSuggestions([]);
    trackHistoryClear();
  };

  const handleKeyDown = (e) => {
    if (!showSuggestions || suggestions.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        trackKeyboardShortcut('arrow_down', 'navigate_suggestions');
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        trackKeyboardShortcut('arrow_up', 'navigate_suggestions');
        break;
      case 'Enter':
        if (selectedIndex >= 0) {
          e.preventDefault();
          handleSuggestionClick(suggestions[selectedIndex]);
          trackKeyboardShortcut('enter', 'select_suggestion');
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedIndex(-1);
        trackKeyboardShortcut('escape', 'close_suggestions');
        break;
    }
  };

  // Expor função para focar input (será chamada pelo atalho global)
  useImperativeHandle(ref, () => ({
    focus: () => {
      inputRef.current?.focus();
      setShowSuggestions(true);
    }
  }));

  return (
    <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <form onSubmit={handleSubmit} className="flex-1 relative" ref={searchRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                placeholder="Buscar serviço (ex: desenvolvimento de software, consultoria TI...)"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
                autoComplete="off"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    onSearch('');
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-64 overflow-y-auto z-20">
                <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {query ? 'Sugestões' : 'Buscas recentes'}
                  </span>
                  {!query && (
                    <button
                      type="button"
                      onClick={handleClearHistory}
                      className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 flex items-center gap-1"
                      title="Limpar histórico"
                    >
                      <Trash2 className="w-3 h-3" />
                      Limpar
                    </button>
                  )}
                </div>
                <ul>
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>
                      <button
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className={`w-full px-3 py-2 text-left flex items-center justify-between group transition-colors ${
                          selectedIndex === index 
                            ? 'bg-blue-100 dark:bg-blue-900/40' 
                            : 'hover:bg-blue-50 dark:hover:bg-blue-900/20'
                        }`}
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <Clock className="w-4 h-4 text-gray-400 dark:text-gray-500 flex-shrink-0" />
                          <span className="text-sm text-gray-700 dark:text-gray-200 truncate">{suggestion}</span>
                        </div>
                        <button
                          onClick={(e) => handleRemoveSuggestion(e, suggestion)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-opacity"
                          title="Remover"
                        >
                          <X className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        </button>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
          <button
            onClick={onShowFavorites}
            className="flex items-center gap-2 px-4 py-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 rounded-lg hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors border border-yellow-200 dark:border-yellow-800"
          >
            <Star className="w-5 h-5" />
            <span className="hidden sm:inline">Favoritos</span>
          </button>
        </div>
      </div>
    </div>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
