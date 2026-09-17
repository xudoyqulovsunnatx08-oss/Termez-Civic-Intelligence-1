import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Landmark, Menu, X, LogOut, User } from "lucide-react";
import type { Session } from "../types";
import { clearSession } from "../utils/storage";

interface NavbarProps {
  session: Session;
  onLogout: () => void;
}

function sessionLabel(session: Session): string {
  if (!session) return "";
  if (session.role === "citizen") return "Fuqaro kabineti";
  if (session.role === "district") return session.district + " hokimligi";
  return "Termiz shahar hokimligi";
}

function homePath(session: Session): string {
  if (!session) return "/";
  if (session.role === "citizen") return "/fuqaro/kabinet";
  if (session.role === "district") return "/tuman/panel";
  return "/shahar/panel";
}

export default function Navbar({ session, onLogout }: NavbarProps) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  function handleLogout() {
    clearSession();
    onLogout();
    navigate("/");
    setOpen(false);
  }

  return (
    <header className="navbar">
      <div className="container-wide navbar-inner">
        <Link to={homePath(session)} className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark">
            <Landmark size={20} strokeWidth={2.25} />
          </span>
          <span className="brand-text">
            <strong>Termez Civic Intelligence</strong>
            <small>{session ? sessionLabel(session) : "Termiz shahar hokimligi platformasi"}</small>
          </span>
        </Link>

        {session && (
          <div className="nav-links nav-links-desktop">
            <span className="nav-session-chip">
              <User size={14} /> {sessionLabel(session)}
            </span>
            <button className="btn btn-ghost btn-sm" onClick={handleLogout}>
              <LogOut size={14} /> Chiqish
            </button>
          </div>
        )}

        {session && (
          <button
            className="nav-toggle"
            aria-label={open ? "Menyuni yopish" : "Menyuni ochish"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        )}
      </div>

      {open && session && (
        <nav className="nav-links-mobile">
          <span className="nav-session-chip">
            <User size={14} /> {sessionLabel(session)}
          </span>
          <button className="btn btn-ghost btn-sm btn-block" onClick={handleLogout}>
            <LogOut size={14} /> Chiqish
          </button>
        </nav>
      )}
    </header>
  );
}
