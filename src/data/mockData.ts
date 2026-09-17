import { STATUS_FLOW, RESPONSIBLE_OFFICIALS } from "../types";
import { REJECTION_LEGAL_NOTE, NO_LEGAL_BASIS_LABEL } from "./legalNotices";
import type {
  AuditLogEntry,
  Citizen,
  Complaint,
  District,
  RequestHistoryEntry,
  Status,
} from "../types";

// ---------------- Demo fuqarolar (barchasi o'ylab topilgan, real emas) ----------------
export const seedCitizens: Citizen[] = [
  {
    id: "C-00001",
    fullName: "Alisher Qodirov",
    phone: "+998901234567",
    pinfl: "52101019400012",
    docNumber: "AB1234567",
    password: "demo123",
    registeredAt: "2026-01-12T09:00:00.000Z",
  },
  {
    id: "C-00002",
    fullName: "Nodira Yusupova",
    phone: "+998912345678",
    pinfl: "50302029500034",
    docNumber: "AC9876543",
    password: "demo123",
    registeredAt: "2026-02-03T09:00:00.000Z",
  },
  {
    id: "C-00003",
    fullName: "Bekzod Norqobilov",
    phone: "+998933456789",
    pinfl: "51203039300056",
    docNumber: "AD4567891",
    password: "demo123",
    registeredAt: "2026-03-18T09:00:00.000Z",
  },
];

function buildHistory(finalStatus: Status, createdAt: Date): RequestHistoryEntry[] {
  if (finalStatus === "Rad etildi") {
    const d1 = new Date(createdAt);
    const d2 = new Date(createdAt);
    d2.setDate(d2.getDate() + 3);
    return [
      { status: "Yangi", date: d1.toISOString() },
      { status: "Rad etildi", date: d2.toISOString() },
    ];
  }
  const finalIdx = STATUS_FLOW.indexOf(finalStatus);
  const history: RequestHistoryEntry[] = [];
  for (let i = 0; i <= finalIdx; i++) {
    const d = new Date(createdAt);
    d.setDate(d.getDate() + i * 2);
    history.push({ status: STATUS_FLOW[i], date: d.toISOString() });
  }
  return history;
}

interface SeedInput {
  id: string;
  citizenId: string;
  fullName: string;
  phone: string;
  category: Complaint["category"];
  district: District;
  mahalla: string;
  address: string;
  description: string;
  priority: Complaint["priority"];
  status: Status;
  daysAgo: number;
  rejectionReason?: string;
  hasLegalRejection?: boolean;
  cityReview?: Complaint["cityReview"];
}

