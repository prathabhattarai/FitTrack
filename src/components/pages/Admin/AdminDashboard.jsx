import React, { useState, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Area, AreaChart,
} from "recharts";
import "./AdminDashboard.css";

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────
const monthlyRevenueData = [
  { name: "Jan", revenue: 42000 },
  { name: "Feb", revenue: 50000 },
  { name: "Mar", revenue: 46000 },
  { name: "Apr", revenue: 58000 },
  { name: "May", revenue: 52000 },
  { name: "Jun", revenue: 67000 },
];

const yearlyRevenueData = [
  { name: "Jan", revenue: 310000 },
  { name: "Feb", revenue: 380000 },
  { name: "Mar", revenue: 420000 },
  { name: "Apr", revenue: 395000 },
  { name: "May", revenue: 450000 },
  { name: "Jun", revenue: 510000 },
  { name: "Jul", revenue: 490000 },
  { name: "Aug", revenue: 530000 },
  { name: "Sep", revenue: 560000 },
  { name: "Oct", revenue: 580000 },
  { name: "Nov", revenue: 610000 },
  { name: "Dec", revenue: 640000 },
];

const growthData = [
  { name: "Jan", value: 1200 },
  { name: "Feb", value: 1350 },
  { name: "Mar", value: 1420 },
  { name: "Apr", value: 1600 },
  { name: "May", value: 1850 },
  { name: "Jun", value: 2100 },
];

const initialMembers = [
  { name: "Marcus Thorne",   email: "m.thorne@example.com",  plan: "Premium",  status: "Active",  date: "Nov 12, 2023" },
  { name: "Elena Rodriguez", email: "elena.r@example.com",   plan: "Standard", status: "Active",  date: "Nov 15, 2023" },
  { name: "Jameson Blake",   email: "j.blake@example.com",   plan: "Premium",  status: "Expired", date: "Oct 1, 2023"  },
  { name: "Sarah Jenkins",   email: "sarah.j@example.com",   plan: "Basic",    status: "Active",  date: "Nov 20, 2023" },
  { name: "David Wu",        email: "d.wu@example.com",      plan: "Standard", status: "Active",  date: "Nov 22, 2023" },
];

// ─────────────────────────────────────────
// NAV
// ─────────────────────────────────────────
const navItems = [
  { label: "Dashboard",        route: "/admin/dashboard", icon: "grid"  },
  { label: "Manage Members",   route: "/members",         icon: "users" },
  { label: "Membership Plans", route: "/membershipplan",  icon: "card"  },
  { label: "Trainers",         route: "/trainer",         icon: "user"  },
  { label: "Attendance",       route: "/attendance",      icon: "list"  },
];

// ─────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────
function getInitials(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}
function formatCurrency(v) {
  return "$" + v.toLocaleString();
}

// ─────────────────────────────────────────
// ICONS
// ─────────────────────────────────────────
const IconGrid = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
    <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
  </svg>
);
const IconUsers = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
    <path d="M16 3.13a4 4 0 010 7.75"/><path d="M21 21v-2a4 4 0 00-3-3.87"/>
  </svg>
);
const IconCard = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
  </svg>
);
const IconUser = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0113 0"/>
  </svg>
);
const IconList = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
  </svg>
);
const IconSettings = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
  </svg>
);
const IconLogout = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconBell = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconDownload = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IconPlus = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconChevron = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const IconClock = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
  </svg>
);
const IconDumbbell = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M6 5v14M18 5v14"/>
    <rect x="3" y="8" width="3" height="8" rx="1"/>
    <rect x="18" y="8" width="3" height="8" rx="1"/>
    <line x1="6" y1="12" x2="18" y2="12"/>
  </svg>
);
const IconTag = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/>
    <line x1="7" y1="7" x2="7.01" y2="7"/>
  </svg>
);

const navIcons = {
  grid:  <IconGrid />,
  users: <IconUsers />,
  card:  <IconCard />,
  user:  <IconUser />,
  list:  <IconList />,
};

// ─────────────────────────────────────────
// CHART TOOLTIPS
// ─────────────────────────────────────────
const RevenueTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="ft-tooltip">
        <div className="ft-tooltip__label">{label}</div>
        <div className="ft-tooltip__value">{formatCurrency(payload[0].value)}</div>
      </div>
    );
  }
  return null;
};

const GrowthTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="ft-tooltip">
        <div className="ft-tooltip__label">{label}</div>
        <div className="ft-tooltip__value">{payload[0].value.toLocaleString()} members</div>
      </div>
    );
  }
  return null;
};

