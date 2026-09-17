import type { Priority, Status } from "../types";
import { statusToneClass, priorityToneClass } from "../utils/helpers";

export function StatusBadge({ status }: { status: Status }) {
  return <span className={"chip " + statusToneClass(status)}>{status}</span>;
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  return <span className={"chip " + priorityToneClass(priority)}>{priority}</span>;
}
