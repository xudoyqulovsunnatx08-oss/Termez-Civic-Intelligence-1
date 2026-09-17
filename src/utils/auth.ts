import type { Citizen } from "../types";
import { addCitizen, findCitizenByPhone, generateCitizenId } from "./storage";

export const DISTRICT_DEMO_PASSWORD = "1234";
export const CITY_DEMO_USERNAME = "shaharadmin";
export const CITY_DEMO_PASSWORD = "1234";

export interface RegisterInput {
  fullName: string;
  phone: string;
  pinfl: string;
  docNumber: string;
  password: string;
}

export function registerCitizen(input: RegisterInput): { ok: true; citizen: Citizen } | { ok: false; error: string } {
  if (findCitizenByPhone(input.phone)) {
    return { ok: false, error: "Bu telefon raqami bilan foydalanuvchi allaqachon ro'yxatdan o'tgan." };
  }
  if (!/^\d{14}$/.test(input.pinfl)) {
    return { ok: false, error: "JShShIR 14 ta raqamdan iborat bo'lishi kerak." };
  }
  const citizen: Citizen = {
    id: generateCitizenId(),
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    pinfl: input.pinfl.trim(),
    docNumber: input.docNumber.trim().toUpperCase(),
    password: input.password,
    registeredAt: new Date().toISOString(),
  };
  addCitizen(citizen);
  return { ok: true, citizen };
}

export function loginCitizen(
  phone: string,
  password: string
): { ok: true; citizen: Citizen } | { ok: false; error: string } {
  const citizen = findCitizenByPhone(phone);
  if (!citizen || citizen.password !== password) {
    return { ok: false, error: "Telefon raqami yoki parol noto'g'ri." };
  }
  return { ok: true, citizen };
}
