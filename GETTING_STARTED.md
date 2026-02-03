# MVP NBS Helper - Instruções de Uso

## ✅ Setup Completo!

Seu MVP está funcionando! Aqui está o que foi criado:

### 📂 Estrutura
```
nbs-helper/
├── apps/
│   ├── web/          ✅ React + Vite + Tailwind (rodando em http://localhost:5173)
│   └── api/          ✅ Express API (pronta para rodar)
├── scripts/          ✅ Importadores CSV
├── data/
│   ├── raw/          ✅ NBSa_2-0.csv (1237 códigos)
│   └── generated/    ✅ index.json gerado
```

## 🚀 Como Usar

### 1. Webapp (já rodando!)
```bash
npm run dev:web
```
Acesse: **http://localhost:5173**

**Funcionalidades:**
- ✅ Busca inteligente por descrição
- ✅ 1237 códigos NBS 2.0 disponíveis
- ✅ Copiar código/descrição com 1 clique
- ✅ Favoritos (salvo no navegador)
- ✅ Interface responsiva

### 2. API (opcional)
```bash
npm run dev:api
```
Acesse: **http://localhost:3001**

**Endpoints:**
- `GET /health` - Status da API
- `GET /search?q=software` - Buscar códigos
- `GET /item/:code` - Código específico
- `GET /meta` - Metadados

### 3. Atualizar dados NBS
```bash
# Baixar novo CSV e processar
npm run prepare:data
```

## 📋 Checklist MVP Semana 1

- [x] Estrutura do projeto criada
- [x] CSV importado (1237 itens)
- [x] Índice de busca gerado
- [x] Webapp funcionando
- [x] Busca inteligente (Fuse.js)
- [x] Copiar código/descrição
- [x] Favoritos locais (LocalStorage)
- [x] Interface com Tailwind
- [x] API REST básica

## 🎯 Próximos Passos (Semana 2)

1. **Deploy do Webapp (Vercel)**
   ```bash
   cd apps/web
   npm run build
   # Deploy no Vercel
   ```

2. **Deploy da API (Render/Railway)**
   ```bash
   cd apps/api
   # Configurar deploy
   ```

3. **Conectar webapp à API** (trocar busca local por chamadas à API)

## 🛠️ Comandos Úteis

```bash
# Root
npm run prepare:data    # Importar + gerar índice
npm run dev:web         # Rodar webapp
npm run dev:api         # Rodar API

# Webapp
cd apps/web
npm run build          # Build para produção
npm run preview        # Preview do build

# API
cd apps/api
npm start             # Produção
npm run dev           # Desenvolvimento
```

## 📝 Testando o Webapp

Abra **http://localhost:5173** e teste:

1. **Busca básica**: Digite "software" ou "consultoria"
2. **Favoritos**: Clique na estrela para favoritar
3. **Copiar**: Use os botões de copiar código/descrição
4. **Ver favoritos**: Clique no botão "Favoritos"

## 🎨 Personalizações

### Mudar cores (Tailwind)
Edite: `apps/web/tailwind.config.js`

### Ajustar busca
Edite: `apps/web/src/services/searchLocal.js`

### Adicionar campos
Edite: `scripts/import_nbs_node.js`

## 🐛 Problemas?

### Webapp não abre
```bash
cd apps/web
rm -rf node_modules
npm install
npm run dev
```

### Dados não aparecem
```bash
# Regenerar índice
npm run prepare:data
# Copiar para public
cp data/generated/index.json apps/web/public/
```

### API não inicia
```bash
cd apps/api
npm install
npm run dev
```

## 📊 Dados

- **Fonte**: https://www.gov.br/mdic/pt-br/assuntos/sdic/comercio-e-servicos/nbs-nomenclatura-brasileira-de-servicos
- **CSV**: NBSa_2-0.csv (1237 códigos)
- **Versão**: NBS 2.0
- **Formato**: Código + Descrição + Nível

## 🚨 Avisos Importantes

⚠️ **Ferramenta de apoio** - Sempre confirme com contador e legislação municipal  
🔒 **Privacidade** - Não coleta dados do usuário  
📱 **Responsivo** - Funciona em desktop e mobile  

---

**Parabéns! Seu MVP está funcionando! 🎉**

Próximo: Deploy e monetização (Semana 2)
