import { X, AlertTriangle } from "lucide-react";
import "./ConfirmDialog.css";

export default function ConfirmDialog({ 
  isOpen, 
  onConfirm, 
  onCancel, 
  title = "Confirmar ação",
  message,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "warning" // warning, danger, info
}) {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className="confirm-dialog-overlay" onClick={handleOverlayClick}>
      <div className="confirm-dialog">
        <div className="confirm-dialog-header">
          <div className={`confirm-dialog-icon ${type}`}>
            <AlertTriangle className="w-6 h-6" />
          </div>
          <button onClick={onCancel} className="confirm-dialog-close">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="confirm-dialog-content">
          <h3 className="confirm-dialog-title">{title}</h3>
          <p className="confirm-dialog-message">{message}</p>
        </div>

        <div className="confirm-dialog-actions">
          <button 
            onClick={onCancel} 
            className="confirm-dialog-btn confirm-dialog-btn-cancel"
          >
            {cancelText}
          </button>
          <button 
            onClick={handleConfirm} 
            className={`confirm-dialog-btn confirm-dialog-btn-confirm ${type}`}
            autoFocus
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
