# 🚀 Quick Deploy Checklist

## ✅ Antes do Próximo Deploy

### 1️⃣ Classifique suas mudanças

**Você fez alguma dessas coisas?**

#### 🔴 MAJOR (1.0.0 → 2.0.0)

- [ ] Mudou algo que QUEBRA compatibilidade?
- [ ] Removeu alguma funcionalidade que usuários usam?
- [ ] Mudou comportamento esperado drasticamente?
- [ ] Requer migração manual dos usuários?

**Se marcou ✅ em qualquer um** → `npm version major`

---

#### 🟡 MINOR (1.0.0 → 1.1.0)

- [ ] Adicionou NOVA funcionalidade?
- [ ] Criou novo modal/componente importante?
- [ ] Adicionou nova integração?
- [ ] Melhorou significativamente a UI?
- [ ] Tudo continua funcionando como antes?

**Se marcou ✅ em qualquer um** → `npm version minor`

---

#### 🟢 PATCH (1.0.0 → 1.0.1)

- [ ] Apenas corrigiu bugs?
- [ ] Melhorou performance?
- [ ] Corrigiu textos/CSS?
- [ ] Atualizou dependências?
- [ ] Nenhuma funcionalidade nova?

**Se marcou ✅ em qualquer um** → `npm version patch`

---

### 2️⃣ Execute os comandos

```bash
# 1. Navegue para o diretório
cd apps/web

# 2. Escolha UMA das opções:
npm version major   # 🔴 1.0.0 → 2.0.0
npm version minor   # 🟡 1.0.0 → 1.1.0
npm version patch   # 🟢 1.0.0 → 1.0.1

# 3. Atualize o CHANGELOG
nano ../../../CHANGELOG.md
# (mova [Unreleased] para [x.x.x] - data de hoje)

# 4. Commit e push
git add .
git commit -m "chore: bump version to x.x.x"
git tag -a vx.x.x -m "Versão x.x.x"
git push origin main --tags

# 5. Deploy automático via Vercel ✅
```

---

### 3️⃣ Após o Deploy

- [ ] Teste o site em produção
- [ ] Verifique se PWA instalado recebe notificação de update
- [ ] Confirme que usuários conseguem atualizar
- [ ] Monitore Analytics por 24h

---

## 📋 Para o Deploy ATUAL (v1.0.0)

Você está indo de `0.0.0` → `1.0.0` (primeira versão oficial)

### Recomendação: ⭐ **MAJOR (1.0.0)**

**Por quê?**

- É a primeira versão de produção
- Produto completo com 32 componentes
- Todas as funcionalidades core implementadas
- Pronto para lançamento oficial

### Execute:

```bash
cd apps/web

# Define versão 1.0.0 explicitamente
npm version 1.0.0

# Commit
git add package.json
git commit -m "chore: release v1.0.0 - primeira versão de produção

✨ Funcionalidades principais:
- Busca fuzzy avançada (1237 códigos NBS)
- Sistema de favoritos + sincronização na nuvem
- Autenticação Firebase/Google
- PWA completo com versionamento automático
- Dark mode e atalhos de teclado
- Templates, compartilhamento e exportação
- LGPD compliance
- 32 componentes React
- Analytics e AdSense

🎯 Lançamento oficial do NBS Helper!"

# Tag
git tag -a v1.0.0 -m "Versão 1.0.0 - Release Oficial"

# Push
git push origin main --tags
```

---

## 🎯 Próximas Versões (Planejadas)

### v1.1.0 (MINOR) - Próximas semanas

**Novas funcionalidades:**

- [ ] Notificações push
- [ ] PWA install badge melhorado
- [ ] 10+ novos templates
- [ ] Filtros avançados de busca

### v1.0.1 (PATCH) - Se necessário

**Correções:**

- [ ] Bugs reportados pelos usuários
- [ ] Ajustes de performance
- [ ] Correções de texto/CSS

---

## 💡 Dicas

### Regra de Ouro

> **Se você não tem certeza entre MINOR e PATCH:**
>
> - Adicionou código novo? → MINOR
> - Apenas ajustou código existente? → PATCH

### Quando NÃO usar MAJOR

MAJOR deve ser usado RARAMENTE. Apenas quando:

- Muda API pública de forma incompatível
- Remove features importantes
- Requer ação manual dos usuários

**Para 99% dos casos, use MINOR ou PATCH!**

---

## 📚 Documentação Completa

Para mais detalhes, consulte:

- [VERSIONING_GUIDE.md](VERSIONING_GUIDE.md) - Guia completo
- [PWA_VERSIONING.md](PWA_VERSIONING.md) - Sistema de updates
- [CHANGELOG.md](../CHANGELOG.md) - Histórico de versões

---

**Criado em:** 06/02/2026  
**Para deploy da versão:** 1.0.0  
**Tipo:** MAJOR (primeira versão oficial)
