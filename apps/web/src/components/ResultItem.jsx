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
    <div className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <code className="text-lg font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded">
              {item.code}
            </code>
            {item.level && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded">
                {item.level}
              </span>
            )}
          </div>
          <p className="text-gray-700 text-sm leading-relaxed">
            {item.description}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggleFavorite(item)}
            className={`p-2 rounded-lg transition-colors ${
              isFavorite
                ? "bg-yellow-100 text-yellow-600 hover:bg-yellow-200"
                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
            }`}
            title={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          >
            <Star className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
          </button>

          <button
            onClick={() => copyToClipboard(item.code, "code")}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Copiar código"
          >
            {copied === "code" ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Copy className="w-5 h-5 text-gray-600" />
            )}
          </button>

          <button
            onClick={() => copyToClipboard(item.description, "desc")}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-xs"
            title="Copiar descrição"
          >
            {copied === "desc" ? (
              <Check className="w-5 h-5 text-green-600" />
            ) : (
              <Copy className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
