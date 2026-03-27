import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./BMICalculator.css";
import { getMemberDisplayName, getMemberInitials } from "../../../utils/memberProfile";

const navItems = [
  { label: "Dashboard", route: "/member/dashboard", icon: "grid" },
  { label: "My Membership", route: "/member/membership", icon: "card" },
  { label: "Payment History", route: "/member/payments", icon: "payment" },
  { label: "Attendance History", route: "/member/attendance", icon: "list" },
  { label: "Workout Schedule", route: "/member/schedule", icon: "calendar" },
  { label: "Workout Videos", route: "/member/videos", icon: "play" },
  { label: "BMI Calculator", route: "/member/bmi", icon: "bmi" },
  { label: "Book Trainer", route: "/member/trainer", icon: "dumbbell" },
  { label: "Profile", route: "/member/profile", icon: "user" },
];

const IconDumbbellBrand = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M6 5v14M18 5v14" />
    <rect x="3" y="8" width="3" height="8" rx="1" />
    <rect x="18" y="8" width="3" height="8" rx="1" />
    <line x1="6" y1="12" x2="18" y2="12" />
  </svg>
);
const IconGrid = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const IconCard = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
  </svg>
);
const IconPayment = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
  </svg>
);
const IconList = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);
const IconDumbbell = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M6 5v14M18 5v14" />
    <rect x="3" y="8" width="3" height="8" rx="1" />
    <rect x="18" y="8" width="3" height="8" rx="1" />
    <line x1="6" y1="12" x2="18" y2="12" />
  </svg>
);
const IconUser = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="7" r="4" />
    <path d="M5.5 21a6.5 6.5 0 0113 0" />
  </svg>
);
const IconLogout = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);
const IconCalc = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="4" y="2" width="16" height="20" rx="2" />
    <line x1="8" y1="6" x2="16" y2="6" />
    <line x1="8" y1="11" x2="10" y2="11" />
    <line x1="14" y1="11" x2="16" y2="11" />
    <line x1="8" y1="15" x2="10" y2="15" />
    <line x1="14" y1="15" x2="16" y2="15" />
  </svg>
);
const IconCalendar = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);
const IconPlay = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);
const IconBell = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);

const navIcons = {
  grid: <IconGrid />,
  card: <IconCard />,
  payment: <IconPayment />,
  list: <IconList />,
  calendar: <IconCalendar />,
  play: <IconPlay />,
  bmi: <IconCalc />,
  dumbbell: <IconDumbbell />,
  user: <IconUser />,
};

function classifyBmi(bmi) {
  if (!Number.isFinite(bmi)) return { label: "-", note: "Enter values to calculate." };
  if (bmi < 18.5) return { label: "Underweight", note: "Consider balanced calorie increase and strength training." };
  if (bmi < 25) return { label: "Normal", note: "Great range. Keep your current routine consistent." };
  if (bmi < 30) return { label: "Overweight", note: "A small calorie deficit and regular exercise can help." };
  return { label: "Obese", note: "Focus on guided nutrition and steady activity." };
}

export default function BMICalculator() {
  const navigate = useNavigate();
  const location = useLocation();
  const memberName = getMemberDisplayName();
  const memberInitials = getMemberInitials(memberName);

  const [unit, setUnit] = useState("metric");
  const [heightCm, setHeightCm] = useState("170");
  const [weightKg, setWeightKg] = useState("70");
  const [heightFt, setHeightFt] = useState("5");
  const [heightIn, setHeightIn] = useState("7");
  const [weightLb, setWeightLb] = useState("154");

  const isActive = (route) => location.pathname === route;

  const bmi = useMemo(() => {
    if (unit === "metric") {
      const h = Number(heightCm);
      const w = Number(weightKg);
      if (!h || !w) return NaN;
      const hm = h / 100;
      return w / (hm * hm);
    }

    const ft = Number(heightFt);
    const inch = Number(heightIn);
    const lb = Number(weightLb);
    const totalInches = ft * 12 + inch;
    if (!totalInches || !lb) return NaN;
    return (lb / (totalInches * totalInches)) * 703;
  }, [unit, heightCm, weightKg, heightFt, heightIn, weightLb]);

  const bmiRounded = Number.isFinite(bmi) ? bmi.toFixed(1) : "-";
  const bmiInfo = classifyBmi(bmi);

  return (
    <div className="bmi-root">
      <aside className="bmi-sidebar">
        <div className="bmi-sidebar__brand">
          <div className="bmi-sidebar__brand-icon"><IconDumbbellBrand /></div>
          <div className="bmi-sidebar__brand-name">FitTrack</div>
        </div>

        <div className="bmi-sidebar__label">Navigation</div>

        <ul className="bmi-sidebar__menu">
          {navItems.map((item) => (
            <li
              key={item.route}
              className={isActive(item.route) ? "active" : ""}
              onClick={() => navigate(item.route)}
            >
              <span className="bmi-sidebar__icon">{navIcons[item.icon]}</span>
              {item.label}
              {isActive(item.route) && <span className="bmi-sidebar__dot" />}
            </li>
          ))}
        </ul>

        <div className="bmi-sidebar__bottom">
          <ul className="bmi-sidebar__menu">
            <li onClick={() => navigate("/login")}>
              <span className="bmi-sidebar__icon"><IconLogout /></span>
              Logout
            </li>
          </ul>
        </div>
      </aside>

      <main className="bmi-main">
        <header className="bmi-topbar">
          <div className="bmi-topbar__left">
            <h1 className="bmi-topbar__title">BMI Calculator</h1>
          </div>
          <div className="bmi-topbar__right">
            <button className="bmi-topbar__bell" type="button">
              <IconBell />
              <span className="bmi-topbar__bell-dot" />
            </button>
            <div className="ft-profile" onClick={() => navigate("/member/profile")}>
              <div className="ft-profile__avatar">{memberInitials}</div>
              <span className="ft-profile__name">{memberName}</span>
              <div className="ft-profile__globe">🌐</div>
            </div>
          </div>
        </header>

        <section className="bmi-content">
          <div className="bmi-card">
            <div className="bmi-units">
              <button
                className={unit === "metric" ? "active" : ""}
                onClick={() => setUnit("metric")}
              >
                Metric
              </button>
              <button
                className={unit === "imperial" ? "active" : ""}
                onClick={() => setUnit("imperial")}
              >
                Imperial
              </button>
            </div>

            {unit === "metric" ? (
              <div className="bmi-grid">
                <label>
                  Height (cm)
                  <input type="number" min="1" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} />
                </label>
                <label>
                  Weight (kg)
                  <input type="number" min="1" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} />
                </label>
              </div>
            ) : (
              <div className="bmi-grid bmi-grid--3">
                <label>
                  Height (ft)
                  <input type="number" min="0" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} />
                </label>
                <label>
                  Height (in)
                  <input type="number" min="0" max="11" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} />
                </label>
                <label>
                  Weight (lb)
                  <input type="number" min="1" value={weightLb} onChange={(e) => setWeightLb(e.target.value)} />
                </label>
              </div>
            )}

            <div className="bmi-result">
              <div className="bmi-result__value">{bmiRounded}</div>
              <div className="bmi-result__label">{bmiInfo.label}</div>
              <p>{bmiInfo.note}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
