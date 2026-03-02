import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MyMembership.css";

const navItems = [
  { label: "Dashboard",          route: "/member/dashboard",  icon: "grid"     },
  { label: "My Membership",      route: "/member/membership", icon: "card"     },
  { label: "Payment History",    route: "/member/payments",   icon: "payment"  },
  { label: "Attendance History", route: "/member/attendance", icon: "list"     },
  { label: "Book Trainer",       route: "/member/trainer",    icon: "dumbbell" },
  { label: "Profile",            route: "/member/profile",    icon: "user"     },
];

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
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconBell = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
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
const IconClock = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
  </svg>
);
const IconRefresh = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <polyline points="23 4 23 10 17 10"/>
    <path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/>
  </svg>
);
const IconUpgrade = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12 8 12 16"/>
    <polyline points="8 12 12 8 16 12"/>
  </svg>
);
const IconShield = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconActivity = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);
const IconUsers = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="9" cy="7" r="4"/>
    <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
    <path d="M16 3.13a4 4 0 010 7.75"/>
    <path d="M21 21v-2a4 4 0 00-3-3.87"/>
  </svg>
);
const IconFlame = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z"/>
  </svg>
);
const IconCreditCard = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
  </svg>
);
const IconChevronRight = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const IconHeadset = () => (
  <svg width="26" height="26" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
    <path d="M3 18v-6a9 9 0 0118 0v6"/>
    <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3z"/>
    <path d="M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3z"/>
  </svg>
);
const IconBolt = () => (
  <svg width="15" height="15" fill="currentColor" stroke="none" viewBox="0 0 24 24">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
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

const benefits = [
  { icon: <IconShield />,   title: "24/7 Access",       desc: "Enter the facility any time using your digital member key."           },
  { icon: <IconActivity />, title: "Advanced Training",  desc: "Complimentary access to all HIIT and Strength classes."              },
  { icon: <IconUsers />,    title: "Guest Passes",       desc: "2 monthly passes for friends to join your workout."                  },
  { icon: <IconFlame />,    title: "Sauna & Spa",        desc: "Full access to recovery zones including sauna and cold plunge."      },
];

export default function MyMembership() {
  const navigate = useNavigate();
  const location = useLocation();
  const [toast, setToast] = useState({ msg: "", show: false });

  const isActive    = (r) => location.pathname === r;
  const showToast   = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: "", show: false }), 2600);
  };

  const daysRemaining = 84;
  const progressPct   = Math.round(((365 - daysRemaining) / 365) * 100);

  return (
    <div className="mym-root">

      {/* ═══════════ SIDEBAR ═══════════ */}
      <aside className="mym-sidebar">
        <div className="mym-sidebar__brand">
          <div className="mym-sidebar__brand-icon"><IconDumbbellBrand /></div>
          <div className="mym-sidebar__brand-name">FitTrack</div>
        </div>

        <div className="mym-sidebar__label">Navigation</div>

        <ul className="mym-sidebar__menu">
          {navItems.map((item) => (
            <li key={item.route} className={isActive(item.route) ? "active" : ""} onClick={() => navigate(item.route)}>
              <span className="mym-sidebar__icon">{navIcons[item.icon]}</span>
              {item.label}
              {isActive(item.route) && <span className="mym-sidebar__dot" />}
            </li>
          ))}
        </ul>

        <div className="mym-sidebar__bottom">
          <ul className="mym-sidebar__menu">
            <li onClick={() => navigate("/login")}>
              <span className="mym-sidebar__icon"><IconLogout /></span>
              Logout
            </li>
          </ul>
        </div>
      </aside>

      {/* ═══════════ MAIN ═══════════ */}
      <main className="mym-main">

        {/* TOPBAR */}
        <header className="mym-topbar">
          <div className="mym-topbar__title">My Membership</div>
          <div className="mym-topbar__right">
            <button className="mym-notif">
              <IconBell />
              <span className="mym-notif__dot" />
            </button>
            <div className="mym-profile">
              <div className="mym-profile__avatar">AT</div>
              <span className="mym-profile__name">Alex Thompson</span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="mym-content">

          <div className="mym-heading">
            <h1 className="mym-heading__title">Your Membership</h1>
            <p className="mym-heading__sub">Manage your subscription, benefits, and billing preferences.</p>
          </div>

          <div className="mym-layout">

            {/* ── LEFT COLUMN ── */}
            <div className="mym-left">

              {/* PLAN CARD */}
              <div className="mym-plan-card">
                <div className="mym-plan-card__top">
                  <div>
                    <div className="mym-tier-pill">Premium Tier</div>
                    <div className="mym-plan-name">Elite Performance</div>
                    <div className="mym-plan-tagline">Unlimited access to all facilities and classes</div>
                  </div>
                  <div className="mym-days-box">
                    <div className="mym-days-box__num">{daysRemaining}</div>
                    <div className="mym-days-box__label">DAYS REMAINING</div>
                  </div>
                </div>

                <div className="mym-dates-row">
                  <span className="mym-date-item">
                    <span className="mym-date-item__ico mym-date-item__ico--gray"><IconCalendar /></span>
                    Started: Jan 12, 2024
                  </span>
                  <span className="mym-date-item mym-date-item--right">
                    <span className="mym-date-item__ico mym-date-item__ico--brand"><IconClock /></span>
                    Expires: Jan 12, 2025
                  </span>
                </div>

                <div className="mym-bar">
                  <div className="mym-bar__fill" style={{ width: `${progressPct}%` }} />
                  <div className="mym-bar__knob" style={{ left: `calc(${progressPct}% - 7px)` }} />
                </div>

                <div className="mym-stats-row">
                  <div className="mym-stat-item">
                    <div className="mym-stat-item__lbl">STATUS</div>
                    <div className="mym-stat-item__val">Active</div>
                  </div>
                  <div className="mym-stat-sep" />
                  <div className="mym-stat-item">
                    <div className="mym-stat-item__lbl">MEMBER SINCE</div>
                    <div className="mym-stat-item__val">2021</div>
                  </div>
                  <div className="mym-stat-sep" />
                  <div className="mym-stat-item">
                    <div className="mym-stat-item__lbl">AUTO-RENEW</div>
                    <div className="mym-stat-item__val">Enabled</div>
                  </div>
                </div>

                <div className="mym-plan-hr" />

                <div className="mym-ctas">
                  <button className="mym-btn-renew" onClick={() => showToast("✓ Renewal initiated!")}>
                    <IconRefresh /> Renew Membership
                  </button>
                  <button className="mym-btn-upgrade" onClick={() => showToast("Upgrade options coming soon.")}>
                    <IconUpgrade /> Upgrade Plan
                  </button>
                </div>
              </div>

              {/* BENEFITS */}
              <div className="mym-benefits">
                <div className="mym-benefits__hdr">
                  <span className="mym-benefits__bolt"><IconBolt /></span>
                  <span className="mym-benefits__title">Plan Benefits</span>
                </div>
                <div className="mym-benefits__grid">
                  {benefits.map((b, i) => (
                    <div key={i} className="mym-benefit">
                      <div className="mym-benefit__ico">{b.icon}</div>
                      <div>
                        <div className="mym-benefit__title">{b.title}</div>
                        <div className="mym-benefit__desc">{b.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="mym-right">

              {/* NEXT PAYMENT */}
              <div className="mym-payment-card">
                <div className="mym-payment-card__hdr">
                  <span className="mym-payment-card__ico"><IconCreditCard /></span>
                  <span className="mym-payment-card__title">Next Payment</span>
                </div>
                <div className="mym-payment-card__amounts">
                  <div>
                    <div className="mym-payment-card__lbl">AMOUNT DUE</div>
                    <div className="mym-payment-card__amount">$129.00</div>
                  </div>
                  <div className="mym-payment-card__date-block">
                    <div className="mym-payment-card__lbl">DATE</div>
                    <div className="mym-payment-card__date">Feb 12, 2025</div>
                  </div>
                </div>
                <div className="mym-visa-row">
                  <div className="mym-visa-info">
                    <IconCreditCard />
                    <span>Visa ending in 4242</span>
                  </div>
                  <button className="mym-change-btn" onClick={() => showToast("Card management coming soon.")}>
                    Change
                  </button>
                </div>
                <div className="mym-payment-sep" />
                <button className="mym-view-history" onClick={() => navigate("/member/payments")}>
                  View Payment History <IconChevronRight />
                </button>
              </div>

              {/* ASSISTANCE */}
              <div className="mym-assist">
                <div className="mym-assist__ico-ring">
                  <IconHeadset />
                </div>
                <div className="mym-assist__title">Need Assistance?</div>
                <div className="mym-assist__sub">Our support team is available 24/7 to help with membership questions.</div>
                <button className="mym-contact-btn" onClick={() => showToast("Opening support…")}>
                  Contact Support
                </button>
              </div>

              {/* REFER A FRIEND */}
              <div className="mym-refer">
                <div className="mym-refer__bg" />
                <div className="mym-refer__overlay" />
                <div className="mym-refer__content">
                  <span className="mym-refer__tag">Refer a Friend</span>
                  <div className="mym-refer__title">Get 1 Month Free!</div>
                  <div className="mym-refer__sub">Invite friends and save on your membership.</div>
                </div>
              </div>

            </div>

          </div>
        </div>

        <footer className="mym-footer">© 2026 FitPanel Gym Automation. All rights reserved.</footer>
      </main>

      {/* TOAST */}
      <div className={`mym-toast ${toast.show ? "mym-toast--show" : ""}`}>
        <span className="mym-toast__dot" />{toast.msg}
      </div>

    </div>
  );
}