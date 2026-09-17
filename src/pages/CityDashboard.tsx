import { useMemo, useState } from "react";
import {
  Inbox,
  Sparkles,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  Eye,
  LayoutGrid,
  Table2,
  Trophy,
  History,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from "recharts";
import type { Complaint, District, Status } from "../types";
import { CATEGORIES, DISTRICTS, STATUS_FLOW } from "../types";
import StatCard from "../components/StatCard";
import CategoryIcon from "../components/CategoryIcon";
import { StatusBadge } from "../components/Badges";
import CityDetailModal from "../components/CityDetailModal";
import ProblemMap from "../components/ProblemMap";
import RankingTable, { type RankingRow } from "../components/RankingTable";
import AuditLogTable from "../components/AuditLogTable";
import { getAllComplaints, updateComplaint, addAuditEntry, getAuditLog } from "../utils/storage";
import { formatDateShort, isOverdue, daysBetween } from "../utils/helpers";

type Tab = "umumiy" | "murojaatlar" | "reyting" | "audit";

const STATUS_COLORS: Record<Status, string> = {
  Yangi: "#e6a13a",
  "Qabul qilindi": "#3d7bc7",
  "Mas'ulga yuborildi": "#7c6bc9",
  Jarayonda: "#14a598",
  Bajarildi: "#12946f",
  "Rad etildi": "#d3554a",
};

export default function CityDashboard() {
  const [tab, setTab] = useState<Tab>("umumiy");
  const [complaints, setComplaints] = useState<Complaint[]>(() => getAllComplaints());
  const [auditLog, setAuditLog] = useState(() => getAuditLog());
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "Hammasi">("Hammasi");
  const [districtFilter, setDistrictFilter] = useState<District | "Hammasi">("Hammasi");
  const [selected, setSelected] = useState<Complaint | null>(null);

  function refresh() {
    setComplaints(getAllComplaints());
    setAuditLog(getAuditLog());
  }

  const total = complaints.length;
  const newCount = complaints.filter((c) => c.status === "Yangi").length;
  const inProgress = complaints.filter(
    (c) => c.status === "Qabul qilindi" || c.status === "Mas'ulga yuborildi" || c.status === "Jarayonda"
  ).length;
  const done = complaints.filter((c) => c.status === "Bajarildi").length;
  const rejected = complaints.filter((c) => c.status === "Rad etildi").length;
  const overdue = complaints.filter((c) => isOverdue(c.dueDate, c.status)).length;

  const categoryStats = useMemo(() => {
    return CATEGORIES.map((cat) => ({
      category: cat,
      count: complaints.filter((c) => c.category === cat).length,
    }));
  }, [complaints]);

  const statusStats = useMemo(() => {
    return [...STATUS_FLOW, "Rad etildi" as Status].map((s) => ({
      status: s,
      count: complaints.filter((c) => c.status === s).length,
      color: STATUS_COLORS[s],
    }));
  }, [complaints]);

  const districtCounts = useMemo(() => {
    const counts = {} as Record<District, number>;
    DISTRICTS.forEach((d) => (counts[d] = 0));
    complaints.forEach((c) => {
      if (c.status !== "Bajarildi" && c.status !== "Rad etildi") {
        counts[c.district] = (counts[c.district] ?? 0) + 1;
      }
    });
    return counts;
  }, [complaints]);

  const rankingRows: RankingRow[] = useMemo(() => {
    return DISTRICTS.map((d) => {
      const rows = complaints.filter((c) => c.district === d);
      const doneRows = rows.filter((c) => c.status === "Bajarildi");
      const overdueCount = rows.filter((c) => isOverdue(c.dueDate, c.status)).length;
      const avgDays =
        doneRows.length === 0
          ? 0
          : Math.round(
              doneRows.reduce((sum, c) => sum + daysBetween(c.createdAt, c.updatedAt), 0) /
                doneRows.length
            );
      const score =
        rows.length === 0
          ? 100
          : Math.max(
              0,
              Math.round(
                (doneRows.length / rows.length) * 100 - overdueCount * 8 - Math.min(avgDays, 20)
              )
            );
      return {
        district: d,
        total: rows.length,
        resolved: doneRows.length,
        overdue: overdueCount,
        avgDays,
        score: Math.min(100, score),
      };
    });
  }, [complaints]);

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchesSearch =
        !searchTerm.trim() ||
        c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.fullName.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "Hammasi" || c.status === statusFilter;
      const matchesDistrict = districtFilter === "Hammasi" || c.district === districtFilter;
      return matchesSearch && matchesStatus && matchesDistrict;
    });
  }, [complaints, searchTerm, statusFilter, districtFilter]);

  function handleForward(district: District) {
    if (!selected) return;
    const now = new Date().toISOString();
    const updated: Complaint = {
      ...selected,
      district,
      status: "Mas'ulga yuborildi",
      updatedAt: now,
      history: [...selected.history, { status: "Mas'ulga yuborildi", date: now }],
    };
    updateComplaint(updated);
    addAuditEntry({
      actorRole: "city",
      actorName: "Shahar hokimligi",
      action: `${updated.id} murojaatini ${district} hokimligiga yubordi`,
      complaintId: updated.id,
    });
    refresh();
    setSelected(null);
  }

  function handleApprove() {
    if (!selected) return;
    const updated: Complaint = { ...selected, cityReview: "tasdiqlandi" };
    updateComplaint(updated);
    addAuditEntry({
      actorRole: "city",
      actorName: "Shahar hokimligi",
      action: `${updated.id} murojaatining bajarilishini tasdiqladi`,
      complaintId: updated.id,
    });
    refresh();
    setSelected(null);
  }

  function handleSendBack() {
    if (!selected) return;
    const now = new Date().toISOString();
    const updated: Complaint = {
      ...selected,
      status: "Jarayonda",
      cityReview: "yo'q",
      completionImageDataUrl: null,
      updatedAt: now,
      history: [...selected.history, { status: "Jarayonda", date: now, note: "Shahar hokimligi qayta ishlashga yubordi" }],
    };
    updateComplaint(updated);
    addAuditEntry({
      actorRole: "city",
      actorName: "Shahar hokimligi",
      action: `${updated.id} murojaatini qayta ishlashga qaytardi`,
      complaintId: updated.id,
    });
    refresh();
    setSelected(null);
  }

  return (
    <div className="page admin-page">
      <section className="admin-hero">
        <div className="container-wide">
          <span className="eyebrow">Shahar hokimligi paneli</span>
          <h1>Termiz shahar hokimligi — Dashboard</h1>
          <p>Barcha hududlar bo'yicha murojaatlar, statistika va nazorat.</p>
        </div>
      </section>

      <section className="container-wide">
        <div className="stats-grid city-stats-grid">
          <StatCard icon={Inbox} label="Jami" value={total} tone="navy" />
          <StatCard icon={Sparkles} label="Yangi" value={newCount} tone="amber" />
          <StatCard icon={Loader2} label="Jarayonda" value={inProgress} tone="turquoise" />
          <StatCard icon={CheckCircle2} label="Bajarildi" value={done} tone="green" />
          <StatCard icon={XCircle} label="Rad etildi" value={rejected} tone="blue" />
        </div>

        {overdue > 0 && (
          <div className="overdue-banner">
            <AlertTriangle size={16} /> Diqqat: barcha hududlar bo'yicha {overdue} ta murojaat
            muddati o'tib ketgan.
          </div>
        )}

        <div className="tab-bar">
          <button className={"tab-btn" + (tab === "umumiy" ? " tab-btn-active" : "")} onClick={() => setTab("umumiy")}>
            <LayoutGrid size={15} /> Umumiy
          </button>
          <button className={"tab-btn" + (tab === "murojaatlar" ? " tab-btn-active" : "")} onClick={() => setTab("murojaatlar")}>
            <Table2 size={15} /> Murojaatlar
          </button>
          <button className={"tab-btn" + (tab === "reyting" ? " tab-btn-active" : "")} onClick={() => setTab("reyting")}>
            <Trophy size={15} /> Tuman reytingi
          </button>
          <button className={"tab-btn" + (tab === "audit" ? " tab-btn-active" : "")} onClick={() => setTab("audit")}>
            <History size={15} /> Audit tarixi
          </button>
        </div>

        {tab === "umumiy" && (
          <div className="stats-page" style={{ padding: 0 }}>
            <div className="chart-card card">
              <h3>Kategoriyalar bo'yicha murojaatlar</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={categoryStats} margin={{ top: 8, right: 12, left: -12, bottom: 8 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#dde6ec" vertical={false} />
                  <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#506575" }} angle={-25} textAnchor="end" interval={0} height={70} />
                  <YAxis tick={{ fontSize: 12, fill: "#506575" }} />
                  <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #dde6ec", fontSize: 13 }} />
                  <Bar dataKey="count" name="Murojaatlar" fill="#14a598" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="stats-page-row">
              <div className="chart-card card">
                <h3>Status bo'yicha taqsimot</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie data={statusStats} dataKey="count" nameKey="status" innerRadius={58} outerRadius={96} paddingAngle={2}>
                      {statusStats.map((entry) => (
                        <Cell key={entry.status} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 10, border: "1px solid #dde6ec", fontSize: 13 }} />
                    <Legend layout="vertical" verticalAlign="middle" align="right" iconType="circle" wrapperStyle={{ fontSize: 11.5, lineHeight: "20px" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card card">
                <h3>Muammolar xaritasi</h3>
                <ProblemMap counts={districtCounts} />
              </div>
            </div>
          </div>
        )}

        {tab === "murojaatlar" && (
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
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <select value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value as District | "Hammasi")}>
                  <option value="Hammasi">Barcha hududlar</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
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
                    <th>Hudud</th>
                    <th>Status</th>
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
                      <td>{c.district}</td>
                      <td>
                        <StatusBadge status={c.status} />
                        {c.status === "Bajarildi" && c.cityReview === "kutilmoqda" && (
                          <span className="pending-tag">tasdiq kutmoqda</span>
                        )}
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
                      <td colSpan={7} className="table-empty">Filtrlarga mos murojaat topilmadi.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === "reyting" && (
          <div className="admin-panel card">
            <RankingTable rows={rankingRows} />
          </div>
        )}

        {tab === "audit" && (
          <div className="admin-panel card">
            <AuditLogTable entries={auditLog} />
          </div>
        )}
      </section>

      {selected && (
        <CityDetailModal
          complaint={selected}
          onClose={() => setSelected(null)}
          onForward={handleForward}
          onApprove={handleApprove}
          onSendBack={handleSendBack}
        />
      )}
    </div>
  );
}
