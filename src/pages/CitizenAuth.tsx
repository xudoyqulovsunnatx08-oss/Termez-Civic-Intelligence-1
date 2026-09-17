import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { User, Phone, Lock, IdCard, ArrowRight } from "lucide-react";
import { loginCitizen, registerCitizen } from "../utils/auth";
import { setSession } from "../utils/storage";

interface CitizenAuthProps {
  onLogin: () => void;
}

export default function CitizenAuth({ onLogin }: CitizenAuthProps) {
  const [tab, setTab] = useState<"login" | "register">("login");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // login fields
  const [loginPhone, setLoginPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // register fields
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [pinfl, setPinfl] = useState("");
  const [docNumber, setDocNumber] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError("");
    const result = loginCitizen(loginPhone, loginPassword);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSession({ role: "citizen", citizenId: result.citizen.id });
    onLogin();
    navigate("/fuqaro/kabinet");
  }

  function handleRegister(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (fullName.trim().length < 3) {
      setError("F.I.Sh. to'liq kiritilishi kerak.");
      return;
    }
    if (!/^\+?[0-9\s]{9,15}$/.test(phone.trim())) {
      setError("Telefon raqamini to'g'ri kiriting.");
      return;
    }
    if (password.length < 4) {
      setError("Parol kamida 4 ta belgidan iborat bo'lishi kerak.");
      return;
    }
    const result = registerCitizen({
      fullName,
      phone: phone.replace(/\s/g, ""),
      pinfl,
      docNumber,
      password,
    });
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setSession({ role: "citizen", citizenId: result.citizen.id });
    onLogin();
    navigate("/fuqaro/kabinet");
  }

  return (
    <div className="page">
      <section className="auth-hero">
        <div className="container auth-container">
          <div className="auth-card card">
            <div className="auth-tabs">
              <button
                className={"auth-tab" + (tab === "login" ? " auth-tab-active" : "")}
                onClick={() => {
                  setTab("login");
                  setError("");
                }}
              >
                Kirish
              </button>
              <button
                className={"auth-tab" + (tab === "register" ? " auth-tab-active" : "")}
                onClick={() => {
                  setTab("register");
                  setError("");
                }}
              >
                Ro'yxatdan o'tish
              </button>
            </div>

            {tab === "login" ? (
              <form onSubmit={handleLogin} className="auth-form">
                <div className="field">
                  <label htmlFor="loginPhone">Telefon raqami</label>
                  <div className="input-with-icon">
                    <Phone size={16} />
                    <input
                      id="loginPhone"
                      type="tel"
                      placeholder="+998901234567"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="loginPassword">Parol</label>
                  <div className="input-with-icon">
                    <Lock size={16} />
                    <input
                      id="loginPassword"
                      type="password"
                      placeholder="Parolingiz"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                    />
                  </div>
                </div>
                {error && <span className="field-error">{error}</span>}
                <button type="submit" className="btn btn-primary btn-block">
                  Kirish <ArrowRight size={16} />
                </button>
                <p className="auth-hint">
                  Demo uchun: +998901234567 / demo123
                </p>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="auth-form">
                <div className="field">
                  <label htmlFor="fullName">F.I.Sh.</label>
                  <div className="input-with-icon">
                    <User size={16} />
                    <input
                      id="fullName"
                      type="text"
                      placeholder="Familiya Ism Sharif"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="regPhone">Telefon raqami</label>
                  <div className="input-with-icon">
                    <Phone size={16} />
                    <input
                      id="regPhone"
                      type="tel"
                      placeholder="+998901234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="pinfl">JShShIR (14 raqam)</label>
                  <div className="input-with-icon">
                    <IdCard size={16} />
                    <input
                      id="pinfl"
                      type="text"
                      inputMode="numeric"
                      maxLength={14}
                      placeholder="Demo uchun istalgan 14 raqam"
                      value={pinfl}
                      onChange={(e) => setPinfl(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                  <span className="field-hint">Faqat demo maqsadida — real ma'lumot kiritmang.</span>
                </div>
                <div className="field">
                  <label htmlFor="docNumber">Pasport / ID-karta raqami</label>
                  <div className="input-with-icon">
                    <IdCard size={16} />
                    <input
                      id="docNumber"
                      type="text"
                      placeholder="Masalan: AB1234567"
                      value={docNumber}
                      onChange={(e) => setDocNumber(e.target.value)}
                    />
                  </div>
                </div>
                <div className="field">
                  <label htmlFor="regPassword">Parol</label>
                  <div className="input-with-icon">
                    <Lock size={16} />
                    <input
                      id="regPassword"
                      type="password"
                      placeholder="Kamida 4 ta belgi"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                </div>
                {error && <span className="field-error">{error}</span>}
                <button type="submit" className="btn btn-primary btn-block">
                  Ro'yxatdan o'tish <ArrowRight size={16} />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
