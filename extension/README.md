# 🧩 NBS Helper - Extensão de Navegador

> Extensão do Chrome/Edge/Firefox para acesso rápido aos códigos NBS 2.0 direto do navegador.

## 📦 Instalação

### Chrome / Edge / Brave

1. **Baixe ou clone este repositório**

   ```bash

   cd nbs-helper/extension
   ```

2. **Gere os ícones**
   - Abra `create-icons.html` no navegador
   - Clique em "Baixar Todos"
   - Mova os arquivos para a pasta `icons/`

3. **Instale a extensão**
   - Abra o Chrome/Edge
   - Acesse `chrome://extensions/` (ou `edge://extensions/`)
   - Ative o **Modo do desenvolvedor** (canto superior direito)
   - Clique em **"Carregar sem compactação"**
   - Selecione a pasta `extension/`

4. **Pronto!** 🎉
   - Clique no ícone da extensão na barra de ferramentas
   - Ou use o atalho `Ctrl+Shift+E` (pode ser configurado)

### Firefox

1. **Baixe ou clone este repositório**

2. **Gere os ícones** (mesmo processo do Chrome)

3. **Instale temporariamente**
   - Abra o Firefox
   - Acesse `about:debugging#/runtime/this-firefox`
   - Clique em **"Carregar extensão temporária..."**
   - Selecione o arquivo `manifest.json` na pasta `extension/`

> **Nota:** No Firefox, extensões temporárias são removidas ao fechar o navegador. Para instalação permanente, é necessário publicar na AMO (addons.mozilla.org).

## ✨ Funcionalidades

### 🔍 Busca Rápida

- Digite código ou descrição
- Resultados instantâneos (máx. 20)
- Busca em códigos, descrições e palavras-chave
- Debounce de 300ms para performance

### ⭐ Favoritos

- Salve códigos com 1 clique
- Acesso rápido na aba "Favoritos"
- Sincronização via `chrome.storage.local`
- Contador de favoritos no badge

### 🎨 Interface

- Design clean e moderno
- Dark mode automático
- 400x500px (compacto)
- Scrollbar personalizada
- Animações suaves

### 🔗 Integração

- Botão para abrir app completo
- Dados carregados do Vercel (sempre atualizados)
- Favoritos independentes do webapp

## 🛠️ Estrutura

```
extension/
├── manifest.json       # Configuração da extensão (Manifest V3)
├── popup.html          # Interface principal
├── popup.css           # Estilos (dark mode incluído)
├── popup.js            # Lógica (busca, favoritos)
├── create-icons.html   # Gerador de ícones
├── icons/              # Ícones 16x16, 48x48, 128x128
└── README.md           # Este arquivo
```

## 🎯 Como Usar

1. **Buscar código:**
   - Clique no ícone da extensão
   - Digite no campo de busca
   - Clique no resultado para ver detalhes

2. **Adicionar aos favoritos:**
   - Clique na estrela (⭐) ao lado do código
   - Estrela preenchida = favoritado

3. **Ver favoritos:**
   - Clique na aba "Favoritos"
   - Clique novamente na estrela para remover

4. **Abrir app completo:**
   - Clique no ícone 🔗 no canto superior direito
   - Ou acesse: https://nbs-helper-web.vercel.app

## 🔧 Desenvolvimento

### Testar alterações

1. Edite os arquivos (HTML/CSS/JS)
2. No navegador, vá em `chrome://extensions/`
3. Clique em 🔄 "Recarregar" na extensão
4. Abra a extensão novamente

### Debugar

1. Abra a extensão
2. Clique com botão direito → "Inspecionar"
3. Use o DevTools normalmente

### Customizar

**Alterar cores:**

- Edite as variáveis CSS em `popup.css` (`:root`)

**Mudar URL do app:**

- Edite `APP_URL` em `popup.js`

**Adicionar funcionalidades:**

- Edite `popup.js` (bem comentado)

## 📝 Permissões

A extensão solicita:

- `storage` - Salvar favoritos localmente
- `host_permissions` - Buscar dados do app (nbs-helper-web.vercel.app)

**Nenhuma permissão sensível!** Não coletamos dados do usuário.

## 🚀 Publicação (Opcional)

### Chrome Web Store

1. Crie conta de desenvolvedor ($5 único)
2. Empacote a extensão: `zip -r extension.zip extension/`
3. Envie em https://chrome.google.com/webstore/devconsole
4. Aguarde revisão (~3-5 dias)

### Firefox Add-ons (AMO)

1. Crie conta em https://addons.mozilla.org
2. Empacote: `zip -r extension.zip extension/`
3. Envie e aguarde revisão
4. Após aprovação, instalação permanente

## 🐛 Problemas Comuns

**Extensão não carrega:**

- Certifique-se de gerar os ícones primeiro
- Verifique se está na pasta correta
- Veja erros em `chrome://extensions/`

**Busca não funciona:**

- Verifique conexão com internet
- URL do dataset correto? (`APP_URL` em popup.js)
- Veja console (botão direito → Inspecionar)

**Favoritos não salvam:**

- Permissão `storage` concedida?
- Tente recarregar a extensão

## 📄 Licença

MIT - Veja LICENSE no repositório principal

## 👨‍💻 Autor

**Harlem Claumann Silva**

- Email: harlemclaumannsilva@gmail.com
- WhatsApp: +55 11 96774-5351

---

⭐ **Dica:** Fixe a extensão na barra de ferramentas para acesso mais rápido!
