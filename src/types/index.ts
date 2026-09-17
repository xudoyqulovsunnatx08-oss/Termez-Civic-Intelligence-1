// ===================== ROLES =====================
export type Role = "citizen" | "district" | "city";

// ===================== SHARED ENUMS =====================
export type Category =
  | "Yo'l"
  | "Ko'cha yoritilishi"
  | "Chiqindi"
  | "Suv"
  | "Obodonlashtirish"
  | "Elektr"
  | "Transport"
  | "Ta'lim"
  | "Tibbiyot"
  | "Boshqa";

export const CATEGORIES: Category[] = [
  "Yo'l",
  "Ko'cha yoritilishi",
  "Chiqindi",
  "Suv",
  "Obodonlashtirish",
  "Elektr",
  "Transport",
  "Ta'lim",
  "Tibbiyot",
  "Boshqa",
];

// "District" here = tuman/shahar hokimligi hududi. "Termiz shahri" boshqaruv
// markazi (shahar hokimligi barcha hududlarni ko'radi).
export type District =
  | "Termiz shahri"
  | "Angor tumani"
  | "Sherobod tumani"
  | "Sho'rchi tumani"
  | "Qumqo'rg'on tumani"
  | "Jarqo'rg'on tumani"
  | "Muzrabot tumani"
  | "Sariosiyo tumani"
  | "Boysun tumani"
  | "Denov tumani"
  | "Uzun tumani"
  | "Oltinsoy tumani";

export const DISTRICTS: District[] = [
  "Termiz shahri",
  "Angor tumani",
  "Sherobod tumani",
  "Sho'rchi tumani",
  "Qumqo'rg'on tumani",
  "Jarqo'rg'on tumani",
  "Muzrabot tumani",
  "Sariosiyo tumani",
  "Boysun tumani",
  "Denov tumani",
  "Uzun tumani",
  "Oltinsoy tumani",
];

export type Priority = "Past" | "O'rta" | "Yuqori" | "Favqulodda";
export const PRIORITIES: Priority[] = ["Past", "O'rta", "Yuqori", "Favqulodda"];

export type Status =
  | "Yangi"
  | "Qabul qilindi"
  | "Mas'ulga yuborildi"
  | "Jarayonda"
  | "Bajarildi"
  | "Rad etildi";

export const STATUS_FLOW: Status[] = [
  "Yangi",
  "Qabul qilindi",
  "Mas'ulga yuborildi",
  "Jarayonda",
  "Bajarildi",
];

export const RESPONSIBLE_OFFICIALS: Record<District, string[]> = {
  "Termiz shahri": ["B. Qodirov (kommunal xo'jalik)", "N. Sharipova (obodonlashtirish)"],
  "Angor tumani": ["S. Nazarov", "D. Yusupova"],
  "Sherobod tumani": ["A. Rahimov", "M. Tosheva"],
  "Sho'rchi tumani": ["J. Ergashev", "K. Nurmatova"],
  "Qumqo'rg'on tumani": ["O. Berdiyev", "G. Xolova"],
  "Jarqo'rg'on tumani": ["R. Sattorov", "F. Qurbonova"],
  "Muzrabot tumani": ["T. Mamatov", "Z. Isayeva"],
  "Sariosiyo tumani": ["I. Yoqubov", "L. Rashidova"],
  "Boysun tumani": ["V. Tursunov", "P. Anorova"],
  "Denov tumani": ["E. Xamidov", "Y. Saidova"],
  "Uzun tumani": ["H. Normurodov", "C. Ibragimova"],
  "Oltinsoy tumani": ["U. G'ulomov", "Sh. Nematova"],
};

// ===================== LEGAL =====================
export interface LegalBasis {
  qonun: string;
  modda: string;
  moddaNomi: string;
  matn: string;
  qoshimcha?: string;
  manba: string;
  manbaHavola: string;
}

// ===================== AUDIT LOG =====================
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorRole: Role;
  actorName: string;
  action: string;
  complaintId?: string;
}

// ===================== CITIZEN =====================
export interface Citizen {
  id: string;
  fullName: string;
  phone: string;
  pinfl: string; // 14 raqamli demo JShShIR (faqat mock)
  docNumber: string; // demo pasport/ID-karta raqami
  password: string; // faqat demo maqsadida, oddiy matn
  registeredAt: string;
}

// ===================== COMPLAINT =====================
export interface RequestHistoryEntry {
  status: Status;
  date: string;
  note?: string;
}

export interface Complaint {
  id: string;
  citizenId: string;
  fullName: string;
  phone: string;
  category: Category;
  district: District;
  mahalla: string;
  address: string;
  description: string;
  priority: Priority;
  imageDataUrl: string | null;
  status: Status;
  assignedOfficial: string | null;
  dueDate: string | null;
  completionImageDataUrl: string | null;
  rejectionReason: string | null;
  rejectionLegal: LegalBasis | null;
  cityReview: "yo'q" | "kutilmoqda" | "tasdiqlandi";
  createdAt: string;
  updatedAt: string;
  history: RequestHistoryEntry[];
}

export interface ComplaintDraft {
  category: Category | "";
  district: District | "";
  mahalla: string;
  address: string;
  description: string;
  priority: Priority;
  imageDataUrl: string | null;
}

// ===================== SESSION =====================
export interface CitizenSession {
  role: "citizen";
  citizenId: string;
}
export interface DistrictSession {
  role: "district";
  district: District;
}
export interface CitySession {
  role: "city";
}
export type Session = CitizenSession | DistrictSession | CitySession | null;
