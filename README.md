# Termez Civic Intelligence

Fuqarolar murojaatlarini raqamli boshqarish, monitoring va tahlil qilish platformasi.
Uch rolga asoslangan yagona tizim: **Fuqaro → Tuman hokimligi → Shahar hokimligi**.

## Ishga tushirish

```bash
npm install
npm run dev
```

Brauzerda ko'rsatilgan manzilni (odatda http://localhost:5173) oching.

## Portallar va demo login ma'lumotlari

| Portal | Manzil | Demo login |
|---|---|---|
| Fuqaro | `/fuqaro/kirish` | Tel: `+998901234567`, Parol: `demo123` (yoki ro'yxatdan o'ting) |
| Tuman hokimligi | `/tuman/kirish` | Hududni tanlang, Parol: `1234` |
| Shahar hokimligi | `/shahar/kirish` | Login: `shaharadmin`, Parol: `1234` |

## Muhim eslatmalar

- Barcha ma'lumotlar brauzer localStorage'ida saqlanadi (backend yo'q). Ma'lumotlarni
  tozalash uchun brauzer sozlamalaridan sayt ma'lumotlarini o'chiring.
- JShShIR va hujjat raqamlari interfeysda maskalangan ko'rinadi.
- Barcha shaxsiy ma'lumotlar (fuqarolar, murojaatlar) — demo/o'ylab topilgan, real emas.
- Huquqiy ogohlantirish matni lex.uz'dan tekshirilgan haqiqiy qonun moddasiga asoslangan
  ("Jismoniy va yuridik shaxslarning murojaatlari to'g'risida"gi Qonun, 38-modda).
  Eng so'nggi tahrirni tekshirish uchun https://lex.uz saytiga murojaat qiling.

## Texnologiyalar

React + TypeScript + Vite, React Router, Lucide React, Recharts. Oddiy CSS (Tailwind/Bootstrap ishlatilmagan).

## Production build

```bash
npm run build
npm run preview
```

## Railway'da deploy qilish

Loyiha `railway.json` bilan birga keladi — GitHub'ga yuklab, Railway'da
"Deploy from GitHub repo" orqali avtomatik ishga tushiriladi.
