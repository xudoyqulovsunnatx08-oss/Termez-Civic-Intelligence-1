import { History } from "lucide-react";
import type { AuditLogEntry } from "../types";
import { formatDate } from "../utils/helpers";

export default function AuditLogTable({ entries }: { entries: AuditLogEntry[] }) {
  return (
    <div className="table-wrap scrollbar-slim">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Vaqt</th>
            <th>Rol</th>
            <th>Amalga oshirgan</th>
            <th>Amal</th>
            <th>Murojaat</th>
          </tr>
        </thead>
        <tbody>
          {entries.map((e) => (
            <tr key={e.id}>
              <td className="cell-date">{formatDate(e.timestamp)}</td>
              <td>
                <span className="chip tone-navy-solid">
                  {e.actorRole === "city" ? "Shahar" : e.actorRole === "district" ? "Tuman" : "Fuqaro"}
                </span>
              </td>
              <td>{e.actorName}</td>
              <td>
                <span className="audit-action">
                  <History size={14} /> {e.action}
                </span>
              </td>
              <td className="cell-id">{e.complaintId ?? "—"}</td>
            </tr>
          ))}
          {entries.length === 0 && (
            <tr>
              <td colSpan={5} className="table-empty">
                Hozircha audit yozuvlari mavjud emas.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
