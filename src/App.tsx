import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Landing from "./pages/Landing";
import CitizenAuth from "./pages/CitizenAuth";
import CitizenDashboard from "./pages/CitizenDashboard";
import CitizenSubmit from "./pages/CitizenSubmit";
import CitizenComplaintDetail from "./pages/CitizenComplaintDetail";
import DistrictLogin from "./pages/DistrictLogin";
import DistrictDashboard from "./pages/DistrictDashboard";
import CityLogin from "./pages/CityLogin";
import CityDashboard from "./pages/CityDashboard";
import { findCitizenById, getSession, initStorage } from "./utils/storage";
import type { Session } from "./types";
import "./App.css";

export default function App() {
  const [session, setSessionState] = useState<Session>(() => {
    initStorage();
    return getSession();
  });

  function refreshSession() {
    setSessionState(getSession());
  }

  const citizen =
    session?.role === "citizen" ? findCitizenById(session.citizenId) : undefined;

  return (
    <BrowserRouter>
      <Navbar session={session} onLogout={refreshSession} />
      <Routes>
        <Route path="/" element={<Landing />} />

        {/* Fuqaro portali */}
        <Route path="/fuqaro/kirish" element={<CitizenAuth onLogin={refreshSession} />} />
        <Route
          path="/fuqaro/kabinet"
          element={
            <ProtectedRoute session={session} allow="citizen" redirectTo="/fuqaro/kirish">
              {citizen ? <CitizenDashboard citizen={citizen} /> : null}
            </ProtectedRoute>
          }
        />
        <Route
          path="/fuqaro/murojaat/yangi"
          element={
            <ProtectedRoute session={session} allow="citizen" redirectTo="/fuqaro/kirish">
              {citizen ? <CitizenSubmit citizen={citizen} /> : null}
            </ProtectedRoute>
          }
        />
        <Route
          path="/fuqaro/murojaat/:id"
          element={
            <ProtectedRoute session={session} allow="citizen" redirectTo="/fuqaro/kirish">
              <CitizenComplaintDetail />
            </ProtectedRoute>
          }
        />

        {/* Tuman hokimligi portali */}
        <Route path="/tuman/kirish" element={<DistrictLogin onLogin={refreshSession} />} />
        <Route
          path="/tuman/panel"
          element={
            <ProtectedRoute session={session} allow="district" redirectTo="/tuman/kirish">
              {session?.role === "district" ? <DistrictDashboard district={session.district} /> : null}
            </ProtectedRoute>
          }
        />

        {/* Shahar hokimligi portali */}
        <Route path="/shahar/kirish" element={<CityLogin onLogin={refreshSession} />} />
        <Route
          path="/shahar/panel"
          element={
            <ProtectedRoute session={session} allow="city" redirectTo="/shahar/kirish">
              <CityDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
