# NBS Helper - MicroSaaS para NFS-e

> Ferramenta para busca rápida de códigos NBS 2.0 (Nomenclatura Brasileira de Serviços) para emissão de NFS-e.

![Status](https://img.shields.io/badge/status-Production-success)
![NBS](https://img.shields.io/badge/NBS-2.0-blue)
![Códigos](https://img.shields.io/badge/códigos-1237-orange)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎯 Sobre o Projeto

Emitir NFS-e exige o código correto da NBS (Nomenclatura Brasileira de Serviços). Encontrar esse código manualmente em tabelas PDF é lento e propenso a erros.

**NBS Helper** resolve este problema oferecendo:
- 🔍 Busca inteligente por descrição do serviço
- ⚡ Base completa com 1237 códigos oficiais NBS 2.0
- 📋 Copiar código/descrição com um clique
- ⭐ Sistema de favoritos para códigos frequentes
- 📱 Interface responsiva (desktop e mobile)

## 🚀 Instalação e Uso

### Pré-requisitos
- Node.js 18+ 
- npm ou pnpm

### Passos

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/nbs-helper.git
cd nbs-helper

# 2. Instale as dependências
npm install

# 3. Inicie o servidor de desenvolvimento
npm run dev:web
```

Acesse: **http://localhost:5173**

### Dados NBS
A base de dados já está processada e pronta para uso. Para atualizar com a versão mais recente do gov.br:  

```bash
npm run prepare:data
```

## 📁 Estrutura do Projeto

```
nbs-helper/
├── apps/
│   ├── web/          # Frontend React (Vite + Tailwind)
│   └── api/          # Backend Node.js (Express)
├── packages/
│   └── shared/       # Código compartilhado
├── scripts/          # Scripts de processamento
├── data/
│   ├── raw/          # CSV original do gov.br
│   └── generated/    # Dados processados (JSON)
├── docs/             # Documentação
└── package.json      # Configuração do workspace
```

## 🔧 Comandos Disponíveis

**Desenvolvimento:**
- `npm run dev:web` - Inicia servidor de desenvolvimento
- `npm run dev:api` - Inicia API em modo dev

**Build:**
- `npm run build:web` - Build para produção

**Dados:**
- `npm run prepare:data` - Atualiza base de dados NBS
- `npm run import:nbs` - Importa CSV
- `npm run build:index` - Gera índice de busca

## � Tecnologias

**Frontend:**
- React 18
- Vite 
- Tailwind CSS
- Fuse.js (busca fuzzy)
- Lucide React (ícones)

**Backend:**
- Node.js + Express
- CSV Parse
- Iconv-lite (encoding)

**Dados:**
- Base oficial NBS 2.0 (Ministério do Desenvolvimento)

## 🗺️ Roadmap

### ✅ Fase 1 - MVP (Concluído)
- [x] Importador de dados NBS 2.0
- [x] Webapp com busca inteligente
- [x] Interface responsiva
- [x] Sistema de favoritos local
- [x] API REST básica

### 🔄 Fase 2 - SaaS (Em andamento)
- [ ] Deploy em produção
- [ ] Analytics e métricas
- [ ] SEO otimizado

### 🎯 Fase 3 - Features Pro
- [ ] Autenticação (Google OAuth)
- [ ] Favoritos sincronizados na nuvem
- [ ] Templates por empresa/perfil
- [ ] Extensão de navegador
- [ ] Exportação de catálogos

## 📚 Documentação

- [Guia de Início](docs/GETTING_STARTED.md) - Como usar o projeto
- [Comandos](docs/COMANDOS.md) - Referência rápida
- [Troubleshooting](docs/TROUBLESHOOTING.md) - Solução de problemas
- [Deploy](docs/DEPLOY_GUIDE.md) - Guia de deploy
- [Índice Completo](docs/DOCS_INDEX.md) - Toda documentação

## ⚠️ Disclaimer

Esta é uma **ferramenta de apoio** para facilitar a busca de códigos NBS. Sempre confirme as informações com seu contador e verifique a legislação específica do seu município.

O projeto não coleta dados pessoais ou informações sensíveis dos usuários.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/NovaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona NovaFeature'`)
4. Push para a branch (`git push origin feature/NovaFeature`)
5. Abrir um Pull Request

## 📄 Licença

MIT License - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 📞 Suporte

Para reportar bugs ou sugerir melhorias, abra uma [issue](https://github.com/seu-usuario/nbs-helper/issues).

---

**Fonte dos dados:** [Ministério do Desenvolvimento, Indústria, Comércio e Serviços](https://www.gov.br/mdic/pt-br/assuntos/sdic/comercio-e-servicos/nbs-nomenclatura-brasileira-de-servicos)