const rawSeeds: SeedInput[] = [
  {
    id: "TM-2026-0001", citizenId: "C-00001", fullName: "Alisher Qodirov", phone: "+998901234567",
    category: "Yo'l", district: "Termiz shahri", mahalla: "Al-Xorazmiy MFY", address: "Al-Xorazmiy ko'chasi, 14-uy",
    description: "Ko'cha qoplamasida katta chuqurlar paydo bo'lgan, avtomobillar zarar ko'rmoqda.",
    priority: "Yuqori", status: "Bajarildi", daysAgo: 58, cityReview: "tasdiqlandi",
  },
  {
    id: "TM-2026-0002", citizenId: "C-00002", fullName: "Nodira Yusupova", phone: "+998912345678",
    category: "Ko'cha yoritilishi", district: "Termiz shahri", mahalla: "Mustaqillik MFY", address: "Mustaqillik ko'chasi, 6-chorraha",
    description: "6 ta yorug'lik ustuni ishlamayapti, kechqurun juda qorong'i va xavfli.",
    priority: "O'rta", status: "Jarayonda", daysAgo: 12,
  },
  {
    id: "TM-2026-0003", citizenId: "C-00003", fullName: "Bekzod Norqobilov", phone: "+998933456789",
    category: "Chiqindi", district: "Angor tumani", mahalla: "Do'stlik MFY", address: "Do'stlik ko'chasi, 22-uy",
    description: "Chiqindi konteynerlari 2 haftadan beri bo'shatilmagan, hidi atrofga yoyilmoqda.",
    priority: "Yuqori", status: "Mas'ulga yuborildi", daysAgo: 6,
  },
  {
    id: "TM-2026-0004", citizenId: "C-00001", fullName: "Alisher Qodirov", phone: "+998901234567",
    category: "Suv", district: "Sherobod tumani", mahalla: "Bog'iston MFY", address: "Bog'iston ko'chasi, 9-uy",
    description: "Uch kundan beri ichimlik suvi kelmayapti, qo'shni ko'chalarda ham xuddi shunday muammo bor.",
    priority: "Favqulodda", status: "Jarayonda", daysAgo: 3,
  },
  {
    id: "TM-2026-0005", citizenId: "C-00002", fullName: "Nodira Yusupova", phone: "+998912345678",
    category: "Obodonlashtirish", district: "Termiz shahri", mahalla: "Bahor MFY", address: "Bahor bog'i hududi",
    description: "Bog' hududidagi skameykalar sinib qolgan va o'yin maydonchasi jihozlari zanglagan.",
    priority: "Past", status: "Qabul qilindi", daysAgo: 4,
  },
  {
    id: "TM-2026-0006", citizenId: "C-00003", fullName: "Bekzod Norqobilov", phone: "+998933456789",
    category: "Elektr", district: "Sho'rchi tumani", mahalla: "Yangiobod MFY", address: "Yangiobod ko'chasi, 3-uy",
    description: "Kuchli shamoldan so'ng elektr simlari uzilib tushgan, mahallada 2 kundan beri elektr yo'q.",
    priority: "Favqulodda", status: "Bajarildi", daysAgo: 45, cityReview: "tasdiqlandi",
  },
  {
    id: "TM-2026-0007", citizenId: "C-00001", fullName: "Alisher Qodirov", phone: "+998901234567",
    category: "Transport", district: "Termiz shahri", mahalla: "Al-Xorazmiy MFY", address: "Avtobus bekati, Universitet yo'nalishi",
    description: "12-marshrut avtobuslari jadval bo'yicha yurmayapti, 40 daqiqa kutishga to'g'ri kelmoqda.",
    priority: "O'rta", status: "Yangi", daysAgo: 1,
  },
  {
    id: "TM-2026-0008", citizenId: "C-00002", fullName: "Nodira Yusupova", phone: "+998912345678",
    category: "Ta'lim", district: "Qumqo'rg'on tumani", mahalla: "Guliston MFY", address: "20-maktab",
    description: "Maktab binosining tom qoplamasi yomg'irda oqadi, sinf xonalariga suv o'tib ketmoqda.",
    priority: "Yuqori", status: "Jarayonda", daysAgo: 9,
  },
  {
    id: "TM-2026-0009", citizenId: "C-00003", fullName: "Bekzod Norqobilov", phone: "+998933456789",
    category: "Tibbiyot", district: "Jarqo'rg'on tumani", mahalla: "Chinor MFY", address: "Qishloq shifokorlik punkti",
    description: "Zarur dori-darmonlar yetishmayapti, aholi shaharga borishga majbur bo'lmoqda.",
    priority: "Yuqori", status: "Qabul qilindi", daysAgo: 5,
  },
  {
    id: "TM-2026-0010", citizenId: "C-00001", fullName: "Alisher Qodirov", phone: "+998901234567",
    category: "Yo'l", district: "Muzrabot tumani", mahalla: "Markaziy MFY", address: "Qishloqlararo yo'l, 14-km",
    description: "Ko'prik konstruksiyasi shikastlangan, yuk mashinalari o'tishi xavfli holatga kelgan.",
    priority: "Favqulodda", status: "Mas'ulga yuborildi", daysAgo: 7,
  },
  {
    id: "TM-2026-0011", citizenId: "C-00002", fullName: "Nodira Yusupova", phone: "+998912345678",
    category: "Chiqindi", district: "Sariosiyo tumani", mahalla: "Bozor MFY", address: "Markaziy bozor hududi",
    description: "Bozor hududida chiqindi yig'ish tizimi yo'lga qo'yilmagan.",
    priority: "O'rta", status: "Bajarildi", daysAgo: 33, cityReview: "tasdiqlandi",
  },
  {
    id: "TM-2026-0012", citizenId: "C-00003", fullName: "Bekzod Norqobilov", phone: "+998933456789",
    category: "Ko'cha yoritilishi", district: "Boysun tumani", mahalla: "Chorbog' MFY", address: "Markaziy maydon",
    description: "Markaziy maydondagi chiroqlar kunduzi ham yonib turibdi, elektr behuda sarflanmoqda.",
    priority: "Past", status: "Yangi", daysAgo: 2,
  },
  {
    id: "TM-2026-0013", citizenId: "C-00001", fullName: "Alisher Qodirov", phone: "+998901234567",
    category: "Suv", district: "Denov tumani", mahalla: "Paxtakor MFY", address: "Sug'orish kanali, 3-uchastka",
    description: "Sug'orish kanali to'sib qolgan, dala ekinlarini sug'orishda katta muammolarga duch kelmoqdamiz.",
    priority: "Yuqori", status: "Jarayonda", daysAgo: 14,
  },
  {
    id: "TM-2026-0014", citizenId: "C-00002", fullName: "Nodira Yusupova", phone: "+998912345678",
    category: "Obodonlashtirish", district: "Uzun tumani", mahalla: "Bog'bon MFY", address: "Ko'cha bo'yi, 2-qator",
    description: "Ko'cha bo'yidagi daraxtlar uzoq vaqtdan beri kesilmagan, shoxlar elektr simlariga tegib turibdi.",
    priority: "O'rta", status: "Qabul qilindi", daysAgo: 3,
  },
  {
    id: "TM-2026-0015", citizenId: "C-00003", fullName: "Bekzod Norqobilov", phone: "+998933456789",
    category: "Boshqa", district: "Oltinsoy tumani", mahalla: "Bahoriston MFY", address: "Mahalliy bozor",
    description: "Savdo rastalarining joylashuvi tartibsiz, piyodalar yurish uchun yo'lak qolmagan.",
    priority: "Past", status: "Jarayonda", daysAgo: 10,
  },
  {
    id: "TM-2026-0016", citizenId: "C-00001", fullName: "Alisher Qodirov", phone: "+998901234567",
    category: "Transport", district: "Termiz shahri", mahalla: "Bahor MFY", address: "Bahor ko'chasi to'xtash joyi",
    description: "Ko'cha bo'yida ruxsatsiz avtoturargoh tashkil etilgan, piyodalar yo'lagi butunlay band qilingan.",
    priority: "Past", status: "Rad etildi", daysAgo: 20,
    rejectionReason: "Ko'rsatilgan manzilda tekshiruv o'tkazildi, ruxsatsiz avtoturargoh tasdiqlanmadi — hudud xususiy mulk chegarasida joylashgan.",
    hasLegalRejection: false,
  },
  {
    id: "TM-2026-0017", citizenId: "C-00002", fullName: "Nodira Yusupova", phone: "+998912345678",
    category: "Boshqa", district: "Angor tumani", mahalla: "Do'stlik MFY", address: "Qo'shni hovli",
    description: "Qo'shnim tomonidan asossiz ravishda uydagi devor qurilishi to'xtatilishi kerak, chunki u menga yoqmaydi.",
    priority: "Past", status: "Rad etildi", daysAgo: 15,
    rejectionReason: "Murojaatda bayon etilgan da'vo hujjatlar bilan tasdiqlanmadi va tekshiruvda bila turib asossiz ma'lumot berilgani aniqlandi.",
    hasLegalRejection: true,
  },
  {
    id: "TM-2026-0018", citizenId: "C-00003", fullName: "Bekzod Norqobilov", phone: "+998933456789",
    category: "Elektr", district: "Qumqo'rg'on tumani", mahalla: "Chinor MFY", address: "Yashil ko'cha, 11-uy",
    description: "Transformator budkasi atrofidagi to'siq yo'q, bolalar uchun xavfli.",
    priority: "Yuqori", status: "Jarayonda", daysAgo: 8,
  },
  {
    id: "TM-2026-0019", citizenId: "C-00001", fullName: "Alisher Qodirov", phone: "+998901234567",
    category: "Yo'l", district: "Sariosiyo tumani", mahalla: "Bog'bon MFY", address: "Tog' yo'li, 5-km",
    description: "Yomg'irdan so'ng yo'lning bir qismi yuvilib ketgan, transport harakati sekinlashgan.",
    priority: "O'rta", status: "Bajarildi", daysAgo: 25, cityReview: "kutilmoqda",
  },
  {
    id: "TM-2026-0020", citizenId: "C-00002", fullName: "Nodira Yusupova", phone: "+998912345678",
    category: "Ta'lim", district: "Denov tumani", mahalla: "Chinor MFY", address: "14-maktab",
    description: "Maktabda isitish tizimi ishlamayapti, sovuq kunlarda darslar sovuq xonalarda o'tmoqda.",
    priority: "Favqulodda", status: "Mas'ulga yuborildi", daysAgo: 4,
  },
];

