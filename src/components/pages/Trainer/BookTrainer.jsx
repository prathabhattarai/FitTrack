import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./BookTrainer.css";

// ─────────────────────────────────────────
// NAV CONFIG
// ─────────────────────────────────────────
const navItems = [
  { label: "Dashboard",          route: "/member/dashboard",  icon: "grid"     },
  { label: "My Membership",      route: "/member/membership", icon: "card"     },
  { label: "Payment History",    route: "/member/payments",   icon: "payment"  },
  { label: "Attendance History", route: "/member/attendance", icon: "list"     },
  { label: "Book Trainer",       route: "/member/trainer",    icon: "dumbbell" },
  { label: "Profile",            route: "/member/profile",    icon: "user"     },
];

// ─────────────────────────────────────────
// TRAINERS DATA
// ─────────────────────────────────────────
const TRAINERS = [
  {
    id: 1,
    name: "Marcus Thorne",
    specialty: "Strength & Conditioning",
    tag: "Strength",
    years: 10,
    rating: 4.9,
    reviews: 214,
    rate: 45,
    quote: "Ex-Athlete specializing in powerlifting and explosive performance training.",
    available: true,
    initials: "MT",
    color: "#e86414",
    bg: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&q=80",
  },
  {
    id: 2,
    name: "Priya Sharma",
    specialty: "Yoga & Flexibility",
    tag: "Yoga",
    years: 7,
    rating: 4.8,
    reviews: 189,
    rate: 40,
    quote: "Ashtanga instructor focused on flexibility, breath and mindful movement.",
    available: true,
    initials: "PS",
    color: "#a78bfa",
    bg: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80",
  },
  {
    id: 3,
    name: "David Chen",
    specialty: "Mobility & Recovery",
    tag: "Mobility",
    years: 8,
    rating: 5.0,
    reviews: 210,
    rate: 50,
    quote: "Sports therapist helping athletes recover faster and move better.",
    available: true,
    initials: "DC",
    color: "#60a5fa",
    bg: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
  },
  {
    id: 4,
    name: "Sarah Jenkins",
    specialty: "Bodybuilding",
    tag: "Bodybuilding",
    years: 3,
    rating: 4.7,
    reviews: 65,
    rate: 42,
    quote: "Specialist in muscle hypertrophy and contest prep for serious lifters.",
    available: false,
    initials: "SJ",
    color: "#f472b6",
    bg: "https://images.unsplash.com/photo-1548690312-e3b507d8c110?w=400&q=80",
  },
  {
    id: 5,
    name: 'Robert "Iron" Mike',
    specialty: "Boxing & Self-Defense",
    tag: "Boxing",
    years: 12,
    rating: 4.9,
    reviews: 158,
    rate: 55,
    quote: "Former amateur boxer teaching discipline, footwork and knockout power.",
    available: true,
    initials: "RM",
    color: "#f87171",
    bg: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&q=80",
  },
  {
    id: 6,
    name: "Lisa Vane",
    specialty: "Nutrition & Lifestyle",
    tag: "Nutrition",
    years: 5,
    rating: 4.8,
    reviews: 112,
    rate: 38,
    quote: "Certified nutritionist and wellness coach for sustainable fat loss.",
    available: true,
    initials: "LV",
    color: "#34d399",
    bg: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=400&q=80",
  },
  {
    id: 7,
    name: "Chris Taylor",
    specialty: "Calisthenics",
    tag: "Calisthenics",
    years: 4,
    rating: 4.6,
    reviews: 42,
    rate: 40,
    quote: "Street workout champion mastering bodyweight strength and skills.",
    available: true,
    initials: "CT",
    color: "#fbbf24",
    bg: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80",
  },
  {
    id: 8,
    name: "Maya Patel",
    specialty: "Pre/Post Natal Fitness",
    tag: "Natal",
    years: 9,
    rating: 5.0,
    reviews: 198,
    rate: 48,
    quote: "Helping mothers stay strong, safe and confident at every stage.",
    available: false,
    initials: "MP",
    color: "#fb923c",
    bg: "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=400&q=80",
  },
];

