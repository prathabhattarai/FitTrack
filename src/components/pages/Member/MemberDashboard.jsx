import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
} from "recharts";
import "./MemberDashboard.css";

// ─────────────────────────────────────────
// NAV CONFIG — member-facing routes
// ─────────────────────────────────────────
const navItems = [
  { label: "Dashboard",         route: "/member/dashboard",  icon: "grid"     },
  { label: "My Membership",     route: "/member/membership", icon: "card"     },
  { label: "Payment History",   route: "/member/payments",   icon: "payment"  },
  { label: "Attendance History",route: "/member/attendance", icon: "list"     },
  { label: "Book Trainer",      route: "/member/trainer",    icon: "dumbbell" },
  { label: "Profile",           route: "/member/profile",    icon: "user"     },
];

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────
const attendanceData = [
  { day: "Mon", sessions: 2 },
  { day: "Tue", sessions: 3 },
  { day: "Wed", sessions: 0 },
  { day: "Thu", sessions: 3 },
  { day: "Fri", sessions: 2 },
  { day: "Sat", sessions: 3 },
  { day: "Sun", sessions: 0 },
];

const invoices = [
  { id: "INV-001", date: "Oct 01, 2023", amount: "$85.00", status: "Paid"     },
  { id: "INV-002", date: "Nov 01, 2023", amount: "$85.00", status: "Paid"     },
  { id: "INV-003", date: "Dec 01, 2023", amount: "$85.00", status: "Upcoming" },
];

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
const IconCheck = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconClock = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconFire = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 2C6.5 6 4 10.5 5.5 15.5 6.5 19 9.5 21 12 21s5.5-2 6.5-5.5C20 10.5 17.5 6 12 2z"/>
  </svg>
);
const IconUsers = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="9" cy="7" r="4"/>
    <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
    <path d="M16 3.13a4 4 0 010 7.75"/>
    <path d="M21 21v-2a4 4 0 00-3-3.87"/>
  </svg>
);
const IconArrow = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconTrend = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
    <polyline points="17 6 23 6 23 12"/>
  </svg>
);

const navIcons = {
  grid:     <IconGrid />,
  card:     <IconCard />,
  payment:  <IconPayment />,
  list:     <IconList />,
  dumbbell: <IconDumbbell />,
  user:     <IconUser />,
};

