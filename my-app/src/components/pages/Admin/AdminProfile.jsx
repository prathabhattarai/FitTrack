import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AdminProfile.css";
import "./AdminDashboard.css";
import { getAdminInitials, getAdminProfile, setAdminProfile } from "../../../utils/adminProfile";

const navItems = [
  { label: "Dashboard", route: "/admin/dashboard", icon: "grid" },
  { label: "Manage Members", route: "/members", icon: "users" },
  { label: "Membership Plans", route: "/membershipplan", icon: "card" },
  { label: "Trainers", route: "/trainer", icon: "user" },
  { label: "Attendance", route: "/attendance", icon: "list" },
  { label: "Profile", route: "/admin/profile", icon: "user" },
];

const IconDumbbell = () => (
  <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M6 5v14M18 5v14" />
    <rect x="3" y="8" width="3" height="8" rx="1" />
    <rect x="18" y="8" width="3" height="8" rx="1" />
    <line x1="6" y1="12" x2="18" y2="12" />
  </svg>
);
const IconGrid = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
);
const IconUsers = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="9" cy="7" r="4" /><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" />
    <path d="M16 3.13a4 4 0 010 7.75" /><path d="M21 21v-2a4 4 0 00-3-3.87" />
  </svg>
);
const IconCard = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" />
  </svg>
);
const IconUser = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="7" r="4" /><path d="M5.5 21a6.5 6.5 0 0113 0" />
  </svg>
);
const IconList = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
  </svg>
);
const IconLogout = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
    <polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
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
  users: <IconUsers />,
  card: <IconCard />,
  user: <IconUser />,
  list: <IconList />,
};

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  department: "",
  address: "",
  avatar_url: "",
};

export default function AdminProfile() {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState(() => getAdminProfile());
  const [form, setForm] = useState({ ...emptyForm, ...getAdminProfile() });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isActive = (route) => location.pathname === route;

  const syncLocalUser = (next) => {
    const localUser = JSON.parse(localStorage.getItem("user") || "{}");
    localStorage.setItem("user", JSON.stringify({ ...localUser, ...next }));
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login to access admin profile.");
      setLoading(false);
      return;
    }

    const load = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/admin/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.status === 401) {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          throw new Error("Session expired. Please login again.");
        }
        if (!res.ok) throw new Error(data?.message || "Failed to load profile");

        const apiProfile = data?.data || {};
        const localProfile = getAdminProfile();
        const isDemoProfile = Boolean(data?.demoMode) || Number(apiProfile?.id) === 0;

        const next = isDemoProfile
          ? {
              ...apiProfile,
              ...localProfile,
              name: (String(localProfile?.name || "").trim() || String(apiProfile?.name || "").trim() || "Admin Demo"),
              email: (String(localProfile?.email || "").trim() || String(apiProfile?.email || "").trim() || "admin@fittrack.com"),
              phone: (String(localProfile?.phone || "").trim() || String(apiProfile?.phone || "").trim()),
              address: (String(localProfile?.address || "").trim() || String(apiProfile?.address || "").trim()),
              department: (String(localProfile?.department || "").trim() || String(apiProfile?.department || "").trim() || "Management"),
              avatar_url: (String(localProfile?.avatar_url || "").trim() || String(apiProfile?.avatar_url || "").trim()),
            }
          : apiProfile;

        setAdminProfile(next);
        syncLocalUser(next);
        setProfile((prev) => ({ ...prev, ...next }));
        setForm({ ...emptyForm, ...next });
      } catch (e) {
        setError(e.message || "Could not load profile.");
        if (String(e.message || "").toLowerCase().includes("login")) {
          setTimeout(() => navigate("/login"), 1200);
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setMessage("");
    setError("");
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError("Name is required.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login again.");
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
          name: form.name,
          phone: form.phone,
          address: form.address,
          department: form.department,
          avatar_url: form.avatar_url,
        }),
      });

      const data = await res.json();
      if (res.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        throw new Error("Session expired. Please login again.");
      }
      if (!res.ok) throw new Error(data?.message || "Update failed");

      const next = data?.data || {};
      setAdminProfile(next);
      syncLocalUser(next);
      setProfile((prev) => ({ ...prev, ...next }));
      setForm((prev) => ({ ...prev, ...next }));
      setMessage("Profile updated successfully.");
      setError("");
    } catch (e) {
      setError(e.message || "Unable to save profile.");
      setMessage("");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ft-dashboard ap-root">
      <aside className="ft-sidebar">
        <div className="ft-sidebar__brand">
          <div className="ft-sidebar__brand-icon"><IconDumbbell /></div>
          <div className="ft-sidebar__brand-name">FitTrack</div>
        </div>

        <div className="ft-sidebar__label">Navigation</div>

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

        <div className="ft-sidebar__bottom">
          <ul className="ft-sidebar__menu">
            <li onClick={() => navigate("/login")}>
              <span className="ft-sidebar__icon"><IconLogout /></span>
              Logout
            </li>
          </ul>
        </div>
      </aside>

      <main className="ft-main">
        <div className="ft-topbar ap-topbar">
          <div className="ap-topbar__title-wrap">
            <h1 className="ap-topbar__title">Admin Profile</h1>
            <p className="ap-topbar__sub">Update your admin details and keep them synced everywhere.</p>
          </div>
          <div className="ft-topbar__right">
            <div className="ft-notif">
              <IconBell />
              <span className="ft-notif__dot" />
            </div>
            <div className="ft-profile" onClick={() => navigate("/admin/profile")} style={{ cursor: "pointer" }}>
              <div className="ft-profile__avatar">{getAdminInitials(profile?.name)}</div>
              <div className="ft-profile__info">
                <div className="ft-profile__name">{profile?.name || "Admin Staff"}</div>
                <div className="ft-profile__role">FitTrack Admin</div>
              </div>
              <div className="ft-profile__globe">🌐</div>
            </div>
          </div>
        </div>

        <section className="ft-content">
          <div className="ap-card">
          {loading ? <div className="ap-status">Loading profile...</div> : null}
          {!loading && error ? <div className="ap-status ap-status--error">{error}</div> : null}
          {!loading && message ? <div className="ap-status ap-status--success">{message}</div> : null}

          <form className="ap-form" onSubmit={handleSave}>
            <div className="ap-grid">
              <label className="ap-field">
                <span>Full Name</span>
                <input name="name" value={form.name || ""} onChange={handleChange} required />
              </label>

              <label className="ap-field">
                <span>Email</span>
                <input name="email" value={form.email || ""} onChange={handleChange} disabled />
              </label>

              <label className="ap-field">
                <span>Phone</span>
                <input name="phone" value={form.phone || ""} onChange={handleChange} />
              </label>

              <label className="ap-field">
                <span>Department</span>
                <input name="department" value={form.department || ""} onChange={handleChange} />
              </label>

              <label className="ap-field ap-field--full">
                <span>Address</span>
                <input name="address" value={form.address || ""} onChange={handleChange} />
              </label>

              <label className="ap-field ap-field--full">
                <span>Avatar URL</span>
                <input name="avatar_url" value={form.avatar_url || ""} onChange={handleChange} placeholder="https://..." />
              </label>
            </div>

            <div className="ap-actions">
              <button type="button" className="ap-btn ap-btn--ghost" onClick={() => setForm({ ...emptyForm, ...profile })}>
                Reset
              </button>
              <button type="submit" className="ap-btn ap-btn--primary" disabled={saving}>
                {saving ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </form>
          </div>
        </section>
      </main>
    </div>
  );
}
