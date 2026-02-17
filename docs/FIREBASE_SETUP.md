# 🔐 Configuração do Firebase - Autenticação Google

## 📋 Passo a Passo

### 1️⃣ Criar Projeto Firebase (5 min)

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **"Adicionar projeto"**
3. Nome do projeto: `nbs-helper` (ou outro de sua escolha)
4. Desabilite Google Analytics (opcional)
5. Clique em **"Criar projeto"**

### 2️⃣ Configurar Authentication (3 min)

1. No menu lateral, clique em **"Authentication"**
2. Clique em **"Começar"**
3. Aba **"Sign-in method"**
4. Habilite **"Google"**:
   - Email de suporte do projeto: seu email
   - Clique em **"Salvar"**

### 3️⃣ Configurar Firestore Database (3 min)

1. No menu lateral, clique em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Modo: **"Produção"** (recomendado)
4. Localização: **"southamerica-east1 (São Paulo)"**
5. Clique em **"Criar"**

#### Regras de Segurança

Clique na aba **"Regras"** e substitua por:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuários podem ler/escrever apenas seus próprios dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Favoritos do usuário
      match /favorites/{favoriteId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

Clique em **"Publicar"**.

### 4️⃣ Registrar App Web (5 min)

1. Na página inicial do projeto, clique no ícone **`</>`** (Web)
2. Apelido do app: `nbs-helper-web`
3. **NÃO** marque "Configure Firebase Hosting"
4. Clique em **"Registrar app"**

5. **Copie as credenciais** que aparecem:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "nbs-helper.firebaseapp.com",
  projectId: "nbs-helper",
  storageBucket: "nbs-helper.firebasestorage.app",
  messagingSenderId: "123...",
  appId: "1:123..."
};
```

### 5️⃣ Configurar no Código (2 min)

Abra o arquivo `/apps/web/src/config/firebase.js` e substitua:

```javascript
const firebaseConfig = {
  apiKey: "COLE_SEU_API_KEY_AQUI",
  authDomain: "COLE_SEU_AUTH_DOMAIN_AQUI",
  projectId: "COLE_SEU_PROJECT_ID_AQUI",
  storageBucket: "COLE_SEU_STORAGE_BUCKET_AQUI",
  messagingSenderId: "COLE_SEU_MESSAGING_SENDER_ID_AQUI",
  appId: "COLE_SEU_APP_ID_AQUI"
};
```

### 6️⃣ Adicionar Domínio Autorizado (2 min)

1. No Firebase Console, vá em **"Authentication"**
2. Aba **"Settings"** → **"Authorized domains"**
3. Clique em **"Add domain"**
4. Adicione: `nbs-helper.vercel.app` (ou seu domínio)
5. Também adicione: `localhost` (para desenvolvimento)

### 7️⃣ Testar (2 min)

```bash
npm run dev:web
```

1. Abra `http://localhost:5173`
2. Clique no botão **"Entrar"**
3. Escolha uma conta Google
4. Deve aparecer seu nome/avatar
5. Adicione um favorito
6. Vá no Firebase Console → Firestore Database
7. Deve aparecer: `users → [seu-user-id] → favorites → [código-nbs]`

---

## 🎯 Estrutura do Firestore

```
users/
  ├── {userId}/
  │   ├── favorites/
  │   │   ├── {code}/
  │   │   │   ├── code: "01.01.00.00"
  │   │   │   ├── description: "..."
  │   │   │   ├── level: "Seção"
  │   │   │   ├── keywords: []
  │   │   │   └── createdAt: "2026-02-04T..."
```

---

## 📊 Limites Gratuitos (Spark Plan)

### Firestore
- **Leituras:** 50.000/dia
- **Gravações:** 20.000/dia
- **Exclusões:** 20.000/dia
- **Armazenamento:** 1 GB

### Authentication
- **Usuários ativos:** Ilimitados (grátis!)
- **Logins Google:** Ilimitados

### Estimativa de Uso

Com 1.000 usuários ativos/mês:
- **Login:** ~1.000 autenticações (grátis)
- **Sync inicial:** ~1.000 leituras + ~1.000 gravações
- **Favoritos diários:** ~100 gravações/dia
- **Total leituras/mês:** ~30.000 (60% do limite)
- **Total gravações/mês:** ~4.000 (20% do limite)

✅ **Dentro dos limites gratuitos!**

---

## 🔒 Segurança

### O Que Está Protegido

✅ Apenas usuários autenticados podem ler/escrever  
✅ Cada usuário acessa apenas seus próprios dados  
✅ Firebase valida tokens automaticamente  
✅ HTTPS obrigatório  

### Dados Armazenados

- **Código NBS:** Público (está no app)
- **Descrição:** Pública (está no app)
- **User ID:** Anônimo (Firebase UID)
- **Email:** Não armazenado no Firestore
- **Timestamp:** Apenas para ordenação

---

## 🚨 Troubleshooting

### Erro: "Firebase: Error (auth/unauthorized-domain)"

**Solução:**
1. Firebase Console → Authentication → Settings
2. Authorized domains → Add domain
3. Adicione seu domínio Vercel

### Erro: "Missing or insufficient permissions"

**Solução:**
1. Firestore Database → Regras
2. Verifique se as regras estão corretas
3. Publique novamente

### Favoritos não sincronizam

**Solução:**
1. Abra DevTools → Console
2. Procure por erros
3. Verifique se está logado (`user` no estado)
4. Verifique Firebase Console → Firestore

### Demora para atualizar

**Normal!** Firestore tem latência de rede:
- Localhost: ~50-100ms
- Produção: ~200-500ms
- A sincronização em tempo real compensa

---

## 📈 Monitoramento

### Firebase Console

1. **Authentication → Users:** Veja quem está usando
2. **Firestore → Data:** Veja favoritos salvos
3. **Usage:** Monitore limites

### Google Analytics

Os eventos já rastreiam:
- `login` (method: google)
- `logout`
- `favorite` (add/remove)

---

## 🔄 Próximos Passos

Após configurar Firebase:

1. **Testar localmente** (localhost)
2. **Deploy na Vercel**
3. **Adicionar domínio autorizado**
4. **Testar em produção**
5. **Monitorar uso nos primeiros dias**

---

## 💡 Recursos Adicionais

- [Documentação Firebase Auth](https://firebase.google.com/docs/auth)
- [Documentação Firestore](https://firebase.google.com/docs/firestore)
- [Regras de Segurança](https://firebase.google.com/docs/firestore/security/get-started)
- [Pricing Firebase](https://firebase.google.com/pricing)

---

**Tempo total de configuração: ~20 minutos**

**Status após setup:** ✅ Login funcionando + Favoritos sincronizados na nuvem!
