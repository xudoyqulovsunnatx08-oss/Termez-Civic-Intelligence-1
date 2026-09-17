import { useRef, useState } from "react";
import { X, User, MapPin, Calendar, Save, Ban, ImagePlus } from "lucide-react";
import type { Complaint, District, Status } from "../types";
import { RESPONSIBLE_OFFICIALS, STATUS_FLOW } from "../types";
import CategoryIcon from "./CategoryIcon";
import { PriorityBadge, StatusBadge } from "./Badges";
import ProgressTracker from "./ProgressTracker";
import { formatDate, fileToDataUrl } from "../utils/helpers";

interface DistrictDetailModalProps {
  complaint: Complaint;
  district: District;
  onClose: () => void;
  onSave: (updated: Complaint) => void;
  onRejectClick: () => void;
}

export default function DistrictDetailModal({
  complaint,
  district,
  onClose,
  onSave,
  onRejectClick,
}: DistrictDetailModalProps) {
  const [status, setStatus] = useState<Status>(
    complaint.status === "Rad etildi" ? "Yangi" : complaint.status
  );
  const [assignedOfficial, setAssignedOfficial] = useState(complaint.assignedOfficial ?? "");
  const [dueDate, setDueDate] = useState(
    complaint.dueDate ? complaint.dueDate.slice(0, 10) : ""
  );
  const [completionImage, setCompletionImage] = useState<string | null>(
    complaint.completionImageDataUrl
  );
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const officials = RESPONSIBLE_OFFICIALS[district];

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    setCompletionImage(dataUrl);
  }

  function handleSave() {
    if (status === "Bajarildi" && !completionImage) {
      alert("Bajarilgan ish uchun tasdiqlovchi fotosurat yuklashingiz kerak.");
      return;
    }
    const now = new Date().toISOString();
    const statusChanged = status !== complaint.status;
    const newHistory = statusChanged
      ? [...complaint.history, { status, date: now }]
      : complaint.history;

    const updated: Complaint = {
      ...complaint,
      status,
      assignedOfficial: assignedOfficial || null,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      completionImageDataUrl: completionImage,
      cityReview: status === "Bajarildi" ? "kutilmoqda" : complaint.cityReview,
      updatedAt: now,
      history: newHistory,
    };
    onSave(updated);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  }

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
            <MapPin size={16} /> {complaint.mahalla}, {complaint.address}
          </div>
          <div className="result-meta-item">
            <Calendar size={16} /> {formatDate(complaint.createdAt)}
          </div>
        </div>

        <p className="admin-modal-desc">{complaint.description}</p>

        {complaint.imageDataUrl && (
          <img src={complaint.imageDataUrl} alt="Murojaat rasmi" className="admin-modal-image" />
        )}

        {complaint.status !== "Rad etildi" && (
          <div className="result-progress">
            <span className="result-progress-title">Jarayon</span>
            <ProgressTracker currentStatus={complaint.status} history={complaint.history} />
          </div>
        )}

        {complaint.status !== "Rad etildi" && (
          <>
            <div className="admin-modal-controls">
              <div className="field">
                <label htmlFor="statusSelect">Statusni o'zgartirish</label>
                <select
                  id="statusSelect"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Status)}
                >
                  {STATUS_FLOW.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="officialSelect">Mas'ul xodim</label>
                <select
                  id="officialSelect"
                  value={assignedOfficial}
                  onChange={(e) => setAssignedOfficial(e.target.value)}
                >
                  <option value="">Tayinlanmagan</option>
                  {officials.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="admin-modal-controls">
              <div className="field">
                <label htmlFor="dueDate">Bajarish muddati</label>
                <input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div className="field">
                <label>Bajarilgan ish fotosi {status === "Bajarildi" && "(majburiy)"}</label>
                {completionImage ? (
                  <div className="image-preview">
                    <img src={completionImage} alt="Bajarilgan ish" />
                    <div className="image-preview-meta">
                      <button
                        type="button"
                        onClick={() => setCompletionImage(null)}
                        className="image-remove"
                      >
                        <X size={14} /> O'chirish
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="dropzone dropzone-compact">
                    <ImagePlus size={20} strokeWidth={1.6} />
                    <span>Fayl tanlash</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      hidden
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="admin-modal-actions">
              <button className="btn btn-navy" onClick={onRejectClick}>
                <Ban size={16} /> Rad etish
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={16} /> {saved ? "Saqlandi" : "Saqlash"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
