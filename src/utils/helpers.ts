import type { Priority, Status } from "../types";

export function formatDate(iso: string): string {
  const d = new Date(iso);
  const months = [
    "yanvar", "fevral", "mart", "aprel", "may", "iyun",
    "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}, ${String(
    d.getHours()
  ).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function formatDateShort(iso: string): string {
  const d = new Date(iso);
  const months = [
    "yan", "fev", "mar", "apr", "may", "iyn",
    "iyl", "avg", "sen", "okt", "noy", "dek",
  ];
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

export function statusToneClass(status: Status): string {
  switch (status) {
    case "Yangi":
      return "tone-new";
    case "Qabul qilindi":
      return "tone-accepted";
    case "Mas'ulga yuborildi":
      return "tone-assigned";
    case "Jarayonda":
      return "tone-progress";
    case "Bajarildi":
      return "tone-done";
    case "Rad etildi":
      return "tone-rejected";
  }
}

export function priorityToneClass(priority: Priority): string {
  switch (priority) {
    case "Past":
      return "tone-low";
    case "O'rta":
      return "tone-medium";
    case "Yuqori":
      return "tone-high";
    case "Favqulodda":
      return "tone-critical";
  }
}

export function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function isOverdue(dueDate: string | null, status: Status): boolean {
  if (!dueDate) return false;
  if (status === "Bajarildi" || status === "Rad etildi") return false;
  return new Date(dueDate).getTime() < Date.now();
}

export function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86400000);
}
