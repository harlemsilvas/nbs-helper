import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "../config/firebase";
import { X, Mail, Lock, User, Phone, UserCircle } from "lucide-react";
import "./AuthModal.css";

export default function AuthModal({ isOpen, onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState("login"); // login ou signup
  const [loading, setLoading] = useState(false);
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
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError(""); // Limpar erro ao digitar
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

      await signInWithEmailAndPassword(auth, loginEmail, loginPassword);

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

      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        throw new Error(
          "Nome de usuário deve conter apenas letras, números e _",
        );
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
          <h2>Autenticação</h2>
          <button
            className="auth-modal-close"
            onClick={handleClose}
            disabled={loading}
            aria-label="Fechar"
          >
            <X size={24} />
          </button>
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
                  placeholder="joao_silva"
                  disabled={loading}
                  autoComplete="username"
                />
                <small>Apenas letras, números e _ (sem espaços)</small>
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
                  placeholder="Mínimo 6 caracteres"
                  disabled={loading}
                  autoComplete="new-password"
                />
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
