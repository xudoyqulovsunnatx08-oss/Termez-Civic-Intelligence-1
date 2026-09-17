import { Check, X } from "lucide-react";
import { STATUS_FLOW } from "../types";
import type { Status } from "../types";
import { formatDateShort } from "../utils/helpers";

interface ProgressTrackerProps {
  currentStatus: Status;
  history: { status: Status; date: string }[];
}

export default function ProgressTracker({ currentStatus, history }: ProgressTrackerProps) {
  if (currentStatus === "Rad etildi") {
    const rejectedEntry = history.find((h) => h.status === "Rad etildi");
    return (
      <ol className="tracker">
        <li className="tracker-step tracker-step-done">
          <span className="tracker-dot">
            <Check size={13} strokeWidth={3} />
          </span>
          <span className="tracker-label">Yangi</span>
        </li>
        <li className="tracker-step tracker-step-rejected">
          <span className="tracker-dot tracker-dot-rejected">
            <X size={13} strokeWidth={3} />
          </span>
          <span className="tracker-label">Rad etildi</span>
          {rejectedEntry && <span className="tracker-date">{formatDateShort(rejectedEntry.date)}</span>}
        </li>
      </ol>
    );
  }

  const currentIdx = STATUS_FLOW.indexOf(currentStatus);

  return (
    <ol className="tracker">
      {STATUS_FLOW.map((step, idx) => {
        const done = idx < currentIdx;
        const active = idx === currentIdx;
        const entry = history.find((h) => h.status === step);
        return (
          <li
            key={step}
            className={
              "tracker-step" +
              (done ? " tracker-step-done" : "") +
              (active ? " tracker-step-active" : "")
            }
          >
            <span className="tracker-dot">
              {done ? <Check size={13} strokeWidth={3} /> : <span className="tracker-dot-inner" />}
            </span>
            <span className="tracker-label">{step}</span>
            {entry && <span className="tracker-date">{formatDateShort(entry.date)}</span>}
          </li>
        );
      })}
    </ol>
  );
}