function buildComplaint(seed: SeedInput): Complaint {
  const created = new Date();
  created.setDate(created.getDate() - seed.daysAgo);
  created.setHours(9 + (seed.daysAgo % 8), (seed.daysAgo * 7) % 60, 0, 0);

  const history = buildHistory(seed.status, created);
  const updatedAt = history[history.length - 1]?.date ?? created.toISOString();

  const officials = RESPONSIBLE_OFFICIALS[seed.district];
  const assignedOfficial =
    seed.status === "Yangi" || seed.status === "Qabul qilindi" || seed.status === "Rad etildi"
      ? null
      : officials[seed.daysAgo % officials.length];

  let dueDate: string | null = null;
  if (assignedOfficial) {
    const d = new Date(created);
    d.setDate(d.getDate() + 10);
    dueDate = d.toISOString();
  }

  return {
    id: seed.id,
    citizenId: seed.citizenId,
    fullName: seed.fullName,
    phone: seed.phone,
    category: seed.category,
    district: seed.district,
    mahalla: seed.mahalla,
    address: seed.address,
    description: seed.description,
    priority: seed.priority,
    imageDataUrl: null,
    status: seed.status,
    assignedOfficial,
    dueDate,
    completionImageDataUrl: null,
    rejectionReason: seed.rejectionReason ?? null,
    rejectionLegal: seed.hasLegalRejection ? REJECTION_LEGAL_NOTE : seed.rejectionReason ? null : null,
    cityReview: seed.cityReview ?? (seed.status === "Bajarildi" ? "kutilmoqda" : "yo'q"),
    createdAt: created.toISOString(),
    updatedAt,
    history,
  };
}

