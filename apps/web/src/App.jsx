import { useState, useEffect } from "react";
import SearchBar from "./components/SearchBar";
import ResultsList from "./components/ResultsList";
import CookieConsent from "./components/CookieConsent";
import { searchNBS, loadIndex, getDatasetInfo } from "./services/searchLocal";
import { getFavorites, addFavorite, removeFavorite } from "./services/favorites";
import { trackSearch, trackFavorite, trackViewFavorites, trackPageChange } from "./services/analytics";
import { BookOpen, X, ChevronLeft, ChevronRight } from "lucide-react";

function App() {
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [dataInfo, setDataInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <BookOpen className="w-8 h-8" />
            <div>
              <h1 className="text-2xl font-bold">NBS Helper</h1>
              <p className="text-blue-100 text-sm">
                Busca rápida de códigos NBS 2.0 para NFS-e
              </p>
            </div>
          </div>
          {dataInfo && (
            <div className="mt-3 text-xs text-blue-100">
              <span className="bg-blue-800/30 px-2 py-1 rounded">
                {dataInfo.totalItems} códigos disponíveis • Versão {dataInfo.version}
              </span>
            </div>
          )}
        </div>
      </header>

      {/* Search Bar */}
      <SearchBar onSearch={handleSearch} onShowFavorites={handleShowFavorites} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {showFavorites && (
          <div className="mb-4 flex items-center justify-between bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <span className="font-medium">Exibindo favoritos</span>
              <span className="text-sm">({favorites.length} itens)</span>
            </div>
            <button
              onClick={handleShowFavorites}
              className="text-yellow-700 hover:text-yellow-900"
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
          <div className="mt-6 space-y-4">
            <div className="text-center text-sm text-gray-500">
              Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, results.length)} de {results.length} resultado{results.length !== 1 ? "s" : ""}
            </div>
            
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Anterior
                </button>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                  </span>
                </div>
                
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Próxima
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-6 bg-white border-t">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-gray-600">
          <p>
            ⚠️ <strong>Ferramenta de apoio.</strong> Confirme com seu contador e a
            legislação do seu município.
          </p>
          <p className="mt-2 text-xs text-gray-500">
            Dados oficiais da NBS 2.0 (Nomenclatura Brasileira de Serviços) • gov.br
          </p>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
            <a 
              href="https://github.com/harlemsilvas/nbs-helper/blob/main/docs/POLITICA_PRIVACIDADE.md" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              Política de Privacidade
            </a>
            <span>•</span>
            <a 
              href="https://github.com/harlemsilvas/nbs-helper" 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:text-blue-600 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieConsent />
    </div>
  );
}

export default App;
