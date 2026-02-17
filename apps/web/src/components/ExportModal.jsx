import { useState } from 'react';
import { Download, FileJson, FileSpreadsheet, Upload, X, CheckCircle } from 'lucide-react';
import { exportToCSV, exportToJSON, importFromJSON } from '../services/export';
import { trackEvent } from '../services/analytics';

export default function ExportModal({ favorites, onClose, onImport }) {
  const [importing, setImporting] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleExportCSV = () => {
    exportToCSV(favorites);
    trackEvent('export_favorites', {
      format: 'csv',
      count: favorites.length
    });
  };

  const handleExportJSON = () => {
    exportToJSON(favorites);
    trackEvent('export_favorites', {
      format: 'json',
      count: favorites.length
    });
  };

  const handleImportClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      setImporting(true);
      try {
        const importedFavorites = await importFromJSON(file);
        
        trackEvent('import_favorites', {
          count: importedFavorites.length,
          success: true
        });

        if (onImport) {
          onImport(importedFavorites);
        }
        
        setImportSuccess(true);
        setTimeout(() => {
          setImportSuccess(false);
          onClose();
        }, 2000);
      } catch (error) {
        alert(error.message);
        trackEvent('import_favorites', {
          success: false,
          error: error.message
        });
      } finally {
        setImporting(false);
      }
    };

    input.click();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full border border-gray-200 dark:border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Exportar Favoritos
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Info */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>{favorites.length}</strong> {favorites.length === 1 ? 'favorito' : 'favoritos'} {favorites.length === 1 ? 'salvo' : 'salvos'}
            </p>
          </div>

          {/* Export Options */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Escolha o formato:
            </h3>

            {/* CSV Button */}
            <button
              onClick={handleExportCSV}
              disabled={favorites.length === 0}
              className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700 disabled:hover:bg-transparent"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 dark:text-gray-100">CSV</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Compatível com Excel, Google Sheets
                </p>
              </div>
            </button>

            {/* JSON Button */}
            <button
              onClick={handleExportJSON}
              disabled={favorites.length === 0}
              className="w-full flex items-center gap-3 p-4 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-gray-200 dark:disabled:hover:border-gray-700 disabled:hover:bg-transparent"
            >
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <FileJson className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1 text-left">
                <p className="font-medium text-gray-900 dark:text-gray-100">JSON</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Backup completo, reimportar depois
                </p>
              </div>
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                ou
              </span>
            </div>
          </div>

          {/* Import Option */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Importar favoritos:
            </h3>

            <button
              onClick={handleImportClick}
              disabled={importing}
              className="w-full flex items-center gap-3 p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importSuccess ? (
                <>
                  <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-green-600 dark:text-green-400">
                      Importado com sucesso!
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <Upload className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {importing ? 'Importando...' : 'Importar de JSON'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Restaurar favoritos de backup anterior
                    </p>
                  </div>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors text-sm font-medium"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
