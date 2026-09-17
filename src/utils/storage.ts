import type { AuditLogEntry, Citizen, Complaint, Session } from "../types";
import { seedCitizens, seedComplaints, seedAuditLog } from "../data/mockData";

const KEYS = {
  complaints: "civic.complaints",
  citizens: "civic.citizens",
  audit: "civic.audit",
  session: "civic.session",
  complaintCounter: "civic.complaintCounter",
  citizenCounter: "civic.citizenCounter",
};

function readJson<T>(key: string, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function initStorage(): void {
  if (!localStorage.getItem(KEYS.complaints)) {
    writeJson(KEYS.complaints, seedComplaints);
    localStorage.setItem(KEYS.complaintCounter, String(seedComplaints.length));
  }
  if (!localStorage.getItem(KEYS.citizens)) {
    writeJson(KEYS.citizens, seedCitizens);
    localStorage.setItem(KEYS.citizenCounter, String(seedCitizens.length));
  }
  if (!localStorage.getItem(KEYS.audit)) {
    writeJson(KEYS.audit, seedAuditLog);
  }
}

// ---------- Complaints ----------
export function getAllComplaints(): Complaint[] {
  initStorage();
  return readJson<Complaint[]>(KEYS.complaints, []).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function saveAllComplaints(list: Complaint[]): void {
  writeJson(KEYS.complaints, list);
}

export function getComplaintById(id: string): Complaint | undefined {
  return getAllComplaints().find((c) => c.id.toLowerCase() === id.trim().toLowerCase());
}

export function addComplaint(c: Complaint): void {
  const all = getAllComplaints();
  all.unshift(c);
  saveAllComplaints(all);
}

export function updateComplaint(updated: Complaint): void {
  const all = getAllComplaints();
  const idx = all.findIndex((c) => c.id === updated.id);
  if (idx !== -1) {
    all[idx] = updated;
    saveAllComplaints(all);
  }
}

export function generateComplaintId(): string {
  const current = parseInt(localStorage.getItem(KEYS.complaintCounter) ?? "0", 10);
  const next = current + 1;
  localStorage.setItem(KEYS.complaintCounter, String(next));
  const year = new Date().getFullYear();
  return `TM-${year}-${String(next).padStart(4, "0")}`;
}

// ---------- Citizens ----------
export function getAllCitizens(): Citizen[] {
  initStorage();
  return readJson<Citizen[]>(KEYS.citizens, []);
}

export function findCitizenByPhone(phone: string): Citizen | undefined {
  return getAllCitizens().find((c) => c.phone === phone.trim());
}

export function findCitizenById(id: string): Citizen | undefined {
  return getAllCitizens().find((c) => c.id === id);
}

export function addCitizen(c: Citizen): void {
  const all = getAllCitizens();
  all.push(c);
  writeJson(KEYS.citizens, all);
}

export function generateCitizenId(): string {
  const current = parseInt(localStorage.getItem(KEYS.citizenCounter) ?? "0", 10);
  const next = current + 1;
  localStorage.setItem(KEYS.citizenCounter, String(next));
  return `C-${String(next).padStart(5, "0")}`;
}

// ---------- Audit log ----------
export function getAuditLog(): AuditLogEntry[] {
  initStorage();
  return readJson<AuditLogEntry[]>(KEYS.audit, []).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

export function addAuditEntry(entry: Omit<AuditLogEntry, "id" | "timestamp">): void {
  const log = getAuditLog();
  const newEntry: AuditLogEntry = {
    ...entry,
    id: `AL-${Date.now()}`,
    timestamp: new Date().toISOString(),
  };
  log.unshift(newEntry);
  writeJson(KEYS.audit, log);
}

// ---------- Session ----------
export function getSession(): Session {
  return readJson<Session>(KEYS.session, null);
}

export function setSession(session: Session): void {
  writeJson(KEYS.session, session);
}

export function clearSession(): void {
  localStorage.removeItem(KEYS.session);
}