// ─────────────────────────────────────────
// CUSTOM TOOLTIP
// ─────────────────────────────────────────
const AttendanceTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="md-tooltip">
        <div className="md-tooltip__label">{label}</div>
        <div className="md-tooltip__value">{payload[0].value} session{payload[0].value !== 1 ? "s" : ""}</div>
      </div>
    );
  }
  return null;
};

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
export default function MemberDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [goalProgress] = useState(75);

  const isActive = (route) => location.pathname === route;

  return (
    <div className="md-root">

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className="md-sidebar">

        {/* Brand */}
        <div className="md-sidebar__brand">
          <div className="md-sidebar__brand-icon"><IconDumbbellBrand /></div>
          <div className="md-sidebar__brand-name">FitTrack</div>
        </div>

        {/* Nav section label */}
        <div className="md-sidebar__label">Navigation</div>

        {/* Main nav */}
        <ul className="md-sidebar__menu">
          {navItems.map((item) => (
            <li
              key={item.route}
              className={isActive(item.route) ? "active" : ""}
              onClick={() => navigate(item.route)}
            >
              <span className="md-sidebar__icon">{navIcons[item.icon]}</span>
              {item.label}
              {isActive(item.route) && <span className="md-sidebar__dot" />}
            </li>
          ))}
        </ul>

        {/* Bottom — logout */}
        <div className="md-sidebar__bottom">
          <ul className="md-sidebar__menu">
            <li onClick={() => navigate("/login")}>
              <span className="md-sidebar__icon"><IconLogout /></span>
              Logout
            </li>
          </ul>
        </div>

      </aside>

      {/* ══════════ MAIN ══════════ */}
      <main className="md-main">

        {/* TOPBAR */}
        <header className="md-topbar">
          <div className="md-topbar__title">Dashboard</div>
          <div className="md-topbar__right">
            <div className="md-topbar__friends">
              <div className="md-friends-avatars">
                {["AT", "MK", "JR"].map((i, idx) => (
                  <div key={idx} className="md-friends-avatar" style={{ zIndex: 3 - idx }}>{i}</div>
                ))}
              </div>
              <span>12 friends are training now</span>
            </div>
            <button className="md-notif">
              <IconBell />
              <span className="md-notif__dot" />
            </button>
            <div className="md-profile">
              <div className="md-profile__avatar">AT</div>
              <span className="md-profile__name">Alex Thompson</span>
              <div className="md-profile__globe">🌐</div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="md-content">

          {/* WELCOME */}
          <div className="md-welcome">
            <div>
              <h1 className="md-welcome__title">Welcome back, Alex!</h1>
              <p className="md-welcome__sub">Here's what's happening with your membership today.</p>
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="md-stats">

            <div className="md-stat-card">
              <div className="md-stat-card__top">
                <div className="md-stat-card__label">STATUS</div>
                <div className="md-stat-card__icon md-stat-card__icon--check">
                  <IconCheck />
                </div>
              </div>
              <div className="md-stat-card__value md-stat-card__value--brand">ACTIVE</div>
              <div className="md-stat-card__sub">Premium Gold Plan</div>
            </div>

            <div className="md-stat-card">
              <div className="md-stat-card__top">
                <div className="md-stat-card__label">MEMBERSHIP EXPIRY</div>
                <div className="md-stat-card__icon">
                  <IconCalendar />
                </div>
              </div>
              <div className="md-stat-card__value">Aug 12, 2024</div>
              <div className="md-stat-card__sub">Standard auto-renewal</div>
            </div>

            <div className="md-stat-card">
              <div className="md-stat-card__top">
                <div className="md-stat-card__label">DAYS REMAINING</div>
                <div className="md-stat-card__icon">
                  <IconClock />
                </div>
              </div>
              <div className="md-stat-card__value">
                142 Days
                <span className="md-stat-card__pill">142d</span>
              </div>
              <div className="md-stat-card__sub">&nbsp;</div>
            </div>

            <div className="md-stat-card">
              <div className="md-stat-card__top">
                <div className="md-stat-card__label">TOTAL ATTENDANCE</div>
                <div className="md-stat-card__icon md-stat-card__icon--trend">
                  <IconTrend />
                </div>
              </div>
              <div className="md-stat-card__value">84</div>
              <div className="md-stat-card__sub md-stat-card__sub--green">+12% since last month</div>
            </div>

          </div>

          {/* MIDDLE ROW — Chart + Next Session */}
          <div className="md-mid-row">

            {/* Attendance Chart */}
            <div className="md-chart-card">
              <div className="md-chart-card__header">
                <div>
                  <div className="md-chart-card__title">Attendance Summary</div>
                  <div className="md-chart-card__sub">Visual summary of your visits this week</div>
                </div>
                <div className="md-streak">
                  <IconFire />
                  <span>3 Day Streak!</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={attendanceData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 4" stroke="rgba(255,255,255,0.04)" vertical={false} />
                  <XAxis
                    dataKey="day"
                    stroke="transparent"
                    tick={{ fill: "#6b6b78", fontSize: 11, fontFamily: "Sora" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip content={<AttendanceTooltip />} cursor={{ fill: "rgba(232,48,42,0.06)" }} />
                  <Bar dataKey="sessions" fill="#e8302a" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Next Session */}
            <div className="md-session-card">
              <div className="md-session-card__header">
                <div className="md-session-card__title">Next Session</div>
                <span className="md-session-card__confirmed">CONFIRMED</span>
              </div>
              <div className="md-session-card__sub">With your personal trainer</div>

              <div className="md-trainer-block">
                <div className="md-trainer-avatar">MA</div>
                <div>
                  <div className="md-trainer-name">Marcus Aurelius</div>
                  <div className="md-trainer-spec">Functional Strength Training</div>
                </div>
              </div>

              <div className="md-session-details">
                <div className="md-session-detail">
                  <span className="md-session-detail__icon md-session-detail__icon--cal"><IconCalendar /></span>
                  <span className="md-session-detail__key">Tomorrow</span>
                  <span className="md-session-detail__val">FEB 14, 2024</span>
                </div>
                <div className="md-session-detail">
                  <span className="md-session-detail__icon md-session-detail__icon--clk"><IconClock /></span>
                  <span className="md-session-detail__key">Time</span>
                  <span className="md-session-detail__val">08:30 AM – 09:30 AM</span>
                </div>
              </div>

              <button className="md-reschedule-btn">RESCHEDULE SESSION</button>
            </div>

          </div>

          {/* BOTTOM ROW — Payment History + Training Progress */}
          <div className="md-bottom-row">

            {/* Payment History */}
            <div className="md-payment-card">
              <div className="md-payment-card__header">
                <div>
                  <div className="md-payment-card__title">Payment History</div>
                  <div className="md-payment-card__sub">Manage your billing and invoices</div>
                </div>
                <div className="md-payment-card__icon"><IconPayment /></div>
              </div>

              <div className="md-invoices">
                {invoices.map((inv) => (
                  <div key={inv.id} className="md-invoice">
                    <div className={`md-invoice__icon ${inv.status === "Upcoming" ? "md-invoice__icon--upcoming" : "md-invoice__icon--paid"}`}>
                      {inv.status === "Upcoming" ? "$" : <IconCheck />}
                    </div>
                    <div className="md-invoice__info">
                      <div className="md-invoice__id">{inv.id}</div>
                      <div className="md-invoice__date">{inv.date}</div>
                    </div>
                    <div className="md-invoice__amount">{inv.amount}</div>
                    <span className={`md-invoice__status md-invoice__status--${inv.status.toLowerCase()}`}>
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>

              <button className="md-view-ledger">
                VIEW FULL LEDGER <IconArrow />
              </button>
            </div>

            {/* Training Progress */}
            <div className="md-progress-card">
              <div className="md-progress-card__header">
                <div className="md-progress-card__title">Training Progress</div>
                <div className="md-progress-card__sub">Your fitness journey at a glance</div>
              </div>

              <div className="md-goal">
                <div className="md-goal__header">
                  <span className="md-goal__label">MONTHLY GOAL (20 SESSIONS)</span>
                  <span className="md-goal__pct">{goalProgress}%</span>
                </div>
                <div className="md-goal__bar">
                  <div className="md-goal__fill" style={{ width: `${goalProgress}%` }} />
                </div>
                <div className="md-goal__note">Only 5 sessions away from your goal</div>
              </div>

              <div className="md-progress-stats">
                <div className="md-progress-stat">
                  <div className="md-progress-stat__label">AVG DURATION</div>
                  <div className="md-progress-stat__value">68 min</div>
                </div>
                <div className="md-progress-stat">
                  <div className="md-progress-stat__label">EST. CALORIES</div>
                  <div className="md-progress-stat__value">12.4k</div>
                </div>
              </div>

              <div className="md-pro-tip">
                <div className="md-pro-tip__label">Pro Tip of the Week:</div>
                <div className="md-pro-tip__text">
                  "Consistent sleep patterns are just as important as your leg day. Aim for 7-9 hours to maximize recovery."
                </div>
              </div>
            </div>

          </div>

        </div>{/* /md-content */}

        {/* FOOTER */}
        <footer className="md-footer">
          <span>© 2026 FitPanel Gym Automation. All rights reserved.</span>
        </footer>

      </main>

    </div>
  );
}