import { useState } from "react";
import { X, User, MapPin, Calendar, Send, CheckCircle2, RotateCcw, Ban } from "lucide-react";
import type { Complaint, District } from "../types";
import { DISTRICTS } from "../types";
import CategoryIcon from "./CategoryIcon";
import { PriorityBadge, StatusBadge } from "./Badges";
import ProgressTracker from "./ProgressTracker";
import { formatDate } from "../utils/helpers";

interface CityDetailModalProps {
  complaint: Complaint;
  onClose: () => void;
  onForward: (district: District) => void;
  onApprove: () => void;
  onSendBack: () => void;
}

export default function CityDetailModal({
  complaint,
  onClose,
  onForward,
  onApprove,
  onSendBack,
}: CityDetailModalProps) {
  const [forwardTo, setForwardTo] = useState<District>(complaint.district);

  const canForward = complaint.status === "Yangi" || complaint.status === "Qabul qilindi";
  const canReview = complaint.status === "Bajarildi" && complaint.cityReview === "kutilmoqda";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel modal-panel-wide" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Yopish">
          <X size={18} />
        </button>

        <div className="admin-modal-header">
          <span className="result-id">{complaint.id}</span>
          <h3>
            <CategoryIcon category={complaint.category} size={20} /> {complaint.category}
          </h3>
          <div className="admin-modal-badges">
            <StatusBadge status={complaint.status} />
            <PriorityBadge priority={complaint.priority} />
          </div>
        </div>

        <div className="result-meta">
          <div className="result-meta-item">
            <User size={16} /> {complaint.fullName}
          </div>
          <div className="result-meta-item">
            <MapPin size={16} /> {complaint.district} · {complaint.mahalla}
          </div>
          <div className="result-meta-item">
            <Calendar size={16} /> {formatDate(complaint.createdAt)}
          </div>
        </div>

        <p className="admin-modal-desc">{complaint.description}</p>

        {complaint.imageDataUrl && (
          <img src={complaint.imageDataUrl} alt="Murojaat rasmi" className="admin-modal-image" />
        )}

        {complaint.completionImageDataUrl && (
          <>
            <span className="field-hint" style={{ display: "block", marginBottom: 8 }}>
              Bajarilganlik tasdig'i:
            </span>
            <img
              src={complaint.completionImageDataUrl}
              alt="Bajarilgan ish"
              className="admin-modal-image"
            />
          </>
        )}

        {complaint.status !== "Rad etildi" && (
          <div className="result-progress">
            <span className="result-progress-title">Jarayon</span>
            <ProgressTracker currentStatus={complaint.status} history={complaint.history} />
          </div>
        )}

        {complaint.status === "Rad etildi" && (
          <div className="rejection-box">
            <div className="rejection-box-header">
              <Ban size={16} /> Tuman hokimligi tomonidan rad etilgan
            </div>
            <p>{complaint.rejectionReason}</p>
          </div>
        )}

        {canForward && (
          <div className="admin-modal-controls">
            <div className="field field-full">
              <label htmlFor="forwardSelect">Tuman hokimligiga yuborish</label>
              <select
                id="forwardSelect"
                value={forwardTo}
                onChange={(e) => setForwardTo(e.target.value as District)}
              >
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {canForward && (
          <button className="btn btn-primary btn-block" onClick={() => onForward(forwardTo)}>
            <Send size={16} /> Mas'ul hokimlikka yuborish
          </button>
        )}

        {canReview && (
          <div className="admin-modal-actions">
            <button className="btn btn-navy" onClick={onSendBack}>
              <RotateCcw size={16} /> Qayta ishlashga yuborish
            </button>
            <button className="btn btn-primary" onClick={onApprove}>
              <CheckCircle2 size={16} /> Bajarilishni tasdiqlash
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
