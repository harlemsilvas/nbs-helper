import { useState } from "react";
import { Copy, Check, Star } from "lucide-react";
import { trackCopy } from "../services/analytics";

export default function ResultItem({ item, isFavorite, onToggleFavorite }) {
  const [copied, setCopied] = useState(null);

  const copyToClipboard = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(type);
      trackCopy(item.code, type);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <code className="text-lg font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded">
              {item.code}
            </code>
            {item.level && (
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                {item.level}
              </span>
            )}
          </div>
          <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(item)}
            className={`p-2 rounded-lg transition-colors ${
              isFavorite
                ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-600"
            }`}
            title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Star className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={() => copyToClipboard(item.code, "code")}
            className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
            title="Copiar código"
          >
            {copied === "code" ? (
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <Copy className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          <button
            onClick={() => copyToClipboard(item.description, "desc")}
            className="p-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors text-xs"
            title="Copiar descrição"
          >
            {copied === "desc" ? (
              <Check className="w-5 h-5 text-green-600 dark:text-green-400" />
            ) : (
              <Copy className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
