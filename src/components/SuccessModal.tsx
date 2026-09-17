import { CheckCircle2, Copy, X, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SuccessModalProps {
  requestId: string;
  onClose: () => void;
}

export default function SuccessModal({ requestId, onClose }: SuccessModalProps) {
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  function handleCopy() {
    navigator.clipboard?.writeText(requestId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Yopish">
          <X size={18} />
        </button>
        <div className="modal-success-icon">
          <CheckCircle2 size={34} strokeWidth={2} />
        </div>
        <h3>Murojaatingiz qabul qilindi</h3>
        <p className="modal-desc">
          Murojaatingiz tegishli bo'lim tomonidan ko'rib chiqiladi. Quyidagi ID raqami
          orqali holatni istalgan vaqtda tekshirishingiz mumkin.
        </p>

        <div className="modal-id-box">
          <span className="modal-id-label">Murojaat raqami</span>
          <div className="modal-id-row">
            <span className="modal-id-value">{requestId}</span>
            <button className="modal-copy-btn" onClick={handleCopy}>
              <Copy size={15} />
              {copied ? "Nusxalandi" : "Nusxalash"}
            </button>
          </div>
        </div>

        <div className="modal-actions">
          <button
            className="btn btn-primary btn-block"
            onClick={() => navigate(`/fuqaro/murojaat/${requestId}`)}
          >
            Holatni ko'rish <ArrowRight size={16} />
          </button>
          <button className="btn btn-ghost btn-block" onClick={onClose}>
            Kabinetga qaytish
          </button>
        </div>
      </div>
    </div>
  );
}
