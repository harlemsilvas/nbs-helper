import { X, Cloud, Smartphone, Shield, Sparkles, Lock } from "lucide-react";
import "./LoginPromptModal.css";

export default function LoginPromptModal({
  isOpen,
  onClose,
  onLogin,
  favoriteCount = 0,
}) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleDismissForever = () => {
    localStorage.setItem("nbs-login-prompt-dismissed", "true");
    onClose();
  };

  return (
    <div className="login-prompt-overlay" onClick={handleOverlayClick}>
      <div className="login-prompt-modal">
        {/* Header com Gradiente */}
        <div className="login-prompt-header">
          <div className="login-prompt-header-content">
            <div className="login-prompt-icon-main">
              <Cloud className="w-8 h-8" />
            </div>
            <div>
              <h2 className="login-prompt-title">
                Proteja seus {favoriteCount}{" "}
                {favoriteCount === 1 ? "favorito" : "favoritos"}!
              </h2>
              <p className="login-prompt-subtitle">
                Não perca seus códigos salvos. Faça login e tenha acesso de
                qualquer lugar.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="login-prompt-close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Conteúdo Principal */}
        <div className="login-prompt-content">
          {/* Destaque do problema */}
          <div className="login-prompt-warning">
            <Lock className="w-5 h-5" />
            <div>
              <p className="login-prompt-warning-title">
                ⚠️ Seus favoritos estão apenas neste navegador
              </p>
              <p className="login-prompt-warning-text">
                Se limpar os dados do navegador ou trocar de dispositivo, você
                perderá tudo.
              </p>
            </div>
          </div>

          {/* Benefícios em Cards */}
          <div className="login-prompt-benefits">
            <div className="login-prompt-benefit-card">
              <div className="login-prompt-benefit-icon blue">
                <Cloud className="w-6 h-6" />
              </div>
              <div>
                <h3 className="login-prompt-benefit-title">
                  Backup Automático
                </h3>
                <p className="login-prompt-benefit-text">
                  Seus favoritos salvos na nuvem com segurança. Nunca mais perca
                  seus códigos.
                </p>
              </div>
            </div>

            <div className="login-prompt-benefit-card">
              <div className="login-prompt-benefit-icon green">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h3 className="login-prompt-benefit-title">
                  Acesse de Qualquer Lugar
                </h3>
                <p className="login-prompt-benefit-text">
                  Computador, celular, tablet. Seus favoritos sincronizados em
                  tempo real.
                </p>
              </div>
            </div>

            <div className="login-prompt-benefit-card">
              <div className="login-prompt-benefit-icon purple">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="login-prompt-benefit-title">100% Seguro</h3>
                <p className="login-prompt-benefit-text">
                  Autenticação via Google. Seus dados protegidos com
                  criptografia de ponta.
                </p>
              </div>
            </div>

            <div className="login-prompt-benefit-card">
              <div className="login-prompt-benefit-icon orange">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="login-prompt-benefit-title">
                  Recursos Exclusivos
                </h3>
                <p className="login-prompt-benefit-text">
                  Compartilhe favoritos, exporte listas e acesse funcionalidades
                  premium.
                </p>
              </div>
            </div>
          </div>

          {/* Testemunho Social */}
          <div className="login-prompt-social-proof">
            <p className="login-prompt-social-text">
              ✨ <strong>Milhares de profissionais</strong> já salvaram seus
              códigos NBS na nuvem
            </p>
          </div>
        </div>

        {/* Footer com CTAs */}
        <div className="login-prompt-footer">
          <div className="login-prompt-actions">
            <button onClick={onLogin} className="login-prompt-cta-primary">
              <Cloud className="w-5 h-5" />
              Fazer Login e Salvar Agora
            </button>
            <button onClick={onClose} className="login-prompt-cta-secondary">
              Mais tarde
            </button>
          </div>
          <button
            onClick={handleDismissForever}
            className="login-prompt-dismiss"
          >
            Não mostrar novamente
          </button>
        </div>
      </div>
    </div>
  );
}
