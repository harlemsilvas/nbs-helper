# 🏗️ Arquitetura Proxy - NBS Helper

## Visão Geral

O NBS Helper usa uma arquitetura de **proxy reverso** no Vercel para servir múltiplos projetos sob um domínio único.

```
┌─────────────────────────────────────────────────────────────┐
│                   nbs-helper.vercel.app                     │
│                     (Landing + Proxy)                        │
└─────────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                 │                 │
        ▼                 ▼                 ▼
    ┌───────┐       ┌─────────┐      ┌─────────┐
    │   /   │       │  /app   │      │  /api   │
    └───────┘       └─────────┘      └─────────┘
        │                 │                 │
        ▼                 ▼                 ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   Landing    │  │   Web App    │  │   Backend    │
│   (HTML)     │  │  (React SPA) │  │  (Express)   │
└──────────────┘  └──────────────┘  └──────────────┘
     Serve            Rewrite          Rewrite
  diretamente      nbs-helper-web   nbs-helper-api
```

## Componentes

### 1. Landing Page (Proxy Layer)

**Localização:** `/landing`

**Responsabilidades:**

- Serve página inicial (`/`)
- Atua como proxy reverso (`/app`, `/api`)
- SEO e marketing

**Deploy:**

```bash
cd landing
vercel --prod
```

**URL:** `https://nbs-helper.vercel.app`

### 2. Web App (React SPA)

**Localização:** `/apps/web`

**Responsabilidades:**

- Interface do usuário
- Busca de códigos NBS
- Favoritos e sincronização
- PWA (funciona offline)

**Deploy:**

```bash
cd apps/web
npm run build
vercel --prod
```

**URLs:**

- Direct: `https://nbs-helper-web.vercel.app`
- Via Proxy: `https://nbs-helper.vercel.app/app`

### 3. API Backend

**Localização:** `/apps/api`

**Responsabilidades:**

- Endpoints REST
- Autenticação
- Sincronização de dados

**Deploy:**

```bash
cd apps/api
vercel --prod
```

**URLs:**

- Direct: `https://nbs-helper-api.vercel.app`
- Via Proxy: `https://nbs-helper.vercel.app/api`

## Configuração Técnica

### Rewrites (landing/vercel.json)

```json
{
  "rewrites": [
    {
      "source": "/app",
      "destination": "https://nbs-helper-web.vercel.app"
    },
    {
      "source": "/app/:path*",
      "destination": "https://nbs-helper-web.vercel.app/:path*"
    },
    {
      "source": "/api/:path*",
      "destination": "https://nbs-helper-api.vercel.app/:path*"
    }
  ]
}
```

### Base Path (apps/web/vite.config.js)

```javascript
export default defineConfig({
  base: "/app/", // Assets servidos de /app/assets/...
  // ...
});
```

### PWA Start URL (apps/web/vite.config.js)

```javascript
manifest: {
  start_url: "/app/",  // PWA inicia em /app
  // ...
}
```

## Fluxo de Dados

### Cenário 1: Usuário acessa Landing

```
1. GET https://nbs-helper.vercel.app/
2. Vercel serve landing/index.html diretamente
3. Browser renderiza landing page
4. Usuário clica "Acessar App"
5. Redireciona para /app
```

### Cenário 2: Usuário acessa App

```
1. GET https://nbs-helper.vercel.app/app
2. Vercel verifica vercel.json
3. Match: /app → rewrite para nbs-helper-web.vercel.app
4. Vercel busca conteúdo do projeto Web
5. Retorna HTML mantendo URL original
6. Browser carrega assets de /app/assets/...
```

### Cenário 3: App faz chamada API

```
1. fetch('/api/favorites')
2. Browser envia: GET https://nbs-helper.vercel.app/api/favorites
3. Vercel match: /api/* → rewrite para nbs-helper-api.vercel.app/favorites
4. API processa e responde
5. Vercel retorna resposta ao browser
```

## Vantagens

### ✅ SEO

