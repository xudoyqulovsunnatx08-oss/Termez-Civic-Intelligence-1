import { useMemo } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Inbox, CheckCircle2, Loader2, XCircle, Eye } from "lucide-react";
import type { Citizen, District } from "../types";
import { DISTRICTS } from "../types";
import { getAllComplaints } from "../utils/storage";
import { maskDoc, maskPinfl } from "../utils/mask";
import { formatDateShort } from "../utils/helpers";
import { StatusBadge, PriorityBadge } from "../components/Badges";
import CategoryIcon from "../components/CategoryIcon";
import StatCard from "../components/StatCard";
import ProblemMap from "../components/ProblemMap";

export default function CitizenDashboard({ citizen }: { citizen: Citizen }) {
  const allComplaints = useMemo(() => getAllComplaints(), []);
  const myComplaints = useMemo(
    () => allComplaints.filter((c) => c.citizenId === citizen.id),
    [allComplaints, citizen.id]
  );

  const total = myComplaints.length;
  const active = myComplaints.filter(
    (c) => c.status !== "Bajarildi" && c.status !== "Rad etildi"
  ).length;
  const done = myComplaints.filter((c) => c.status === "Bajarildi").length;
  const rejected = myComplaints.filter((c) => c.status === "Rad etildi").length;

  const districtCounts = useMemo(() => {
    const counts = {} as Record<District, number>;
    DISTRICTS.forEach((d) => (counts[d] = 0));
    allComplaints.forEach((c) => {
      if (c.status !== "Bajarildi" && c.status !== "Rad etildi") {
        counts[c.district] = (counts[c.district] ?? 0) + 1;
      }
    });
    return counts;
  }, [allComplaints]);

  return (
    <div className="page">
      <section className="form-hero">
        <div className="container">
          <span className="eyebrow">Shaxsiy kabinet</span>
          <h1>Xush kelibsiz, {citizen.fullName}</h1>
          <p>
            JShShIR: <span className="mono-mask">{maskPinfl(citizen.pinfl)}</span> · Hujjat:{" "}
            <span className="mono-mask">{maskDoc(citizen.docNumber)}</span>
          </p>
        </div>
      </section>

      <section className="container-wide">
        <div className="stats-grid admin-stats-grid">
          <StatCard icon={Inbox} label="Jami murojaatlarim" value={total} tone="navy" />
          <StatCard icon={Loader2} label="Faol" value={active} tone="turquoise" />
          <StatCard icon={CheckCircle2} label="Bajarildi" value={done} tone="green" />
          <StatCard icon={XCircle} label="Rad etildi" value={rejected} tone="amber" />
        </div>

        <div className="dashboard-row">
          <div className="card admin-panel dashboard-main">
            <div className="dashboard-panel-header">
              <h3>Mening murojaatlarim</h3>
              <Link to="/fuqaro/murojaat/yangi" className="btn btn-primary btn-sm">
                <PlusCircle size={15} /> Yangi murojaat
              </Link>
            </div>

            <div className="table-wrap scrollbar-slim">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Kategoriya</th>
                    <th>Hudud</th>
                    <th>Muhimlik</th>
                    <th>Status</th>
                    <th>Sana</th>
                    <th>Amal</th>
                  </tr>
                </thead>
                <tbody>
                  {myComplaints.map((c) => (
                    <tr key={c.id}>
                      <td className="cell-id">{c.id}</td>
                      <td>
                        <span className="cell-category">
                          <CategoryIcon category={c.category} size={15} />
                          {c.category}
                        </span>
                      </td>
                      <td>{c.district}</td>
                      <td>
                        <PriorityBadge priority={c.priority} />
                      </td>
                      <td>
                        <StatusBadge status={c.status} />
                      </td>
                      <td className="cell-date">{formatDateShort(c.createdAt)}</td>
                      <td>
                        <Link to={`/fuqaro/murojaat/${c.id}`} className="btn btn-ghost btn-sm">
                          <Eye size={14} /> Ko'rish
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {myComplaints.length === 0 && (
                    <tr>
                      <td colSpan={7} className="table-empty">
                        Siz hali murojaat yubormagansiz.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card dashboard-side">
            <h3 style={{ marginBottom: 16, fontSize: 16 }}>Shahar bo'yicha umumiy holat</h3>
            <ProblemMap counts={districtCounts} />
          </div>
        </div>
      </section>
    </div>
  );
}
