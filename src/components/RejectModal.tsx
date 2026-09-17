import { useState } from "react";
import { X, Ban, ExternalLink, Scale } from "lucide-react";
import { REJECTION_LEGAL_NOTE, NO_LEGAL_BASIS_LABEL } from "../data/legalNotices";

interface RejectModalProps {
  complaintId: string;
  onCancel: () => void;
  onConfirm: (reason: string, attachLegal: boolean) => void;
}

export default function RejectModal({ complaintId, onCancel, onConfirm }: RejectModalProps) {
  const [reason, setReason] = useState("");
  const [attachLegal, setAttachLegal] = useState(false);
  const [error, setError] = useState("");

  function handleConfirm() {
    if (reason.trim().length < 10) {
      setError("Rad etish sababi kamida 10 ta belgidan iborat bo'lishi kerak.");
      return;
    }
    onConfirm(reason.trim(), attachLegal);
  }

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-panel modal-panel-wide" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCancel} aria-label="Yopish">
          <X size={18} />
        </button>
        <div className="legal-modal-icon legal-modal-icon-danger">
          <Ban size={26} strokeWidth={2} />
        </div>
        <h3>Murojaatni rad etish</h3>
        <p className="modal-desc" style={{ textAlign: "left" }}>
          <span className="result-id">{complaintId}</span> murojaatini rad etish uchun asosli
          sababni ko'rsating. Bu sabab fuqaroning shaxsiy kabinetida ko'rsatiladi.
        </p>

        <div className="field">
          <label htmlFor="rejectReason">Rad etish sababi</label>
          <textarea
            id="rejectReason"
            rows={4}
            placeholder="Masalan: ko'rsatilgan manzilda tekshiruv o'tkazildi, muammo tasdiqlanmadi..."
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              setError("");
            }}
          />
          {error && <span className="field-error">{error}</span>}
        </div>

        <label className="legal-checkbox">
          <input
            type="checkbox"
            checked={attachLegal}
            onChange={(e) => setAttachLegal(e.target.checked)}
          />
          <span>Murojaat bila turib yolg'on/asossiz deb topildi (huquqiy bildirishnoma qo'shilsin)</span>
        </label>

        {attachLegal && (
          <div className="legal-box legal-box-compact">
            <div className="legal-box-header">
              <Scale size={15} />
              <span>{REJECTION_LEGAL_NOTE.qonun}</span>
            </div>
            <div className="legal-modda">{REJECTION_LEGAL_NOTE.modda} — {REJECTION_LEGAL_NOTE.moddaNomi}</div>
            <p className="legal-matn">"{REJECTION_LEGAL_NOTE.matn}"</p>
            <a href={REJECTION_LEGAL_NOTE.manbaHavola} target="_blank" rel="noreferrer" className="legal-source">
              <ExternalLink size={13} /> Manba: {REJECTION_LEGAL_NOTE.manba}
            </a>
          </div>
        )}

        {!attachLegal && (
          <p className="field-hint" style={{ marginBottom: 18 }}>
            Huquqiy bildirishnoma qo'shilmasa, fuqaroga faqat "{NO_LEGAL_BASIS_LABEL}" ko'rsatiladi.
          </p>
        )}

        <button className="btn btn-navy btn-block" onClick={handleConfirm}>
          Rad etishni tasdiqlash
        </button>
      </div>
    </div>
  );
}
