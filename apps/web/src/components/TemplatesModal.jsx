import { useState } from "react";
import { Download, X, Sparkles, CheckCircle2 } from "lucide-react";
import templatesData from "../data/templates.json";
import { trackEvent } from "../services/analytics";

// Mapa de ícones (importar dinamicamente seria melhor, mas isso funciona)
const iconMap = {
  Calculator: "🧮",
  Code: "💻",
  Briefcase: "💼",
  HardHat: "👷",
  Heart: "❤️",
  Scale: "⚖️",
  Megaphone: "📣",
  GraduationCap: "🎓",
};

const colorMap = {
  blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-700",
  purple:
    "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700",
  green:
    "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-700",
  orange:
    "bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border-orange-300 dark:border-orange-700",
  red: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-300 dark:border-red-700",
  indigo:
    "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 border-indigo-300 dark:border-indigo-700",
  pink: "bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 border-pink-300 dark:border-pink-700",
  yellow:
    "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 border-yellow-300 dark:border-yellow-700",
};

export default function TemplatesModal({ onClose, onApplyTemplate, dataInfo }) {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [applying, setApplying] = useState(false);

  const handleApplyTemplate = async (template) => {
    setApplying(true);
    setSelectedTemplate(template.id);

    try {
      // Verificar se dataInfo está carregado
      if (!dataInfo || !dataInfo.items) {
        alert(
          "Dados ainda não carregados. Aguarde um momento e tente novamente.",
        );
        return;
      }

      // Buscar detalhes completos dos códigos
      const fullCodes = template.codes
        .map((code) => dataInfo.items.find((item) => item.code === code))
        .filter(Boolean); // Remove códigos não encontrados

      if (fullCodes.length === 0) {
        alert("Nenhum código válido encontrado neste template.");
        return;
      }

      // Aplicar template
      onApplyTemplate(fullCodes);

      // Analytics
      trackEvent("template_applied", {
        template_id: template.id,
        template_name: template.name,
        codes_count: fullCodes.length,
      });

      // Feedback visual
      await new Promise((resolve) => setTimeout(resolve, 800));
      onClose();
    } catch (error) {
      console.error("Erro ao aplicar template:", error);
      trackEvent("template_error", {
        template_id: template.id,
        error: error.message,
      });
      alert("Erro ao aplicar template. Tente novamente.");
    } finally {
      setApplying(false);
      setSelectedTemplate(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-bold">Modelos por Perfil</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Comece rapidamente com códigos pré-selecionados
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1"
              disabled={applying}
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {templatesData.templates.map((template) => {
              const isSelected = selectedTemplate === template.id;
              const colorClasses = colorMap[template.color] || colorMap.blue;

              return (
                <div
                  key={template.id}
                  className={`border-2 rounded-lg p-4 transition-all ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  {/* Template Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl border-2 ${colorClasses}`}
                    >
                      {iconMap[template.icon] || "📋"}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {template.description}
                      </p>
                    </div>
                  </div>

                  {/* Codes Preview */}
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                      {template.codes.length} códigos inclusos:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {template.codes.slice(0, 5).map((code) => (
                        <span
                          key={code}
                          className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                        >
                          {code}
                        </span>
                      ))}
                      {template.codes.length > 5 && (
                        <span className="text-xs px-2 py-1 text-gray-500 dark:text-gray-400">
                          +{template.codes.length - 5} mais
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Apply Button */}
                  <button
                    onClick={() => handleApplyTemplate(template)}
                    disabled={applying}
                    className={`w-full py-2 px-4 rounded-lg font-medium transition-all ${
                      isSelected && applying
                        ? "bg-green-500 text-white"
                        : "bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                    }`}
                  >
                    {isSelected && applying ? (
                      <span className="flex items-center justify-center gap-2">
                        <CheckCircle2 className="w-4 h-4" />
                        Aplicado!
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        <Download className="w-4 h-4" />
                        Aplicar Modelo
                      </span>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              💡 <strong>Dica:</strong> Os códigos do modelo serão{" "}
              <strong>adicionados</strong> aos seus favoritos existentes, sem
              substituir nada.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4 bg-gray-50 dark:bg-gray-900/50">
          <button
            onClick={onClose}
            disabled={applying}
            className="w-full sm:w-auto px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
