import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Calendar, FileText, Scale, ExternalLink, Ban } from "lucide-react";
import CategoryIcon from "../components/CategoryIcon";
import { StatusBadge, PriorityBadge } from "../components/Badges";
import ProgressTracker from "../components/ProgressTracker";
import { getComplaintById } from "../utils/storage";
import { formatDate } from "../utils/helpers";
import { NO_LEGAL_BASIS_LABEL } from "../data/legalNotices";

export default function CitizenComplaintDetail() {
  const { id } = useParams<{ id: string }>();
  const complaint = id ? getComplaintById(id) : undefined;

  if (!complaint) {
    return (
      <div className="page">
        <section className="container check-section">
          <div className="empty-state card">
            <h3>Murojaat topilmadi</h3>
            <p>"{id}" ID raqami bo'yicha murojaat topilmadi.</p>
            <Link to="/fuqaro/kabinet" className="btn btn-primary btn-sm" style={{ marginTop: 16 }}>
              Kabinetga qaytish
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="form-hero">
        <div className="container">
          <Link to="/fuqaro/kabinet" className="back-link">
            <ArrowLeft size={15} /> Kabinetga qaytish
          </Link>
          <h1 style={{ marginTop: 12 }}>{complaint.id}</h1>
        </div>
      </section>

      <section className="container check-section" style={{ paddingTop: 0 }}>
        <div className="result-card card" style={{ marginTop: -50 }}>
          <div className="result-header">
            <div>
              <span className="result-id">
                <CategoryIcon category={complaint.category} size={14} /> {complaint.category}
              </span>
              <h3>{complaint.district}</h3>
            </div>
            <StatusBadge status={complaint.status} />
          </div>

          <div className="result-meta">
            <div className="result-meta-item">
              <MapPin size={16} /> {complaint.mahalla}, {complaint.address}
            </div>
            <div className="result-meta-item">
              <Calendar size={16} /> {formatDate(complaint.createdAt)}
            </div>
            <div className="result-meta-item">
              <PriorityBadge priority={complaint.priority} />
            </div>
          </div>

          <div className="result-description">
            <FileText size={16} />
            <p>{complaint.description}</p>
          </div>

          {complaint.imageDataUrl && (
            <img src={complaint.imageDataUrl} alt="Murojaat rasmi" className="admin-modal-image" />
          )}

          {complaint.assignedOfficial && (
            <div className="result-assigned">
              Mas'ul xodim: <strong>{complaint.assignedOfficial}</strong>
              {complaint.dueDate && (
                <>
                  {" "}
                  · Bajarish muddati: <strong>{formatDate(complaint.dueDate)}</strong>
                </>
              )}
            </div>
          )}

          {complaint.status === "Rad etildi" ? (
            <div className="rejection-box">
              <div className="rejection-box-header">
                <Ban size={16} /> Murojaat rad etildi
              </div>
              <p>{complaint.rejectionReason}</p>

              <div className="legal-box legal-box-compact" style={{ marginTop: 14 }}>
                <div className="legal-box-header">
                  <Scale size={15} />
                  <span>Huquqiy asos</span>
                </div>
                {complaint.rejectionLegal ? (
                  <>
                    <div className="legal-modda">
                      {complaint.rejectionLegal.modda} — {complaint.rejectionLegal.moddaNomi}
                    </div>
                    <p className="legal-matn">"{complaint.rejectionLegal.matn}"</p>
                    <a
                      href={complaint.rejectionLegal.manbaHavola}
                      target="_blank"
                      rel="noreferrer"
                      className="legal-source"
                    >
                      <ExternalLink size={13} /> Manba: {complaint.rejectionLegal.manba}
                    </a>
                  </>
                ) : (
                  <p className="legal-matn">{NO_LEGAL_BASIS_LABEL}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="result-progress">
              <span className="result-progress-title">Ko'rib chiqish jarayoni</span>
              <ProgressTracker currentStatus={complaint.status} history={complaint.history} />
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
