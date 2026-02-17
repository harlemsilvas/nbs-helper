# Atalhos de Teclado - NBS Helper

Esta documentação descreve todos os atalhos de teclado disponíveis no NBS Helper para uma navegação mais rápida e eficiente.

## Atalhos Globais

Estes atalhos funcionam em qualquer lugar da aplicação:

### `Ctrl + K` (ou `⌘ + K` no Mac)
**Ação:** Focar no campo de busca  
**Descrição:** Ativa imediatamente o campo de busca, permitindo que você comece a digitar sem precisar clicar. Se houver sugestões de histórico, elas serão exibidas automaticamente.

### `Ctrl + B` (ou `⌘ + B` no Mac)
**Ação:** Abrir/Fechar favoritos  
**Descrição:** Alterna a visualização de favoritos. Se estiver na busca normal, exibe seus favoritos. Se estiver vendo favoritos, volta para a busca.

### `Esc`
**Ação:** Fechar dropdown ou modal  
**Descrição:** Fecha o dropdown de sugestões de busca ou o modal de ajuda de atalhos (se estiver aberto).

### `?`
**Ação:** Mostrar ajuda de atalhos  
**Descrição:** Abre um modal com a lista completa de atalhos de teclado disponíveis. Pressione `Esc` ou clique fora para fechar.

## Atalhos de Navegação

Estes atalhos funcionam quando o dropdown de sugestões de busca está aberto:

### `↓` (Seta para baixo)
**Ação:** Navegar para a próxima sugestão  
**Descrição:** Move a seleção para a próxima sugestão na lista de histórico de buscas.

### `↑` (Seta para cima)
**Ação:** Navegar para a sugestão anterior  
**Descrição:** Move a seleção para a sugestão anterior na lista de histórico de buscas.

### `Enter`
**Ação:** Selecionar sugestão destacada  
**Descrição:** Se uma sugestão estiver destacada (navegando com as setas), pressionar Enter seleciona essa sugestão e executa a busca.

## Implementação Técnica

### Hook Personalizado
Os atalhos são gerenciados através de um hook React customizado:

```javascript
// hooks/useKeyboardShortcuts.js
useKeyboardShortcuts({
  ctrlK: () => focusSearch(),
  ctrlB: () => toggleFavorites(),
  escape: () => closeDropdown(),
  help: () => showHelp()
});
```

### Rastreamento no Google Analytics
Todos os atalhos de teclado são rastreados no Google Analytics 4:

- `keyboard_shortcut` - Evento genérico com parâmetros:
  - `shortcut`: Nome da tecla/combinação usada
  - `action`: Ação executada (focus_search, toggle_favorites, etc.)

### Eventos Rastreados

| Atalho | Shortcut | Action |
|--------|----------|--------|
| Ctrl+K | `ctrl_k` | `focus_search` |
| Ctrl+B | `ctrl_b` | `toggle_favorites` |
| Esc | `escape` | `close_suggestions` |
| ↓ | `arrow_down` | `navigate_suggestions` |
| ↑ | `arrow_up` | `navigate_suggestions` |
| Enter | `enter` | `select_suggestion` |
| ? | `help` | `show_shortcuts` |

## Componentes Relacionados

### KeyboardShortcutsHelp
Modal que exibe a lista de atalhos disponíveis:
- **Localização:** `/apps/web/src/components/KeyboardShortcutsHelp.jsx`
- **Ativação:** Pressione `?` ou clique no botão "Atalhos" no header
- **Características:**
  - Design responsivo
  - Suporte a dark mode
  - Teclas visualizadas com estilo `<kbd>`
  - Fecha com `Esc` ou clique fora

### SearchBar
Componente de busca com suporte a navegação por teclado:
- **Localização:** `/apps/web/src/components/SearchBar.jsx`
- **Características:**
  - `forwardRef` para permitir foco programático
  - `useImperativeHandle` para expor método `focus()`
  - Handler `onKeyDown` para navegação com setas
  - Destaque visual da sugestão selecionada

### App
Componente principal que coordena os atalhos globais:
- **Localização:** `/apps/web/src/App.jsx`
- **Características:**
  - Hook `useKeyboardShortcuts` para atalhos globais
  - Ref para o SearchBar
  - Estado para controlar modal de ajuda

## Acessibilidade

### Indicadores Visuais
- Sugestões selecionadas com navegação por teclado têm destaque visual (background azul)
- Teclas no modal de ajuda são exibidas com elemento `<kbd>` semântico
- Botão de ajuda no header com título explicativo

### Compatibilidade
- **Windows/Linux:** Usa `Ctrl` como tecla modificadora
- **macOS:** Detecta automaticamente `⌘` (Command) como tecla modificadora
- **Suporte a navegadores:** Testado em Chrome, Firefox, Safari e Edge

## Dicas de Uso

1. **Busca Rápida:** Use `Ctrl+K` para começar a buscar imediatamente, sem tirar as mãos do teclado
2. **Histórico Eficiente:** Navegue pelo histórico com `↑` e `↓` e selecione com `Enter`
3. **Favoritos Rápidos:** Alterne entre busca e favoritos com `Ctrl+B`
4. **Limpeza Rápida:** Use `Esc` para fechar dropdowns e voltar ao estado inicial
5. **Ajuda Sempre Disponível:** Pressione `?` a qualquer momento para ver todos os atalhos

## Performance

- Listeners de teclado são adicionados/removidos corretamente para evitar memory leaks
- Atalhos não interferem em campos de entrada (exceto os globais como `Ctrl+K`)
- Debouncing automático para evitar múltiplas execuções
- Zero impacto no bundle size (< 5KB total)

## Roadmap Futuro

Possíveis melhorias para versões futuras:

- [ ] `Ctrl+1-9` - Selecionar resultado direto pelo número
- [ ] `Ctrl+C` - Copiar código do primeiro resultado
- [ ] `Alt+↑/↓` - Navegar entre páginas de resultados
- [ ] `Ctrl+F` - Abrir busca avançada (filtros)
- [ ] Personalização de atalhos pelo usuário
- [ ] Modo vim/emacs para power users
