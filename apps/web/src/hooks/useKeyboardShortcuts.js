import { useEffect } from 'react';

/**
 * Hook para gerenciar atalhos de teclado globais
 * @param {Object} shortcuts - Objeto com mapeamento de atalhos e callbacks
 * @param {boolean} enabled - Se os atalhos estão ativos
 */
export function useKeyboardShortcuts(shortcuts, enabled = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event) => {
      // Ignorar se estiver digitando em um input/textarea (exceto para atalhos específicos)
      const isTyping = ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName);
      
      // Ctrl+K ou Cmd+K (Mac) - busca rápida
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        if (shortcuts.ctrlK) {
          shortcuts.ctrlK(event);
        }
        return;
      }

      // ESC - fechar/limpar
      if (event.key === 'Escape') {
        if (shortcuts.escape) {
          shortcuts.escape(event);
        }
        return;
      }

      // Ctrl+B ou Cmd+B - favoritos
      if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
        event.preventDefault();
        if (shortcuts.ctrlB) {
          shortcuts.ctrlB(event);
        }
        return;
      }

      // ArrowDown - navegação para baixo
      if (event.key === 'ArrowDown' && !isTyping) {
        if (shortcuts.arrowDown) {
          event.preventDefault();
          shortcuts.arrowDown(event);
        }
        return;
      }

      // ArrowUp - navegação para cima
      if (event.key === 'ArrowUp' && !isTyping) {
        if (shortcuts.arrowUp) {
          event.preventDefault();
          shortcuts.arrowUp(event);
        }
        return;
      }

      // Enter - confirmar
      if (event.key === 'Enter' && !isTyping) {
        if (shortcuts.enter) {
          shortcuts.enter(event);
        }
        return;
      }

      // ? - mostrar ajuda de atalhos
      if (event.key === '?' && !isTyping) {
        event.preventDefault();
        if (shortcuts.help) {
          shortcuts.help(event);
        }
        return;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts, enabled]);
}

/**
 * Hook simplificado para um único atalho
 * @param {string} key - Tecla do atalho
 * @param {Function} callback - Função a ser executada
 * @param {Object} options - Opções (ctrl, alt, shift)
 */
export function useKeyboardShortcut(key, callback, options = {}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const { ctrl, alt, shift, meta } = options;
      
      if (event.key !== key) return;
      if (ctrl && !event.ctrlKey) return;
      if (alt && !event.altKey) return;
      if (shift && !event.shiftKey) return;
      if (meta && !event.metaKey) return;
      
      event.preventDefault();
      callback(event);
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, options]);
}
