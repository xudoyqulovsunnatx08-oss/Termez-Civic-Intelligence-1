import { Landmark, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container-wide footer-inner">
        <div className="footer-brand">
          <span className="brand-mark brand-mark-light">
            <Landmark size={20} strokeWidth={2.25} />
          </span>
          <div>
            <strong>Termez Civic Intelligence</strong>
            <p>Fuqarolar murojaatlarini raqamli boshqarish, monitoring va tahlil qilish platformasi.</p>
          </div>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Aloqa</span>
          <div className="footer-line">
            <MapPin size={16} /> Termiz shahri, Al-Xorazmiy ko'chasi, 1-uy
          </div>
          <div className="footer-line">
            <Phone size={16} /> +998 76 222 10 10
          </div>
          <div className="footer-line">
            <Mail size={16} /> info@termiz.gov.uz
          </div>
        </div>

        <div className="footer-col">
          <span className="footer-col-title">Portallar</span>
          <div className="footer-line">Fuqarolar platformasi</div>
          <div className="footer-line">Tuman hokimligi paneli</div>
          <div className="footer-line">Shahar hokimligi paneli</div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container-wide">
          © {new Date().getFullYear()} Termiz shahar hokimligi. Barcha huquqlar himoyalangan.
        </div>
      </div>
    </footer>
  );
}
