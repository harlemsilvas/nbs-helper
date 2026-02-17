import { useState } from "react";
import { X } from "lucide-react";
import "./CookiePreferencesModal.css";

export default function CookiePreferencesModal({ isOpen, onClose }) {
  // Carregar preferências salvas ao inicializar
  const loadInitialPreferences = () => {
    const consent = localStorage.getItem("cookie-consent");
    return {
      necessary: true, // Sempre ativo
      analytics: consent === "accepted",
    };
  };

  const [preferences, setPreferences] = useState(loadInitialPreferences);

  if (!isOpen) return null;

  const handleAcceptAnalytics = () => {
    setPreferences({ ...preferences, analytics: true });
  };

  const handleRejectAnalytics = () => {
    setPreferences({ ...preferences, analytics: false });
  };

  const handleSaveChanges = () => {
    // Salvar preferência de analytics
    if (preferences.analytics) {
      localStorage.setItem("cookie-consent", "accepted");
    } else {
      localStorage.setItem("cookie-consent", "rejected");
      // Desativar Google Analytics
      if (window.gtag) {
        window.gtag("consent", "update", {
          analytics_storage: "denied",
        });
      }
    }
    onClose();
    // Recarregar para aplicar mudanças
    window.location.reload();
  };

  const handleResetAll = () => {
    setPreferences({
      necessary: true,
      analytics: false,
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="cookie-prefs-overlay" onClick={handleOverlayClick}>
      <div className="cookie-prefs-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="cookie-prefs-header">
          <h2>Gerenciar preferências de cookies</h2>
          <button
            className="cookie-prefs-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="cookie-prefs-content">
          <p className="cookie-prefs-intro">
            Usamos cookies para melhorar a experiência no site. Por exemplo, cookies são
            usados para guardar suas preferências e quantas vezes você clica em uma tarefa.
            Também usamos alguns cookies analíticos para fornecer publicidade personalizada.
          </p>

          {/* Necessary Cookies */}
          <div className="cookie-prefs-section">
            <div className="cookie-prefs-section-header">
              <h3>Cookies Essenciais</h3>
              <div className="cookie-prefs-toggle disabled">
                <div className="cookie-prefs-toggle-circle active"></div>
              </div>
            </div>
            <p className="cookie-prefs-description">
              Estes cookies são necessários para o funcionamento básico do site e não podem
              ser desativados. Eles armazenam suas preferências de tema (modo escuro/claro),
              favoritos locais e consentimento de cookies.
            </p>
            <p className="cookie-prefs-note">
              <strong>Sempre ativo</strong> - Não coletamos informações pessoais identificáveis.
            </p>
          </div>

          {/* Analytics Cookies */}
          <div className="cookie-prefs-section">
            <div className="cookie-prefs-section-header">
              <h3>Análise e Publicidade</h3>
              <div className="cookie-prefs-options">
                <label className={preferences.analytics ? "active" : ""}>
                  <input
                    type="radio"
                    name="analytics"
                    checked={preferences.analytics}
                    onChange={handleAcceptAnalytics}
                  />
                  <span>Aceitar</span>
                </label>
                <label className={!preferences.analytics ? "active" : ""}>
                  <input
                    type="radio"
                    name="analytics"
                    checked={!preferences.analytics}
                    onChange={handleRejectAnalytics}
                  />
                  <span>Rejeitar</span>
                </label>
              </div>
            </div>
            <p className="cookie-prefs-description">
              O NBS Helper e terceiros usam cookies de análise para mostrar anúncios e
              conteúdo baseados em sua atividade nos sites. Isso garante que os anúncios e
              o conteúdo que você vê refletem melhor seus interesses. Isso também permite
              que terceiros desenvolvam e melhorem seus produtos, que podem ser usados em
              sites não pertencentes ao NBS Helper.
            </p>
          </div>

          {/* Privacy Note */}
          <div className="cookie-prefs-privacy">
            <p>
              ℹ️ Seus dados são anonimizados e não compartilhamos informações pessoais
              identificáveis. Veja nossa{" "}
              <a
                href="/politica-privacidade.html"
                target="_blank"
                rel="noopener noreferrer"
              >
                Política de Privacidade
              </a>{" "}
              para mais detalhes.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="cookie-prefs-footer">
          <button className="cookie-prefs-btn-secondary" onClick={handleResetAll}>
            Restaurar padrões
          </button>
          <button className="cookie-prefs-btn-primary" onClick={handleSaveChanges}>
            Salvar alterações
          </button>
        </div>
      </div>
    </div>
  );
}
