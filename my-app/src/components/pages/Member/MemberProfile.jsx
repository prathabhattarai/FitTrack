import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MemberProfile.css";
import {
  getMemberDisplayName,
  getMemberInitials,
  setMemberDisplayName,
  getMemberProfile,
  setMemberProfile,
} from "../../../utils/memberProfile";

// ─────────────────────────────────────────
// NAV CONFIG
// ─────────────────────────────────────────
const navItems = [
  { label: "Dashboard",          route: "/member/dashboard",  icon: "grid"     },
  { label: "My Membership",      route: "/member/membership", icon: "card"     },
  { label: "Payment History",    route: "/member/payments",   icon: "payment"  },
  { label: "Attendance History", route: "/member/attendance", icon: "list"     },
  { label: "Workout Schedule",   route: "/member/schedule",   icon: "calendar" },
  { label: "Workout Videos",     route: "/member/videos",     icon: "play"     },
  { label: "BMI Calculator",     route: "/member/bmi",        icon: "bmi"      },
  { label: "Book Trainer",       route: "/member/trainer",    icon: "dumbbell" },
  { label: "Profile",            route: "/member/profile",    icon: "user"     },
];

// ─────────────────────────────────────────
// INITIAL PROFILE DATA
// ─────────────────────────────────────────
const INITIAL_PROFILE = {
  fullName:  "",
  memberId:  "--",
  dob:       "--",
  gender:    "--",
  email:     "--",
  phone:     "--",
  address:   "--",
  status:    "Active",
  tier:      "Elite Member",
  plan:      "--",
  progress:  85,
  renewal:   42,
  sessions:  24,
  streak:    12,
  points:    2450,
  since:     "2023",
  anniversary: "Jan Anniversary",
};

const RECENT_ACTIVITY = [
  { label: "Morning Workout",   date: "Oct 24, 2023", duration: "1h 15m", color: "#e86414" },
  { label: "Personal Training", date: "Oct 22, 2023", duration: "55m",    color: "#e86414" },
  { label: "Evening Cardio",    date: "Oct 21, 2023", duration: "45m",    color: "#e86414" },
];

const API_BASE_URL = "http://localhost:5000/api";