const SPECIALTY_TAGS = ["All Trainers", "Strength", "Yoga", "Mobility", "Bodybuilding", "Boxing", "Nutrition", "Calisthenics", "Natal"];
const TIME_SLOTS     = ["08:00 AM", "09:30 AM", "11:00 AM", "02:00 PM", "04:30 PM", "06:00 PM"];

// ─────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────
const IconDumbbellBrand = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M6 5v14M18 5v14"/>
    <rect x="3" y="8" width="3" height="8" rx="1"/>
    <rect x="18" y="8" width="3" height="8" rx="1"/>
    <line x1="6" y1="12" x2="18" y2="12"/>
  </svg>
);
const IconGrid = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const IconCard = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
  </svg>
);
const IconPayment = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
  </svg>
);
const IconList = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
  </svg>
);
const IconDumbbell = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M6 5v14M18 5v14"/>
    <rect x="3" y="8" width="3" height="8" rx="1"/>
    <rect x="18" y="8" width="3" height="8" rx="1"/>
    <line x1="6" y1="12" x2="18" y2="12"/>
  </svg>
);
const IconUser = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0113 0"/>
  </svg>
);
const IconLogout = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconBell = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);
const IconSearch = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const IconStar = ({ filled }) => (
  <svg width="12" height="12" fill={filled ? "#e86414" : "none"} stroke="#e86414" strokeWidth="1.5" viewBox="0 0 24 24">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconPin = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
    <circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconClock = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
  </svg>
);
const IconClose = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconCheck = () => (
  <svg width="40" height="40" fill="none" stroke="#e86414" strokeWidth="2.5" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" stroke="rgba(232,100,20,0.3)"/>
    <polyline points="8 12 11 15 16 9"/>
  </svg>
);
const IconFilter = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="4" y1="6" x2="20" y2="6"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
    <line x1="11" y1="18" x2="13" y2="18"/>
  </svg>
);

const navIcons = {
  grid: <IconGrid />, card: <IconCard />, payment: <IconPayment />,
  list: <IconList />, dumbbell: <IconDumbbell />, user: <IconUser />,
};

