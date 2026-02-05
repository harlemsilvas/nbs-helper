import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { X, Mail, Lock, User, Phone, UserCircle } from "lucide-react";
import { loginWithGoogle } from "../services/authService";
import "./AuthModal.css";

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState("login"); // login ou signup
  const [loading, setLoading] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [error, setError] = useState("");

  // Dados do formulário
  const [formData, setFormData] = useState({
    // Login
    loginEmail: "",
    loginPassword: "",
    // Cadastro
    fullName: "",
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Para username, remover caracteres não permitidos em tempo real
    if (name === "username") {
      const cleanValue = value.replace(/[^a-zA-Z0-9_]/g, "");
      setFormData((prev) => ({ ...prev, [name]: cleanValue }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    setError(""); // Limpar erro ao digitar
  };

  const handleGoogleLogin = async () => {
    setError("");
    setLoadingGoogle(true);

    try {
      await loginWithGoogle();
      
      // Limpar formulário
      setFormData({
        loginEmail: "",
        loginPassword: "",
        fullName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Erro ao fazer login com Google:", err);
      
      switch (err.code) {
        case "auth/popup-closed-by-user":
          setError("Login cancelado");
          break;
        case "auth/popup-blocked":
          setError("Popup bloqueado. Permita popups para este site");
          break;
        case "auth/cancelled-popup-request":
          // Usuário fechou o popup, não mostrar erro
          break;
        default:
          setError(err.message || "Erro ao fazer login com Google");
      }
    } finally {
      setLoadingGoogle(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { loginEmail, loginPassword } = formData;

      if (!loginEmail || !loginPassword) {
        throw new Error("Preencha todos os campos");
      }

      const result = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      
      // Atualizar último login
      const userDocRef = doc(db, 'users', result.user.uid);
      await setDoc(userDocRef, {
        lastLoginAt: new Date().toISOString(),
      }, { merge: true });

      // Limpar formulário
      setFormData({
        loginEmail: "",
        loginPassword: "",
        fullName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Erro ao fazer login:", err);

      // Mensagens de erro em português
      switch (err.code) {
        case "auth/user-not-found":
          setError("Email não cadastrado");
          break;
        case "auth/wrong-password":
          setError("Senha incorreta");
          break;
        case "auth/invalid-email":
          setError("Email inválido");
          break;
        case "auth/too-many-requests":
          setError("Muitas tentativas. Tente novamente mais tarde");
          break;
        default:
          setError(err.message || "Erro ao fazer login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { fullName, username, email, phone, password, confirmPassword } =
        formData;

      // Validações
      if (
        !fullName ||
        !username ||
        !email ||
        !phone ||
        !password ||
        !confirmPassword
      ) {
        throw new Error("Preencha todos os campos");
      }

      if (fullName.trim().length < 3) {
        throw new Error("Nome deve ter pelo menos 3 caracteres");
      }

      if (username.trim().length < 3) {
        throw new Error("Nome de usuário deve ter pelo menos 3 caracteres");
      }

      if (phone.length < 10) {
        throw new Error("Telefone inválido");
      }

      if (password.length < 6) {
        throw new Error("Senha deve ter pelo menos 6 caracteres");
      }

      if (password !== confirmPassword) {
        throw new Error("As senhas não conferem");
      }

      // Verificar se username já existe
      const usernameDoc = await getDoc(
        doc(db, "usernames", username.toLowerCase()),
      );
      if (usernameDoc.exists()) {
        throw new Error("Nome de usuário já está em uso");
      }

      // Criar conta
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      // Atualizar perfil com nome
      await updateProfile(user, {
        displayName: fullName,
      });

      // Salvar dados adicionais no Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        fullName: fullName.trim(),
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        phone: phone.trim(),
        createdAt: new Date().toISOString(),
        provider: "email",
      });

      // Reservar username (evita duplicatas)
      await setDoc(doc(db, "usernames", username.toLowerCase()), {
        uid: user.uid,
        createdAt: new Date().toISOString(),
      });

      // Limpar formulário
      setFormData({
        loginEmail: "",
        loginPassword: "",
        fullName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });

      onSuccess?.();
      onClose();
    } catch (err) {
      console.error("Erro ao criar conta:", err);

      // Mensagens de erro em português
      switch (err.code) {
        case "auth/email-already-in-use":
          setError("Este email já está cadastrado");
          break;
        case "auth/invalid-email":
          setError("Email inválido");
          break;
        case "auth/weak-password":
          setError("Senha muito fraca. Use pelo menos 6 caracteres");
          break;
        default:
          setError(err.message || "Erro ao criar conta");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setFormData({
        loginEmail: "",
        loginPassword: "",
        fullName: "",
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      setError("");
      onClose();
    }
  };

  const handleOverlayClick = (e) => {
    // Só fecha se clicar exatamente no overlay (não em elementos filhos)
    if (e.target === e.currentTarget && !loading) {
      handleClose();
    }
  };

  // Prevenir fechamento ao pressionar ESC durante loading
  const handleKeyDown = (e) => {
    if (e.key === "Escape" && !loading) {
      handleClose();
    }
  };

  return (
    <div
      className="auth-modal-overlay"
      onClick={handleOverlayClick}
      onKeyDown={handleKeyDown}
    >
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="auth-modal-header">
          <h2>Entrar ou Criar Conta</h2>
          <button
            className="auth-modal-close"
            onClick={handleClose}
            disabled={loading || loadingGoogle}
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
        </div>

        {/* Google Login Button */}
        <div className="auth-google-section">
          <button
            className="auth-btn-google"
            onClick={handleGoogleLogin}
            disabled={loading || loadingGoogle}
            type="button"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z"/>
                <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z"/>
                <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z"/>
                <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z"/>
              </g>
            </svg>
            {loadingGoogle ? "Autenticando..." : "Continuar com Google"}
          </button>
          
          <div className="auth-divider">
            <span>ou</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("login");
              setError("");
            }}
            disabled={loading}
          >
            Entrar
          </button>
          <button
            className={`auth-tab ${activeTab === "signup" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("signup");
              setError("");
            }}
            disabled={loading}
          >
            Criar Conta
          </button>
        </div>

        {/* Conteúdo */}
        <div className="auth-modal-content">
          {/* Tab: Login */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="auth-form">
              <div className="auth-form-group">
                <label htmlFor="loginEmail">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  id="loginEmail"
                  name="loginEmail"
                  value={formData.loginEmail}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="loginPassword">
                  <Lock size={16} />
                  Senha
                </label>
                <input
                  type="password"
                  id="loginPassword"
                  name="loginPassword"
                  value={formData.loginPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="auth-error">
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="auth-btn-primary"
                disabled={loading}
              >
                {loading ? "Entrando..." : "Entrar"}
              </button>
            </form>
          )}

          {/* Tab: Cadastro */}
          {activeTab === "signup" && (
            <form onSubmit={handleSignup} className="auth-form">
              <div className="auth-form-group">
                <label htmlFor="fullName">
                  <User size={16} />
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="João da Silva"
                  disabled={loading}
                  autoComplete="name"
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="username">
                  <UserCircle size={16} />
                  Nome de Usuário
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="joao_silva123"
                  disabled={loading}
                  autoComplete="username"
                  maxLength={20}
                />
                <small>⚠️ Apenas letras, números e _ (caracteres especiais serão removidos automaticamente)</small>
              </div>

              <div className="auth-form-group">
                <label htmlFor="email">
                  <Mail size={16} />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="seu@email.com"
                  disabled={loading}
                  autoComplete="email"
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="phone">
                  <Phone size={16} />
                  Telefone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(11) 98765-4321"
                  disabled={loading}
                  autoComplete="tel"
                />
              </div>

              <div className="auth-form-group">
                <label htmlFor="password">
                  <Lock size={16} />
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Ex: Teste123*, Senha@2026"
                  disabled={loading}
                  autoComplete="new-password"
                  minLength={6}
                />
                <small>✅ Pode usar letras, números e caracteres especiais (!@#$%*)</small>
              </div>

              <div className="auth-form-group">
                <label htmlFor="confirmPassword">
                  <Lock size={16} />
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Digite a senha novamente"
                  disabled={loading}
                  autoComplete="new-password"
                />
              </div>

              {error && (
                <div className="auth-error">
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                className="auth-btn-primary"
                disabled={loading}
              >
                {loading ? "Criando conta..." : "Criar Conta"}
              </button>

              <p className="auth-terms">
                Ao criar uma conta, você concorda com nossos{" "}
                <a href="/termos" target="_blank">
                  Termos de Uso
                </a>{" "}
                e{" "}
                <a href="/privacidade" target="_blank">
                  Política de Privacidade
                </a>
                .
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
