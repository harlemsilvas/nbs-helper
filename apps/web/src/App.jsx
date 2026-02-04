import { useState, useEffect, useRef } from "react";
import SearchBar from "./components/SearchBar";
import ResultsList from "./components/ResultsList";
import CookieConsent from "./components/CookieConsent";
import ThemeToggle from "./components/ThemeToggle";
import KeyboardShortcutsHelp from "./components/KeyboardShortcutsHelp";
import { HorizontalAdBanner } from "./components/AdBanner";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { searchNBS, loadIndex, getDatasetInfo } from "./services/searchLocal";
import { getFavorites, addFavorite, removeFavorite } from "./services/favorites";
import { trackSearch, trackFavorite, trackViewFavorites, trackPageChange, trackKeyboardShortcut, trackHelpModal } from "./services/analytics";
import { ADSENSE_CONFIG } from "./config/adsense";
import { BookOpen, X, ChevronLeft, ChevronRight } from "lucide-react";

function App() {
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [dataInfo, setDataInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [showHelp, setShowHelp] = useState(false);
  const searchInputRef = useRef(null);

  useEffect(() => {
    // Carregar índice e favoritos na inicialização
    const init = async () => {
      setLoading(true);
      try {
        await loadIndex();
        const info = getDatasetInfo();
        setDataInfo(info);
        setFavorites(getFavorites());
        
        // Mostrar resultados iniciais
        const initial = await searchNBS("");
        setResults(initial);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSearch = async (query) => {
    setLoading(true);
    setShowFavorites(false);
    setCurrentPage(1);
    try {
      const searchResults = await searchNBS(query);
      setResults(searchResults);
      trackSearch(query, searchResults.length);
    } catch (error) {
      console.error("Erro na busca:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleFavorite = (item) => {
    const isFav = favorites.some((f) => f.code === item.code);
    if (isFav) {
      const updated = removeFavorite(item.code);
      setFavorites(updated);
      trackFavorite(item.code, false);
    } else {
      const updated = addFavorite(item);
      setFavorites(updated);
      trackFavorite(item.code, true);
    }
  };

  const handleShowFavorites = () => {
    setShowFavorites(!showFavorites);
    setCurrentPage(1);
    if (!showFavorites) {
      setResults(favorites);
      trackViewFavorites();
    } else {
      handleSearch("");
    }
  };

  // Cálculos de paginação
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentResults = results.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(results.length / itemsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      trackPageChange(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      trackPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Configurar atalhos de teclado
  useKeyboardShortcuts({
    ctrlK: () => {
      searchInputRef.current?.focus();
      trackKeyboardShortcut('ctrl_k', 'focus_search');
    },
    ctrlB: () => {
      handleShowFavorites();
      trackKeyboardShortcut('ctrl_b', 'toggle_favorites');
    },
    escape: () => {
      // ESC é tratado dentro do SearchBar
      if (showHelp) {
        setShowHelp(false);
        trackHelpModal('close');
      }
    },
    help: () => {
      setShowHelp(true);
      trackHelpModal('open');
    }
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 dark:from-blue-800 dark:to-blue-900">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <BookOpen className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-white">NBS Helper</h1>
                <p className="text-blue-100 text-xs sm:text-sm hidden xs:block">
                  Busca rápida de códigos NBS 2.0 para NFS-e
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-3">
              <button
                onClick={() => setShowHelp(true)}
                className="text-blue-100 hover:text-white transition-colors text-xs sm:text-sm px-2 sm:px-3 py-1 border border-blue-400 rounded-lg hover:bg-blue-700/50"
                title="Atalhos de teclado (?)"
              >
                <span className="hidden sm:inline">Atalhos</span>
                <span className="sm:hidden">?</span>
              </button>
              <ThemeToggle />
            </div>
          </div>
          {dataInfo && (
            <div className="mt-2 sm:mt-3 text-xs text-blue-100">
              <span className="bg-blue-800/30 px-2 py-1 rounded">
                <span className="hidden xs:inline">{dataInfo.totalItems} códigos • </span>
                <span className="xs:hidden">{dataInfo.totalItems} • </span>
                v{dataInfo.version}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Search Bar */}
      <SearchBar 
        ref={searchInputRef}
        onSearch={handleSearch} 
        onShowFavorites={handleShowFavorites} 
      />

      {/* Header Ad Banner */}
      {ADSENSE_CONFIG.settings.showHeaderBanner && (
        <HorizontalAdBanner className="bg-white dark:bg-gray-800 border-b dark:border-gray-700" />
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {showFavorites && (
          <div className="mb-4 flex items-center justify-between bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <span className="font-medium">Exibindo favoritos</span>
              <span className="text-sm">({favorites.length} itens)</span>
            </div>
            <button
              onClick={handleShowFavorites}
              className="text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        <ResultsList
          results={currentResults}
          loading={loading}
          favorites={favorites}
          onToggleFavorite={handleToggleFavorite}
        />

        {!loading && results.length > 0 && (
          <div className="mt-6 space-y-3 sm:space-y-4">
            <div className="text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, results.length)} de {results.length} resultado{results.length !== 1 ? "s" : ""}
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span className="hidden xs:inline">Anterior</span>
                  <span className="xs:hidden">Ant</span>
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">
                    <span className="hidden xs:inline">Página </span>{currentPage} / {totalPages}
                  </span>
                </div>
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 text-sm sm:text-base bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-700 dark:text-gray-200"
                >
                  <span className="hidden xs:inline">Próxima</span>
                  <span className="xs:hidden">Prox</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Ad Banner */}
      {ADSENSE_CONFIG.settings.showFooterBanner && (
        <HorizontalAdBanner className="bg-white dark:bg-gray-800 border-t dark:border-gray-700" />
      )}

      {/* Footer */}
      <footer className="mt-12 py-6 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600 dark:text-gray-300">
          <p>
            ⚠️ <strong>Ferramenta de apoio.</strong> Confirme com seu contador e a
            legislação do seu município.
          </p>
          <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
            Dados oficiais da NBS 2.0 (Nomenclatura Brasileira de Serviços) • gov.br
          </p>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
            <a 
              href="/politica-privacidade.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              Política de Privacidade
            </a>
            {/* <span>•</span>
            <a 
              href="https://github.com/harlemsilvas/nbs-helper" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              GitHub
            </a> */}
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieConsent />

      {/* Keyboard Shortcuts Help */}
      {showHelp && <KeyboardShortcutsHelp onClose={() => setShowHelp(false)} />}
    </div>
  );
}

export default App;