// ─────────────────────────────────────────
// STAR RATING
// ─────────────────────────────────────────
function StarRating({ rating }) {
  return (
    <div className="bt-stars">
      {[1,2,3,4,5].map((i) => (
        <IconStar key={i} filled={i <= Math.round(rating)} />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────
// BOOKING MODAL
// ─────────────────────────────────────────
function BookingModal({ trainer, onClose, onConfirm }) {
  const [date, setDate]       = useState("");
  const [timeSlot, setTime]   = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError]     = useState("");

  const handleConfirm = () => {
    if (!date) { setError("Please select a date."); return; }
    if (!timeSlot) { setError("Please select a time slot."); return; }
    setError("");
    setConfirmed(true);
    setTimeout(() => {
      onConfirm({ trainer, date, timeSlot });
      onClose();
    }, 2200);
  };

  // Min date = today
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="bt-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bt-modal">

        {confirmed ? (
          <div className="bt-modal__success">
            <IconCheck />
            <div className="bt-modal__success-title">Booking Confirmed!</div>
            <div className="bt-modal__success-sub">
              Your session with <strong>{trainer.name}</strong><br/>
              on {new Date(date + "T00:00:00").toLocaleDateString("en-US", { weekday:"long", month:"long", day:"numeric" })} at {timeSlot} is booked.
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="bt-modal__header">
              <div className="bt-modal__trainer">
                <div
                  className="bt-modal__trainer-avatar"
                  style={{ background: `${trainer.color}22`, border: `2px solid ${trainer.color}55` }}
                >
                  {trainer.bg ? (
                    <img src={trainer.bg} alt={trainer.name} className="bt-modal__trainer-img" />
                  ) : (
                    <span style={{ color: trainer.color, fontWeight: 700 }}>{trainer.initials}</span>
                  )}
                </div>
                <div>
                  <div className="bt-modal__title">Book a Session</div>
                  <div className="bt-modal__subtitle">
                    <span className="bt-modal__pin"><IconPin /></span>
                    with {trainer.name}
                  </div>
                </div>
              </div>
              <button className="bt-modal__close" onClick={onClose}><IconClose /></button>
            </div>

            <div className="bt-modal__body">
              {/* Date */}
              <div className="bt-modal__field">
                <label className="bt-modal__label">
                  <IconCalendar /> Select Date
                </label>
                <input
                  type="date"
                  className={`bt-modal__date-input ${date ? "bt-modal__date-input--filled" : ""}`}
                  value={date}
                  min={today}
                  onChange={(e) => { setDate(e.target.value); setError(""); }}
                />
              </div>

              {/* Time */}
              <div className="bt-modal__field">
                <label className="bt-modal__label">
                  <IconClock /> Select Available Time
                </label>
                <div className="bt-modal__times">
                  {TIME_SLOTS.map((t) => (
                    <button
                      key={t}
                      className={`bt-modal__time ${timeSlot === t ? "bt-modal__time--active" : ""}`}
                      onClick={() => { setTime(t); setError(""); }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Session info */}
              <div className="bt-modal__info">
                <div className="bt-modal__info-row">
                  <span className="bt-modal__info-key">Session Type</span>
                  <span className="bt-modal__info-val">Personal Training (60 min)</span>
                </div>
                <div className="bt-modal__info-row">
                  <span className="bt-modal__info-key">Rate</span>
                  <span className="bt-modal__info-val bt-modal__info-val--brand">${trainer.rate}.00</span>
                </div>
              </div>

              {error && <div className="bt-modal__error">{error}</div>}
            </div>

            {/* Footer */}
            <div className="bt-modal__footer">
              <button className="bt-modal__cancel" onClick={onClose}>Cancel</button>
              <button className="bt-modal__confirm" onClick={handleConfirm}>
                Confirm Booking
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// TRAINER CARD
// ─────────────────────────────────────────
function TrainerCard({ trainer, onBook }) {
  return (
    <div className={`bt-card ${!trainer.available ? "bt-card--unavailable" : ""}`}>
      {/* Years badge */}
      <div className="bt-card__years">{trainer.years} Years</div>

      {/* Image */}
      <div className="bt-card__img-wrap">
        {trainer.bg ? (
          <img src={trainer.bg} alt={trainer.name} className="bt-card__img" />
        ) : (
          <div className="bt-card__initials" style={{ color: trainer.color }}>
            {trainer.initials}
          </div>
        )}
        <div className="bt-card__img-overlay" />
        {!trainer.available && <div className="bt-card__unavail-badge">Unavailable</div>}
      </div>

      {/* Info */}
      <div className="bt-card__body">
        <div className="bt-card__name">{trainer.name}</div>
        <div className="bt-card__spec" style={{ color: trainer.color }}>
          {trainer.specialty.toUpperCase()}
        </div>

        <div className="bt-card__rating">
          <StarRating rating={trainer.rating} />
          <span className="bt-card__rating-val">{trainer.rating}</span>
          <span className="bt-card__rating-count">({trainer.reviews})</span>
        </div>

        <p className="bt-card__quote">"{trainer.quote}"</p>

        <button
          className="bt-card__btn"
          onClick={() => trainer.available && onBook(trainer)}
          disabled={!trainer.available}
          style={trainer.available ? { background: trainer.color, boxShadow: `0 4px 18px ${trainer.color}55` } : {}}
        >
          {trainer.available ? "Book Session" : "Unavailable"}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────
export default function BookTrainer() {
  const navigate = useNavigate();
  const location = useLocation();

  const [search, setSearch]       = useState("");
  const [activeTag, setActiveTag] = useState("All Trainers");
  const [booking, setBooking]     = useState(null);     // trainer being booked
  const [toast, setToast]         = useState(null);

  const isActive = (r) => location.pathname === r;

  const filtered = useMemo(() => {
    return TRAINERS.filter((t) => {
      const matchTag    = activeTag === "All Trainers" || t.tag === activeTag;
      const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) ||
                          t.specialty.toLowerCase().includes(search.toLowerCase());
      return matchTag && matchSearch;
    });
  }, [search, activeTag]);

  const handleConfirm = ({ trainer, date, timeSlot }) => {
    setToast(`✓ Session booked with ${trainer.name} on ${new Date(date + "T00:00:00").toLocaleDateString("en-US",{month:"short",day:"numeric"})} at ${timeSlot}`);
    setTimeout(() => setToast(null), 4000);
  };

  return (
    <div className="bt-root">

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className="bt-sidebar">
        <div className="bt-sidebar__brand">
          <div className="bt-sidebar__brand-icon"><IconDumbbellBrand /></div>
          <div className="bt-sidebar__brand-name">FitTrack</div>
        </div>

        <div className="bt-sidebar__label">Navigation</div>

        <ul className="bt-sidebar__menu">
          {navItems.map((item) => (
            <li
              key={item.route}
              className={isActive(item.route) ? "active" : ""}
              onClick={() => navigate(item.route)}
            >
              <span className="bt-sidebar__icon">{navIcons[item.icon]}</span>
              {item.label}
              {isActive(item.route) && <span className="bt-sidebar__dot" />}
            </li>
          ))}
        </ul>

        <div className="bt-sidebar__bottom">
          <ul className="bt-sidebar__menu">
            <li onClick={() => navigate("/login")}>
              <span className="bt-sidebar__icon"><IconLogout /></span>
              Logout
            </li>
          </ul>
        </div>
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <main className="bt-main">

        {/* TOPBAR */}
        <header className="bt-topbar">
          <div className="bt-topbar__title">Book Trainer</div>
          <div className="bt-topbar__right">
            <button className="bt-notif">
              <IconBell />
              <span className="bt-notif__dot" />
            </button>
            <div className="bt-profile">
              <div className="bt-profile__avatar">AT</div>
              <span className="bt-profile__name">Alex Thompson</span>
              <div className="bt-profile__globe">🌐</div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="bt-content">

          {/* PAGE HEADER */}
          <div className="bt-page-header">
            <div>
              <h1 className="bt-page-title">Personal Trainers</h1>
              <p className="bt-page-sub">Find the perfect expert to reach your fitness goals faster.</p>
            </div>
            <div className="bt-header-controls">
              <div className="bt-search">
                <IconSearch />
                <input
                  type="text"
                  placeholder="Search by name or specialization..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <button className="bt-filter-btn">
                <IconFilter /> Filters
              </button>
            </div>
          </div>

          {/* SPECIALTY TABS */}
          <div className="bt-tabs">
            {SPECIALTY_TAGS.map((tag) => (
              <button
                key={tag}
                className={`bt-tab ${activeTag === tag ? "bt-tab--active" : ""}`}
                onClick={() => { setActiveTag(tag); }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* TRAINER GRID */}
          {filtered.length === 0 ? (
            <div className="bt-empty">No trainers found matching your search.</div>
          ) : (
            <div className="bt-grid">
              {filtered.map((t) => (
                <TrainerCard key={t.id} trainer={t} onBook={setBooking} />
              ))}
            </div>
          )}

        </div>

        <footer className="bt-footer">
          <span>© 2026 FitPanel Gym Automation. All rights reserved.</span>
        </footer>
      </main>

      {/* BOOKING MODAL */}
      {booking && (
        <BookingModal
          trainer={booking}
          onClose={() => setBooking(null)}
          onConfirm={handleConfirm}
        />
      )}

      {/* TOAST */}
      {toast && <div className="bt-toast">{toast}</div>}
    </div>
  );
}