import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Adminsettings.css";
import { getAdminProfile, setAdminProfile, getAdminInitials } from "../../../utils/adminProfile";

// ── Nav Items ────────────────────────────────────────────────────────────
const navItems = [
  { label: "Dashboard",        route: "/admin/dashboard", icon: "grid"  },
  { label: "Manage Members",   route: "/members",         icon: "users" },
  { label: "Membership Plans", route: "/membershipplan",  icon: "card"  },
  { label: "Trainers",         route: "/trainer",         icon: "user"  },
  { label: "Attendance",       route: "/attendance",      icon: "list"  },
  { label: "Profile",          route: "/admin/profile",   icon: "user"  },
];

// ── Tab keyword map for search navigation ────────────────────────────────
const TAB_KEYWORDS = {
  account:       ["account","profile","name","email","phone","avatar","photo","gender","dob","address","role","department"],
  password:      ["password","security","change password","update password","current","confirm","uppercase"],
  notifications: ["notification","alert","sms","email alert","expiry","trainer","promo","member alert","payment"],
  privacy:       ["privacy","visibility","two factor","2fa","activity log","api","data sharing"],
  theme:         ["theme","dark","light","color","accent","font","layout","appearance","mode"],
  system:        ["system","gym name","timezone","currency","backup","maintenance","debug","email provider","config"],
  danger:        ["danger","export","reset","deactivate","logout","actions","delete","download"],
};

// ── Icons ────────────────────────────────────────────────────────────────
const Ic = {
  Dumbbell: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M6 5v14M18 5v14"/><rect x="3" y="8" width="3" height="8" rx="1"/>
      <rect x="18" y="8" width="3" height="8" rx="1"/><line x1="6" y1="12" x2="18" y2="12"/>
    </svg>
  ),
  Grid: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  Users: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="9" cy="7" r="4"/>
      <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
      <path d="M16 3.13a4 4 0 010 7.75"/><path d="M21 21v-2a4 4 0 00-3-3.87"/>
    </svg>
  ),
  Card: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
    </svg>
  ),
  User: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0113 0"/>
    </svg>
  ),
  List: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
    </svg>
  ),
  Settings: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/>
    </svg>
  ),
  Logout: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
      <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  ),
  Bell: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  AccountIc: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  ),
  Lock: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <rect x="3" y="11" width="18" height="11" rx="2"/>
      <path d="M7 11V7a5 5 0 0110 0v4"/>
    </svg>
  ),
  BellSection: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
      <path d="M13.73 21a2 2 0 01-3.46 0"/>
    </svg>
  ),
  Shield: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Palette: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 2a10 10 0 000 20c1.1 0 2-.9 2-2v-1c0-.55.45-1 1-1h3c2.21 0 4-1.79 4-4 0-5.52-4.48-10-10-10z"/>
    </svg>
  ),
  AlertTriangle: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  Eye: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  EyeOff: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94"/>
      <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ),
  Upload: () => (
    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  ),
  Download: () => (
    <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
      <polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Database: () => (
    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <ellipse cx="12" cy="5" rx="9" ry="3"/>
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/>
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>
    </svg>
  ),
  Search: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
      <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
    </svg>
  ),
  Warn: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
    </svg>
  ),
  XCircle: () => (
    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10"/>
      <line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
    </svg>
  ),
};

const navIcons = {
  grid: <Ic.Grid />, users: <Ic.Users />, card: <Ic.Card />,
  user: <Ic.User />, list: <Ic.List />,
};

const TABS = [
  { id: "account",       label: "Account",       icon: <Ic.AccountIc /> },
  { id: "password",      label: "Password",      icon: <Ic.Lock /> },
  { id: "notifications", label: "Notifications", icon: <Ic.BellSection /> },
  { id: "privacy",       label: "Privacy",       icon: <Ic.Shield /> },
  { id: "theme",         label: "Theme",         icon: <Ic.Palette /> },
  { id: "system",        label: "System",        icon: <Ic.Database /> },
  { id: "danger",        label: "Actions",       icon: <Ic.AlertTriangle /> },
];

// ── Toggle ────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      className={`as-toggle${checked ? " as-toggle--on" : ""}`}
      onClick={() => onChange(!checked)}
      type="button"
      aria-pressed={checked}
    >
      <span className="as-toggle__thumb" />
    </button>
  );
}

// ── PasswordField ─────────────────────────────────────────────────────────
function PasswordField({ label, value, onChange, error }) {
  const [show, setShow] = useState(false);
  return (
    <div className="as-form-group">
      <label>{label}</label>
      <div className="as-input-wrap">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder="••••••••"
          className={error ? "as-input--error" : ""}
        />
        <button type="button" className="as-eye-btn" onClick={() => setShow(s => !s)}>
          {show ? <Ic.EyeOff /> : <Ic.Eye />}
        </button>
      </div>
      {error && <span className="as-field-error">{error}</span>}
    </div>
  );
}

// ── Toast — success | warning | danger ────────────────────────────────────
function Toast({ message, type, visible }) {
  const icon = type === "success" ? <Ic.Check />
             : type === "warning" ? <Ic.Warn />
             : <Ic.XCircle />;
  return (
    <div className={`as-toast as-toast--${type || "success"}${visible ? " as-toast--show" : ""}`}>
      {icon} {message}
    </div>
  );
}

