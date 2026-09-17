import { Link } from "react-router-dom";
import { User, Building2, Landmark, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

const PORTALS = [
  {
    to: "/fuqaro/kirish",
    icon: User,
    title: "Fuqarolar platformasi",
    desc: "Murojaat yuboring, holatini kuzating va hokimlik javoblarini shaxsiy kabinetingizda ko'ring.",
    cta: "Fuqaro sifatida kirish",
  },
  {
    to: "/tuman/kirish",
    icon: Building2,
    title: "Tuman hokimligi paneli",
    desc: "O'z hududingizga tegishli murojaatlarni boshqaring, mas'ul xodim tayinlang va ijroni nazorat qiling.",
    cta: "Tuman hokimligi sifatida kirish",
  },
  {
    to: "/shahar/kirish",
    icon: Landmark,
    title: "Termiz shahar hokimligi paneli",
    desc: "Barcha hududlar bo'yicha statistika, tahlil, reyting va audit tarixini ko'ring.",
    cta: "Shahar hokimligi sifatida kirish",
  },
];

export default function Landing() {
  return (
    <div className="page">
      <section className="hero">
        <div className="hero-pattern" aria-hidden="true" />
        <div className="container-wide hero-inner hero-inner-centered">
          <div className="hero-copy">
            <span className="hero-eyebrow">
              <Sparkles size={14} /> Termiz shahar hokimligi raqamli tizimi
            </span>
            <h1 className="hero-title">Termez Civic Intelligence</h1>
            <p className="hero-subtitle">
              Fuqarolar murojaatlarini raqamli boshqarish, monitoring va tahlil qilish
              platformasi. Fuqaro → Shahar hokimligi → Tuman hokimligi → Bajarilish →
              Nazorat → Fuqaro zanjiri asosida ishlaydi.
            </p>
          </div>
        </div>
      </section>

      <section className="portal-section">
        <div className="container-wide portal-grid">
          {PORTALS.map((p) => (
            <Link to={p.to} className="portal-card" key={p.to}>
              <div className="portal-icon">
                <p.icon size={24} strokeWidth={2} />
              </div>
              <h3>{p.title}</h3>
              <p>{p.desc}</p>
              <span className="portal-cta">
                {p.cta} <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>

        <div className="container-wide demo-note">
          <ShieldCheck size={16} />
          Bu — demo platforma. Barcha ma'lumotlar sizning brauzeringizda (localStorage)
          saqlanadi, real shaxsiy ma'lumotlar ishlatilmagan.
        </div>
      </section>
    </div>
  );
}
