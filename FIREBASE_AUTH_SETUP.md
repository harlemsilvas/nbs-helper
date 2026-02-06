# Configuração da Autenticação Email/Senha no Firebase

## ⚠️ IMPORTANTE: Etapas necessárias antes do deploy

Antes de fazer o deploy, você precisa **habilitar a autenticação por Email/Senha** no Firebase Console:

### 1. Acessar o Firebase Console

1. Acesse: https://console.firebase.google.com
2. Selecione seu projeto: **nbs-helper**

### 2. Habilitar Email/Password Authentication

1. No menu lateral, clique em **Authentication** (Autenticação)
2. Clique na aba **Sign-in method** (Método de login)
3. Na lista de provedores, clique em **Email/Password**
4. **Ative** o primeiro toggle (Email/Password)
5. O segundo toggle (Email link) pode ficar **desativado**
6. Clique em **Salvar**

✅ Pronto! O Firebase agora aceita login por email e senha.

### 3. Configurar Regras do Firestore (Já feito, mas verifique)

As regras do Firestore já permitem que usuários leiam/escrevam apenas seus próprios dados. Verifique se suas regras estão assim:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Coleção de usuários - cada usuário pode ler/escrever apenas seus dados
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Coleção de usernames - para evitar duplicatas
    match /usernames/{username} {
      allow read: if true;
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null && resource.data.uid == request.auth.uid;
    }

    // Favoritos dos usuários (estrutura existente)
    match /users/{userId}/favorites/{favoriteId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Estrutura de Dados Criada

O sistema agora cria duas coleções:

#### `users` (dados do usuário)

```javascript
{
  uid: "abc123...",
  fullName: "João da Silva",
  username: "joao_silva",
  email: "joao@email.com",
  phone: "(11) 98765-4321",
  createdAt: "2026-02-05T...",
  provider: "email" // ou "google.com"
}
```

#### `usernames` (reserva de usernames únicos)

```javascript
{
  uid: "abc123...",
  createdAt: "2026-02-05T..."
}
```

### 5. Funcionalidades Implementadas

✅ **Login com Google** (já existia)
✅ **Login com Email/Senha** (novo)
✅ **Cadastro com Email/Senha** (novo)
✅ **Validação de campos**
✅ **Verificação de username único**
✅ **Mensagens de erro em português**
✅ **Dropdown com as duas opções de login**
✅ **Modal responsivo para cadastro/login**

### 6. Validações Implementadas

**Login:**

- Email válido
- Senha não vazia

**Cadastro:**

- Nome completo (mínimo 3 caracteres)
- Username único (mínimo 3 caracteres, apenas letras, números e \_)
- Email válido
- Telefone (mínimo 10 dígitos)
- Senha (mínimo 6 caracteres)
- Confirmação de senha

### 7. Segurança

- Senhas nunca são armazenadas (Firebase Auth cuida disso)
- Cada usuário só acessa seus próprios dados
- Usernames são únicos e reservados
- Mensagens de erro não revelam se um email existe ou não

### 8. Testando Localmente

```bash
npm run dev
```

Então:

1. Clique no botão "Entrar"
2. Selecione "Entrar com Email" no dropdown
3. Teste o cadastro na aba "Criar Conta"
4. Teste o login na aba "Entrar"

### 9. Deploy

Depois de habilitar Email/Password no Firebase:

```bash
vercel --prod
```

---

## 🎯 Próximos Passos Opcionais

- [ ] Recuperação de senha (email de reset)
- [ ] Verificação de email
- [ ] Edição de perfil
- [ ] Foto de perfil
- [ ] Autenticação de dois fatores
