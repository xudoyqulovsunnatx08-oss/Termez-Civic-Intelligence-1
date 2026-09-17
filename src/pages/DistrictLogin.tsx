import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Lock, ArrowRight } from "lucide-react";
import { DISTRICTS } from "../types";
import type { District } from "../types";
import { DISTRICT_DEMO_PASSWORD } from "../utils/auth";
import { setSession } from "../utils/storage";

export default function DistrictLogin({ onLogin }: { onLogin: () => void }) {
  const [district, setDistrict] = useState<District | "">("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!district) {
      setError("Hududni tanlang.");
      return;
    }
    if (password !== DISTRICT_DEMO_PASSWORD) {
      setError("Parol noto'g'ri.");
      return;
    }
    setSession({ role: "district", district });
    onLogin();
    navigate("/tuman/panel");
  }

  return (
    <div className="page">
      <section className="auth-hero">
        <div className="container auth-container">
          <div className="auth-card card">
            <div className="auth-icon-header">
              <Building2 size={22} />
              <h2>Tuman hokimligi paneli</h2>
            </div>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="field">
                <label htmlFor="district">Hududingizni tanlang</label>
                <select
                  id="district"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value as District)}
                >
                  <option value="">Tanlang...</option>
                  {DISTRICTS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label htmlFor="password">Parol</label>
                <div className="input-with-icon">
                  <Lock size={16} />
                  <input
                    id="password"
                    type="password"
                    placeholder="Demo parol"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              {error && <span className="field-error">{error}</span>}
              <button type="submit" className="btn btn-primary btn-block">
                Kirish <ArrowRight size={16} />
              </button>
              <p className="auth-hint">Demo parol: {DISTRICT_DEMO_PASSWORD}</p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