export const seedComplaints: Complaint[] = rawSeeds.map(buildComplaint);

export const seedAuditLog: AuditLogEntry[] = [
  {
    id: "AL-seed-1",
    timestamp: seedComplaints[0].updatedAt,
    actorRole: "city",
    actorName: "Shahar hokimligi",
    action: "TM-2026-0001 murojaatining bajarilishini tasdiqladi",
    complaintId: "TM-2026-0001",
  },
  {
    id: "AL-seed-2",
    timestamp: seedComplaints[5].updatedAt,
    actorRole: "district",
    actorName: "Sho'rchi tumani hokimligi",
    action: "TM-2026-0006 murojaatini bajarildi deb belgiladi",
    complaintId: "TM-2026-0006",
  },
  {
    id: "AL-seed-3",
    timestamp: seedComplaints[15].updatedAt,
    actorRole: "district",
    actorName: "Termiz shahri hokimligi",
    action: "TM-2026-0016 murojaatini rad etdi",
    complaintId: "TM-2026-0016",
  },
  {
    id: "AL-seed-4",
    timestamp: seedComplaints[16].updatedAt,
    actorRole: "district",
    actorName: "Angor tumani hokimligi",
    action: "TM-2026-0017 murojaatini huquqiy asosda rad etdi",
    complaintId: "TM-2026-0017",
  },
];

export const NO_LEGAL_BASIS = NO_LEGAL_BASIS_LABEL;
