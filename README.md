# NBS Helper - MicroSaaS para NFS-e

> 🚀 **MVP COMPLETO E FUNCIONANDO!** Ferramenta para busca rápida de códigos NBS 2.0 (Nomenclatura Brasileira de Serviços) para emissão de NFS-e.

![Status](https://img.shields.io/badge/status-MVP%20Completo-success)
![NBS](https://img.shields.io/badge/NBS-2.0-blue)
![Códigos](https://img.shields.io/badge/códigos-1237-orange)

## 🎯 Problema Resolvido

Encontrar o código NBS correto para emissão de NFS-e é demorado e confuso. Esta ferramenta resolve isso com:
- 🔍 Busca inteligente por descrição
- ⚡ 1237 códigos NBS 2.0 disponíveis
- 📋 Copiar código/descrição com 1 clique
- ⭐ Sistema de favoritos
- 📱 Interface responsiva

## 🚀 Quick Start

```bash
# 1. Instalar dependências
npm install

# 2. Já está tudo pronto! Rodar webapp
npm run dev:web
```

**Acesse:** http://localhost:5173 🎉

### Dados já processados
✅ CSV oficial baixado (1237 códigos)  
✅ Índice de busca gerado  
✅ Webapp funcionando  

## 📁 Estrutura

```
nbs-helper/
├── apps/
│   ├── web/          # React webapp (Vite)
│   └── api/          # Node.js API (Express)
├── packages/
│   └── shared/       # Tipos e utils compartilhados
├── scripts/          # Scripts de importação
├── data/
│   ├── raw/          # CSV original
│   └── generated/    # JSON processado
└── package.json      # Workspace root
```

## 📦 Scripts Disponíveis

- `npm run import:nbs` - Importa CSV da NBS para JSON
- `npm run build:index` - Gera índice de busca
- `npm run prepare:data` - Executa importação + índice
- `npm run dev:web` - Inicia webapp em dev
- `npm run dev:api` - Inicia API em dev

## 🔧 Tecnologias

- **Frontend**: React + Vite + Tailwind CSS + Fuse.js
- **Backend**: Node.js + Express
- **Dados**: CSV oficial NBS 2.0 (gov.br)

## 📝 Roadmap

### ✅ Semana 1 - MVP Local (COMPLETO!)
- [x] Estrutura do projeto
- [x] Importador CSV funcionando (1237 códigos)
- [x] Webapp com busca inteligente
- [x] Interface responsiva com Tailwind
- [x] Favoritos local
- [x] API REST básica

### 🔄 Semana 2 - MVP SaaS
- [ ] Deploy webapp (Vercel)
- [ ] Deploy API (Render/Railway)
- [ ] Conectar webapp à API

### 🎯 30 dias - Produto Pro
- [ ] Login (Google OAuth)
- [ ] Favoritos na nuvem
- [ ] Templates por empresa
- [ ] Extensão do navegador

## 🎯 Como Testar

1. **Webapp já está rodando:** http://localhost:5173
2. **Teste a busca:** Digite "software", "consultoria", "desenvolvimento"
3. **Favoritos:** Clique na estrela para adicionar aos favoritos
4. **Copiar:** Use os botões para copiar código ou descrição

## 📚 Documentação

- [GETTING_STARTED.md](GETTING_STARTED.md) - Guia completo de uso
- [Projeto.md](Projeto.md) - Plano detalhado do MVP
- [Ideia.md](Ideia.md) - Conceito e estratégia

## 🚨 Avisos

⚠️ **Ferramenta de apoio** - Sempre confirme com seu contador e a legislação municipal  
🔒 **Privacidade** - Não coleta dados sensíveis do usuário  
📱 **Responsivo** - Funciona em desktop e mobile

## 📄 Licença

MIT