- Landing page na raiz (`/`) otimizada para Google
- URLs limpas e amigáveis
- Meta tags específicas por seção

### ✅ Performance

- Landing ultra-leve (HTML puro)
- App em CDN global Vercel
- Cache independente por projeto

### ✅ Desenvolvimento

- Projetos isolados (commits separados)
- Deploys independentes
- Fácil debug (URLs diretas disponíveis)

### ✅ Manutenção

- Atualizar Web sem afetar Landing
- Rollback seletivo por projeto
- Logs separados no Vercel

### ✅ Escalabilidade

- Adicionar novos projetos com novos rewrites
- Ex: `/blog` → projeto separado de blog
- Ex: `/docs` → documentação Docusaurus

## Desvantagens (Trade-offs)

### ⚠️ Complexidade Inicial

- Configuração de 3 projetos no Vercel
- Entender rewrites vs redirects
- Base path em assets

**Mitigação:** Documentação completa (este arquivo)

### ⚠️ Latência Adicional

- Pequeno overhead do proxy reverso (~10-50ms)

**Mitigação:** Vercel Edge Network minimiza latência

### ⚠️ Debugging

- Erros podem vir de múltiplas origens

**Mitigação:** URLs diretas disponíveis para debug

## Alternativas Consideradas

### ❌ Monorepo com Next.js

**Por que não:**

- Vite é mais leve que Next.js
- Não precisamos SSR
- PWA offline-first é prioridade

### ❌ Subdomínios

```
app.nbshelper.com → Web
api.nbshelper.com → API
```

**Por que não:**

- Complica cookies/sessões (CORS)
- URLs menos amigáveis
- Múltiplos certificados SSL

### ❌ Tudo em um projeto

Landing + Web + API em um único Vercel project

**Por que não:**

- Build time lento
- Deploys acoplados
- Difícil manutenção

## Troubleshooting

### Problema: 404 em /app

**Causa:** Landing não deployada ou vercel.json incorreto

**Solução:**

```bash
cd landing
vercel --prod
```

### Problema: Assets não carregam

**Causa:** Base path não configurado no Vite

**Solução:**

```javascript
// apps/web/vite.config.js
export default defineConfig({
  base: "/app/", // ← verificar
});
```

### Problema: PWA não instala

**Causa:** start_url incorreto

**Solução:**

```javascript
// apps/web/vite.config.js
manifest: {
  start_url: "/app/",  // ← verificar
}
```

### Problema: CORS em API

**Causa:** Requisições vindas de origem diferente

**Solução:**

```javascript
// apps/api/server.js
app.use(
  cors({
    origin: ["https://nbs-helper.vercel.app"],
    credentials: true,
  }),
);
```

## Evolução Futura

### Fase 1: ✅ Atual (MVP)

- Landing estática
- Web SPA
- API básica

### Fase 2: 🔄 Planejado

- [ ] Blog em `/blog` (outro projeto)
- [ ] Docs em `/docs` (Docusaurus)
- [ ] Admin em `/admin` (protegido)

### Fase 3: 💡 Ideias

- [ ] Analytics dashboard em `/analytics`
- [ ] A/B testing na landing
- [ ] Multi-idioma (i18n proxy)

## Monitoramento

### Métricas Importantes

- **Latência do Proxy:** <100ms target
- **Cache Hit Rate:** >90% target
- **Error Rate:** <0.1% target

### Ferramentas

- Vercel Analytics (built-in)
- Google Analytics (landing + web)
- Sentry (web app errors)

## Referências

- [Vercel Rewrites Docs](https://vercel.com/docs/projects/project-configuration#rewrites)
- [Vite Base Path](https://vitejs.dev/config/shared-options.html#base)
- [Proxy Pattern](https://en.wikipedia.org/wiki/Proxy_pattern)
- [Reverse Proxy](https://en.wikipedia.org/wiki/Reverse_proxy)

---

**Autor:** Documentação técnica NBS Helper  
**Última atualização:** 06/02/2026  
**Versão:** 1.0.0
