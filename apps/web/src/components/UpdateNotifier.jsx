import { RefreshCw, X } from "lucide-react";
import { useRegisterSW } from "virtual:pwa-register/react";

export default function UpdateNotifier() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log("SW Registered: " + r);

      // Verifica por atualizações a cada 60 segundos
      r &&
        setInterval(() => {
          r.update();
        }, 60000);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
  });

  const handleUpdate = () => {
    updateServiceWorker(true);
  };

  const handleClose = () => {
    setNeedRefresh(false);
  };

  if (!needRefresh) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-2xl p-4 max-w-sm border border-blue-500">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0">
            <RefreshCw className="w-6 h-6 text-blue-100" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg mb-1">
              Nova versão disponível! 🎉
            </h3>
            <p className="text-sm text-blue-50 mb-3">
              Uma atualização do app está pronta. Clique em atualizar para obter
              as novidades e melhorias.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleUpdate}
                className="flex-1 bg-white text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-md font-medium transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Atualizar agora
              </button>
              <button
                onClick={handleClose}
                className="bg-blue-800 hover:bg-blue-900 px-3 py-2 rounded-md transition-colors duration-200"
                title="Fechar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