// ─────────────────────────────────────────
// TOAST
// ─────────────────────────────────────────
const Toast = ({ message, type, visible }) => (
  <div className={`ft-toast ft-toast--${type} ${visible ? "ft-toast--show" : ""}`}>
    <span className="ft-toast__dot" />
    {message}
  </div>
);

// ─────────────────────────────────────────
// MEMBER MODAL
// ─────────────────────────────────────────
const MemberModal = ({ isOpen, onClose, onSave, editData }) => {
  const [form, setForm] = useState({ name: "", email: "", plan: "Premium", status: "Active" });

  React.useEffect(() => {
    if (editData) {
      setForm({ name: editData.name, email: editData.email, plan: editData.plan, status: editData.status });
    } else {
      setForm({ name: "", email: "", plan: "Premium", status: "Active" });
    }
  }, [editData, isOpen]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    onSave(form);
  };

  if (!isOpen) return null;

  return (
    <div className="ft-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ft-modal">
        <div className="ft-modal__header">
          <div>
            <h2>{editData ? "Edit Member" : "Add New Member"}</h2>
            <p>Fill in the member's details below.</p>
          </div>
          <button className="ft-modal__close" onClick={onClose}>✕</button>
        </div>
        <div className="ft-modal__body">
          <div className="ft-form-group">
            <label>Full Name</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. John Smith" />
          </div>
          <div className="ft-form-group">
            <label>Email Address</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
          </div>
          <div className="ft-form-group">
            <label>Membership Plan</label>
            <select name="plan" value={form.plan} onChange={handleChange}>
              <option value="Premium">Premium — $199/yr</option>
              <option value="Standard">Standard — $99/3mo</option>
              <option value="Basic">Basic — $49/mo</option>
            </select>
          </div>
          <div className="ft-form-group">
            <label>Status</label>
            <select name="status" value={form.status} onChange={handleChange}>
              <option value="Active">Active</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
        </div>
        <div className="ft-modal__actions">
          <button className="ft-btn ft-btn--outline" onClick={onClose}>Cancel</button>
          <button className="ft-btn ft-btn--primary" onClick={handleSubmit}>
            {editData ? "Update Member" : "Save Member"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// SEARCH SUGGESTIONS
// ─────────────────────────────────────────
const quickSuggestions = [
  { label: "Premium members",  query: "Premium",  type: "plan"   },
  { label: "Standard members", query: "Standard", type: "plan"   },
  { label: "Basic members",    query: "Basic",    type: "plan"   },
  { label: "Active members",   query: "Active",   type: "status" },
  { label: "Expired members",  query: "Expired",  type: "status" },
];

const SearchSuggestions = ({ search, members, onSelect, visible }) => {
  if (!visible) return null;
  const isTyping = search.trim().length > 0;
  const memberMatches = isTyping
    ? members.filter((m) =>
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.plan.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <div className="ft-suggestions">
      {!isTyping && (
        <>
          <div className="ft-suggestions__section-label">Quick Filters</div>
          {quickSuggestions.map((s) => (
            <button
              key={s.query}
              className="ft-suggestions__item ft-suggestions__item--quick"
              onMouseDown={() => onSelect(s.query)}
            >
              <span className={`ft-suggestions__tag ft-suggestions__tag--${s.type}`}>
                <IconTag /> {s.type}
              </span>
              {s.label}
            </button>
          ))}
          <div className="ft-suggestions__section-label" style={{ marginTop: 8 }}>Recent Members</div>
          {members.slice(0, 3).map((m) => (
            <button key={m.email} className="ft-suggestions__item" onMouseDown={() => onSelect(m.name)}>
              <span className="ft-suggestions__avatar">{getInitials(m.name)}</span>
              <span className="ft-suggestions__info">
                <span className="ft-suggestions__name">{m.name}</span>
                <span className="ft-suggestions__sub">{m.email}</span>
              </span>
              <span className={`ft-suggestions__plan ft-suggestions__plan--${m.plan.toLowerCase()}`}>{m.plan}</span>
            </button>
          ))}
        </>
      )}
      {isTyping && memberMatches.length === 0 && (
        <div className="ft-suggestions__empty">
          No results for <strong>"{search}"</strong>
        </div>
      )}
      {isTyping && memberMatches.length > 0 && (
        <>
          <div className="ft-suggestions__section-label">
            {memberMatches.length} result{memberMatches.length !== 1 ? "s" : ""} found
          </div>
          {memberMatches.map((m) => (
            <button key={m.email} className="ft-suggestions__item" onMouseDown={() => onSelect(m.name)}>
              <span className="ft-suggestions__avatar">{getInitials(m.name)}</span>
              <span className="ft-suggestions__info">
                <span className="ft-suggestions__name">{m.name}</span>
                <span className="ft-suggestions__sub">{m.email}</span>
              </span>
              <span className={`ft-suggestions__plan ft-suggestions__plan--${m.plan.toLowerCase()}`}>{m.plan}</span>
            </button>
          ))}
        </>
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
const AdminDashboard = () => {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [members, setMembers]             = useState(initialMembers);
  const [search, setSearch]               = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [revenueMode, setRevenueMode]     = useState("monthly");
  const [modalOpen, setModalOpen]         = useState(false);
  const [editIndex, setEditIndex]         = useState(null);
  const [toast, setToast]                 = useState({ message: "", type: "success", visible: false });

  const toastTimer = useRef(null);
  const searchRef  = useRef(null);

  // ── Derived stats
  const totalMembers   = members.length + 2477;
  const activeCount    = members.filter((m) => m.status === "Active").length + 1836;
  const expiredCount   = members.filter((m) => m.status === "Expired").length + 213;
  const monthlyRevenue = "$67,420";

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase()) ||
      m.plan.toLowerCase().includes(search.toLowerCase())
  );

  const revenueChartData = revenueMode === "monthly" ? monthlyRevenueData : yearlyRevenueData;

  // ── Helpers
  const showToast = (message, type = "success") => {
    clearTimeout(toastTimer.current);
    setToast({ message, type, visible: true });
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2800);
  };

  const isActive = (route) => location.pathname === route;

  // ── Member actions
  const handleSave = (form) => {
    if (editIndex !== null) {
      setMembers((prev) => prev.map((m, i) => (i === editIndex ? { ...m, ...form } : m)));
      showToast("✓ Member updated!");
    } else {
      const dateStr = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      setMembers((prev) => [{ ...form, date: dateStr }, ...prev]);
      showToast("✓ Member added successfully!");
    }
    setModalOpen(false);
    setEditIndex(null);
  };

  const handleEdit   = (i) => { setEditIndex(i); setModalOpen(true); };
  const handleDelete = (i) => {
    if (!window.confirm(`Delete ${members[i].name}?`)) return;
    setMembers((prev) => prev.filter((_, idx) => idx !== i));
    showToast("Member removed.");
  };

  const handleDownload = () => {
    const lines = [
      "FITTRACK — SYSTEM REPORT", "========================",
      `Total Members:    ${totalMembers.toLocaleString()}`,
      `Active:           ${activeCount.toLocaleString()}`,
      `Expired:          ${expiredCount.toLocaleString()}`,
      `Monthly Revenue:  ${monthlyRevenue}`, "",
      "RECENT REGISTRATIONS", "--------------------",
      ...members.map((m) => `${m.name} | ${m.plan} | ${m.status} | ${m.date}`),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "fittrack-report.txt";
    a.click();
    showToast("✓ Report downloaded!");
  };

  const handleSuggestionSelect = (query) => {
    setSearch(query);
    setSearchFocused(false);
    searchRef.current?.blur();
  };

  // ─────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────
  return (
    <div className="ft-dashboard">

      {/* ════════════ SIDEBAR ════════════ */}
      <aside className="ft-sidebar">

        {/* Brand */}
        <div className="ft-sidebar__brand">
          <div className="ft-sidebar__brand-icon"><IconDumbbell /></div>
          <div className="ft-sidebar__brand-name">FitTrack</div>
        </div>

        {/* Nav section label */}
        <div className="ft-sidebar__label">Navigation</div>

        {/* Main nav */}
        <ul className="ft-sidebar__menu">
          {navItems.map((item) => (
            <li
              key={item.route}
              className={isActive(item.route) ? "active" : ""}
              onClick={() => navigate(item.route)}
            >
              <span className="ft-sidebar__icon">{navIcons[item.icon]}</span>
              {item.label}
              {isActive(item.route) && <span className="ft-sidebar__dot" />}
            </li>
          ))}
        </ul>

        {/* Bottom — settings + logout */}
        <div className="ft-sidebar__bottom">
          <ul className="ft-sidebar__menu">
            {/* ✅ FIXED: navigates to /admin/settings instead of showing toast */}
            <li
              className={isActive("/admin/settings") ? "active" : ""}
              onClick={() => navigate("/admin/settings")}
            >
              <span className="ft-sidebar__icon"><IconSettings /></span>
              Settings
              {isActive("/admin/settings") && <span className="ft-sidebar__dot" />}
            </li>
            <li onClick={() => navigate("/login")}>
              <span className="ft-sidebar__icon"><IconLogout /></span>
              Logout
            </li>
          </ul>
        </div>

      </aside>

      {/* ════════════ MAIN ════════════ */}
      <div className="ft-main">

        {/* ── TOPBAR ── */}
        <div className="ft-topbar">
          <div className="ft-topbar__search-wrap">
            <div className={`ft-topbar__search ${searchFocused ? "ft-topbar__search--focused" : ""}`}>
              <IconSearch />
              <input
                ref={searchRef}
                type="text"
                placeholder="Search members, plans, transactions…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearch(""); setSearchFocused(false); searchRef.current?.blur();
                  }
                }}
              />
              {search && (
                <button
                  className="ft-search-clear"
                  onMouseDown={() => { setSearch(""); searchRef.current?.focus(); }}
                >✕</button>
              )}
            </div>
            <SearchSuggestions
              search={search}
              members={members}
              onSelect={handleSuggestionSelect}
              visible={searchFocused}
            />
          </div>

          <div className="ft-topbar__right">
            <div className="ft-notif" onClick={() => showToast("No new notifications.")}>
              <IconBell /><span className="ft-notif__dot" />
            </div>
            <div className="ft-profile">
              <div className="ft-profile__avatar">AD</div>
              <div className="ft-profile__info">
                <div className="ft-profile__name">Admin</div>
                <div className="ft-profile__role">FitTrack Admin</div>
              </div>
            </div>
          </div>
        </div>

        {/* ── CONTENT ── */}
        <div className="ft-content">

          {/* PAGE HEADER */}
          <div className="ft-page-header">
            <div>
              <div className="ft-page-header__title">System Overview</div>
              <div className="ft-page-header__sub">Operational pulse for FitTrack Gym Management System.</div>
            </div>
            <div className="ft-page-header__actions">
              <button className="ft-btn ft-btn--outline" onClick={handleDownload}>
                <IconDownload /> Download Report
              </button>
              <button className="ft-btn ft-btn--primary" onClick={() => { setEditIndex(null); setModalOpen(true); }}>
                <IconPlus /> Add New Member
              </button>
            </div>
          </div>

          {/* STATS */}
          <div className="ft-stats">
            <div className="ft-stat-card">
              <div className="ft-stat-card__top">
                <div className="ft-stat-card__icon">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/>
                  </svg>
                </div>
                <span className="ft-badge ft-badge--green">↑ +12.5%</span>
              </div>
              <div className="ft-stat-card__value">{totalMembers.toLocaleString()}</div>
              <div className="ft-stat-card__label">Total Members</div>
            </div>

            <div className="ft-stat-card">
              <div className="ft-stat-card__top">
                <div className="ft-stat-card__icon">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                </div>
                <span className="ft-badge ft-badge--green">↑ +8.2%</span>
              </div>
              <div className="ft-stat-card__value">{activeCount.toLocaleString()}</div>
              <div className="ft-stat-card__label">Active Memberships</div>
            </div>

            <div className="ft-stat-card">
              <div className="ft-stat-card__top">
                <div className="ft-stat-card__icon">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="3" y="4" width="18" height="18" rx="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <span className="ft-badge ft-badge--red">↓ -4.1%</span>
              </div>
              <div className="ft-stat-card__value">{expiredCount.toLocaleString()}</div>
              <div className="ft-stat-card__label">Expired Memberships</div>
            </div>

            <div className="ft-stat-card">
              <div className="ft-stat-card__top">
                <div className="ft-stat-card__icon">
                  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <rect x="1" y="4" width="22" height="16" rx="2"/>
                    <line x1="1" y1="10" x2="23" y2="10"/>
                  </svg>
                </div>
                <span className="ft-badge ft-badge--green">↑ +18.4%</span>
              </div>
              <div className="ft-stat-card__value">{monthlyRevenue}</div>
              <div className="ft-stat-card__label">Monthly Revenue</div>
            </div>
          </div>

          {/* CHARTS */}
          <div className="ft-charts">
            <div className="ft-chart-card">
              <div className="ft-chart-card__header">
                <div>
                  <div className="ft-chart-card__title">Revenue Performance</div>
                  <div className="ft-chart-card__sub">
                    {revenueMode === "monthly"
                      ? "Monthly fiscal growth analysis (Jan – Jun)"
                      : "Yearly fiscal growth analysis (Jan – Dec)"}
                  </div>
                </div>
                <div className="ft-toggle-group">
                  <button
                    className={`ft-toggle-btn ${revenueMode === "yearly" ? "active" : ""}`}
                    onClick={() => setRevenueMode("yearly")}
                  >Yearly</button>
                  <button
                    className={`ft-toggle-btn ${revenueMode === "monthly" ? "active" : ""}`}
                    onClick={() => setRevenueMode("monthly")}
                  >Monthly</button>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={revenueChartData} barSize={26}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" stroke="#555" tick={{ fontSize: 11, fontFamily: "Sora" }} />
                  <YAxis
                    stroke="#555"
                    tick={{ fontSize: 11, fontFamily: "Sora" }}
                    tickFormatter={(v) => "$" + (v >= 1000 ? v / 1000 + "k" : v)}
                  />
                  <Tooltip content={<RevenueTooltip />} cursor={{ fill: "rgba(232,48,42,0.04)" }} />
                  <Bar dataKey="revenue" fill="#e86414" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="ft-chart-card">
              <div className="ft-chart-card__header">
                <div>
                  <div className="ft-chart-card__title">Member Growth</div>
                  <div className="ft-chart-card__sub">Organic acquisition vs retention rate</div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={240}>
                <AreaChart data={growthData}>
                  <defs>
                    <linearGradient id="ftGrowthGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#e86414" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#e86414" stopOpacity={0}   />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                  <XAxis dataKey="name" stroke="#555" tick={{ fontSize: 11, fontFamily: "Sora" }} />
                  <YAxis stroke="#555" tick={{ fontSize: 11, fontFamily: "Sora" }} />
                  <Tooltip content={<GrowthTooltip />} />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#e86414"
                    strokeWidth={2.5}
                    fill="url(#ftGrowthGrad)"
                    dot={{ fill: "#e86414", r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* TABLE */}
          <div className="ft-table-card">
            <div className="ft-table-card__header">
              <div>
                <div className="ft-table-card__title">Recent Registrations</div>
                <div className="ft-table-card__sub">Manage the latest additions to your fitness community.</div>
              </div>
              <div className="ft-view-all" onClick={() => navigate("/members")}>
                View All Members <IconChevron />
              </div>
            </div>

            <table className="ft-table">
              <thead>
                <tr>
                  <th>Member</th>
                  <th>Membership Plan</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="ft-table__empty">No members found.</td>
                  </tr>
                ) : (
                  filtered.map((m, i) => (
                    <tr key={i}>
                      <td>
                        <div className="ft-member-cell">
                          <div className="ft-member-cell__avatar">{getInitials(m.name)}</div>
                          <div>
                            <div className="ft-member-cell__name">{m.name}</div>
                            <div className="ft-member-cell__email">{m.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="ft-plan-cell">
                          <IconClock /> {m.plan}
                        </div>
                      </td>
                      <td>
                        <span className={`ft-status ${m.status === "Active" ? "ft-status--active" : "ft-status--expired"}`}>
                          <span className="ft-status__dot" />
                          {m.status}
                        </span>
                      </td>
                      <td className="ft-table__date">{m.date}</td>
                      <td>
                        <div className="ft-actions">
                          <button
                            className="ft-action-btn"
                            title="Edit"
                            onClick={() => handleEdit(members.indexOf(m))}
                          >✎</button>
                          <button
                            className="ft-action-btn ft-action-btn--delete"
                            title="Delete"
                            onClick={() => handleDelete(members.indexOf(m))}
                          >✕</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>{/* /ft-content */}

        {/* FOOTER */}
        <footer className="ft-footer">
          <div className="ft-footer__links">
            <span onClick={() => showToast("Documentation coming soon.")}>Documentation</span>
            <span onClick={() => showToast("Privacy Policy coming soon.")}>Privacy Policy</span>
            <span onClick={() => showToast("Security Audit coming soon.")}>Security Audit</span>
          </div>
          <div className="ft-footer__copy">© 2026 FitTrack. All rights reserved.</div>
        </footer>

      </div>{/* /ft-main */}

      {/* MEMBER MODAL */}
      <MemberModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditIndex(null); }}
        onSave={handleSave}
        editData={editIndex !== null ? members[editIndex] : null}
      />

      {/* TOAST */}
      <Toast message={toast.message} type={toast.type} visible={toast.visible} />

    </div>
  );
};

export default AdminDashboard;