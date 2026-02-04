import { X, Command } from "lucide-react";

export default function KeyboardShortcutsHelp({ onClose }) {
  const shortcuts = [
    { keys: ["Ctrl", "K"], description: "Focar no campo de busca" },
    { keys: ["Esc"], description: "Limpar busca / Fechar dropdown" },
    { keys: ["Ctrl", "B"], description: "Abrir/Fechar favoritos" },
    { keys: ["Ctrl", "E"], description: "Exportar favoritos" },
    { keys: ["Ctrl", "T"], description: "Abrir templates por perfil" },
    { keys: ["↑", "↓"], description: "Navegar sugestões de busca" },
    { keys: ["Enter"], description: "Selecionar sugestão" },
    { keys: ["?"], description: "Mostrar esta ajuda" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Command className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Atalhos de Teclado
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <ul className="space-y-3">
            {shortcuts.map((shortcut, index) => (
              <li key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {shortcut.description}
                </span>
                <div className="flex items-center gap-1">
                  {shortcut.keys.map((key, keyIndex) => (
                    <span key={keyIndex} className="inline-flex items-center">
                      {keyIndex > 0 && (
                        <span className="mx-1 text-gray-400 dark:text-gray-500">+</span>
                      )}
                      <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 dark:text-gray-200 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded shadow-sm">
                        {key}
                      </kbd>
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Pressione <kbd className="px-1.5 py-0.5 text-xs font-semibold bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded">?</kbd> a qualquer momento para ver estes atalhos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
