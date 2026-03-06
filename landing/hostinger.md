1. Estrutura de Pastas Hostinguer, dentro da vps

Organize meus projetos em /var/www/ para facilitar o gerenciamento:

    /var/www/nbshelper/landing  (site estatico principal - HTML)
    /var/www/nbshelper/apps/api (API Express)
    /var/www/nbshelper/apps/web (Vite)

# 📦 Deploy do Projeto ProcessadorXML na Hostinger VPS

> **Guia Completo de Configuração com Nginx + GitHub Actions (CI/CD)**

---

## 📋 Índice

1. [Visão Geral](#-visão-geral)
2. [Pré-requisitos](#-pré-requisitos)
3. [Estrutura de Pastas](#-estrutura-de-pastas)
4. [Passo 1: Preparar a VPS](#-passo-1-preparar-a-vps)
5. [Passo 2: Configurar Nginx com Location](#-passo-2-configurar-nginx-com-location)
6. [Passo 3: Configurar GitHub Actions (CI/CD)](#-passo-3-configurar-github-actions-cicd)
7. [Passo 4: Testar o Deploy](#-passo-4-testar-o-deploy)
8. [Solução de Problemas](#-solução-de-problemas)
9. [Comandos Úteis](#-comandos-úteis)
10. [Anexos](#-anexos)

---

## 🎯 Visão Geral

Este guia configura o projeto **[ProcessadorXML](https://github.com/harlemsilvas/ProcessadorXML)** para rodar em uma subpasta da sua VPS Hostinger:

```bash
🌐 Acesso Público:
├── http://187.77.61.83/ → Site principal (nbshelper)
└── http://187.77.61.83/ProcessadorXml/ → Seu projeto ProcessadorXML ✅
📁 Estrutura no Servidor:
/var/www/
├── nbshelper/landing/ → Site principal
└── processadorxml/ → Projeto ProcessadorXML (build)
```

**Tecnologias utilizadas:**

- 🖥️ Nginx (Web Server)
- 🔐 SSH + GitHub Actions (Deploy Automatizado)
- 📦 Vite/Static Build (ou PHP, conforme o projeto)

---

## ✅ Pré-requisitos

### Na Sua VPS Hostinger:

```bash
# Verificar se o Nginx está instalado
nginx -v

# Verificar se o Git está instalado
git --version

# Verificar usuário e permissões
whoami
# Deve retornar: harlem (ou seu usuário)
```

## No Seu Computador Local:

```bash
# Ter o projeto clonado
git clone https://github.com/harlemsilvas/ProcessadorXML
cd ProcessadorXML

# Ter Node.js instalado (se for projeto Vite/JS)
node -v
npm -v
```

## No GitHub:

- Acesso de escrita ao repositório harlemsilvas/ProcessadorXML
- Permissão para criar Secrets e Workflows

## 📁 Estrutura de Pastas

```bash
/var/www/
├── nbshelper/
│   └── landing/                    # Site principal
│
└── processadorxml/                 # ← Projeto ProcessadorXML
    ├── index.html                  # Página principal
    ├── assets/                     # JS, CSS, imagens (build do Vite)
    └── .htaccess                   # (Opcional, se usar Apache fallback)
```

⚠️ Importante: O nome da pasta no servidor será processadorxml (minúsculo), mas o acesso na URL será /ProcessadorXml/ (como definido no Nginx).

---

## 🚀 Passo 1: Preparar a VPS

### 1.1 Criar Diretório do Projeto

```bash
# Acessar a VPS
ssh harlem@187.77.61.83

# Criar pasta de deploy
sudo mkdir -p /var/www/processadorxml

# Definir permissões para o usuário harlem
sudo chown -R harlem:www-data /var/www/processadorxml
sudo chmod -R 775 /var/www/processadorxml

# Verificar
ls -la /var/www/
```

### 1.2 Gerar Chave SSH para GitHub Actions

```bash
# No seu computador LOCAL (não na VPS):

# Gerar chave SSH sem passphrase
ssh-keygen -t ed25519 -C "github-actions-processadorxml" -f ~/.ssh/github_actions_processadorxml

# Isso criará:
# ~/.ssh/github_actions_processadorxml      ← Chave PRIVADA (guardar!)
# ~/.ssh/github_actions_processadorxml.pub  ← Chave PÚBLICA (copiar para VPS)
```

### 1.3 Adicionar Chave Pública na VPS

```bash
# Na VPS, como usuário harlem:

# Criar diretório .ssh se não existir
mkdir -p ~/.ssh

# Editar authorized_keys
nano ~/.ssh/authorized_keys

# Colar o conteúdo da chave PÚBLICA (~/.ssh/github_actions_processadorxml.pub)
# Uma chave por linha. Exemplo:
# ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI... github-actions-processadorxml

# Salvar (Ctrl+O, Enter) e sair (Ctrl+X)

# Definir permissões corretas
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
chown -R $USER:$USER ~/.ssh
```

### 1.4 Testar Conexão SSH

```bash
# No seu computador LOCAL:
ssh -i ~/.ssh/github_actions_processadorxml harlem@187.77.61.83

# Se conectar sem pedir senha, está funcionando! ✅
# Digite 'exit' para sair
```

### ⚙️ Passo 2: Configurar Nginx com Location

### 2.1 Editar Arquivo de Configuração

```bash
# Na VPS:
sudo nano /etc/nginx/sites-available/nbshelper
```

### ### 2.2 Adicionar Bloco location /ProcessadorXml/

Adicione este bloco DENTRO do server { } existente:

```bash
    # ===== PROCESSADORXML - SUBPASTA =====
    location /ProcessadorXml/ {
        alias /var/www/processadorxml/;
        index index.html index.htm;

        # Suporte para SPA (Single Page Application)
        # Redireciona rotas não encontradas para index.html
        try_files $uri $uri/ /ProcessadorXml/index.html;

        # Cache para arquivos estáticos (performance)
        location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|xml|xsl)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }

        # Headers de segurança (opcional, mas recomendado)
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
    }
    # ===== FIM PROCESSADORXML =====
```

### 2.3 Estrutura Completa do Arquivo (Exemplo)

```bash
server {
    listen 80;
    server_name 187.77.61.83;

    # Site principal
    root /var/www/nbshelper/landing;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    # ===== PROCESSADORXML - SUBPASTA =====
    location /ProcessadorXml/ {
        alias /var/www/processadorxml/;
        index index.html index.htm;
        try_files $uri $uri/ /ProcessadorXml/index.html;

        location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|xml|xsl)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-Frame-Options "SAMEORIGIN" always;
    }
}
```

### 2.4 Testar e Recarregar Nginx

```bash
# Testar configuração
sudo nginx -t
# Deve retornar: "syntax is ok" e "test is successful"

# Recarregar Nginx
sudo systemctl reload nginx

# Verificar status
sudo systemctl status nginx
```

---

## 🔄 Passo 3: Configurar GitHub Actions (CI/CD)

### ### 3.1 Configurar Secrets no GitHub

1. Acesse: https://github.com/harlemsilvas/ProcessadorXML
2. Vá em Settings → Secrets and variables → Actions
3. Clique em New repository secret
4. Adicione os seguintes secrets:

| Nome do Secret  | Valor                                | Descrição               |
| --------------- | ------------------------------------ | ----------------------- |
| `SSH_HOST`      | `187.77.61.83`                       | IP da sua VPS Hostinger |
| `SSH_USER`      | `harlem`                             | Usuário SSH da VPS      |
| `SSH_KEY`       | ~/.ssh/github_actions_processadorxml | Chave privada SSH       |
| `DEPLOY_PATH`   | `/var/www/processadorxml`            | Pasta de deploy na VPS  |
| --------------- | -------                              | ---------               |

### 💡 Como obter o valor de SSH_KEY:

```bash
cat ~/.ssh/github_actions_processadorxml
```

Copie TODO o conteúdo (incluindo -----BEGIN OPENSSH PRIVATE KEY-----) e cole no GitHub.

### 3.2 Criar Arquivo de Workflow

No seu repositório, crie o arquivo:

```bash
.github/workflows/deploy.yml
```

Cole este conteúdo:

```yaml
name: 🚀 Deploy ProcessadorXML

on:
  push:
    branches:
      - main # Altere para 'master' se for sua branch principal
  workflow_dispatch: # Permite deploy manual pela interface do GitHub

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment: production

    steps:
      # 1️⃣ Checkout do código
      - name: 📦 Checkout code
        uses: actions/checkout@v4

      # 2️⃣ Setup Node.js (ajuste a versão conforme seu projeto)
      - name: ⚙️ Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: "20"
          cache: "npm"

      # 3️⃣ Instalar dependências
      - name: 📥 Install dependencies
        run: npm ci

      # 4️⃣ Configurar Vite para subpasta (se aplicável)
      - name: 🔧 Configure Vite base path
        run: |
          if [ -f "vite.config.js" ]; then
            sed -i "s|base:.*|base: '/ProcessadorXml/',|" vite.config.js
            echo "✅ vite.config.js atualizado com base: '/ProcessadorXml/'"
          fi

      # 5️⃣ Build do projeto
      - name: 🔨 Build project
        run: npm run build

      # 6️⃣ Deploy via SSH para VPS
      - name: 📤 Deploy to Hostinger VPS
        uses: easingthemes/ssh-deploy@v4
        with:
          SSH_PRIVATE_KEY: ${{ secrets.SSH_KEY }}
          REMOTE_HOST: ${{ secrets.SSH_HOST }}
          REMOTE_USER: ${{ secrets.SSH_USER }}
          SOURCE: "dist/" # Pasta de output do build (ajuste se for diferente)
          TARGET: ${{ secrets.DEPLOY_PATH }}
          EXCLUDE: "/dist/, /node_modules/, /.git/"
          ARGS: "-rltgoDzvO --delete" # Sincroniza e remove arquivos antigos
          SCRIPT_AFTER: |
            # Corrigir permissões para o Nginx ler
            sudo chown -R www-www-data ${{ secrets.DEPLOY_PATH }}
            sudo chmod -R 755 ${{ secrets.DEPLOY_PATH }}

            # Recarregar Nginx para aplicar mudanças
            sudo systemctl reload nginx

            echo "✅ Deploy concluído com sucesso!"

      # 7️⃣ Notificar resultado (opcional)
      - name: 📢 Notify result
        if: always()
        run: |
          if [ "${{ job.status }}" == "success" ]; then
            echo "🎉 Deploy realizado com sucesso!"
          else
            echo "❌ Falha no deploy. Verifique os logs."
            exit 1
          fi
```

### 3.3 Ajustes Importantes no Workflow

| Configuração       | O Que Verificar                                                        |
| ------------------ | ---------------------------------------------------------------------- |
| branches: - main   | Altere para master se for sua branch padrão                            |
| node-version: '20' | Ajuste para a versão do Node que seu projeto usa                       |
| SOURCE: "dist/"    | Altere se seu build gera em outra pasta (ex: build/, public/)          |
| vite.config.js     | O script de configuração assume que você usa Vite. Remova se não usar. |

### 3.4 Commitar e Push

```bash
# No seu computador local, dentro da pasta do projeto:

git add .github/workflows/deploy.yml
git commit -m "ci: adicionar workflow de deploy para Hostinger VPS"
git push origin main
```

### 3.5 Acompanhar o Deploy

1. Acesse: https://github.com/harlemsilvas/ProcessadorXML/actions
2. Você verá o workflow "🚀 Deploy ProcessadorXML" rodando
3. Clique para ver os logs em tempo real
4. Quando ficar verde ✅, o deploy foi concluído!

### 🧪 Passo 4: Testar o Deploy

## 4.1 Testes via Terminal (na VPS)

```bash
# Testar se os arquivos foram copiados
ls -la /var/www/processadorxml/

# Testar resposta HTTP localmente
curl -I http://localhost/ProcessadorXml/
# Deve retornar: HTTP/1.1 200 OK

# Testar com verbose para ver headers
curl -v http://localhost/ProcessadorXml/
```

## 4.2 Testes via Navegador

| URL                                                 | O Que Esperar                         |
| --------------------------------------------------- | ------------------------------------- |
| http://187.77.61.83/ProcessadorXml/                 | ✅ Página principal do ProcessadorXML |
| http://187.77.61.83/ProcessadorXml/assets/app.js    | ✅ Arquivo JS carregando (200 OK)     |
| http://187.77.61.83/ProcessadorXml/rota-inexistente | ✅ Redireciona para index.html (SPA)  |

### 💡 Dica: Use aba anônima e force recarregamento (Ctrl+F5) para evitar cache.

## 4.3 Verificar Logs do Nginx

```bash
# Logs de acesso (para ver requisições chegando)
sudo tail -f /var/log/nginx/access.log | grep ProcessadorXml

# Logs de erro (para debugar problemas)
sudo tail -f /var/log/nginx/error.log
```

### 🔧 Solução de Problemas

❌ Erro: 403 Forbidden

```bash
# Causa: Permissões incorretas
# Solução:
sudo chown -R www-www-data /var/www/processadorxml
sudo chmod -R 755 /var/www/processadorxml
```

❌ Erro: 404 Not Found

```bash
# Causa 1: Arquivos não foram copiados
ls -la /var/www/processadorxml/

# Causa 2: Path do alias incorreto no Nginx
# Verifique se termina com barra:
# alias /var/www/processadorxml/;  ← Barra final é OBRIGATÓRIA

# Causa 3: Base path do Vite incorreto
# No vite.config.js deve ter:
export default defineConfig({
  base: '/ProcessadorXml/',  # ← Deve bater com o location do Nginx
  // ...
})
```

❌ Erro: SSH Connection Failed no GitHub Actions

```bash
# Teste manual da chave:
ssh -i ~/.ssh/github_actions_processadorxml harlem@187.77.61.83

# Verifique na VPS:
cat ~/.ssh/authorized_keys  # A chave pública está lá?

# Verifique permissões na VPS:
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

❌ Erro: SPA dá 404 ao recarregar a página

```bash
# Causa: try_files não configurado para SPA
# Solução: No Nginx, use:
try_files $uri $uri/ /ProcessadorXml/index.html;
```

❌ Erro: Assets (CSS/JS) não carregam (404)

```bash
# Causa: Paths absolutos no HTML apontando para /assets/ em vez de /ProcessadorXml/assets/
# Solução 1: No vite.config.js:
base: '/ProcessadorXml/'

# Solução 2: No HTML, use paths relativos:
<link rel="stylesheet" href="./assets/style.css">  ← Correto
<link rel="stylesheet" href="/assets/style.css">   ← Errado (aponta para raiz)
```

## 🛠️ Comandos Úteis

### Gerenciamento do Nginx

```bash
# Testar configuração
sudo nginx -t

# Recarregar (sem downtime)
sudo systemctl reload nginx

# Reiniciar (com downtime breve)
sudo systemctl restart nginx

# Ver status
sudo systemctl status nginx

# Ver logs em tempo real
sudo tail -f /var/log/nginx/error.log
```

Gerenciamento de Arquivos

```bash
# Verificar conteúdo da pasta de deploy
ls -lah /var/www/processadorxml/

# Verificar permissões
ls -la /var/www/processadorxml/ | head -10

# Corrigir proprietário e permissões
sudo chown -R www-www-data /var/www/processadorxml
sudo chmod -R 755 /var/www/processadorxml
```

Debug de Deploy

```bash
# Verificar qual configuração está ativa
sudo nginx -T | grep -A 10 "ProcessadorXml"

# Testar resposta HTTP
curl -I http://localhost/ProcessadorXml/

# Simular requisição externa
curl -H "Host: 187.77.61.83" http://127.0.0.1/ProcessadorXml/
```

GitHub Actions

```bash
# Trigger manual do workflow (via API)
curl -X POST \
  -H "Accept: application/vnd.github.v3+json" \
  -H "Authorization: token $GITHUB_TOKEN" \
  https://api.github.com/repos/harlemsilvas/ProcessadorXML/actions/workflows/deploy.yml/dispatches \
  -d '{"ref":"main"}'
```

📎 Anexos
Anexo A: vite.config.js Exemplo para Subpasta

```javascript
// vite.config.js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react"; // ou vue, svelte, etc

export default defineConfig({
  plugins: [react()],

  // 👇 IMPORTANTE: Caminho da subpasta no servidor
  base: "/ProcessadorXml/",

  build: {
    outDir: "dist",
    assetsDir: "assets",
    rollupOptions: {
      output: {
        // Garantir que assets usem paths relativos
        assetFileNames: "assets/[name].[hash][extname]",
        chunkFileNames: "assets/[name].[hash].js",
        entryFileNames: "assets/[name].[hash].js",
      },
    },
  },

  server: {
    // Para desenvolvimento local
    base: "/ProcessadorXml/",
  },
});
```

Anexo B: index.html Exemplo com Paths Relativos

```html
<!DOCTYPE html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>ProcessadorXML</title>

    <!-- ✅ Use paths relativos para assets -->
    <link rel="stylesheet" href="./assets/index.css" />
  </head>
  <body>
    <div id="root"></div>

    <!-- ✅ Script com path relativo -->
    <script type="module" src="./assets/index.js"></script>
  </body>
</html>
```

Anexo C: Script de Deploy Manual (Alternativa ao GitHub Actions)

```bash
#!/bin/bash
# deploy-manual.sh - Execute na VPS para deploy rápido

set -e

echo "🔄 Iniciando deploy manual do ProcessadorXML..."

# Entrar na pasta do projeto
cd /var/www/processadorxml

# Pull das últimas alterações (se clonar via git)
git pull origin main

# Se for projeto Node/Vite:
if [ -f "package.json" ]; then
  echo "📦 Instalando dependências..."
  npm ci

  echo "🔨 Gerando build..."
  npm run build

  echo "📤 Copiando build para pasta pública..."
  cp -r dist/* /var/www/processadorxml/
fi

# Corrigir permissões
echo "🔐 Ajustando permissões..."
sudo chown -R www-www-data /var/www/processadorxml
sudo chmod -R 755 /var/www/processadorxml

# Recarregar Nginx
echo "♻️ Recarregando Nginx..."
sudo systemctl reload nginx

echo "✅ Deploy concluído! Acesse: http://187.77.61.83/ProcessadorXml/"
```

🎯 Checklist Final

```markdown
- [ ] Pasta /var/www/processadorxml criada com permissões corretas
- [ ] Chave SSH gerada e configurada no GitHub + VPS
- [ ] Secrets configurados no repositório GitHub
- [ ] Arquivo .github/workflows/deploy.yml criado e commitado
- [ ] vite.config.js com base: '/ProcessadorXml/' (se aplicável)
- [ ] Nginx configurado com location /ProcessadorXml/ { alias ... }
- [ ] nginx -t retorna "syntax is ok"
- [ ] Nginx recarregado com systemctl reload
- [ ] curl -I http://localhost/ProcessadorXml/ retorna 200 OK
- [ ] Navegador carrega http://187.77.61.83/ProcessadorXml/ sem erros
```

### 🆘 Precisa de Ajuda?

Se algo não funcionar, colete estas informações e me envie:

```bash
# 1. Resultado do teste do Nginx
sudo nginx -t

# 2. Configuração ativa do location
sudo nginx -T | grep -A 15 "ProcessadorXml"

# 3. Permissões da pasta
ls -la /var/www/processadorxml/

# 4. Logs de erro recentes
sudo tail -20 /var/log/nginx/error.log

# 5. Resposta HTTP
curl -v http://localhost/ProcessadorXml/
```

### ✨ Parabéns! Seu projeto ProcessadorXML agora está configurado para deploy automático na Hostinger VPS.

> 🔄 A cada git push, o GitHub Actions irá:>
>
> - Instalar dependências
> - Gerar o build
> - Enviar para a VPS via SSH
> - Recarregar o Nginx
> - 🌐 Acesse: http://187.77.61.83/ProcessadorXml/

**Documento gerado para deploy em VPS Hostinger**

**Última atualização: Configuração para subpasta com alias + GitHub Actions**

**Autor: Assistente de Configuração Nginx + VPS 🚀**