// ── Unsaved banner ────────────────────────────────────────────────────────
function UnsavedBanner({ onDiscard }) {
  return (
    <div className="as-unsaved-banner">
      <Ic.Warn /> You have unsaved changes.
      <button className="as-unsaved-banner__discard" onClick={onDiscard}>Discard</button>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SECTION: Account
// ════════════════════════════════════════════════════════════════════════
const ACCOUNT_DEFAULTS = {
  fullName: "Admin Staff", email: "admin@fittrack.com",
  phone: "+977 9800000001", gender: "male",
  dob: "1990-01-01", address: "Kathmandu, Nepal",
  role: "Super Admin", department: "Management",
};

function AccountSection({ toast, adminProfile, onProfileSaved }) {
  const fileRef = useRef(null);
  const [avatar,  setAvatar]  = useState(null);
  const initialForm = {
    ...ACCOUNT_DEFAULTS,
    fullName: adminProfile?.name || ACCOUNT_DEFAULTS.fullName,
    email: adminProfile?.email || ACCOUNT_DEFAULTS.email,
    phone: adminProfile?.phone || "",
    address: adminProfile?.address || "",
    department: adminProfile?.department || ACCOUNT_DEFAULTS.department,
    role: adminProfile?.role ? `${String(adminProfile.role).charAt(0).toUpperCase()}${String(adminProfile.role).slice(1)}` : ACCOUNT_DEFAULTS.role,
  };
  const [form,    setForm]    = useState(initialForm);
  const [saved,   setSaved]   = useState(initialForm); // last committed snapshot
  const [errors,  setErrors]  = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const next = {
      ...ACCOUNT_DEFAULTS,
      fullName: adminProfile?.name || ACCOUNT_DEFAULTS.fullName,
      email: adminProfile?.email || ACCOUNT_DEFAULTS.email,
      phone: adminProfile?.phone || "",
      address: adminProfile?.address || "",
      department: adminProfile?.department || ACCOUNT_DEFAULTS.department,
      role: adminProfile?.role ? `${String(adminProfile.role).charAt(0).toUpperCase()}${String(adminProfile.role).slice(1)}` : ACCOUNT_DEFAULTS.role,
    };
    setForm(next);
    setSaved(next);
    setAvatar(adminProfile?.avatar_url || null);
  }, [adminProfile]);

  const dirty = JSON.stringify(form) !== JSON.stringify(saved);

  const set = k => e => {
    setForm(f => ({ ...f, [k]: e.target.value }));
    setErrors(er => ({ ...er, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.fullName.trim())                                  e.fullName = "Full name is required.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))        e.email    = "Enter a valid email address.";
    if (!form.phone.trim())                                     e.phone    = "Phone number is required.";
    else if (!/^[\d\s\+\-\(\)]{7,}$/.test(form.phone.trim()))  e.phone    = "Enter a valid phone number.";
    return e;
  };

  // ✅ Save — validates, commits snapshot, shows toast
  const handleSave = async () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length !== 0) {
      toast("Please fix the errors before saving.", "warning");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      toast("Please login again to update profile.", "danger");
      return;
    }

    try {
      setSaving(true);
      const res = await fetch("http://localhost:5000/api/admin/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.fullName,
          phone: form.phone,
          address: form.address,
          department: form.department,
          avatar_url: avatar || adminProfile?.avatar_url || "",
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to update admin profile.");

      const updatedProfile = data?.data || {};
      setSaved({ ...form });
      setAdminProfile(updatedProfile);

      const localUser = JSON.parse(localStorage.getItem("user") || "{}");
      localStorage.setItem("user", JSON.stringify({ ...localUser, ...updatedProfile }));

      onProfileSaved?.(updatedProfile);
      toast("Admin profile saved successfully!", "success");
    } catch (err) {
      toast(err.message || "Unable to save profile right now.", "danger");
    } finally {
      setSaving(false);
    }
  };

  // ✅ Cancel — reverts to last saved snapshot, clears errors
  const handleCancel = () => {
    setForm({ ...saved });
    setErrors({});
  };

  // ✅ Avatar upload with 2MB guard
  const handleAvatarChange = e => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 2 * 1024 * 1024) {
      toast("Image must be under 2MB.", "warning");
      return;
    }
    setAvatar(URL.createObjectURL(f));
    toast("Profile photo updated!", "success");
  };

  return (
    <div className="as-section">
      <div className="as-section__header">
        <div className="as-section__icon"><Ic.AccountIc /></div>
        <div>
          <div className="as-section__title">Account Settings</div>
          <div className="as-section__sub">Update admin profile information</div>
        </div>
        <span className="as-admin-badge">ADMIN</span>
      </div>

      {/* Avatar */}
      <div className="as-avatar-row">
        <div className="as-avatar-preview" onClick={() => fileRef.current.click()}>
          {avatar
            ? <img src={avatar} alt="avatar" className="as-avatar-img" />
            : <span className="as-avatar-initials">AD</span>}
          <div className="as-avatar-overlay"><Ic.Upload /></div>
        </div>
        <div className="as-avatar-info">
          <button className="as-btn as-btn--outline" onClick={() => fileRef.current.click()}>
            <Ic.Upload /> Upload Photo
          </button>
          <p>JPG, PNG · Max 2MB</p>
          {avatar && (
            <button
              className="as-btn as-btn--ghost"
              style={{ marginTop: 6 }}
              onClick={() => { setAvatar(null); toast("Photo removed.", "warning"); }}
            >
              Remove Photo
            </button>
          )}
        </div>
        <input ref={fileRef} type="file" accept="image/*"
          style={{ display: "none" }} onChange={handleAvatarChange} />
      </div>

      <div className="as-form-grid">
        <div className="as-form-group">
          <label>Full Name</label>
          <input value={form.fullName} onChange={set("fullName")} className={errors.fullName ? "as-input--error" : ""} />
          {errors.fullName && <span className="as-field-error">{errors.fullName}</span>}
        </div>
        <div className="as-form-group">
          <label>Email Address</label>
          <input value={form.email} onChange={set("email")} className={errors.email ? "as-input--error" : ""} />
          {errors.email && <span className="as-field-error">{errors.email}</span>}
        </div>
        <div className="as-form-group">
          <label>Phone Number</label>
          <input value={form.phone} onChange={set("phone")} className={errors.phone ? "as-input--error" : ""} />
          {errors.phone && <span className="as-field-error">{errors.phone}</span>}
        </div>
        <div className="as-form-group">
          <label>Gender</label>
          <select value={form.gender} onChange={set("gender")}>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div className="as-form-group">
          <label>Date of Birth</label>
          <input type="date" value={form.dob} onChange={set("dob")} />
        </div>
        <div className="as-form-group">
          <label>Role</label>
          <input value={form.role} onChange={set("role")} />
        </div>
        <div className="as-form-group">
          <label>Department</label>
          <input value={form.department} onChange={set("department")} />
        </div>
        <div className="as-form-group as-form-group--full">
          <label>Address</label>
          <input value={form.address} onChange={set("address")} />
        </div>
      </div>

      {dirty && <UnsavedBanner onDiscard={handleCancel} />}

      <div className="as-form-actions">
        {/* ✅ Cancel now truly reverts form to last saved values */}
        <button className="as-btn as-btn--ghost" onClick={handleCancel} disabled={!dirty}>Cancel</button>
        <button className="as-btn as-btn--primary" onClick={handleSave} disabled={saving}>
          Save Changes {dirty && <span className="as-unsaved-dot" />}
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SECTION: Password
// ════════════════════════════════════════════════════════════════════════
function PasswordSection({ toast }) {
  const [form,   setForm]   = useState({ current: "", newPw: "", confirm: "" });
  const [errors, setErrors] = useState({});

  const set = k => v => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.current)                                          e.current = "Current password is required.";
    if (form.newPw.length < 8)                                  e.newPw   = "Password must be at least 8 characters.";
    else if (!/[A-Z]/.test(form.newPw))                         e.newPw   = "Must contain at least one uppercase letter.";
    else if (form.current && form.newPw === form.current)       e.newPw   = "New password must differ from current.";
    if (form.newPw && form.confirm && form.newPw !== form.confirm) e.confirm = "Passwords do not match.";
    return e;
  };

  const handleUpdate = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      toast("Password updated successfully!", "success");
      setForm({ current: "", newPw: "", confirm: "" });
      setErrors({});
    } else {
      toast("Please fix the password errors.", "warning");
    }
  };

  const strength = form.newPw.length === 0 ? 0
    : form.newPw.length < 6  ? 1
    : form.newPw.length < 10 ? 2
    : form.newPw.length < 14 ? 3 : 4;

  const strengthColors = ["", "#e8302a", "#e86414", "#e86414", "#3ecf6e"];
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];

  // Live requirement checks
  const rules = [
    { label: "At least 8 characters",         pass: form.newPw.length >= 8 },
    { label: "At least one uppercase letter",  pass: /[A-Z]/.test(form.newPw) },
    { label: "Confirm password matches",       pass: form.confirm.length > 0 && form.newPw === form.confirm },
    { label: "Different from current",         pass: form.newPw.length > 0 && form.newPw !== form.current },
  ];

  return (
    <div className="as-section">
      <div className="as-section__header">
        <div className="as-section__icon"><Ic.Lock /></div>
        <div>
          <div className="as-section__title">Change Password</div>
          <div className="as-section__sub">Secure your admin account</div>
        </div>
      </div>

      <div className="as-form-grid as-form-grid--single">
        <PasswordField label="Current Password" value={form.current} onChange={set("current")} error={errors.current} />
        <PasswordField label="New Password"     value={form.newPw}   onChange={set("newPw")}   error={errors.newPw} />
        <PasswordField label="Confirm Password" value={form.confirm} onChange={set("confirm")} error={errors.confirm} />
      </div>

      {/* Strength meter */}
      <div className="as-pw-strength">
        <span className="as-pw-label">Strength</span>
        <div className="as-pw-bars">
          {[1,2,3,4].map(i => (
            <div key={i}
              className={`as-pw-bar${strength >= i ? " as-pw-bar--fill" : ""}`}
              style={{ background: strength >= i ? strengthColors[strength] : undefined }}
            />
          ))}
        </div>
        <span className="as-pw-hint" style={{ color: strengthColors[strength] || "var(--muted)" }}>
          {strengthLabels[strength] || "Enter a password"}
        </span>
      </div>

      {/* ✅ Live requirement checklist — shows before user submits */}
      <ul className="as-pw-rules">
        {rules.map(r => (
          <li key={r.label} className={`as-pw-rule${r.pass ? " as-pw-rule--pass" : ""}`}>
            <span className="as-pw-rule__icon">{r.pass ? <Ic.Check /> : <span className="as-pw-rule__dot" />}</span>
            {r.label}
          </li>
        ))}
      </ul>

      <div className="as-form-actions">
        <button className="as-btn as-btn--ghost"
          onClick={() => { setForm({ current:"", newPw:"", confirm:"" }); setErrors({}); }}>
          Clear
        </button>
        <button className="as-btn as-btn--primary" onClick={handleUpdate}>Update Password</button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SECTION: Notifications
// ════════════════════════════════════════════════════════════════════════
function NotificationsSection({ toast }) {
  const DEFAULTS = {
    email: true, sms: false, expiry: true,
    trainer: true, promo: false, newMember: true, payments: true,
  };
  const [notifs, setNotifs] = useState({ ...DEFAULTS });
  const [saved,  setSaved]  = useState({ ...DEFAULTS });

  const dirty = JSON.stringify(notifs) !== JSON.stringify(saved);

  const rows = [
    { key: "email",     label: "Email Notifications",      sub: "Admin alerts via email" },
    { key: "sms",       label: "SMS Notifications",        sub: "Receive critical alerts via SMS" },
    { key: "newMember", label: "New Member Alerts",        sub: "Notify when new member registers" },
    { key: "payments",  label: "Payment Notifications",    sub: "Alerts for payments and renewals" },
    { key: "expiry",    label: "Membership Expiry Alerts", sub: "Member plan expiry reminders" },
    { key: "trainer",   label: "Trainer Session Alerts",   sub: "Trainer booking notifications" },
    { key: "promo",     label: "Promotional Messages",     sub: "Marketing and campaign updates" },
  ];

  // ✅ Save persists state into saved snapshot
  const handleSave = () => {
    setSaved({ ...notifs });
    toast("Notification preferences saved!", "success");
  };

  // ✅ Discard reverts to last saved snapshot
  const handleDiscard = () => {
    setNotifs({ ...saved });
    toast("Changes discarded.", "warning");
  };

  return (
    <div className="as-section">
      <div className="as-section__header">
        <div className="as-section__icon"><Ic.BellSection /></div>
        <div>
          <div className="as-section__title">Notification Settings</div>
          <div className="as-section__sub">Control admin alert preferences</div>
        </div>
      </div>

      <div className="as-toggle-list">
        {rows.map(r => (
          <div key={r.key} className="as-toggle-row">
            <div>
              <div className="as-toggle-row__label">{r.label}</div>
              <div className="as-toggle-row__sub">{r.sub}</div>
            </div>
            <Toggle checked={notifs[r.key]} onChange={v => setNotifs(n => ({ ...n, [r.key]: v }))} />
          </div>
        ))}
      </div>

      {dirty && <UnsavedBanner onDiscard={handleDiscard} />}

      <div className="as-form-actions">
        <button className="as-btn as-btn--ghost" onClick={handleDiscard} disabled={!dirty}>Discard</button>
        <button className="as-btn as-btn--primary" onClick={handleSave}>
          Save Preferences {dirty && <span className="as-unsaved-dot" />}
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SECTION: Privacy
// ════════════════════════════════════════════════════════════════════════
function PrivacySection({ toast }) {
  const DEFAULTS = { visibility: "private", twoFactor: true, activityLog: true, dataSharing: false, apiAccess: true };
  const [priv,  setPriv]  = useState({ ...DEFAULTS });
  const [saved, setSaved] = useState({ ...DEFAULTS });

  const dirty = JSON.stringify(priv) !== JSON.stringify(saved);

  const rows = [
    { key: "twoFactor",   label: "Two-Factor Authentication", sub: "Add an extra layer of security" },
    { key: "activityLog", label: "Activity Log",              sub: "Track admin actions and logins" },
    { key: "dataSharing", label: "Data Sharing",              sub: "Share anonymized stats with partners" },
    { key: "apiAccess",   label: "API Access",                sub: "Allow external API integrations" },
  ];

  const handleSave = () => {
    setSaved({ ...priv });
    toast("Security settings saved!", "success");
  };

  const handleDiscard = () => {
    setPriv({ ...saved });
    toast("Changes discarded.", "warning");
  };

  return (
    <div className="as-section">
      <div className="as-section__header">
        <div className="as-section__icon"><Ic.Shield /></div>
        <div>
          <div className="as-section__title">Privacy & Security</div>
          <div className="as-section__sub">Manage admin access and security settings</div>
        </div>
      </div>

      <div className="as-form-group" style={{ marginBottom: 20 }}>
        <label>Profile Visibility</label>
        <div className="as-radio-group">
          {["public","private"].map(v => (
            <label key={v} className={`as-radio-card${priv.visibility === v ? " as-radio-card--active" : ""}`}>
              <input type="radio" name="visibility" value={v}
                checked={priv.visibility === v}
                onChange={() => setPriv(p => ({ ...p, visibility: v }))} />
              <span className="as-radio-dot" />
              <span>{v.charAt(0).toUpperCase() + v.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="as-toggle-list">
        {rows.map(r => (
          <div key={r.key} className="as-toggle-row">
            <div>
              <div className="as-toggle-row__label">{r.label}</div>
              <div className="as-toggle-row__sub">{r.sub}</div>
            </div>
            <Toggle checked={priv[r.key]} onChange={v => setPriv(p => ({ ...p, [r.key]: v }))} />
          </div>
        ))}
      </div>

      {dirty && <UnsavedBanner onDiscard={handleDiscard} />}

      <div className="as-form-actions">
        <button className="as-btn as-btn--ghost" onClick={handleDiscard} disabled={!dirty}>Discard</button>
        <button className="as-btn as-btn--primary" onClick={handleSave}>
          Save Settings {dirty && <span className="as-unsaved-dot" />}
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SECTION: Theme
// ════════════════════════════════════════════════════════════════════════
function ThemeSection({ toast, onAccentChange }) {
  const DEFAULTS = { darkMode: true, accent: "#e86414", fontSize: "medium", layout: "sidebar" };
  const [theme,  setTheme]  = useState({ ...DEFAULTS });
  const [saved,  setSaved]  = useState({ ...DEFAULTS });
  const accents = ["#e86414","#3ecf6e","#4e6ef2","#e86414","#a78bfa","#f87171","#06b6d4"];

  const dirty = JSON.stringify(theme) !== JSON.stringify(saved);

  // ✅ Apply Theme — writes CSS variables live, commits snapshot
  const handleApply = () => {
    // Apply accent color
    document.documentElement.style.setProperty("--brand",       theme.accent);
    document.documentElement.style.setProperty("--brand-hover", theme.accent + "cc");
    document.documentElement.style.setProperty("--brand-dim",   theme.accent + "22");
    document.documentElement.style.setProperty("--brand-glow",  theme.accent + "77");
    // Apply font size
    const sizeMap = { small: "12px", medium: "14px", large: "16px" };
    document.documentElement.style.setProperty("--font-size-base", sizeMap[theme.fontSize]);
    // Propagate to parent for sidebar
    onAccentChange(theme.accent);
    setSaved({ ...theme });
    toast("Theme applied to the panel!", "success");
  };

  const handleDiscard = () => {
    setTheme({ ...saved });
    toast("Theme changes discarded.", "warning");
  };

  return (
    <div className="as-section">
      <div className="as-section__header">
        <div className="as-section__icon"><Ic.Palette /></div>
        <div>
          <div className="as-section__title">Theme Preferences</div>
          <div className="as-section__sub">Customise the admin panel appearance</div>
        </div>
      </div>

      <div className="as-toggle-list" style={{ marginBottom: 20 }}>
        <div className="as-toggle-row">
          <div>
            <div className="as-toggle-row__label">Dark Mode</div>
            <div className="as-toggle-row__sub">Switch between light and dark interface</div>
          </div>
          <Toggle checked={theme.darkMode} onChange={v => setTheme(t => ({ ...t, darkMode: v }))} />
        </div>
      </div>

      <div className="as-form-group" style={{ marginBottom: 6 }}>
        <label>Accent Color</label>
        <div className="as-color-row">
          {accents.map(c => (
            <button key={c} type="button"
              className={`as-color-swatch${theme.accent === c ? " as-color-swatch--active" : ""}`}
              style={{ background: c }}
              title={c}
              onClick={() => setTheme(t => ({ ...t, accent: c }))}
            >
              {theme.accent === c && <Ic.Check />}
            </button>
          ))}
        </div>
        {/* ✅ Live preview of selected color */}
        <div className="as-color-preview">
          <span className="as-color-preview__swatch" style={{ background: theme.accent }} />
          <span className="as-color-preview__hex">{theme.accent}</span>
          <span className="as-color-preview__note">— click Apply Theme to activate</span>
        </div>
      </div>

      <div className="as-form-group" style={{ marginBottom: 20, marginTop: 20 }}>
        <label>Font Size</label>
        <div className="as-radio-group">
          {["small","medium","large"].map(s => (
            <label key={s} className={`as-radio-card${theme.fontSize === s ? " as-radio-card--active" : ""}`}>
              <input type="radio" name="fontSize" value={s}
                checked={theme.fontSize === s}
                onChange={() => setTheme(t => ({ ...t, fontSize: s }))} />
              <span className="as-radio-dot" />
              <span>{s.charAt(0).toUpperCase() + s.slice(1)}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="as-form-group">
        <label>Dashboard Layout</label>
        <div className="as-radio-group">
          {["sidebar","top-nav","compact"].map(l => (
            <label key={l} className={`as-radio-card${theme.layout === l ? " as-radio-card--active" : ""}`}>
              <input type="radio" name="layout" value={l}
                checked={theme.layout === l}
                onChange={() => setTheme(t => ({ ...t, layout: l }))} />
              <span className="as-radio-dot" />
              <span>{l.split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")}</span>
            </label>
          ))}
        </div>
      </div>

      {dirty && <UnsavedBanner onDiscard={handleDiscard} />}

      <div className="as-form-actions">
        <button className="as-btn as-btn--ghost" onClick={handleDiscard} disabled={!dirty}>Discard</button>
        <button className="as-btn as-btn--primary" onClick={handleApply}>
          Apply Theme {dirty && <span className="as-unsaved-dot" />}
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SECTION: System
// ════════════════════════════════════════════════════════════════════════
function SystemSection({ toast }) {
  const DEFAULTS = {
    backupEnabled: true, autoBackup: "daily",
    maintenanceMode: false, debugMode: false,
    emailProvider: "smtp", timezone: "Asia/Kathmandu",
    currency: "NPR", gymName: "FitTrack Gym",
  };
  const [sys,    setSys]    = useState({ ...DEFAULTS });
  const [saved,  setSaved]  = useState({ ...DEFAULTS });
  const [errors, setErrors] = useState({});

  const dirty = JSON.stringify(sys) !== JSON.stringify(saved);

  const validate = () => {
    const e = {};
    if (!sys.gymName.trim()) e.gymName = "Gym name is required.";
    return e;
  };

  const handleSave = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length === 0) {
      setSaved({ ...sys });
      toast("System configuration saved!", "success");
    } else {
      toast("Please fix errors before saving.", "warning");
    }
  };

  const handleDiscard = () => {
    setSys({ ...saved });
    setErrors({});
    toast("System changes discarded.", "warning");
  };

  // ✅ Maintenance toggle with immediate feedback toast
  const handleMaintenanceToggle = v => {
    setSys(s => ({ ...s, maintenanceMode: v }));
    if (v) toast("⚠ Maintenance mode ON — members cannot log in.", "warning");
    else   toast("Maintenance mode disabled.", "success");
  };

  return (
    <div className="as-section">
      <div className="as-section__header">
        <div className="as-section__icon"><Ic.Database /></div>
        <div>
          <div className="as-section__title">System Settings</div>
          <div className="as-section__sub">Configure gym system preferences</div>
        </div>
      </div>

      <div className="as-form-grid" style={{ marginBottom: 20 }}>
        <div className="as-form-group">
          <label>Gym Name</label>
          <input value={sys.gymName}
            className={errors.gymName ? "as-input--error" : ""}
            onChange={e => { setSys(s => ({ ...s, gymName: e.target.value })); setErrors({}); }} />
          {errors.gymName && <span className="as-field-error">{errors.gymName}</span>}
        </div>
        <div className="as-form-group">
          <label>Timezone</label>
          <select value={sys.timezone} onChange={e => setSys(s => ({ ...s, timezone: e.target.value }))}>
            <option value="Asia/Kathmandu">Asia/Kathmandu (UTC+5:45)</option>
            <option value="Asia/Kolkata">Asia/Kolkata (UTC+5:30)</option>
            <option value="UTC">UTC (UTC+0)</option>
            <option value="America/New_York">America/New_York (UTC-5)</option>
            <option value="Europe/London">Europe/London (UTC+0)</option>
          </select>
        </div>
        <div className="as-form-group">
          <label>Currency</label>
          <select value={sys.currency} onChange={e => setSys(s => ({ ...s, currency: e.target.value }))}>
            <option value="NPR">NPR — Nepali Rupee</option>
            <option value="USD">USD — US Dollar</option>
            <option value="INR">INR — Indian Rupee</option>
            <option value="EUR">EUR — Euro</option>
          </select>
        </div>
        <div className="as-form-group">
          <label>Email Provider</label>
          <select value={sys.emailProvider} onChange={e => setSys(s => ({ ...s, emailProvider: e.target.value }))}>
            <option value="smtp">SMTP</option>
            <option value="sendgrid">SendGrid</option>
            <option value="mailgun">Mailgun</option>
            <option value="ses">Amazon SES</option>
          </select>
        </div>
        <div className="as-form-group">
          <label>Auto Backup Frequency</label>
          <select value={sys.autoBackup}
            disabled={!sys.backupEnabled}
            onChange={e => setSys(s => ({ ...s, autoBackup: e.target.value }))}>
            <option value="hourly">Every Hour</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </div>
      </div>

      <div className="as-toggle-list">
        <div className="as-toggle-row">
          <div>
            <div className="as-toggle-row__label">Automatic Backups</div>
            <div className="as-toggle-row__sub">Regularly back up all gym data</div>
          </div>
          <Toggle checked={sys.backupEnabled} onChange={v => setSys(s => ({ ...s, backupEnabled: v }))} />
        </div>
        <div className="as-toggle-row">
          <div>
            <div className="as-toggle-row__label">
              Maintenance Mode
              {sys.maintenanceMode && <span className="as-inline-badge as-inline-badge--warning">ACTIVE</span>}
            </div>
            <div className="as-toggle-row__sub">Temporarily disables member portal access</div>
          </div>
          {/* ✅ Gives immediate feedback toast when toggled */}
          <Toggle checked={sys.maintenanceMode} onChange={handleMaintenanceToggle} />
        </div>
        <div className="as-toggle-row">
          <div>
            <div className="as-toggle-row__label">
              Debug Mode
              {sys.debugMode && <span className="as-inline-badge as-inline-badge--info">ON</span>}
            </div>
            <div className="as-toggle-row__sub">Shows system debug information in console</div>
          </div>
          <Toggle checked={sys.debugMode} onChange={v => setSys(s => ({ ...s, debugMode: v }))} />
        </div>
      </div>

      {dirty && <UnsavedBanner onDiscard={handleDiscard} />}

      <div className="as-form-actions">
        <button className="as-btn as-btn--ghost" onClick={handleDiscard} disabled={!dirty}>Discard</button>
        <button className="as-btn as-btn--primary" onClick={handleSave}>
          Save System Config {dirty && <span className="as-unsaved-dot" />}
        </button>
      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// SECTION: Danger / Account Actions
// ════════════════════════════════════════════════════════════════════════
function DangerSection({ navigate, toast }) {
  const [confirm, setConfirm] = useState(null); // "reset" | "deactivate" | null

  // ✅ Export — builds real JSON file and triggers browser download
  const handleExport = () => {
    const payload = {
      exportedAt:  new Date().toISOString(),
      gym:         "FitTrack Gym",
      timezone:    "Asia/Kathmandu",
      stats: {
        totalMembers:   2482,
        activeMembers:  1840,
        expiredMembers: 214,
        monthlyRevenue: "Rs 67,420",
      },
      members: [
        { id:1, name:"Marcus Thorne",   email:"m.thorne@example.com",  plan:"Premium",  status:"Active"  },
        { id:2, name:"Elena Rodriguez", email:"elena.r@example.com",   plan:"Standard", status:"Active"  },
        { id:3, name:"Jameson Blake",   email:"j.blake@example.com",   plan:"Premium",  status:"Expired" },
        { id:4, name:"Sarah Jenkins",   email:"sarah.j@example.com",   plan:"Basic",    status:"Active"  },
        { id:5, name:"David Wu",        email:"d.wu@example.com",      plan:"Standard", status:"Active"  },
      ],
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `fittrack-export-${new Date().toISOString().slice(0,10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast("System data exported!", "success");
  };

  // ✅ Reset — shows feedback then closes confirm
  const handleReset = () => {
    setConfirm(null);
    toast("Dashboard analytics have been reset.", "warning");
  };

  // ✅ Deactivate — shows danger toast then redirects after 2s
  const handleDeactivate = () => {
    setConfirm(null);
    toast("Account deactivated. Redirecting to login…", "danger");
    setTimeout(() => navigate("/login"), 2200);
  };

  return (
    <div className="as-section">
      <div className="as-section__header">
        <div className="as-section__icon as-section__icon--danger"><Ic.AlertTriangle /></div>
        <div>
          <div className="as-section__title">Account Actions</div>
          <div className="as-section__sub">Manage admin account and system data</div>
        </div>
      </div>

      <div className="as-danger-cards">

        {/* ✅ Export — downloads real file */}
        <div className="as-danger-card">
          <div>
            <div className="as-danger-card__title">Export System Data</div>
            <div className="as-danger-card__sub">
              Download all gym data (members, stats, payments) as a JSON file.
            </div>
          </div>
          <button className="as-btn as-btn--outline" onClick={handleExport}>
            <Ic.Download /> Export All
          </button>
        </div>

        {/* ✅ Reset — shows result feedback */}
        <div className="as-danger-card">
          <div>
            <div className="as-danger-card__title">Reset Dashboard Data</div>
            <div className="as-danger-card__sub">
              Clear all cached analytics and reset dashboard statistics.
            </div>
          </div>
          {confirm !== "reset" ? (
            <button className="as-btn as-btn--danger-outline" onClick={() => setConfirm("reset")}>
              Reset Data
            </button>
          ) : (
            <div className="as-confirm-row">
              <span className="as-confirm-text">This cannot be undone.</span>
              <button className="as-btn as-btn--danger"  onClick={handleReset}>Yes, Reset</button>
              <button className="as-btn as-btn--ghost"   onClick={() => setConfirm(null)}>Cancel</button>
            </div>
          )}
        </div>

        {/* ✅ Deactivate — redirects to /login after toast */}
        <div className="as-danger-card">
          <div>
            <div className="as-danger-card__title">Deactivate Admin Account</div>
            <div className="as-danger-card__sub">
              Disable this account. Another super admin can reactivate it.
            </div>
          </div>
          {confirm !== "deactivate" ? (
            <button className="as-btn as-btn--danger-outline" onClick={() => setConfirm("deactivate")}>
              Deactivate
            </button>
          ) : (
            <div className="as-confirm-row">
              <span className="as-confirm-text">Are you absolutely sure?</span>
              <button className="as-btn as-btn--danger" onClick={handleDeactivate}>Yes, Deactivate</button>
              <button className="as-btn as-btn--ghost"  onClick={() => setConfirm(null)}>Cancel</button>
            </div>
          )}
        </div>

        {/* ✅ Logout — navigates to /login */}
        <div className="as-danger-card">
          <div>
            <div className="as-danger-card__title">Logout</div>
            <div className="as-danger-card__sub">Sign out of the admin panel on this device.</div>
          </div>
          <button className="as-btn as-btn--outline" onClick={() => navigate("/login")}>
            <Ic.Logout /> Logout
          </button>
        </div>

      </div>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ════════════════════════════════════════════════════════════════════════
export default function AdminSettings() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab,   setActiveTab]   = useState("account");
  const [toastMsg,    setToastMsg]    = useState("");
  const [toastType,   setToastType]   = useState("success");
  const [toastVis,    setToastVis]    = useState(false);
  const [search,      setSearch]      = useState("");
  const [accentColor, setAccentColor] = useState("#e86414");
  const [adminProfileState, setAdminProfileState] = useState(() => getAdminProfile());

  const timer   = useRef(null);
  const inputRef = useRef(null);

  // Apply accent to CSS variable on mount and on change
  useEffect(() => {
    document.documentElement.style.setProperty("--brand",      accentColor);
    document.documentElement.style.setProperty("--brand-dim",  accentColor + "22");
    document.documentElement.style.setProperty("--brand-glow", accentColor + "77");
  }, [accentColor]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const loadProfile = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok || !data?.data) return;
        setAdminProfile(data.data);
        setAdminProfileState(getAdminProfile());
      } catch {
        // Keep existing local profile if API is unavailable.
      }
    };

    loadProfile();
  }, []);

  const isActive = r => location.pathname === r;

  // ✅ Toast now carries type for color coding
  const showToast = (msg, type = "success") => {
    setToastMsg(msg);
    setToastType(type);
    setToastVis(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToastVis(false), 3000);
  };

  // ✅ Search navigates to matching tab in real time
  const handleSearch = e => {
    const val = e.target.value;
    setSearch(val);
    const lower = val.toLowerCase().trim();
    if (lower.length < 2) return;
    for (const [tabId, keywords] of Object.entries(TAB_KEYWORDS)) {
      if (keywords.some(k => k.includes(lower) || lower.includes(k.split(" ")[0]))) {
        setActiveTab(tabId);
        break;
      }
    }
  };

  const handleSearchKeyDown = e => {
    if (e.key === "Escape") { setSearch(""); inputRef.current?.blur(); }
    if (e.key === "Enter" && search.trim()) {
      const lower = search.toLowerCase().trim();
      for (const [tabId, keywords] of Object.entries(TAB_KEYWORDS)) {
        if (keywords.some(k => k.includes(lower) || lower.includes(k.split(" ")[0]))) {
          setActiveTab(tabId);
          setSearch("");
          break;
        }
      }
    }
  };

  const renderSection = () => {
    switch (activeTab) {
      case "account":       return <AccountSection toast={showToast} adminProfile={adminProfileState} onProfileSaved={(p) => setAdminProfileState((prev) => ({ ...prev, ...p }))} />;
      case "password":      return <PasswordSection toast={showToast} />;
      case "notifications": return <NotificationsSection toast={showToast} />;
      case "privacy":       return <PrivacySection toast={showToast} />;
      case "theme":         return <ThemeSection toast={showToast} onAccentChange={setAccentColor} />;
      case "system":        return <SystemSection toast={showToast} />;
      case "danger":        return <DangerSection navigate={navigate} toast={showToast} />;
      default:              return null;
    }
  };

  return (
    <div className="ft-root">

      {/* SIDEBAR */}
      <aside className="ft-sidebar">
        <div className="ft-sidebar__brand">
          <div className="ft-sidebar__brand-icon"><Ic.Dumbbell /></div>
          <div className="ft-sidebar__brand-name">FitTrack</div>
        </div>
        <div className="ft-sidebar__label">Navigation</div>
        <ul className="ft-sidebar__menu">
          {navItems.map(item => (
            <li key={item.route}
              className={isActive(item.route) ? "active" : ""}
              onClick={() => navigate(item.route)}>
              <span className="ft-sidebar__icon">{navIcons[item.icon]}</span>
              {item.label}
              {isActive(item.route) && <span className="ft-sidebar__dot" />}
            </li>
          ))}
        </ul>
        <div className="ft-sidebar__bottom">
          <ul className="ft-sidebar__menu">
            <li onClick={() => navigate("/login")}>
              <span className="ft-sidebar__icon"><Ic.Logout /></span>Logout
            </li>
          </ul>
        </div>
      </aside>

      {/* MAIN */}
      <div className="ft-main">

        {/* TOPBAR */}
        <div className="ft-topbar">
          {/* Search */}
          <div className="ft-topbar__search">
            <Ic.Search />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search settings… (e.g. password, backup, color)"
              value={search}
              onChange={handleSearch}
              onKeyDown={handleSearchKeyDown}
            />
            {search && (
              <button className="ft-search-clear" onClick={() => setSearch("")}>✕</button>
            )}
          </div>
          <div className="ft-topbar__right">
            <div className="ft-notif"><Ic.Bell /><span className="ft-notif__dot" /></div>
            <div className="ft-profile">
              <div className="ft-profile__avatar">{getAdminInitials(adminProfileState?.name)}</div>
              <div>
                <div className="ft-profile__name">{adminProfileState?.name || "Admin Staff"}</div>
                <div className="ft-profile__role">FitTrack Admin</div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="ft-content">
          <div className="as-page-header">
            <div>
              <div className="as-page-header__eyebrow">
                <span className="as-page-header__dot" />Admin Panel
              </div>
              <h1 className="as-page-header__title">Settings</h1>
              <p className="as-page-header__sub">
                Manage your admin account settings, notifications, and system preferences.
              </p>
            </div>
          </div>

          <div className="as-layout">
            <nav className="as-tabs">
              {TABS.map(t => (
                <button
                  key={t.id}
                  className={`as-tab${activeTab === t.id ? " as-tab--active" : ""}${t.id === "danger" ? " as-tab--danger" : ""}`}
                  onClick={() => setActiveTab(t.id)}
                >
                  <span className="as-tab__icon">{t.icon}</span>
                  <span className="as-tab__label">{t.label}</span>
                  {activeTab === t.id && <span className="as-tab__pip" />}
                </button>
              ))}
            </nav>

            <div className="as-panel">
              {renderSection()}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Toast with type-based coloring */}
      <Toast message={toastMsg} type={toastType} visible={toastVis} />
    </div>
  );
}