const formatDob = (rawDob) => {
  if (!rawDob) return "--";
  const parsed = new Date(rawDob);
  if (Number.isNaN(parsed.getTime())) return String(rawDob);
  return parsed.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const toDateInputValue = (rawDob) => {
  if (!rawDob || rawDob === "--") return "";
  const parsed = new Date(rawDob);
  if (Number.isNaN(parsed.getTime())) return "";
  return parsed.toISOString().split("T")[0];
};

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
const IconGrid    = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>;
const IconCard    = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>;
const IconPayment = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>;
const IconList    = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>;
const IconDumbbell= () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 5v14M18 5v14"/><rect x="3" y="8" width="3" height="8" rx="1"/><rect x="18" y="8" width="3" height="8" rx="1"/><line x1="6" y1="12" x2="18" y2="12"/></svg>;
const IconUser    = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0113 0"/></svg>;
const IconLogout  = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>;
const IconBell    = () => <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>;
const IconClose   = () => <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;
const IconEdit    = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>;
const IconLock    = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>;
const IconTrend   = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>;
const IconAward   = () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;
const IconCalendar= () => <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
const IconPlay    = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>;
const IconCamera  = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>;
const IconMail    = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>;
const IconPhone   = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.8 19.79 19.79 0 01.14 1.26 2 2 0 012.11.08h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>;
const IconMapPin  = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>;
const IconGender  = () => <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
const IconShield  = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
const IconArrow   = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
const IconEye     = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;
const IconEyeOff  = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>;
const IconCheck   = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>;

const navIcons = {
  grid: <IconGrid />, card: <IconCard />, payment: <IconPayment />,
  list: <IconList />, calendar: <IconCalendar />, play: <IconPlay />, bmi: <IconCard />, dumbbell: <IconDumbbell />, user: <IconUser />,
};

// ─────────────────────────────────────────
// TOGGLE SWITCH
// ─────────────────────────────────────────
function Toggle({ on, onChange }) {
  return (
    <button className={`mp-toggle ${on ? "mp-toggle--on" : ""}`} onClick={() => onChange(!on)}>
      <span className="mp-toggle__thumb" />
    </button>
  );
}

// ─────────────────────────────────────────
// CHANGE PASSWORD MODAL
// ─────────────────────────────────────────
function PasswordModal({ onClose }) {
  const [form, setForm]   = useState({ current: "", newPw: "", confirm: "" });
  const [show, setShow]   = useState({ current: false, newPw: false, confirm: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone]   = useState(false);

  const handleSave = async () => {
    if (!form.current) { setError("Enter your current password."); return; }
    if (form.newPw.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (form.newPw !== form.confirm) { setError("Passwords don't match."); return; }
    
    setError("");
    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const email = user.email;

      if (!email) {
        setError("User information not found. Please logout and login again.");
        setLoading(false);
        return;
      }

      const res = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          currentPassword: form.current,
          newPassword: form.newPw
        })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Failed to change password");
        setLoading(false);
        return;
      }

      setDone(true);
      setLoading(false);
      setTimeout(onClose, 2000);
    } catch (err) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  const toggle = (k) => setShow((s) => ({ ...s, [k]: !s[k] }));

  return (
    <div className="mp-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mp-modal">
        <div className="mp-modal__header">
          <div className="mp-modal__title">Change Password</div>
          <button className="mp-modal__close" onClick={onClose}><IconClose /></button>
        </div>
        {done ? (
          <div className="mp-modal__success">
            <div className="mp-modal__success-icon"><IconCheck /></div>
            Password updated successfully! Please logout and login again with your new password.
          </div>
        ) : (
          <>
            <div className="mp-modal__body">
              {[
                { key: "current", label: "Current Password" },
                { key: "newPw",   label: "New Password" },
                { key: "confirm", label: "Confirm New Password" },
              ].map(({ key, label }) => (
                <div className="mp-field" key={key}>
                  <label className="mp-field__label">{label}</label>
                  <div className="mp-field__pw-wrap">
                    <input
                      type={show[key] ? "text" : "password"}
                      className="mp-field__input"
                      placeholder={label}
                      value={form[key]}
                      onChange={(e) => { setForm((f) => ({ ...f, [key]: e.target.value })); setError(""); }}
                      disabled={loading}
                    />
                    <button className="mp-field__eye" onClick={() => toggle(key)} disabled={loading}>
                      {show[key] ? <IconEyeOff /> : <IconEye />}
                    </button>
                  </div>
                </div>
              ))}
              {error && <div className="mp-modal__error">{error}</div>}
            </div>
            <div className="mp-modal__footer">
              <button className="mp-modal__cancel" onClick={onClose} disabled={loading}>Cancel</button>
              <button className="mp-modal__confirm" onClick={handleSave} disabled={loading}>
                {loading ? "Updating..." : "Update Password"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// EDIT PROFILE MODAL
// ─────────────────────────────────────────
function EditProfileModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState({
    fullName: profile.fullName,
    dob:      toDateInputValue(profile.dob),
    gender:   profile.gender,
    email:    profile.email,
    phone:    profile.phone,
    address:  profile.address,
    plan:     profile.plan,
  });
  const [done, setDone] = useState(false);

  const handleSave = () => {
    setDone(true);
    setTimeout(() => { onSave(form); onClose(); }, 1600);
  };

  return (
    <div className="mp-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="mp-modal mp-modal--wide">
        <div className="mp-modal__header">
          <div className="mp-modal__title">Edit Profile</div>
          <button className="mp-modal__close" onClick={onClose}><IconClose /></button>
        </div>
        {done ? (
          <div className="mp-modal__success">
            <div className="mp-modal__success-icon"><IconCheck /></div>
            Profile saved successfully!
          </div>
        ) : (
          <>
            <div className="mp-modal__body mp-modal__body--grid">
              {[
                { key: "fullName", label: "Full Name",   type: "text" },
                { key: "dob",      label: "Date of Birth", type: "date" },
                { key: "gender",   label: "Gender",      type: "text" },
                { key: "email",    label: "Email",        type: "email" },
                { key: "phone",    label: "Phone Number", type: "tel" },
                { key: "address",  label: "Address",      type: "text", full: true },
                { key: "plan",     label: "Membership Plan", type: "text", full: true },
              ].map(({ key, label, type, full }) => (
                <div className={`mp-field ${full ? "mp-field--full" : ""}`} key={key}>
                  <label className="mp-field__label">{label}</label>
                  <input
                    type={type}
                    className="mp-field__input"
                    value={form[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                  />
                </div>
              ))}
            </div>
            <div className="mp-modal__footer">
              <button className="mp-modal__cancel" onClick={onClose}>Cancel</button>
              <button className="mp-modal__confirm" onClick={handleSave}>Save Changes</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────
export default function MemberProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const storedProfile = getMemberProfile();
  const [profile, setProfile] = useState(() => ({
    ...INITIAL_PROFILE,
    ...storedProfile,
    fullName: storedProfile?.fullName || getMemberDisplayName(),
  }));
  const [prefs, setPrefs]     = useState({ marketing: true, push: true, twofa: false });
  const [showPw, setShowPw]   = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [toast, setToast]     = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  const memberName = profile.fullName || getMemberDisplayName();
  const memberInitials = getMemberInitials(memberName);

  const isActive = (r) => location.pathname === r;

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const loadProfile = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/member/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          return;
        }

        const result = await res.json();
        const user = result?.data;
        const detail = user?.memberDetail || {};
        const activePlanName = detail?.activePlan?.name;

        const nextProfile = {
          fullName: user?.name || storedProfile?.fullName || getMemberDisplayName(),
          memberId: user?.id ? `FP-${String(user.id).padStart(5, "0")}` : (storedProfile?.memberId || "--"),
          dob: formatDob(detail?.date_of_birth),
          gender: detail?.gender || "--",
          email: user?.email || "--",
          phone: user?.phone || detail?.phone || "--",
          address: user?.address || detail?.address || "--",
          plan: activePlanName || detail?.selected_plan || "--",
        };

        setProfile((prev) => ({ ...prev, ...nextProfile }));
        setMemberProfile(nextProfile);
      } catch {
        // Keep local fallback profile when API is unreachable.
      }
    };

    loadProfile();
  }, []);

  const handleSaveProfile = async (form) => {
    const token = localStorage.getItem("token");
    const payload = {
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      gender: form.gender,
      dob: form.dob,
      plan: form.plan,
    };

    let mergedProfile;

    try {
      if (token) {
        const res = await fetch(`${API_BASE_URL}/member/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const result = await res.json();
          const user = result?.data;
          const detail = user?.memberDetail || {};
          const activePlanName = detail?.activePlan?.name;

          mergedProfile = {
            fullName: user?.name || payload.fullName || profile.fullName,
            memberId: user?.id ? `FP-${String(user.id).padStart(5, "0")}` : profile.memberId,
            dob: formatDob(detail?.date_of_birth || payload.dob),
            gender: detail?.gender || payload.gender || profile.gender,
            email: user?.email || payload.email || profile.email,
            phone: user?.phone || detail?.phone || payload.phone || profile.phone,
            address: user?.address || detail?.address || payload.address || profile.address,
            plan: activePlanName || detail?.selected_plan || payload.plan || profile.plan,
          };
        }
      }
    } catch {
      // If API save fails, still keep local changes so UI reflects edits.
    }

    if (!mergedProfile) {
      mergedProfile = {
        ...profile,
        ...payload,
        dob: form.dob ? formatDob(form.dob) : profile.dob,
      };
    }

    setProfile((prev) => ({ ...prev, ...mergedProfile }));
    setMemberProfile(mergedProfile);
    setMemberDisplayName(mergedProfile.fullName);
    showToast("✓ Profile updated successfully!");
  };

  const handlePrefChange = (key, val) => {
    setPrefs((p) => ({ ...p, [key]: val }));
    showToast(`✓ ${key === "marketing" ? "Marketing Emails" : key === "push" ? "Push Notifications" : "Two-Factor Auth"} ${val ? "enabled" : "disabled"}`);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAvatarUrl(ev.target.result);
      showToast("✓ Profile photo updated!");
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mp-root">

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className="mp-sidebar">
        <div className="mp-sidebar__brand">
          <div className="mp-sidebar__brand-icon"><IconDumbbellBrand /></div>
          <div className="mp-sidebar__brand-name">FitTrack</div>
        </div>
        <div className="mp-sidebar__label">Navigation</div>
        <ul className="mp-sidebar__menu">
          {navItems.map((item) => (
            <li key={item.route} className={isActive(item.route) ? "active" : ""} onClick={() => navigate(item.route)}>
              <span className="mp-sidebar__icon">{navIcons[item.icon]}</span>
              {item.label}
              {isActive(item.route) && <span className="mp-sidebar__dot" />}
            </li>
          ))}
        </ul>
        <div className="mp-sidebar__bottom">
          <ul className="mp-sidebar__menu">
            <li onClick={() => navigate("/login")}>
              <span className="mp-sidebar__icon"><IconLogout /></span>
              Logout
            </li>
          </ul>
        </div>
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <main className="mp-main">

        {/* TOPBAR */}
        <header className="mp-topbar">
          <div className="mp-topbar__title">My Profile</div>
          <div className="mp-topbar__right">
            <button className="mp-notif" onClick={() => showToast("No new notifications right now.")}>
              <IconBell />
              <span className="mp-notif__dot" />
            </button>
            <div className="mp-profile-top">
              <div className="mp-profile-top__avatar">{memberInitials}</div>
              <span className="mp-profile-top__name">{memberName}</span>
              <div className="mp-profile-top__globe">🌐</div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="mp-content">

          {/* ── STAT STRIP ── */}
          <div className="mp-stat-strip">
            <div className="mp-stat-strip__card">
              <div className="mp-stat-strip__icon mp-stat-strip__icon--brand"><IconTrend /></div>
              <div>
                <div className="mp-stat-strip__label">Training Streak</div>
                <div className="mp-stat-strip__value">{profile.streak} Days</div>
                <div className="mp-stat-strip__note">+2 from last week</div>
              </div>
            </div>
            <div className="mp-stat-strip__card">
              <div className="mp-stat-strip__icon mp-stat-strip__icon--amber"><IconAward /></div>
              <div>
                <div className="mp-stat-strip__label">Loyalty Points</div>
                <div className="mp-stat-strip__value">{profile.points.toLocaleString()}</div>
                <div className="mp-stat-strip__note">Gold Member</div>
              </div>
            </div>
            <div className="mp-stat-strip__card">
              <div className="mp-stat-strip__icon mp-stat-strip__icon--green"><IconCalendar /></div>
              <div>
                <div className="mp-stat-strip__label">Active Since</div>
                <div className="mp-stat-strip__value">{profile.since}</div>
                <div className="mp-stat-strip__note">{profile.anniversary}</div>
              </div>
            </div>
          </div>

          {/* ── MAIN GRID ── */}
          <div className="mp-grid">

            {/* ── LEFT: Avatar card ── */}
            <div className="mp-avatar-card">
              <div className="mp-avatar-wrap">
                <div className="mp-avatar">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" className="mp-avatar__img" />
                  ) : (
                    <img
                      src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=300&q=80"
                      alt="gym"
                      className="mp-avatar__img"
                    />
                  )}
                </div>
                <label className="mp-avatar__edit" title="Change photo">
                  <IconCamera />
                  <input type="file" accept="image/*" hidden onChange={handleAvatarChange} />
                </label>
              </div>

              <div className="mp-avatar-card__name">{profile.fullName}</div>
              <div className="mp-avatar-card__id">{profile.memberId}</div>

              <div className="mp-avatar-card__badges">
                <span className="mp-badge mp-badge--active">{profile.status}</span>
                <span className="mp-badge mp-badge--tier">{profile.tier}</span>
              </div>

              <div className="mp-plan-progress">
                <div className="mp-plan-progress__header">
                  <span>Plan Progress</span>
                  <span className="mp-plan-progress__pct">{profile.progress}%</span>
                </div>
                <div className="mp-plan-progress__bar">
                  <div className="mp-plan-progress__fill" style={{ width: `${profile.progress}%` }} />
                </div>
                <div className="mp-plan-progress__note">
                  Renewal due in {profile.renewal} days. You've attended {profile.sessions} sessions this month.
                </div>
              </div>
            </div>

            {/* ── RIGHT: Account info ── */}
            <div className="mp-account-card">
              <div className="mp-account-card__header">
                <div>
                  <div className="mp-account-card__title">Account Information</div>
                  <div className="mp-account-card__sub">Manage your personal details and account settings.</div>
                </div>
                <div className="mp-account-card__actions">
                  <button className="mp-btn mp-btn--ghost" onClick={() => setShowPw(true)}>
                    <IconLock /> Change Password
                  </button>
                  <button className="mp-btn mp-btn--brand" onClick={() => setShowEdit(true)}>
                    <IconEdit /> Edit Profile
                  </button>
                </div>
              </div>

              {/* Two columns */}
              <div className="mp-info-cols">

                {/* Personal Details */}
                <div className="mp-info-col">
                  <div className="mp-info-col__heading">
                    <IconUser /> Personal Details
                  </div>
                  <div className="mp-info-fields">
                    <div className="mp-info-field">
                      <div className="mp-info-field__label"><IconUser /> Full Name</div>
                      <div className="mp-info-field__value">{profile.fullName}</div>
                    </div>
                    <div className="mp-info-field">
                      <div className="mp-info-field__label"><IconCalendar /> Date of Birth</div>
                      <div className="mp-info-field__value">{profile.dob}</div>
                    </div>
                    <div className="mp-info-field">
                      <div className="mp-info-field__label"><IconGender /> Gender</div>
                      <div className="mp-info-field__value">{profile.gender}</div>
                    </div>
                  </div>
                </div>

                {/* Contact & Security */}
                <div className="mp-info-col">
                  <div className="mp-info-col__heading">
                    <IconMail /> Contact &amp; Security
                  </div>
                  <div className="mp-info-fields">
                    <div className="mp-info-field">
                      <div className="mp-info-field__label"><IconMail /> Email Address</div>
                      <div className="mp-info-field__value">{profile.email}</div>
                    </div>
                    <div className="mp-info-field">
                      <div className="mp-info-field__label"><IconPhone /> Phone Number</div>
                      <div className="mp-info-field__value">{profile.phone}</div>
                    </div>
                    <div className="mp-info-field mp-info-field--tall">
                      <div className="mp-info-field__label"><IconMapPin /> Residential Address</div>
                      <div className="mp-info-field__value">{profile.address}</div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Active Plan Banner */}
              <div className="mp-plan-banner">
                <div className="mp-plan-banner__icon"><IconShield /></div>
                <div className="mp-plan-banner__text">
                  <div className="mp-plan-banner__label">ACTIVE PLAN</div>
                  <div className="mp-plan-banner__name">{profile.plan}</div>
                </div>
                <button
                  className="mp-plan-banner__btn"
                  onClick={() => navigate("/member/membership")}
                >
                  View Plan Details <IconArrow />
                </button>
              </div>

            </div>
          </div>

          {/* ── BOTTOM ROW ── */}
          <div className="mp-bottom-row">

            {/* Recent Activity */}
            <div className="mp-activity-card">
              <div className="mp-activity-card__header">
                <div>
                  <div className="mp-activity-card__title">Recent Activity</div>
                  <div className="mp-activity-card__sub">Your last 3 gym visits</div>
                </div>
              </div>
              <div className="mp-activity-list">
                {RECENT_ACTIVITY.map((a, i) => (
                  <div key={i} className="mp-activity-item">
                    <span className="mp-activity-dot" style={{ background: a.color }} />
                    <div className="mp-activity-item__info">
                      <div className="mp-activity-item__label">{a.label}</div>
                      <div className="mp-activity-item__date">{a.date}</div>
                    </div>
                    <span className="mp-activity-item__dur">{a.duration}</span>
                  </div>
                ))}
              </div>
              <button className="mp-activity-card__link" onClick={() => navigate("/member/attendance")}>
                View Attendance History
              </button>
            </div>

            {/* Preferences */}
            <div className="mp-prefs-card">
              <div className="mp-prefs-card__header">
                <div className="mp-prefs-card__title">Preferences</div>
                <div className="mp-prefs-card__sub">Customize your panel experience</div>
              </div>
              <div className="mp-prefs-list">
                {[
                  { key: "marketing", label: "Marketing Emails",    desc: "Receive gym updates and offers" },
                  { key: "push",      label: "Push Notifications",   desc: "App alerts for class bookings" },
                  { key: "twofa",     label: "Two-Factor Auth",      desc: "Enhanced account security" },
                ].map(({ key, label, desc }) => (
                  <div key={key} className="mp-pref-item">
                    <div className="mp-pref-item__text">
                      <div className="mp-pref-item__label">{label}</div>
                      <div className="mp-pref-item__desc">{desc}</div>
                    </div>
                    <Toggle on={prefs[key]} onChange={(val) => handlePrefChange(key, val)} />
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

        <footer className="mp-footer">
          <span>© 2026 FitPanel Gym Automation. All rights reserved.</span>
        </footer>
      </main>

      {/* MODALS */}
      {showPw   && <PasswordModal onClose={() => setShowPw(false)} />}
      {showEdit && <EditProfileModal profile={profile} onClose={() => setShowEdit(false)} onSave={handleSaveProfile} />}

      {/* TOAST */}
      {toast && <div className="mp-toast">{toast}</div>}
    </div>
  );
}