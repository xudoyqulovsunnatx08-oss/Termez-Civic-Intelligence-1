import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Landmark, Lock, User, ArrowRight } from "lucide-react";
import { CITY_DEMO_PASSWORD, CITY_DEMO_USERNAME } from "../utils/auth";
import { setSession } from "../utils/storage";

export default function CityLogin({ onLogin }: { onLogin: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (username !== CITY_DEMO_USERNAME || password !== CITY_DEMO_PASSWORD) {
      setError("Login yoki parol noto'g'ri.");
      return;
    }
    setSession({ role: "city" });
    onLogin();
    navigate("/shahar/panel");
  }

  return (
    <div className="page">
      <section className="auth-hero">
        <div className="container auth-container">
          <div className="auth-card card">
            <div className="auth-icon-header">
              <Landmark size={22} />
              <h2>Termiz shahar hokimligi paneli</h2>
            </div>
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="field">
                <label htmlFor="username">Login</label>
                <div className="input-with-icon">
                  <User size={16} />
                  <input
                    id="username"
                    type="text"
                    placeholder="Login"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="field">
                <label htmlFor="password">Parol</label>
                <div className="input-with-icon">
                  <Lock size={16} />
                  <input
                    id="password"
                    type="password"
                    placeholder="Parol"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
              {error && <span className="field-error">{error}</span>}
              <button type="submit" className="btn btn-primary btn-block">
                Kirish <ArrowRight size={16} />
              </button>
              <p className="auth-hint">
                Demo: {CITY_DEMO_USERNAME} / {CITY_DEMO_PASSWORD}
              </p>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
