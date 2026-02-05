import { X } from "lucide-react";
import "./PrivacyPolicyModal.css";

export default function PrivacyPolicyModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="privacy-modal-overlay" onClick={handleOverlayClick}>
      <div className="privacy-modal">
        <div className="privacy-modal-header">
          <div>
            <h2 className="privacy-modal-title">📜 Política de Privacidade</h2>
            <p className="privacy-modal-subtitle">NBS Helper - Busca de Códigos NBS 2.0</p>
          </div>
          <button onClick={onClose} className="privacy-modal-close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="privacy-modal-content">
          <section>
            <h2>1. Informações Gerais</h2>
            <p>Esta Política de Privacidade descreve como o <strong>NBS Helper</strong> coleta, usa e protege informações ao utilizar nossa plataforma.</p>
            <p><strong>Última atualização:</strong> 03 de fevereiro de 2026</p>
          </section>

          <section>
            <h2>2. Dados Coletados</h2>
            
            <h3>2.1 Dados Armazenados Localmente</h3>
            <p>O NBS Helper armazena <strong>apenas no seu navegador</strong> (LocalStorage):</p>
            <ul>
              <li><strong>Favoritos:</strong> Lista de códigos NBS que você marcou como favoritos</li>
              <li><strong>Histórico de buscas:</strong> Suas últimas 10 buscas realizadas</li>
              <li><strong>Tema:</strong> Preferência de modo claro/escuro</li>
              <li><strong>Consentimento de cookies:</strong> Sua escolha sobre aceitar ou recusar cookies</li>
            </ul>
            
            <div className="privacy-highlight">
              <strong>⚠️ Importante:</strong> Estes dados <strong>não são enviados para nenhum servidor</strong> e permanecem apenas no seu dispositivo.
            </div>

            <h3>2.2 Dados Analíticos (Google Analytics)</h3>
            <p>Com seu consentimento, coletamos dados anônimos através do Google Analytics 4 (GA4):</p>
            <ul>
              <li><strong>Dados de navegação:</strong> Páginas visitadas, tempo de permanência</li>
              <li><strong>Dados de uso:</strong> Buscas realizadas (termos pesquisados), códigos copiados, favoritos adicionados</li>
              <li><strong>Dados técnicos:</strong> Tipo de navegador, sistema operacional, resolução de tela</li>
              <li><strong>Localização aproximada:</strong> País e cidade (baseado no IP)</li>
            </ul>
            
            <p><strong>O Google Analytics:</strong></p>
            <ul>
              <li>Anonimiza seu endereço IP</li>
              <li>Não coleta dados pessoais identificáveis (nome, email, CPF, etc)</li>
              <li>Dados são agregados e utilizados apenas para estatísticas</li>
            </ul>
          </section>

          <section>
            <h2>3. Finalidade do Uso dos Dados</h2>
            <p>Os dados coletados são utilizados para:</p>
            <ol>
              <li><strong>Melhorar a experiência:</strong> Entender quais códigos são mais buscados</li>
              <li><strong>Otimizar a ferramenta:</strong> Identificar problemas de usabilidade</li>
              <li><strong>Estatísticas de uso:</strong> Quantificar acessos e funcionalidades mais utilizadas</li>
            </ol>
            
            <p><strong>Não utilizamos seus dados para:</strong></p>
            <ul>
              <li>❌ Vender ou compartilhar com terceiros</li>
              <li>❌ Enviar spam ou publicidade não solicitada</li>
              <li>❌ Rastreamento individual ou profiling</li>
            </ul>
          </section>

          <section>
            <h2>4. Cookies Utilizados</h2>
            
            <h3>4.1 Cookies Essenciais (Sempre Ativos)</h3>
            <ul>
              <li><strong>cookie-consent:</strong> Armazena sua escolha sobre aceitar/recusar cookies</li>
              <li><strong>nbs-theme:</strong> Armazena preferência de tema (claro/escuro)</li>
            </ul>

            <h3>4.2 Cookies Analíticos (Mediante Consentimento)</h3>
            <ul>
              <li><strong>_ga, _ga_*:</strong> Cookies do Google Analytics para rastreamento anônimo de uso</li>
            </ul>
            
            <p>Você pode <strong>aceitar ou recusar</strong> cookies analíticos através do banner exibido no site.</p>
          </section>

          <section>
            <h2>5. Seus Direitos (LGPD e GDPR)</h2>
            <p>De acordo com a <strong>Lei Geral de Proteção de Dados (LGPD)</strong> e <strong>GDPR</strong>, você tem direito a:</p>
            <ol>
              <li><strong>Acesso:</strong> Saber quais dados temos sobre você</li>
              <li><strong>Retificação:</strong> Corrigir dados incorretos</li>
              <li><strong>Exclusão:</strong> Solicitar remoção de seus dados</li>
              <li><strong>Portabilidade:</strong> Obter cópia dos seus dados</li>
              <li><strong>Revogação:</strong> Retirar consentimento a qualquer momento</li>
            </ol>
            
            <div className="privacy-highlight">
              <strong>Como exercer seus direitos:</strong>
              <ul style={{ marginTop: "10px" }}>
                <li><strong>Excluir favoritos:</strong> Limpe os dados do navegador (Settings &gt; Clear browsing data)</li>
                <li><strong>Revogar consentimento de cookies:</strong> Limpe os dados do site e recarregue a página</li>
                <li><strong>Desativar Google Analytics:</strong> Use extensões como uBlock Origin ou Privacy Badger</li>
              </ul>
            </div>
          </section>

          <section>
            <h2>6. Compartilhamento de Dados</h2>
            <p>O NBS Helper <strong>não compartilha, vende ou aluga</strong> seus dados para terceiros.</p>
            <p>Os únicos dados compartilhados são com:</p>
            <ul>
              <li><strong>Google Analytics:</strong> Para análise anônima de uso (mediante seu consentimento)</li>
            </ul>
            <p>O Google está em conformidade com LGPD e GDPR e possui suas próprias políticas de privacidade.</p>
          </section>

          <section>
            <h2>7. Segurança</h2>
            <p>Medidas de segurança implementadas:</p>
            <ul>
              <li>✅ <strong>HTTPS:</strong> Conexão criptografada</li>
              <li>✅ <strong>LocalStorage:</strong> Dados salvos apenas no seu dispositivo</li>
              <li>✅ <strong>Sem banco de dados:</strong> Não armazenamos dados em servidores próprios</li>
              <li>✅ <strong>Anonimização de IP:</strong> Google Analytics anonimiza endereços IP</li>
            </ul>
          </section>

          <section>
            <h2>8. Retenção de Dados</h2>
            <ul>
              <li><strong>Favoritos e histórico:</strong> Permanecem no seu navegador até você limpar os dados</li>
              <li><strong>Google Analytics:</strong> Retidos por 26 meses (configuração padrão do GA4)</li>
            </ul>
          </section>

          <section>
            <h2>9. Crianças</h2>
            <p>O NBS Helper não é direcionado para menores de 18 anos. Não coletamos intencionalmente dados de crianças.</p>
          </section>

          <section>
            <h2>10. Alterações nesta Política</h2>
            <p>Esta política pode ser atualizada periodicamente. A data da última atualização será sempre exibida no topo.</p>
            <p>Mudanças significativas serão comunicadas através de aviso no site.</p>
          </section>

          <section>
            <h2>11. Legislação Aplicável</h2>
            <p>Esta política é regida pela legislação brasileira, especialmente:</p>
            <ul>
              <li><strong>LGPD</strong> (Lei nº 13.709/2018) - Lei Geral de Proteção de Dados</li>
              <li><strong>Marco Civil da Internet</strong> (Lei nº 12.965/2014)</li>
            </ul>
            <p>Para usuários da União Europeia, aplicam-se também as regras do <strong>GDPR</strong>.</p>
          </section>

          <section>
            <h2>12. Contato</h2>
            <p>Para dúvidas sobre esta política ou exercer seus direitos:</p>
            <ul>
              <li><strong>GitHub Issues:</strong> <a href="https://github.com/harlemsilvas/nbs-helper/issues" target="_blank" rel="noopener noreferrer">github.com/harlemsilvas/nbs-helper/issues</a></li>
            </ul>
          </section>

          <section>
            <h2>13. Consentimento</h2>
            <p>Ao usar o NBS Helper e aceitar cookies, você concorda com esta Política de Privacidade.</p>
          </section>
        </div>

        <div className="privacy-modal-footer">
          <p><strong>Última atualização:</strong> 03/02/2026 • <strong>Versão:</strong> 1.0</p>
        </div>
      </div>
    </div>
  );
}
