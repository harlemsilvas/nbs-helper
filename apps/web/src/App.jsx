import { useState, useEffect, useRef } from "react";
import SearchBar from "./components/SearchBar";
import ResultsList from "./components/ResultsList";
import CookieConsent from "./components/CookieConsent";
import ThemeToggle from "./components/ThemeToggle";
import KeyboardShortcutsHelp from "./components/KeyboardShortcutsHelp";
import LoginButton from "./components/LoginButton";
import SyncModal from "./components/SyncModal";
import InstallPWA from "./components/InstallPWA";
import ExportModal from "./components/ExportModal";
import TemplatesModal from "./components/TemplatesModal";
import ShareModal from "./components/ShareModal";
import ReceivedFavoritesModal from "./components/ReceivedFavoritesModal";
import ContactModal from "./components/ContactModal";
import HelpInfoModal from "./components/HelpInfoModal";
import AuthModal from "./components/AuthModal";
import CookiePreferencesModal from "./components/CookiePreferencesModal";
import NBSImportanceModal from "./components/NBSImportanceModal";
import { HorizontalAdBanner } from "./components/AdBanner";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { searchNBS, loadIndex, getDatasetInfo } from "./services/searchLocal";
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from "./services/favorites";
import { onAuthChange } from "./services/authService";
import {
  syncLocalToCloud,
  getFavoritesFromCloud,
  addFavoriteToCloud,
  removeFavoriteFromCloud,
  watchFavorites,
} from "./services/favoritesCloud";
import {
  getSharedCodeFromURL,
  decodeShareLink,
  clearShareFromURL,
} from "./services/share";
import {
  trackSearch,
  trackFavorite,
  trackViewFavorites,
  trackPageChange,
  trackKeyboardShortcut,
  trackHelpModal,
  trackContact,
} from "./services/analytics";
import { ADSENSE_CONFIG } from "./config/adsense";
import {
  BookOpen,
  X,
  ChevronLeft,
  ChevronRight,
  Mail,
  MessageCircle,
  Info,
} from "lucide-react";

