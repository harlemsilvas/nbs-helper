import { useState } from "react";
import "./ContactModal.css";

export default function ContactModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle, loading, success, error
  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Nome é obrigatório";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email é obrigatório";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Mensagem é obrigatória";
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Mensagem deve ter pelo menos 10 caracteres";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus("loading");
    setErrors({});

    try {
      // FormSubmit.co - serviço gratuito de formulários
      // Substitua YOUR_EMAIL pelo seu email
      const response = await fetch(
        "https://formsubmit.co/ajax/harlem.claumann@gmail.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            _subject: `[NBS Helper] Contato de ${formData.name}`,
            _template: "table",
            _captcha: "false",
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        console.error("Erro FormSubmit:", response.status, data);
        throw new Error(
          data.message || `Erro ${response.status}: ${response.statusText}`,
        );
      }

      setStatus("success");

      // Limpar formulário
      setFormData({ name: "", email: "", message: "" });

      // Fechar modal após 2 segundos
      setTimeout(() => {
        onClose();
        setStatus("idle");
      }, 2000);
    } catch (error) {
      console.error("Erro ao enviar formulário:", error);
      setStatus("error");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Limpar erro do campo quando usuário começar a digitar
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleClose = () => {
    if (status !== "loading") {
      setFormData({ name: "", email: "", message: "" });
      setErrors({});
      setStatus("idle");
      onClose();
    }
  };

  return (
    <div className="contact-modal-overlay" onClick={handleClose}>
      <div className="contact-modal" onClick={(e) => e.stopPropagation()}>
        <div className="contact-modal-header">
          <h2>Entre em Contato</h2>
          <button
            className="contact-modal-close"
            onClick={handleClose}
            disabled={status === "loading"}
            aria-label="Fechar"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        {status === "success" ? (
          <div className="contact-success">
            <div className="contact-success-icon">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <polyline
                  points="22 4 12 14.01 9 11.01"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3>Mensagem enviada!</h3>
            <p>Obrigado pelo contato. Responderemos em breve.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="contact-form-group">
              <label htmlFor="name">
                Nome <span className="required">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={errors.name ? "error" : ""}
                disabled={status === "loading"}
                placeholder="Seu nome completo"
              />
              {errors.name && (
                <span className="error-message">{errors.name}</span>
              )}
            </div>

            <div className="contact-form-group">
              <label htmlFor="email">
                Email <span className="required">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
                disabled={status === "loading"}
                placeholder="seu@email.com"
              />
              {errors.email && (
                <span className="error-message">{errors.email}</span>
              )}
            </div>

            <div className="contact-form-group">
              <label htmlFor="message">
                Mensagem <span className="required">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={errors.message ? "error" : ""}
                disabled={status === "loading"}
                rows="5"
                placeholder="Como podemos ajudar?"
              />
              {errors.message && (
                <span className="error-message">{errors.message}</span>
              )}
            </div>

            {status === "error" && (
              <div className="contact-error">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <circle cx="12" cy="12" r="10" strokeWidth="2" />
                  <line
                    x1="12"
                    y1="8"
                    x2="12"
                    y2="12"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1="12"
                    y1="16"
                    x2="12.01"
                    y2="16"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
                <div>
                  <strong>Erro ao enviar mensagem</strong>
                  <p style={{ fontSize: "0.875rem", marginTop: "4px" }}>
                    Verifique o console (F12) para mais detalhes ou tente
                    novamente em alguns minutos.
                  </p>
                </div>
              </div>
            )}

            <div className="contact-form-actions">
              <button
                type="button"
                onClick={handleClose}
                disabled={status === "loading"}
                className="contact-btn-cancel"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={status === "loading"}
                className="contact-btn-submit"
              >
                {status === "loading" ? (
                  <>
                    <span className="spinner"></span>
                    Enviando...
                  </>
                ) : (
                  <>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                    >
                      <line
                        x1="22"
                        y1="2"
                        x2="11"
                        y2="13"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <polygon
                        points="22 2 15 22 11 13 2 9 22 2"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Enviar Mensagem
                  </>
                )}
              </button>
            </div>

            <p className="contact-form-note">
              Seus dados são protegidos e não serão compartilhados.
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
