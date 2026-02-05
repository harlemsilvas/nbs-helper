import { X, FileText, TrendingUp, Shield, CheckCircle } from "lucide-react";
import "./NBSImportanceModal.css";

export default function NBSImportanceModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="nbs-importance-overlay" onClick={handleOverlayClick}>
      <div className="nbs-importance-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="nbs-importance-header">
          <h2>📋 Por que a NBS é importante?</h2>
          <button
            className="nbs-importance-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="nbs-importance-content">
          {/* Introduction */}
          <div className="nbs-importance-intro">
            <p>
              A <strong>NBS 2.0 (Nomenclatura Brasileira de Serviços)</strong> é uma
              classificação oficial padronizada de todos os serviços prestados no Brasil.
              Criada pelo governo federal, ela unifica a identificação de serviços em
              documentos fiscais, facilitando a gestão tributária e reduzindo erros.
            </p>
          </div>

          {/* Why it matters */}
          <div className="nbs-importance-sections">
            <div className="nbs-importance-card">
              <div className="nbs-importance-card-icon blue">
                <FileText size={24} />
              </div>
              <h3>Padronização Nacional</h3>
              <p>
                Antes da NBS, cada município tinha sua própria lista de códigos de
                serviços, gerando confusão. A NBS unifica tudo em um único padrão
                nacional, facilitando a emissão de notas fiscais em qualquer lugar do
                Brasil.
              </p>
            </div>

            <div className="nbs-importance-card">
              <div className="nbs-importance-card-icon green">
                <TrendingUp size={24} />
              </div>
              <h3>Tributação Correta</h3>
              <p>
                Escolher o código NBS correto garante que você pague o ISS (Imposto sobre
                Serviços) na alíquota adequada. Códigos errados podem resultar em
                multas, autuações fiscais ou pagamento indevido de impostos.
              </p>
            </div>

            <div className="nbs-importance-card">
              <div className="nbs-importance-card-icon purple">
                <Shield size={24} />
              </div>
              <h3>Conformidade Legal</h3>
              <p>
                Desde 2022, a NBS 2.0 é <strong>obrigatória</strong> para nota fiscal
                eletrônica de serviços (NFS-e) em todo o Brasil. Empresas e profissionais
                autônomos devem usar os códigos corretos para manter a conformidade
                fiscal.
              </p>
            </div>

            <div className="nbs-importance-card">
              <div className="nbs-importance-card-icon orange">
                <CheckCircle size={24} />
              </div>
              <h3>Facilita a Gestão</h3>
              <p>
                Com códigos padronizados, sistemas de contabilidade e emissão de notas
                podem automatizar processos, reduzindo erros manuais e economizando tempo
                na gestão tributária do seu negócio.
              </p>
            </div>
          </div>

          {/* Dataset Info */}
          <div className="nbs-importance-dataset">
            <h3>📊 Base de Dados do NBS Helper</h3>
            <div className="nbs-importance-dataset-grid">
              <div>
                <strong>1.237 códigos</strong>
                <span>Total de serviços catalogados</span>
              </div>
              <div>
                <strong>Atualizado</strong>
                <span>Versão oficial NBS 2.0</span>
              </div>
              <div>
                <strong>Gov.br</strong>
                <span>Fonte oficial do governo</span>
              </div>
            </div>
          </div>

          {/* Important Note */}
          <div className="nbs-importance-note">
            <p>
              ⚠️ <strong>Importante:</strong> Esta ferramenta é um apoio para encontrar
              códigos. Sempre confirme com seu contador e verifique a legislação
              específica do seu município antes de emitir notas fiscais.
            </p>
          </div>

          {/* Links */}
          <div className="nbs-importance-links">
            <a
              href="https://www.gov.br/empresas-e-negocios/pt-br/empreendedor/servicos-para-mei/nbs-nomenclatura-brasileira-de-servicos"
              target="_blank"
              rel="noopener noreferrer"
              className="nbs-importance-link"
            >
              📖 Documentação Oficial NBS 2.0
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="nbs-importance-footer">
          <button className="nbs-importance-btn-primary" onClick={onClose}>
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
