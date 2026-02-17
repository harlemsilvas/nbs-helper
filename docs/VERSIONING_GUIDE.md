# Guia de Versionamento - NBS Helper

## 📊 Análise da Versão Atual

### De: `0.0.0` → Para: `1.0.0` ✅ **RECOMENDADO**

### 🎯 Justificativa

O projeto saiu de um estado inicial de desenvolvimento (`0.0.0`) para um **produto completo e pronto para produção** com:

#### ✨ Funcionalidades Implementadas (32 componentes)

**Core Features:**

1. ✅ Busca fuzzy avançada (Fuse.js)
2. ✅ 1237 códigos NBS 2.0 processados
3. ✅ Sistema de favoritos local (LocalStorage)
4. ✅ Autenticação Firebase/Google
5. ✅ Sincronização de favoritos na nuvem (Firestore)
6. ✅ PWA completo (offline-first)
7. ✅ Service Worker com cache estratégico
8. ✅ **Sistema de versionamento automático**

**UI/UX Avançada:** 9. ✅ Dark mode com persistência 10. ✅ 10+ atalhos de teclado 11. ✅ Design responsivo (mobile-first) 12. ✅ Animações suaves 13. ✅ Acessibilidade (WCAG 2.1)

**Recursos Premium:** 14. ✅ Templates de descrições 15. ✅ Compartilhamento de favoritos via link 16. ✅ Exportação de dados (CSV/JSON) 17. ✅ Histórico de buscas (10 últimas) 18. ✅ Sistema de sugestões

**Modais & Diálogos (11):** 19. ✅ AuthModal - Autenticação 20. ✅ SyncModal - Sincronização 21. ✅ ExportModal - Exportação 22. ✅ TemplatesModal - Templates 23. ✅ ShareModal - Compartilhamento 24. ✅ ContactModal - Contato 25. ✅ HelpInfoModal - Ajuda 26. ✅ PrivacyPolicyModal - Privacidade 27. ✅ CookiePreferencesModal - Cookies 28. ✅ NBSImportanceModal - Importância NBS 29. ✅ LoginPromptModal - Prompt login 30. ✅ ConfirmDialog - Confirmações 31. ✅ **UpdateNotifier - Notificação de updates**

**Compliance & Analytics:** 32. ✅ LGPD compliant (cookies, privacidade) 33. ✅ Google Analytics integrado 34. ✅ AdSense configurado 35. ✅ Política de privacidade 36. ✅ Consentimento de cookies

### 📈 Métricas do Projeto

```
Total de Componentes:    32
Total de Serviços:       10+
Linhas de Código:        ~5000+
Arquivos Criados:        50+
Documentação:            15 docs
Estado:                  Produção Ready ✅
```

---

## 🎯 Decisão de Versionamento

### Opções Analisadas:

#### Opção 1: `0.0.0` → `1.0.0` ⭐ **RECOMENDADO**

**Quando usar:** Primeira versão de produção oficial

✅ **Vantagens:**

- Indica que saiu de "desenvolvimento" para "produção"
- Versão 1.0.0 transmite estabilidade e confiança
- Alinha com semantic versioning
- Este é um produto COMPLETO, não um beta

❌ **Desvantagens:**

- Nenhuma (é o padrão correto!)

**Use este comando:**

```bash
cd apps/web
npm version 1.0.0  # Define explicitamente
```

---

#### Opção 2: `0.0.0` → `0.1.0` ⚠️ **NÃO RECOMENDADO**

**Quando usar:** Se ainda considera versão beta/desenvolvimento

❌ **Desvantagens:**

- Versão 0.x.x indica "instável" ou "beta"
- Subestima a completude do projeto
- Com 32 componentes e todas as features, não é beta

**Pule esta opção!**

---

#### Opção 3: `0.0.0` → `2.0.0` ⚠️ **MUITO AGRESSIVO**

**Quando usar:** Se já teve uma v1.0.0 (não é o caso)

❌ **Desvantagens:**

- Pula a versão 1.0.0
- Confuso para usuários
- Versão 2 implica "segunda geração"

**Não use!**

---

## 📋 Checklist de Versionamento

Use este checklist antes de cada deploy para decidir MAJOR, MINOR ou PATCH.

### 🔴 MAJOR Version (X.0.0) - Breaking Changes

Aumente o MAJOR quando:

- [ ] Mudou API pública de forma incompatível
- [ ] Removeu funcionalidades que os usuários usavam
- [ ] Alterou comportamento esperado drasticamente
- [ ] Mudou estrutura de dados (favoritos, etc.)
- [ ] Requer migração manual dos usuários
- [ ] Mudanças da Firebase que quebram compatibilidade

**Exemplos:**

- `1.0.0 → 2.0.0`: Mudou de LocalStorage para Firestore obrigatório
- `2.0.0 → 3.0.0`: Mudou formato de exportação CSV
- `3.0.0 → 4.0.0`: Removeu suporte a navegadores antigos

---

### 🟡 MINOR Version (x.Y.0) - New Features

Aumente o MINOR quando:

- [ ] Adicionou nova funcionalidade importante
- [ ] Novo modal ou componente significativo
- [ ] Nova integração (ex: novo método de login)
- [ ] Melhorias substanciais na UI
- [ ] Novos atalhos de teclado
- [ ] Nova página ou seção
- [ ] Compatível com versão anterior

**Exemplos:**

- `1.0.0 → 1.1.0`: Adicionou sistema de templates
- `1.1.0 → 1.2.0`: Adicionou compartilhamento de favoritos
- `1.2.0 → 1.3.0`: Adicionou dark mode
- `1.3.0 → 1.4.0`: Adicionou exportação de dados
- `1.4.0 → 1.5.0`: Adicionou UpdateNotifier (acabamos de fazer!)