function App() {
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFavorites, setShowFavorites] = useState(false);
  const [dataInfo, setDataInfo] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [showHelp, setShowHelp] = useState(false);
  const [user, setUser] = useState(null);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showReceivedModal, setShowReceivedModal] = useState(false);
  const [receivedData, setReceivedData] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showHelpInfo, setShowHelpInfo] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [showCookiePrefs, setShowCookiePrefs] = useState(false);
  const [showNBSImportance, setShowNBSImportance] = useState(false);
  const searchInputRef = useRef(null);

  // Observar mudanças de autenticação
  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Usuário logou
        console.log(
          "Usuário logado:",
          currentUser.displayName || currentUser.email,
        );

        // Buscar favoritos da nuvem
        try {
          const cloudFavorites = await getFavoritesFromCloud(currentUser.uid);

          // Se há favoritos locais mas nenhum na nuvem, mostrar modal de sync
          const localFavorites = getFavorites();
          if (localFavorites.length > 0 && cloudFavorites.length === 0) {
            setShowSyncModal(true);
          } else {
            // Usar favoritos da nuvem
            setFavorites(cloudFavorites);
          }

          // Observar mudanças em tempo real
          const unsubscribeFavorites = watchFavorites(
            currentUser.uid,
            (updatedFavorites) => {
              setFavorites(updatedFavorites);
            },
          );

          return () => unsubscribeFavorites();
        } catch (error) {
          console.error("Erro ao carregar favoritos da nuvem:", error);
        }
      } else {
        // Usuário deslogou - voltar para favoritos locais
        setFavorites(getFavorites());
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Carregar índice e favoritos na inicialização
    const init = async () => {
      setLoading(true);
      try {
        await loadIndex();
        const info = getDatasetInfo();
        setDataInfo(info);
        setFavorites(getFavorites());

        // Verificar se há favoritos compartilhados na URL
        const sharedCode = getSharedCodeFromURL();
        if (sharedCode) {
          try {
            const sharedData = decodeShareLink(sharedCode);
            setReceivedData(sharedData);
            setShowReceivedModal(true);
            clearShareFromURL(); // Limpar URL após detectar
          } catch (error) {
            console.error(
              "Erro ao decodificar favoritos compartilhados:",
              error,
            );
            alert("Link de compartilhamento inválido ou expirado.");
            clearShareFromURL();
          }
        }

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

  const handleToggleFavorite = async (item) => {
    const isFav = favorites.some((f) => f.code === item.code);

    if (isFav) {
      // Remover favorito
      const updated = removeFavorite(item.code);
      setFavorites(updated);
      trackFavorite(item.code, false);

      // Se usuário logado, remover da nuvem também
      if (user) {
        try {
          await removeFavoriteFromCloud(user.uid, item.code);
        } catch (error) {
          console.error("Erro ao remover favorito da nuvem:", error);
        }
      }
    } else {
      // Adicionar favorito
      const updated = addFavorite(item);
      setFavorites(updated);
      trackFavorite(item.code, true);

      // Se usuário logado, adicionar na nuvem também
      if (user) {
        try {
          await addFavoriteToCloud(user.uid, item);
        } catch (error) {
          console.error("Erro ao adicionar favorito na nuvem:", error);
        }
      }
    }
  };

  const handleSync = async () => {
    if (!user) return;

    try {
      await syncLocalToCloud(user.uid);
      const cloudFavorites = await getFavoritesFromCloud(user.uid);
      setFavorites(cloudFavorites);
    } catch (error) {
      console.error("Erro ao sincronizar:", error);
      alert("Erro ao sincronizar favoritos. Tente novamente.");
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

  const handleImportFavorites = async (importedFavorites) => {
    // Mesclar favoritos importados com os existentes (evitar duplicatas)
    const existingCodes = new Set(favorites.map((f) => f.code));
    const newFavorites = importedFavorites.filter(
      (f) => !existingCodes.has(f.code),
    );

    if (newFavorites.length === 0) {
      alert("Todos os favoritos já estão salvos.");
      return;
    }

    const updated = [...favorites, ...newFavorites];

    // Salvar localmente
    localStorage.setItem("nbs-favorites", JSON.stringify(updated));
    setFavorites(updated);

    // Se logado, salvar na nuvem também
    if (user) {
      for (const fav of newFavorites) {
        try {
          await addFavoriteToCloud(user.uid, fav);
        } catch (error) {
          console.error(
            "Erro ao adicionar favorito na nuvem:",
            fav.code,
            error,
          );
        }
      }
    }

    alert(
      `${newFavorites.length} ${newFavorites.length === 1 ? "favorito importado" : "favoritos importados"} com sucesso!`,
    );
  };

  const handleApplyTemplate = async (templateCodes) => {
    // Mesclar códigos do template com favoritos existentes (evitar duplicatas)
    const existingCodes = new Set(favorites.map((f) => f.code));
    const newFavorites = templateCodes.filter(
      (f) => !existingCodes.has(f.code),
    );

    if (newFavorites.length === 0) {
      alert("Todos os códigos deste template já estão nos seus favoritos.");
      return;
    }

    const updated = [...favorites, ...newFavorites];

    // Salvar localmente
    localStorage.setItem("nbs-favorites", JSON.stringify(updated));
    setFavorites(updated);

    // Se logado, salvar na nuvem também
    if (user) {
      for (const fav of newFavorites) {
        try {
          await addFavoriteToCloud(user.uid, fav);
        } catch (error) {
          console.error(
            "Erro ao adicionar favorito na nuvem:",
            fav.code,
            error,
          );
        }
      }
    }

    alert(
      `✨ ${newFavorites.length} ${newFavorites.length === 1 ? "código adicionado" : "códigos adicionados"} aos favoritos!`,
    );
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
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      trackPageChange(currentPage - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Configurar atalhos de teclado
  useKeyboardShortcuts({
    ctrlK: () => {
      searchInputRef.current?.focus();
      trackKeyboardShortcut("ctrl_k", "focus_search");
    },
    ctrlB: () => {
      handleShowFavorites();
      trackKeyboardShortcut("ctrl_b", "toggle_favorites");
    },
    ctrlE: () => {
      if (favorites.length > 0) {
        setShowExportModal(true);
        trackKeyboardShortcut("ctrl_e", "open_export");
      }
    },
    ctrlT: () => {
      setShowTemplatesModal(true);
      trackKeyboardShortcut("ctrl_t", "open_templates");
    },
    escape: () => {
      // ESC é tratado dentro do SearchBar
      if (showHelp) {
        setShowHelp(false);
        trackHelpModal("close");
      }
    },
    help: () => {
      setShowHelp(true);
      trackHelpModal("open");
    },
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
                <h1 className="text-lg sm:text-2xl font-bold text-white">
                  NBS Helper
                </h1>
                <p className="text-blue-100 text-xs sm:text-sm hidden xs:block">
                  Busca rápida de códigos NBS 2.0 para NFS-e
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-3">
              <LoginButton
                user={user}
                onLoginSuccess={() => console.log("Login realizado!")}
              />
              <button
                onClick={() => setShowTemplatesModal(true)}
                className="text-blue-100 hover:text-white transition-colors text-xs sm:text-sm px-2 sm:px-3 py-1 border border-blue-400 rounded-lg hover:bg-blue-700/50"
                title="Templates por perfil (Ctrl+T)"
              >
                <span className="hidden sm:inline">Templates</span>
                <span className="sm:hidden">✨</span>
              </button>
              <button
                onClick={() => setShowHelpInfo(true)}
                className="text-blue-100 hover:text-white transition-colors text-xs sm:text-sm px-2 sm:px-3 py-1 border border-blue-400 rounded-lg hover:bg-blue-700/50"
                title="Central de Ajuda - Saiba mais sobre NBS"
              >
                <Info className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
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
          {/* Dataset info oculta - descomente se necessário
          {dataInfo && (
            <div className="mt-2 sm:mt-3 text-xs text-blue-100">
              <span className="bg-blue-800/30 px-2 py-1 rounded">
                <span className="hidden xs:inline">
                  {dataInfo.totalItems} códigos •{" "}
                </span>
                <span className="xs:hidden">{dataInfo.totalItems} • </span>v
                {dataInfo.version}
              </span>
            </div>
          )}
          */}
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
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowShareModal(true)}
                className="px-3 py-1.5 bg-green-200 dark:bg-green-800 text-green-900 dark:text-green-100 rounded-lg hover:bg-green-300 dark:hover:bg-green-700 transition-colors text-sm font-medium"
                title="Compartilhar favoritos"
              >
                <span className="hidden xs:inline">Compartilhar</span>
                <span className="xs:hidden">🔗</span>
              </button>
              <button
                onClick={() => setShowExportModal(true)}
                className="px-3 py-1.5 bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 rounded-lg hover:bg-yellow-300 dark:hover:bg-yellow-700 transition-colors text-sm font-medium"
                title="Exportar favoritos (Ctrl+E)"
              >
                <span className="hidden xs:inline">Exportar</span>
                <span className="xs:hidden">⬇</span>
              </button>
              <button
                onClick={handleShowFavorites}
                className="text-yellow-700 dark:text-yellow-300 hover:text-yellow-900 dark:hover:text-yellow-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
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
              Mostrando {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, results.length)} de {results.length}{" "}
              resultado{results.length !== 1 ? "s" : ""}
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
                    <span className="hidden xs:inline">Página </span>
                    {currentPage} / {totalPages}
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
      {/* Important Disclaimer Banner */}
      {showDisclaimer && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border-y border-yellow-200 dark:border-yellow-800">
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  ⚠️ <strong>Ferramenta de apoio.</strong> Confirme com seu contador e a legislação do seu município.
                </p>
                <p className="mt-1 text-xs text-yellow-700 dark:text-yellow-300">
                  Dados oficiais da NBS 2.0 (Nomenclatura Brasileira de Serviços) • gov.br
                </p>
              </div>
              <button
                onClick={() => setShowDisclaimer(false)}
                className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-200 transition-colors"
                title="Fechar aviso"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {ADSENSE_CONFIG.settings.showFooterBanner && (
        <HorizontalAdBanner className="bg-white dark:bg-gray-800 border-t dark:border-gray-700" />
      )}

      {/* Contact Section - DESATIVADO TEMPORARIAMENTE */}
      {/* 
      <div className="bg-white dark:bg-gray-800 border-t dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">
              📞 Entre em contato
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => {
                  trackContact("form");
                  setShowContactModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors text-sm"
                title="Enviar mensagem"
              >
                <Mail className="w-4 h-4" />
                <span>Enviar Mensagem</span>
              </button>

              <a
                href="https://wa.me/5511967745351?text=Olá! Vim através do NBS Helper e gostaria de saber mais."
                onClick={() => trackContact("whatsapp")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors text-sm"
                title="Abrir WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden xs:inline">(11) 96774-5351</span>
                <span className="xs:hidden">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </div>
      */}

      {/* Footer - GitHub Style */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Top Row - Brand + Links */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            {/* Logo/Brand + WhatsApp */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <BookOpen className="w-6 h-6" />
                <span className="text-base font-semibold">© 2026 NBS Helper</span>
              </div>
              <a
                href="https://wa.me/5511967745351?text=Olá! Vim através do NBS Helper."
                onClick={() => trackContact("footer_whatsapp")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors text-sm"
                title="Fale conosco no WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">(11) 96774-5351</span>
              </a>
            </div>

            {/* Links */}
            <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-gray-600 dark:text-gray-400">
              <a
                href="/politica-privacidade.html"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Privacidade
              </a>
              <button
                onClick={() => setShowHelpInfo(true)}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Ajuda
              </button>
              <button
                onClick={() => {
                  trackContact("footer");
                  setShowContactModal(true);
                }}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Contato
              </button>
              <button
                onClick={() => setShowNBSImportance(true)}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Por que a NBS?
              </button>
              <button
                onClick={() => setShowCookiePrefs(true)}
                className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                Gerenciar Cookies
              </button>
            </nav>
          </div>

          {/* Middle Row - Social Media Icons Placeholder */}
          <div className="flex items-center justify-center gap-4 py-4 border-y border-gray-200 dark:border-gray-800">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              {/* Espaço reservado para ícones de redes sociais */}
            </p>
          </div>

          {/* Bottom Row - Description */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">
              Ferramenta gratuita de busca de códigos NBS 2.0 (Nomenclatura Brasileira de Serviços)
            </p>
          </div>
        </div>
      </footer>

      {/* Cookie Consent Banner */}
      <CookieConsent />

      {/* Keyboard Shortcuts Help */}
      {showHelp && <KeyboardShortcutsHelp onClose={() => setShowHelp(false)} />}

      {/* Sync Modal */}
      {showSyncModal && (
        <SyncModal
          onClose={() => setShowSyncModal(false)}
          localCount={getFavorites().length}
          cloudCount={0}
          onSync={handleSync}
        />
      )}

      {/* Export Modal */}
      {showExportModal && (
        <ExportModal
          favorites={favorites}
          onClose={() => setShowExportModal(false)}
          onImport={handleImportFavorites}
        />
      )}

      {/* Templates Modal */}
      {showTemplatesModal && (
        <TemplatesModal
          onClose={() => setShowTemplatesModal(false)}
          onApplyTemplate={handleApplyTemplate}
          dataInfo={dataInfo}
        />
      )}

      {/* Share Modal */}
      {showShareModal && favorites.length > 0 && (
        <ShareModal
          favorites={favorites}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {/* Received Favorites Modal */}
      {showReceivedModal && receivedData && (
        <ReceivedFavoritesModal
          sharedData={receivedData}
          onImport={handleImportFavorites}
          onClose={() => {
            setShowReceivedModal(false);
            setReceivedData(null);
          }}
          user={user}
          onLoginClick={() => setShowAuthModal(true)}
        />
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <ContactModal
          isOpen={showContactModal}
          onClose={() => setShowContactModal(false)}
        />
      )}

      {/* Help Info Modal */}
      {showHelpInfo && (
        <HelpInfoModal
          isOpen={showHelpInfo}
          onClose={() => setShowHelpInfo(false)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={() => {
          setShowAuthModal(false);
          // Reabrir modal de favoritos compartilhados se tiver dados
          if (receivedData) {
            setShowReceivedModal(true);
          }
        }}
      />

      {/* Cookie Preferences Modal */}
      <CookiePreferencesModal
        isOpen={showCookiePrefs}
        onClose={() => setShowCookiePrefs(false)}
      />

      {/* NBS Importance Modal */}
      <NBSImportanceModal
        isOpen={showNBSImportance}
        onClose={() => setShowNBSImportance(false)}
      />

      {/* PWA Install Prompt */}
      <InstallPWA />
    </div>
  );
}

export default App;
