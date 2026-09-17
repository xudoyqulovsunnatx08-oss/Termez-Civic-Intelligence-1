import { Trophy } from "lucide-react";

export interface RankingRow {
  district: string;
  total: number;
  resolved: number;
  overdue: number;
  avgDays: number;
  score: number;
}

export default function RankingTable({ rows }: { rows: RankingRow[] }) {
  const sorted = [...rows].sort((a, b) => b.score - a.score);

  return (
    <div className="table-wrap scrollbar-slim">
      <table className="admin-table">
        <thead>
          <tr>
            <th>O'rin</th>
            <th>Hudud</th>
            <th>Jami</th>
            <th>Bajarilgan</th>
            <th>Kechikkan</th>
            <th>O'rt. muddat</th>
            <th>Samaradorlik</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, idx) => (
            <tr key={row.district}>
              <td>
                <span className="rank-badge">
                  {idx < 3 && <Trophy size={13} />} {idx + 1}
                </span>
              </td>
              <td style={{ fontWeight: 700 }}>{row.district}</td>
              <td>{row.total}</td>
              <td>{row.resolved}</td>
              <td className={row.overdue > 0 ? "cell-danger" : ""}>{row.overdue}</td>
              <td>{row.avgDays} kun</td>
              <td>
                <div className="score-bar-wrap">
                  <div className="score-bar" style={{ width: `${row.score}%` }} />
                  <span>{row.score}%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