---

### 🟢 PATCH Version (x.y.Z) - Bug Fixes

Aumente o PATCH quando:

- [ ] Corrigiu bugs sem adicionar features
- [ ] Melhorias de desempenho
- [ ] Correções de texto/typos
- [ ] Ajustes de CSS/estilo
- [ ] Correções de segurança menores
- [ ] Atualizações de dependências
- [ ] Refatoração interna sem impacto externo

**Exemplos:**

- `1.0.0 → 1.0.1`: Corrigido bug de busca vazia
- `1.0.1 → 1.0.2`: Corrigido problema de autenticação
- `1.0.2 → 1.0.3`: Ajustado padding dos cards
- `1.0.3 → 1.0.4`: Atualizado Firebase para versão segura

---

## 🚀 Workflow Recomendado

### 1️⃣ Antes de Fazer Deploy

```bash
# 1. Analise suas mudanças
git diff main

# 2. Conte quantos arquivos mudaram
git status

# 3. Use o checklist acima para decidir:
#    - MAJOR? MINOR? PATCH?
```

### 2️⃣ Atualize o CHANGELOG

```bash
# Edite CHANGELOG.md
nano CHANGELOG.md

# Adicione suas mudanças na seção [Unreleased]
```

### 3️⃣ Bump da Versão

```bash
cd apps/web

# Escolha UMA opção:
npm version patch   # 1.0.0 → 1.0.1 (bug fixes)
npm version minor   # 1.0.0 → 1.1.0 (new features)
npm version major   # 1.0.0 → 2.0.0 (breaking changes)

# Ou defina manualmente:
npm version 1.0.0
```

### 4️⃣ Atualize CHANGELOG com a versão

```bash
# Mova [Unreleased] para [1.x.x] - YYYY-MM-DD
nano CHANGELOG.md
```

### 5️⃣ Commit e Deploy

```bash
git add .
git commit -m "chore: bump version to 1.x.x"
git push

# Deploy automático via Vercel
```

---

## 📊 Histórico de Decisões de Versão

### Versão Atual: `1.0.0` (06/02/2026)

**Mudanças desde 0.0.0:**

- ✨ 32 componentes implementados
- ✨ Sistema completo de favoritos + sincronização
- ✨ PWA com service worker
- ✨ Autenticação Firebase
- ✨ Dark mode
- ✨ Atalhos de teclado
- ✨ Templates, compartilhamento, exportação
- ✨ Sistema de versionamento automático
- ✨ LGPD compliance
- ✨ Analytics e AdSense

**Decisão:** `npm version 1.0.0`  
**Tipo:** MAJOR (primeira versão de produção)  
**Razão:** Produto completo e pronto para lançamento oficial

---

### Próximas Versões Planejadas

#### v1.1.0 (Planejado)

**Tipo:** MINOR

- [ ] Notificações push
- [ ] PWA install badge
- [ ] Mais templates

#### v1.0.1 (Hotfix se necessário)

**Tipo:** PATCH

- [ ] Correções de bugs reportados
- [ ] Ajustes de performance

---

## 🎓 Exemplos Práticos

### Exemplo 1: Adicionou novo modal de "Histórico"

```bash
# Nova funcionalidade → MINOR
npm version minor  # 1.0.0 → 1.1.0
```

### Exemplo 2: Corrigiu bug no dark mode

```bash
# Bug fix → PATCH
npm version patch  # 1.0.0 → 1.0.1
```

### Exemplo 3: Mudou Firebase para Auth0 (requer relogin)

```bash
# Breaking change → MAJOR
npm version major  # 1.0.0 → 2.0.0
```

### Exemplo 4: Melhorou algoritmo de busca (sem breaking)

```bash
# Melhoria interna → PATCH
npm version patch  # 1.0.0 → 1.0.1
```

---

## ⚡ Quick Reference

| Mudança                    | Tipo  | Comando             | Exemplo       |
| -------------------------- | ----- | ------------------- | ------------- |
| 🔴 Quebra compatibilidade  | MAJOR | `npm version major` | 1.0.0 → 2.0.0 |
| 🟡 Nova funcionalidade     | MINOR | `npm version minor` | 1.0.0 → 1.1.0 |
| 🟢 Bug fix / Melhoria      | PATCH | `npm version patch` | 1.0.0 → 1.0.1 |
| 🎯 Primeira versão oficial | MAJOR | `npm version 1.0.0` | 0.0.0 → 1.0.0 |

---

## 🎯 Recomendação Final

### Para o deploy AGORA:

```bash
cd apps/web
npm version 1.0.0
git add package.json
git commit -m "chore: release v1.0.0 - primeira versão de produção

- 32 componentes implementados
- Sistema completo de favoritos e sincronização
- PWA com versionamento automático
- Autenticação e analytics
- LGPD compliance"

git tag -a v1.0.0 -m "Versão 1.0.0 - Release Oficial"
git push origin main --tags
```

### Para próximos deploys:

1. 📝 Consulte o checklist acima
2. 🤔 Pergunte-se: "Isso quebra algo existente?"
   - ✅ Sim → MAJOR
   - ❌ Não → Prossiga
3. 🤔 Pergunte-se: "Isso adiciona funcionalidade nova?"
   - ✅ Sim → MINOR
   - ❌ Não → PATCH

---

**Última atualização:** 06/02/2026  
**Versão recomendada:** 1.0.0  
**Próxima versão planejada:** 1.1.0 (minor)
