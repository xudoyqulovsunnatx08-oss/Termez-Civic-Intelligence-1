import type { LegalBasis } from "../types";

// MUHIM: Ushbu ma'lumotlar 2026-yil sentabr holatiga ko'ra lex.uz'dan
// tekshirilgan haqiqiy, amaldagi qonun matnidir. Hech qanday modda yoki
// javobgarlik chorasi o'ylab topilmagan. Har doim lex.uz'dagi eng so'nggi
// tahrirni tekshirib turish tavsiya etiladi.

// Murojaat yuborishdan oldin ko'rsatiladigan asosiy ogohlantirish.
export const SUBMIT_WARNING: LegalBasis = {
  qonun:
    "\"Jismoniy va yuridik shaxslarning murojaatlari to'g'risida\"gi O'zbekiston Respublikasi Qonuni (O'RQ-378, 2014-yil 3-dekabr, keyingi tahrirlar bilan)",
  modda: "38-modda",
  moddaNomi: "Murojaatlar to'g'risidagi qonun hujjatlarini buzganlik uchun javobgarlik",
  matn:
    "Murojaatlar to'g'risidagi qonun hujjatlarini buzganlik, xuddi shuningdek tuhmat va haqoratdan iborat murojaat berganlik belgilangan tartibda javobgarlikka sabab bo'ladi.",
  qoshimcha:
    "Shuningdek qarang: O'zbekiston Respublikasi Ma'muriy javobgarlik to'g'risidagi kodeksining 40, 41 va 43-moddalari hamda Jinoyat kodeksining 139, 140 va 144-moddalari (tuhmat, haqorat). Bila turib yolg'on ma'lumot bergan holatda, ko'rib chiqish bilan bog'liq xarajatlar sud qarori bilan murojaat etuvchidan undirilishi mumkin (27-modda).",
  manba: "lex.uz — Qonunchilik ma'lumotlari milliy bazasi",
  manbaHavola: "https://lex.uz/acts/-2509996",
};

// Tuman hokimligi murojaatni rad etganda, agar rad etish sababi
// qonun bilan bog'liq bo'lsa, fuqaroga yuboriladigan standart huquqiy
// izoh (faqat tekshirilgan norma asosida; jismoniy tashrif talabi
// qonunda mavjud bo'lmagani uchun avtomatik qo'shilmaydi).
export const REJECTION_LEGAL_NOTE: LegalBasis = {
  qonun:
    "\"Jismoniy va yuridik shaxslarning murojaatlari to'g'risida\"gi O'zbekiston Respublikasi Qonuni (O'RQ-378, 2014-yil 3-dekabr, keyingi tahrirlar bilan)",
  modda: "18-modda",
  moddaNomi: "Murojaatlarni ko'rib chiqish tartibi",
  matn:
    "Davlat organiga kelib tushgan murojaatlar shu organ tomonidan yoki uning murojaatlarni ko'rib chiqish bo'yicha majburiyatlar zimmasiga yuklatilgan mansabdor shaxsi tomonidan ko'rib chiqiladi va murojaat etuvchiga natija haqida yozma yoxud elektron shaklda xabar qilinadi.",
  qoshimcha:
    "Agar qaror bilan rozi bo'lmasangiz, uni bo'ysunuv tartibida yuqori turuvchi organga (Termiz shahar hokimligi) yoxud sudga shikoyat qilish huquqingiz mavjud (13-modda).",
  manba: "lex.uz — Qonunchilik ma'lumotlari milliy bazasi",
  manbaHavola: "https://lex.uz/acts/-2509996",
};

export const NO_LEGAL_BASIS_LABEL = "Huquqiy asos aniqlanmadi";
