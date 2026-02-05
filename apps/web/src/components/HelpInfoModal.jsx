import { useState } from "react";
import { X, BookOpen, AlertCircle, HelpCircle, Lightbulb } from "lucide-react";
import "./HelpInfoModal.css";

export default function HelpInfoModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("sobre");

  if (!isOpen) return null;

  const tabs = [
    { id: "sobre", label: "O que é NBS", icon: BookOpen },
    { id: "importancia", label: "Importância", icon: AlertCircle },
    { id: "como-usar", label: "Como Usar", icon: Lightbulb },
    { id: "faq", label: "FAQ", icon: HelpCircle },
  ];

  return (
    <div className="help-modal-overlay" onClick={onClose}>
      <div className="help-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="help-modal-header">
          <h2>Central de Ajuda</h2>
          <button
            className="help-modal-close"
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="help-tabs">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`help-tab ${activeTab === id ? "active" : ""}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="help-content">
          {activeTab === "sobre" && (
            <div className="help-section">
              <h3>O que é a NBS?</h3>
              <p>
                A <strong>NBS (Nomenclatura Brasileira de Serviços)</strong> é
                uma classificação oficial que padroniza e organiza todos os
                serviços prestados no Brasil. Similar ao NCM (Nomenclatura Comum
                do Mercosul) para produtos, a NBS é fundamental para:
              </p>

              <div className="help-features">
                <div className="help-feature">
                  <div className="help-feature-icon">📋</div>
                  <div>
                    <h4>Emissão de Notas Fiscais</h4>
                    <p>
                      Obrigatório informar o código NBS nas NF-e de serviços
                      desde 2018
                    </p>
                  </div>
                </div>

                <div className="help-feature">
                  <div className="help-feature-icon">📊</div>
                  <div>
                    <h4>Estatísticas e Dados</h4>
                    <p>
                      Permite ao governo acompanhar o setor de serviços no
                      Brasil
                    </p>
                  </div>
                </div>

                <div className="help-feature">
                  <div className="help-feature-icon">🏛️</div>
                  <div>
                    <h4>Conformidade Fiscal</h4>
                    <p>Evita multas e garante regularidade tributária</p>
                  </div>
                </div>

                <div className="help-feature">
                  <div className="help-feature-icon">🔍</div>
                  <div>
                    <h4>Classificação Precisa</h4>
                    <p>
                      Identifica exatamente o serviço prestado de forma
                      padronizada
                    </p>
                  </div>
                </div>
              </div>

              <div className="help-note">
                <strong>💡 Curiosidade:</strong> A NBS possui mais de 1.200
                códigos organizados hierarquicamente em 4 níveis, desde
                categorias gerais até serviços muito específicos.
              </div>
            </div>
          )}

          {activeTab === "importancia" && (
            <div className="help-section">
              <h3>Por que a NBS é importante?</h3>

              <div className="help-timeline">
                <div className="help-timeline-item">
                  <div className="help-timeline-marker">1</div>
                  <div className="help-timeline-content">
                    <h4>Obrigatoriedade Legal</h4>
                    <p>
                      Desde <strong>2018</strong>, a Receita Federal tornou
                      obrigatório o uso da NBS na emissão de Notas Fiscais de
                      Serviços Eletrônicas (NFS-e). Empresas que não utilizam
                      podem receber multas.
                    </p>
                  </div>
                </div>

                <div className="help-timeline-item">
                  <div className="help-timeline-marker">2</div>
                  <div className="help-timeline-content">
                    <h4>Transparência Fiscal</h4>
                    <p>
                      Facilita a fiscalização e auditoria, tanto para o governo
                      quanto para a empresa, garantindo que os impostos sejam
                      calculados corretamente sobre cada serviço.
                    </p>
                  </div>
                </div>

                <div className="help-timeline-item">
                  <div className="help-timeline-marker">3</div>
                  <div className="help-timeline-content">
                    <h4>Análise Econômica</h4>
                    <p>
                      Permite ao governo brasileiro medir o desempenho do setor
                      de serviços, que representa{" "}
                      <strong>mais de 70% do PIB brasileiro</strong>, ajudando
                      na criação de políticas públicas.
                    </p>
                  </div>
                </div>

                <div className="help-timeline-item">
                  <div className="help-timeline-marker">4</div>
                  <div className="help-timeline-content">
                    <h4>Padronização Nacional</h4>
                    <p>
                      Unifica a linguagem de serviços em todo o país,
                      facilitando negócios interestaduais e a integração com
                      sistemas governamentais.
                    </p>
                  </div>
                </div>
              </div>

              <div className="help-warning">
                <strong>⚠️ Atenção:</strong> Usar o código NBS errado pode
                resultar em:
                <ul>
                  <li>Rejeição da Nota Fiscal pela Receita</li>
                  <li>Cálculo incorreto de impostos (ISS, PIS, COFINS)</li>
                  <li>Multas e penalidades fiscais</li>
                  <li>Problemas em auditorias futuras</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "como-usar" && (
            <div className="help-section">
              <h3>Como usar o NBS Helper</h3>

              <div className="help-steps">
                <div className="help-step">
                  <div className="help-step-number">1</div>
                  <div className="help-step-content">
                    <h4>Busque seu serviço</h4>
                    <p>
                      Digite palavras-chave relacionadas ao serviço na barra de
                      busca. Por exemplo: "contabilidade", "consultoria",
                      "desenvolvimento web", etc.
                    </p>
                    <div className="help-example">
                      <strong>Exemplo:</strong> Se você presta serviços de
                      design gráfico, busque por "design", "gráfico" ou
                      "publicidade"
                    </div>
                  </div>
                </div>

                <div className="help-step">
                  <div className="help-step-number">2</div>
                  <div className="help-step-content">
                    <h4>Analise os resultados</h4>
                    <p>
                      Leia com atenção as descrições. A NBS é hierárquica, então
                      você verá códigos de diferentes níveis. Escolha o mais
                      específico possível.
                    </p>
                    <div className="help-example">
                      <strong>Dica:</strong> Códigos mais longos são mais
                      específicos. Prefira "1.1406.10.00" a "1.14" quando
                      possível.
                    </div>
                  </div>
                </div>

                <div className="help-step">
                  <div className="help-step-number">3</div>
                  <div className="help-step-content">
                    <h4>Salve seus favoritos</h4>
                    <p>
                      Clique na ⭐ para adicionar códigos que você usa
                      frequentemente. Eles ficarão salvos para consulta rápida.
                    </p>
                    <div className="help-example">
                      <strong>Vantagem:</strong> Ideal se você presta sempre os
                      mesmos serviços - não precisa buscar toda vez!
                    </div>
                  </div>
                </div>

                <div className="help-step">
                  <div className="help-step-number">4</div>
                  <div className="help-step-content">
                    <h4>Use na Nota Fiscal</h4>
                    <p>
                      Copie o código (sem os pontos) e cole no campo NBS do seu
                      sistema de emissão de notas fiscais. Geralmente são 9
                      dígitos.
                    </p>
                    <div className="help-example">
                      <strong>Formato:</strong> 1.1302.00.01 → 113020001
                    </div>
                  </div>
                </div>
              </div>

              <div className="help-shortcuts">
                <h4>⌨️ Atalhos do Teclado</h4>
                <div className="help-shortcuts-grid">
                  <div>
                    <kbd>Ctrl</kbd> + <kbd>K</kbd> = Focar na busca
                  </div>
                  <div>
                    <kbd>Ctrl</kbd> + <kbd>F</kbd> = Ver favoritos
                  </div>
                  <div>
                    <kbd>Ctrl</kbd> + <kbd>T</kbd> = Templates
                  </div>
                  <div>
                    <kbd>?</kbd> = Mostrar atalhos
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="help-section">
              <h3>Perguntas Frequentes</h3>

              <div className="help-faqs">
                <details className="help-faq">
                  <summary>Qual a diferença entre NBS e NCM?</summary>
                  <p>
                    <strong>NCM</strong> é para <strong>produtos</strong>{" "}
                    (mercadorias físicas), enquanto <strong>NBS</strong> é para{" "}
                    <strong>serviços</strong>. Se você vende um computador, usa
                    NCM. Se você conserta computadores, usa NBS.
                  </p>
                </details>

                <details className="help-faq">
                  <summary>Sou MEI, preciso usar NBS?</summary>
                  <p>
                    <strong>Sim!</strong> Mesmo MEIs que emitem nota fiscal de
                    serviço precisam informar o código NBS desde 2018. Verifique
                    no sistema da sua prefeitura se o campo é obrigatório.
                  </p>
                </details>

                <details className="help-faq">
                  <summary>E se meu serviço não estiver na lista?</summary>
                  <p>
                    Busque por serviços similares ou use um código mais genérico
                    da categoria. Por exemplo, se você faz algo muito específico
                    em TI, use o código geral "Serviços de tecnologia da
                    informação" (1.15).
                  </p>
                </details>

                <details className="help-faq">
                  <summary>
                    Posso usar mais de um código NBS na mesma nota?
                  </summary>
                  <p>
                    <strong>Sim!</strong> Se você prestou diferentes tipos de
                    serviços na mesma nota, você pode (e deve) discriminar cada
                    um com seu respectivo código NBS.
                  </p>
                </details>

                <details className="help-faq">
                  <summary>O código NBS muda o valor do ISS?</summary>
                  <p>
                    Pode mudar. Cada município define alíquotas de ISS para
                    diferentes serviços. Usar o código correto garante que você
                    pague o imposto adequado - nem mais, nem menos.
                  </p>
                </details>

                <details className="help-faq">
                  <summary>Com que frequência a NBS é atualizada?</summary>
                  <p>
                    A NBS é atualizada periodicamente pelo IBGE e Ministério da
                    Economia. Nosso sistema é atualizado sempre que há mudanças
                    oficiais, garantindo que você tenha acesso aos códigos mais
                    recentes.
                  </p>
                </details>

                <details className="help-faq">
                  <summary>Posso exportar minha lista de favoritos?</summary>
                  <p>
                    <strong>Sim!</strong> Use a função "Exportar" (📥) no menu
                    de favoritos. Você pode baixar em JSON ou TXT e até
                    compartilhar com sua equipe via link.
                  </p>
                </details>

                <details className="help-faq">
                  <summary>O que são os templates?</summary>
                  <p>
                    Templates são listas pré-configuradas de códigos NBS para
                    diferentes profissões (Contador, TI, Saúde, etc.).
                    Economizam tempo se você está começando ou quer explorar
                    códigos da sua área.
                  </p>
                </details>
              </div>

              <div className="help-contact">
                <h4>Ainda tem dúvidas?</h4>
                <p>
                  Entre em contato conosco através do botão "Enviar Mensagem" no
                  rodapé da página.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
