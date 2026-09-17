import { useMemo, useState } from "react";
import { Inbox, Sparkles, Loader2, CheckCircle2, AlertTriangle, Eye, Search } from "lucide-react";
import type { Complaint, District, Status } from "../types";
import { STATUS_FLOW } from "../types";
import StatCard from "../components/StatCard";
import CategoryIcon from "../components/CategoryIcon";
import { StatusBadge, PriorityBadge } from "../components/Badges";
import DistrictDetailModal from "../components/DistrictDetailModal";
import RejectModal from "../components/RejectModal";
import { getAllComplaints, updateComplaint, addAuditEntry } from "../utils/storage";
import { formatDateShort, isOverdue } from "../utils/helpers";
import { REJECTION_LEGAL_NOTE } from "../data/legalNotices";

export default function DistrictDashboard({ district }: { district: District }) {
  const [complaints, setComplaints] = useState<Complaint[]>(() =>
    getAllComplaints().filter((c) => c.district === district)
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "Hammasi">("Hammasi");
  const [selected, setSelected] = useState<Complaint | null>(null);
  const [rejectTarget, setRejectTarget] = useState<Complaint | null>(null);

  function refresh() {
    setComplaints(getAllComplaints().filter((c) => c.district === district));
  }

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch =
        !searchTerm.trim() ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "Hammasi" || c.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [complaints, searchTerm, statusFilter]);

  const total = complaints.length;
  const newCount = complaints.filter((c) => c.status === "Yangi" || c.status === "Qabul qilindi").length;
  const inProgress = complaints.filter(
    (c) => c.status === "Mas'ulga yuborildi" || c.status === "Jarayonda"
  ).length;
  const done = complaints.filter((c) => c.status === "Bajarildi").length;
  const overdue = complaints.filter((c) => isOverdue(c.dueDate, c.status)).length;

  function handleSave(updated: Complaint) {
    updateComplaint(updated);
    addAuditEntry({
      actorRole: "district",
      actorName: `${district} hokimligi`,
      action: `${updated.id} murojaatini "${updated.status}" holatiga o'tkazdi`,
      complaintId: updated.id,
    });
    refresh();
    setSelected(updated);
  }

  function handleReject(reason: string, attachLegal: boolean) {
    if (!rejectTarget) return;
    const now = new Date().toISOString();
    const updated: Complaint = {
      ...rejectTarget,
      status: "Rad etildi",
      rejectionReason: reason,
      rejectionLegal: attachLegal ? REJECTION_LEGAL_NOTE : null,
      updatedAt: now,
      history: [...rejectTarget.history, { status: "Rad etildi", date: now }],
    };
    updateComplaint(updated);
    addAuditEntry({
      actorRole: "district",
      actorName: `${district} hokimligi`,
      action: attachLegal
        ? `${updated.id} murojaatini huquqiy asosda rad etdi`
        : `${updated.id} murojaatini rad etdi`,
      complaintId: updated.id,
    });
    refresh();
    setRejectTarget(null);
    setSelected(null);
  }

  return (
    <div className="page admin-page">
      <section className="admin-hero">
        <div className="container-wide">
          <span className="eyebrow">Tuman hokimligi paneli</span>
          <h1>{district}</h1>
          <p>Ushbu hududga tegishli murojaatlarni boshqaring va ijroni nazorat qiling.</p>
        </div>
      </section>

      <section className="container-wide">
        <div className="stats-grid admin-stats-grid">
          <StatCard icon={Inbox} label="Jami" value={total} tone="navy" />
          <StatCard icon={Sparkles} label="Yangi topshiriqlar" value={newCount} tone="amber" />
          <StatCard icon={Loader2} label="Jarayonda" value={inProgress} tone="turquoise" />
          <StatCard icon={CheckCircle2} label="Bajarildi" value={done} tone="green" />
        </div>

        {overdue > 0 && (
          <div className="overdue-banner">
            <AlertTriangle size={16} /> Diqqat: {overdue} ta murojaat muddati o'tib ketgan.
          </div>
        )}

        <div className="admin-panel card">
          <div className="admin-toolbar">
            <div className="search-bar admin-search">
              <Search size={17} className="search-icon" />
              <input
                type="text"
                placeholder="ID yoki F.I.Sh. bo'yicha qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="admin-filters">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as Status | "Hammasi")}>
                <option value="Hammasi">Barcha statuslar</option>
                {[...STATUS_FLOW, "Rad etildi" as Status].map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="table-wrap scrollbar-slim">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>F.I.Sh.</th>
                  <th>Kategoriya</th>
                  <th>Muhimlik</th>
                  <th>Status</th>
                  <th>Muddat</th>
                  <th>Sana</th>
                  <th>Amal</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((c) => (
                  <tr key={c.id} className={isOverdue(c.dueDate, c.status) ? "row-overdue" : ""}>
                    <td className="cell-id">{c.id}</td>
                    <td>{c.fullName}</td>
                    <td>
                      <span className="cell-category">
                        <CategoryIcon category={c.category} size={15} />
                        {c.category}
                      </span>
                    </td>
                    <td>
                      <PriorityBadge priority={c.priority} />
                    </td>
                    <td>
                      <StatusBadge status={c.status} />
                    </td>
                    <td className="cell-date">
                      {c.dueDate ? formatDateShort(c.dueDate) : "—"}
                      {isOverdue(c.dueDate, c.status) && <span className="overdue-tag">kechikkan</span>}
                    </td>
                    <td className="cell-date">{formatDateShort(c.createdAt)}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => setSelected(c)}>
                        <Eye size={14} /> Ko'rish
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={8} className="table-empty">
                      Filtrlarga mos murojaat topilmadi.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {selected && (
        <DistrictDetailModal
          complaint={selected}
          district={district}
          onClose={() => setSelected(null)}
          onSave={handleSave}
          onRejectClick={() => {
            setRejectTarget(selected);
            setSelected(null);
          }}
        />
      )}

      {rejectTarget && (
        <RejectModal
          complaintId={rejectTarget.id}
          onCancel={() => setRejectTarget(null)}
          onConfirm={handleReject}
        />
      )}
    </div>
  );
}
