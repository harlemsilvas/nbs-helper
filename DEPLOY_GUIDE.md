# 🚀 Deploy no GitHub + Vercel - Guia Completo

## ✅ Status Atual
- [x] Git inicializado
- [x] Branch `main` criada
- [x] Commit inicial feito (47 arquivos)
- [x] Pronto para push

---

## 📋 Passo a Passo

### 1. Criar Repositório no GitHub

#### Opção A: Via Interface Web (Recomendado)
1. Acesse: https://github.com/new
2. Preencha:
   - **Repository name:** `nbs-helper` (ou outro nome)
   - **Description:** `MicroSaaS para busca de códigos NBS 2.0 em emissão de NFS-e`
   - **Visibility:** Public ou Private
   - **❌ NÃO** marque "Initialize with README"
   - **❌ NÃO** adicione .gitignore
   - **❌ NÃO** adicione license
3. Clique em **"Create repository"**

#### Opção B: Via GitHub CLI (se tiver instalado)
```bash
gh repo create nbs-helper --public --description "MicroSaaS para busca de códigos NBS 2.0"
```

---

### 2. Conectar Repositório Local ao GitHub

Após criar o repo, o GitHub vai mostrar comandos. Use estes:

```bash
cd /home/harlem/projetos/zipados/apps/microSaas

# Adicionar remote (substitua SEU-USUARIO pelo seu username)
git remote add origin https://github.com/SEU-USUARIO/nbs-helper.git

# Verificar se foi adicionado
git remote -v

# Fazer push
git push -u origin main
```

**Ou copie e execute este comando (vou preparar):**

---

### 3. Verificar no GitHub

Acesse: `https://github.com/SEU-USUARIO/nbs-helper`

Você deve ver:
- ✅ 47 arquivos
- ✅ README.md com badges
- ✅ Documentação completa
- ✅ Código fonte

---

## 🚀 Deploy na Vercel

### Passo 1: Criar conta na Vercel (se não tiver)
1. Acesse: https://vercel.com/signup
2. Faça login com GitHub
3. Autorize a Vercel

### Passo 2: Importar Projeto
1. Acesse: https://vercel.com/new
2. Clique em **"Import Git Repository"**
3. Selecione `nbs-helper`
4. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `apps/web`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Passo 3: Deploy
1. Clique em **"Deploy"**
2. Aguarde ~2 minutos
3. Pronto! Você terá um link tipo: `nbs-helper.vercel.app`

---

## 🔧 Configurações Importantes

### Build Settings na Vercel

```json
{
  "buildCommand": "cd ../.. && npm run prepare:data && cd apps/web && npm run build",
  "outputDirectory": "apps/web/dist",
  "installCommand": "cd ../.. && npm install && cd apps/web && npm install"
}
```

**Ou mais simples (dados já commitados):**

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm install"
}
```

### Environment Variables (Vercel)
Não precisa configurar nada para o MVP! O app funciona 100% client-side.

---

## 📝 Próximos Commits

Quando fizer mudanças:

```bash
# Ver mudanças
git status

# Adicionar arquivos
git add .

# Commit
git commit -m "feat: descrição da mudança"

# Push
git push

# Vercel faz deploy automático! 🎉
```

---

## 🎯 Comandos Prontos

### Configurar Remote (ajuste SEU-USUARIO)
```bash
git remote add origin https://github.com/SEU-USUARIO/nbs-helper.git
git push -u origin main
```

### Ver status do repo
```bash
git status
git log --oneline
git remote -v
```

---

## 🐛 Troubleshooting

### Erro: "remote origin already exists"
```bash
git remote remove origin
git remote add origin https://github.com/SEU-USUARIO/nbs-helper.git
```

### Erro: Authentication failed
```bash
# Usar SSH ao invés de HTTPS
git remote set-url origin git@github.com:SEU-USUARIO/nbs-helper.git

# Ou configurar token
gh auth login
```

### Deploy falha na Vercel
1. Verifique se `data/generated/index.json` está no repo
2. Ou rode `npm run prepare:data` antes do build
3. Ou suba o index.json commitado (já está!)

---

## ✅ Checklist de Deploy

- [ ] Repositório criado no GitHub
- [ ] Remote configurado localmente
- [ ] Push feito com sucesso
- [ ] Projeto importado na Vercel
- [ ] Build rodou sem erros
- [ ] Site acessível no link da Vercel
- [ ] Busca funcionando
- [ ] Favoritos funcionando
- [ ] Dados com acentos corretos

---

## 🎉 Resultado Final

Após deploy, você terá:
- 🌐 **URL pública:** `https://seu-projeto.vercel.app`
- 🔄 **Deploy automático:** Cada push = novo deploy
- 📊 **Analytics:** Vercel mostra métricas
- ⚡ **Performance:** CDN global
- 🆓 **Grátis:** Hobby plan da Vercel

---

## 📞 Próximos Passos

1. ✅ Fazer push para GitHub
2. ✅ Deploy na Vercel
3. 🎯 Testar URL pública
4. 📱 Compartilhar com usuários
5. 💰 Planejar monetização

---

**Seu username do GitHub:** ___________  
**URL do repo:** https://github.com/_______/nbs-helper  
**URL da Vercel:** https://_______.vercel.app  

**Pronto para começar!** 🚀
