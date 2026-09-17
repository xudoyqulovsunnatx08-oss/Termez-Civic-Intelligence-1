import { useRef, useState, type FormEvent } from "react";
import { ImagePlus, X, Send } from "lucide-react";
import { CATEGORIES, DISTRICTS, PRIORITIES, STATUS_FLOW } from "../types";
import type { Category, Citizen, Complaint, ComplaintDraft, District, Priority } from "../types";
import CategoryIcon from "../components/CategoryIcon";
import LegalWarningModal from "../components/LegalWarningModal";
import SuccessModal from "../components/SuccessModal";
import Toast from "../components/Toast";
import { SUBMIT_WARNING } from "../data/legalNotices";
import { addComplaint, generateComplaintId } from "../utils/storage";
import { fileToDataUrl } from "../utils/helpers";

const emptyDraft: ComplaintDraft = {
  category: "",
  district: "",
  mahalla: "",
  address: "",
  description: "",
  priority: "O'rta",
  imageDataUrl: null,
};

type Errors = Partial<Record<keyof ComplaintDraft, string>>;

export default function CitizenSubmit({ citizen }: { citizen: Citizen }) {
  const [draft, setDraft] = useState<ComplaintDraft>(emptyDraft);
  const [errors, setErrors] = useState<Errors>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof ComplaintDraft>(key: K, value: ComplaintDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setToastMsg("Rasm hajmi 5 MB dan oshmasligi kerak.");
      return;
    }
    const dataUrl = await fileToDataUrl(file);
    setImagePreview(dataUrl);
    setImageName(file.name);
    update("imageDataUrl", dataUrl);
  }

  function removeImage() {
    setImagePreview(null);
    setImageName("");
    update("imageDataUrl", null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function validate(): boolean {
    const next: Errors = {};
    if (!draft.category) next.category = "Kategoriyani tanlang";
    if (!draft.district) next.district = "Hududni tanlang";
    if (!draft.mahalla.trim()) next.mahalla = "Mahallani kiriting";
    if (!draft.address.trim()) next.address = "Aniq manzilni kiriting";
    if (!draft.description.trim() || draft.description.trim().length < 15) {
      next.description = "Muammoni kamida 15 ta belgi bilan tavsiflang";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleFormSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) {
      setToastMsg("Iltimos, formadagi xatoliklarni to'g'rilang.");
      return;
    }
    setShowLegalModal(true);
  }

  function finalizeSubmit() {
    const id = generateComplaintId();
    const now = new Date().toISOString();
    const complaint: Complaint = {
      id,
      citizenId: citizen.id,
      fullName: citizen.fullName,
      phone: citizen.phone,
      category: draft.category as Category,
      district: draft.district as District,
      mahalla: draft.mahalla.trim(),
      address: draft.address.trim(),
      description: draft.description.trim(),
      priority: draft.priority,
      imageDataUrl: draft.imageDataUrl,
      status: "Yangi",
      assignedOfficial: null,
      dueDate: null,
      completionImageDataUrl: null,
      rejectionReason: null,
      rejectionLegal: null,
      cityReview: "yo'q",
      createdAt: now,
      updatedAt: now,
      history: [{ status: STATUS_FLOW[0], date: now }],
    };

    addComplaint(complaint);
    setShowLegalModal(false);
    setSubmittedId(id);
    setDraft(emptyDraft);
    removeImage();
  }

  return (
    <div className="page">
      <section className="form-hero">
        <div className="container">
          <span className="eyebrow">Yangi murojaat</span>
          <h1>Murojaat yuborish</h1>
          <p>Muammoni tasvirlab bering — murojaatingiz avtomatik ID bilan ro'yxatga olinadi.</p>
        </div>
      </section>

      <section className="container form-section">
        <form className="form-card card" onSubmit={handleFormSubmit} noValidate>
          <div className="form-grid">
            <div className="field">
              <label htmlFor="category">Kategoriya</label>
              <select
                id="category"
                value={draft.category}
                onChange={(e) => update("category", e.target.value as Category)}
                className={errors.category ? "input-error" : ""}
              >
                <option value="">Tanlang...</option>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              {errors.category && <span className="field-error">{errors.category}</span>}
            </div>

            <div className="field">
              <label htmlFor="district">Viloyat/Shahar/Tuman</label>
              <select
                id="district"
                value={draft.district}
                onChange={(e) => update("district", e.target.value as District)}
                className={errors.district ? "input-error" : ""}
              >
                <option value="">Tanlang...</option>
                {DISTRICTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
              {errors.district && <span className="field-error">{errors.district}</span>}
            </div>

            <div className="field">
              <label htmlFor="mahalla">Mahalla</label>
              <input
                id="mahalla"
                type="text"
                placeholder="Masalan: Do'stlik MFY"
                value={draft.mahalla}
                onChange={(e) => update("mahalla", e.target.value)}
                className={errors.mahalla ? "input-error" : ""}
              />
              {errors.mahalla && <span className="field-error">{errors.mahalla}</span>}
            </div>

            <div className="field">
              <label htmlFor="address">Aniq manzil</label>
              <input
                id="address"
                type="text"
                placeholder="Ko'cha nomi, uy raqami"
                value={draft.address}
                onChange={(e) => update("address", e.target.value)}
                className={errors.address ? "input-error" : ""}
              />
              {errors.address && <span className="field-error">{errors.address}</span>}
            </div>

            <div className="field field-full">
              <label htmlFor="description">Muammo tavsifi</label>
              <textarea
                id="description"
                rows={5}
                placeholder="Muammoni imkon qadar batafsil tasvirlab bering..."
                value={draft.description}
                onChange={(e) => update("description", e.target.value)}
                className={errors.description ? "input-error" : ""}
              />
              <div className="field-footer">
                {errors.description ? (
                  <span className="field-error">{errors.description}</span>
                ) : (
                  <span className="field-hint">Kamida 15 ta belgi</span>
                )}
                <span className="field-count">{draft.description.length} belgi</span>
              </div>
            </div>

            <div className="field field-full">
              <label>Dolzarblik darajasi</label>
              <div className="priority-select">
                {PRIORITIES.map((p) => (
                  <button
                    type="button"
                    key={p}
                    className={
                      "priority-option priority-" +
                      p.toLowerCase().replace("'", "") +
                      (draft.priority === p ? " priority-option-active" : "")
                    }
                    onClick={() => update("priority", p as Priority)}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div className="field field-full">
              <label>Foto/video (ixtiyoriy)</label>
              {!imagePreview ? (
                <label className="dropzone">
                  <ImagePlus size={26} strokeWidth={1.6} />
                  <span>Fayl tanlash uchun bosing</span>
                  <small>PNG, JPG — 5 MB gacha</small>
                  <input
                    ref={fileInputRef}
                    type="file"
  accept="image/png,image/jpeg,image/webp,video/mp4,video/webm,video/quicktime"
                    onChange={handleImageChange}
                    hidden
                  />
                </label>
              ) : (
                <div className="image-preview">
                  <img src={imagePreview} alt="Yuklangan rasm" />
                  <div className="image-preview-meta">
                    <span>{imageName}</span>
                    <button type="button" onClick={removeImage} className="image-remove">
                      <X size={14} /> O'chirish
                    </button>
                  </div>
                </div>
              )}
            </div>

            {draft.category && (
              <div className="category-preview">
                <CategoryIcon category={draft.category as Category} size={16} />
                {draft.category} kategoriyasi tanlandi
              </div>
            )}
          </div>

          <div className="form-footer">
            <div className="form-note">Yuborishdan oldin huquqiy ogohlantirish ko'rsatiladi.</div>
            <button type="submit" className="btn btn-primary">
              Davom etish <Send size={16} />
            </button>
          </div>
        </form>
      </section>

      {showLegalModal && (
        <LegalWarningModal
          legal={SUBMIT_WARNING}
          onAgree={finalizeSubmit}
          onCancel={() => setShowLegalModal(false)}
        />
      )}

      {submittedId && (
        <SuccessModal requestId={submittedId} onClose={() => setSubmittedId(null)} />
      )}

      {toastMsg && (
        <div className="toast-stack">
          <Toast message={toastMsg} tone="error" onClose={() => setToastMsg(null)} />
        </div>
      )}
    </div>
  );
}
