# 🔧 Configurar Domínio Principal - nbs-helper.vercel.app

## Objetivo

Transferir o domínio `nbs-helper.vercel.app` para o projeto **landing** (com proxy configurado).

## 📋 Passos no Vercel Dashboard

### 1. Acessar Dashboard do Vercel

Abra: https://vercel.com/dashboard

### 2. Remover Domínio do Projeto Antigo

#### a) Identifique qual projeto está usando `nbs-helper.vercel.app`

Vá em: **Projects** → procure pelo projeto que tem esse domínio  
(Provavelmente é um projeto chamado "nbs-helper" ou "landing" antigo)

#### b) Remove o domínio

1. Clique no projeto
2. **Settings** → **Domains**
3. Localize `nbs-helper.vercel.app`
4. Clique nos **...** (três pontos) → **Remove**
5. Confirme a remoção

### 3. Adicionar Domínio ao Projeto Landing Correto

#### a) Acesse o projeto "landing"

Na lista de projetos, clique em: **landing**  
(O projeto deployado em `landing-three-liart.vercel.app`)

#### b) Configure o domínio

1. Vá em **Settings** → **Domains**
2. Clique em **Add**
3. Digite: `nbs-helper.vercel.app`
4. Clique **Add**

O Vercel vai automaticamente:

- ✅ Configurar SSL
- ✅ Aplicar os rewrites do vercel.json
- ✅ Disponibilizar em ~30 segundos

### 4. Configurar Domínio de Produção (Opcional)

Para garantir que `nbs-helper.vercel.app` seja o domínio principal:

1. No projeto **landing**
2. **Settings** → **Domains**
3. Ao lado de `nbs-helper.vercel.app`, clique **Set as Primary**

Isso garante que:

- Todos os redirects apontam para esse domínio
- É a URL canônica do projeto

## 🎯 Resultado Final

Após configuração, você terá:

```
https://nbs-helper.vercel.app/          → Landing Page
https://nbs-helper.vercel.app/app       → React App (proxy)
https://nbs-helper.vercel.app/api/*     → Backend API (proxy)
```

URLs diretas (ainda funcionais para debug):

```
https://landing-three-liart.vercel.app/         → Mesmo que acima
https://web-ashen-theta-31.vercel.app/          → Web app direta
https://nbs-helper-api.vercel.app/              → API direta
```

## ✅ Teste Após Configuração

Aguarde ~1 minuto para propagar, depois teste:

```bash
# Landing
curl -I https://nbs-helper.vercel.app/

# App via proxy
curl -I https://nbs-helper.vercel.app/app

# API via proxy
curl https://nbs-helper.vercel.app/api/health
```

## 🚨 Troubleshooting

### Erro: "Domain is already in use"

**Causa:** Outro projeto está usando o domínio  
**Solução:** Remova o domínio do outro projeto primeiro (passo 2)

### Domínio não aparece disponível

**Causa:** Pode estar em outro time/workspace  
**Solução:** Verifique se está no workspace correto ("Harlem Silva's projects")

### Proxy não funciona após mudança

**Causa:** Cache do Vercel  
**Solução:**

```bash
cd landing
vercel --prod --yes
```

Força novo deploy que limpa cache.

## 🔄 Via CLI (Alternativa)

Se preferir usar CLI em vez do dashboard:

```bash
# 1. Remover domínio do projeto antigo (se souber o nome)
vercel domains rm nbs-helper.vercel.app --scope harlem-silvas-projects

# 2. Adicionar ao projeto landing
cd landing
vercel domains add nbs-helper.vercel.app --scope harlem-silvas-projects

# 3. Redeploy
vercel --prod --yes
```

## 📝 Checklist

- [ ] Remover `nbs-helper.vercel.app` do projeto antigo
- [ ] Adicionar `nbs-helper.vercel.app` ao projeto **landing**
- [ ] Configurar como domínio primário
- [ ] Testar `https://nbs-helper.vercel.app/`
- [ ] Testar `https://nbs-helper.vercel.app/app`
- [ ] Testar `https://nbs-helper.vercel.app/api/health`
- [ ] Atualizar links no README e docs (se necessário)

---

**Tempo estimado:** 2-3 minutos  
**Downtime:** Nenhum (transição instantânea)
