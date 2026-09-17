export function maskPinfl(pinfl: string): string {
  if (pinfl.length < 4) return "••••••••••••••";
  return "•••••••••••" + pinfl.slice(-3);
}

export function maskDoc(doc: string): string {
  if (doc.length < 3) return "•••••••";
  return doc.slice(0, 2) + "•••••" + doc.slice(-2);
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 4) return "+998 ••• •• •• ••";
  const last4 = digits.slice(-4);
  return `+998 ••• ••${last4.slice(0, 2)} ${last4.slice(2)}`;
}
