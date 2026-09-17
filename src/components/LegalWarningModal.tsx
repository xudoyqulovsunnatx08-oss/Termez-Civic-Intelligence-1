import { useState } from "react";
import { Scale, ExternalLink, ShieldAlert } from "lucide-react";
import type { LegalBasis } from "../types";

interface LegalWarningModalProps {
  legal: LegalBasis;
  onAgree: () => void;
  onCancel: () => void;
}

export default function LegalWarningModal({ legal, onAgree, onCancel }: LegalWarningModalProps) {
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-panel modal-panel-wide legal-modal" onClick={(e) => e.stopPropagation()}>
        <div className="legal-modal-icon">
          <ShieldAlert size={28} strokeWidth={2} />
        </div>
        <h3>Huquqiy ogohlantirish</h3>
        <p className="modal-desc" style={{ textAlign: "left" }}>
          Murojaat yuborishdan oldin quyidagi qonun normasi bilan tanishib chiqing. Bila
          turib yolg'on ma'lumot berish qonun bo'yicha javobgarlikka sabab bo'lishi mumkin.
        </p>

        <div className="legal-box">
          <div className="legal-box-header">
            <Scale size={16} />
            <span>{legal.qonun}</span>
          </div>
          <div className="legal-modda">{legal.modda} — {legal.moddaNomi}</div>
          <p className="legal-matn">"{legal.matn}"</p>
          {legal.qoshimcha && <p className="legal-qoshimcha">{legal.qoshimcha}</p>}
          <a href={legal.manbaHavola} target="_blank" rel="noreferrer" className="legal-source">
            <ExternalLink size={13} /> Manba: {legal.manba}
          </a>
        </div>

        <label className="legal-checkbox">
          <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
          <span>Huquqiy ogohlantirish bilan tanishdim va roziman</span>
        </label>

        <div className="modal-actions">
          <button className="btn btn-primary btn-block" disabled={!agreed} onClick={onAgree}>
            Murojaatni yuborish
          </button>
          <button className="btn btn-ghost btn-block" onClick={onCancel}>
            Bekor qilish
          </button>
        </div>
      </div>
    </div>
  );
}
