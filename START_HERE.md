# 👋 Guia de Início Rápido - NBS Helper

> Ferramenta para busca de códigos NBS 2.0 para emissão de NFS-e

## ⚡ Início Rápido (30 segundos)

```bash
npm install
npm run dev:web
```

Acesse: **http://localhost:5173**

---

## 🎯 O Que Este Projeto Oferece

## 🎯 O Que Este Projeto Oferece

✅ **1237 códigos NBS 2.0** processados da base oficial  
✅ **Busca inteligente** com algoritmo fuzzy  
✅ **Interface moderna** com React + Tailwind  
✅ **Sistema de favoritos** para códigos frequentes  
✅ **API REST** para integração  
✅ **Documentação completa**  

---

## 📚 Documentação

### Primeiros Passos
1. **[README.md](README.md)** - Visão geral do projeto
2. **[docs/GETTING_STARTED.md](docs/GETTING_STARTED.md)** - Guia completo
3. **[docs/DEPLOY_GUIDE.md](docs/DEPLOY_GUIDE.md)** - Como fazer deploy

### Referência
- **[docs/COMANDOS.md](docs/COMANDOS.md)** - Comandos úteis
- **[docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** - Soluções de problemas
- **[docs/DOCS_INDEX.md](docs/DOCS_INDEX.md)** - Índice completo

---

## 🧪 Testando o Projeto

1. **Acesse:** http://localhost:5173
2. **Busque:** Digite "software" ou "consultoria"
3. **Copie:** Clique no botão de copiar código
4. **Favorite:** Clique na estrela ⭐
5. **Veja favoritos:** Botão "Favoritos" no topo

✅ Se tudo funcionou, seu MVP está perfeito!

---

## 📊 Recursos Implementados

| Recurso | Status |
|---------|--------|
| Base de dados NBS 2.0 | ✅ 1237 códigos |
| Busca inteligente | ✅ Funcionando |
| Sistema de favoritos | ✅ LocalStorage |
| Copiar código/descrição | ✅ Implementado |
| API REST | ✅ Disponível |
| Interface responsiva | ✅ Mobile-ready |
| Documentação | ✅ Completa |

---

## 🚀 Próximas Etapas

## 🚀 Próximas Etapas

### Desenvolvimento
```bash
# Iniciar servidor
npm run dev:web

# Rodar API
npm run dev:api

# Atualizar base NBS
npm run prepare:data

# Build para produção
npm run build:web
```

### Deploy
Consulte [docs/DEPLOY_GUIDE.md](docs/DEPLOY_GUIDE.md) para instruções de deploy na Vercel.

---

## 🎯 Roadmap

### Fase Atual
1. ✅ Testar todas as funcionalidades
2. ✅ Revisar documentação
3. ⏳ Deploy em produção

### Próximas Features
- Autenticação de usuários
- Favoritos sincronizados
- Templates por empresa
- Extensão de navegador

---

## 🐛 Problemas Comuns

### Webapp não inicia
```bash
npm install
npm run dev:web
```

### Busca não retorna resultados
Verifique se o índice existe:
```bash
ls apps/web/public/index.json
```

Se não existir:
```bash
cp data/generated/index.json apps/web/public/
```

### Mais ajuda
Consulte [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)

---

## 📁 Estrutura

```
nbs-helper/
├── apps/
│   ├── web/          # Frontend React
│   └── api/          # Backend Express
├── data/
│   ├── raw/          # CSV oficial
│   └── generated/    # Dados processados
├── scripts/          # Processamento de dados
├── docs/             # Documentação
└── packages/shared/  # Código compartilhado
```

---

## 💡 Recursos do Projeto

### Tecnologias
- Monorepo com npm workspaces
- React 18 + Vite
- Tailwind CSS
- Fuse.js (busca fuzzy)
- Express (API REST)
- LocalStorage (favoritos)

### Funcionalidades
- Busca em tempo real
- Interface responsiva
- Favoritos persistentes
- Copiar com um clique
- 1237 códigos NBS processados

---

## 📞 Suporte

| Preciso de... | Veja |
|---------------|------|
| Começar | Este arquivo |
| Comandos | [docs/COMANDOS.md](docs/COMANDOS.md) |
| Problemas | [docs/TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md) |
| Deploy | [docs/DEPLOY_GUIDE.md](docs/DEPLOY_GUIDE.md) |
| Tudo | [docs/DOCS_INDEX.md](docs/DOCS_INDEX.md) |

---

**Desenvolvido com base em dados oficiais do Ministério do Desenvolvimento, Indústria, Comércio e Serviços**
