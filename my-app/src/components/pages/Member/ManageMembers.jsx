import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./ManageMembers.css";
import { getAdminProfile, getAdminInitials } from "../../../utils/adminProfile";

// ─── INITIAL DATA ───────────────────────────────────
// Members will be fetched from API
const INITIAL_MEMBERS = [];

const navItems = [
  { label: "Dashboard",        route: "/admin/dashboard", icon: "grid"  },
  { label: "Manage Members",   route: "/members",         icon: "users" },
  { label: "Membership Plans", route: "/membershipplan",  icon: "card"  },
  { label: "Trainers",         route: "/trainer",         icon: "user"  },
  { label: "Attendance",       route: "/attendance",      icon: "list"  },
  { label: "Profile",          route: "/admin/profile",   icon: "user"  },
];

// ─── HELPERS ────────────────────────────────────────
function getInitials(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

// ─── ICONS ──────────────────────────────────────────
const IconDumbbell = () => (
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
const IconUsers = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="9" cy="7" r="4"/>
    <path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/>
    <path d="M16 3.13a4 4 0 010 7.75"/>
    <path d="M21 21v-2a4 4 0 00-3-3.87"/>
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
const IconLogout = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconBell = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);
const IconPlus = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconUpload = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);
const IconEdit = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconTrash = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
    <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
  </svg>
);
const IconEye = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconSearch = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconClock = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
  </svg>
);
const IconChevronDown = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);

const navIcons = {
  grid:  <IconGrid />,
  users: <IconUsers />,
  card:  <IconCard />,
  user:  <IconUser />,
  list:  <IconList />,
};

// ─── MAIN COMPONENT ─────────────────────────────────
export default function ManageMembers() {
  const navigate = useNavigate();
  const location = useLocation();

  const [members, setMembers]           = useState(INITIAL_MEMBERS);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [planFilter, setPlanFilter]     = useState("All");
  const [showModal, setShowModal]       = useState(false);
  const [viewMember, setViewMember]     = useState(null);
  const [editingMemberId, setEditingMemberId] = useState(null);
  const [toast, setToast]               = useState({ msg: "", show: false });
  const [adminProfile]                  = useState(() => getAdminProfile());
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);
  const [plans, setPlans]               = useState([]);

  const [form, setForm] = useState({
    name: "", email: "", phone: "", plan: "", expiry: "", status: "Active",
  });

  // Helper: Calculate expiry date based on duration_months
  const calculateExpiryDate = (durationMonths) => {
    const date = new Date();
    date.setMonth(date.getMonth() + parseInt(durationMonths));
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  // Fetch plans on mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/members/plans", {
          headers: { "Authorization": `Bearer ${token}` },
        });
        if (response.ok) {
          const data = await response.json();
          const plansList = Array.isArray(data.data) ? data.data : [];
          setPlans(plansList);
        }
      } catch (err) {
        console.error("Failed to fetch plans:", err);
      }
    };
    fetchPlans();
  }, []);

  // Update expiry when plan changes
  const handlePlanChange = (planId) => {
    const selectedPlan = plans.find(p => p.id === parseInt(planId));
    if (selectedPlan && selectedPlan.duration_months) {
      const newExpiry = calculateExpiryDate(selectedPlan.duration_months);
      setForm({ ...form, plan: planId, expiry: newExpiry });
    } else {
      setForm({ ...form, plan: planId });
    }
  };

  // Fetch members from API
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/members", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch members");
        }

        const data = await response.json();
        const membersList = Array.isArray(data.data) ? data.data : [];

        // Transform API data to match component format
        const transformedMembers = membersList.map(member => ({
          id: member.id || `GF-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          name: member.name || "Unknown",
          email: member.email || "N/A",
          phone: member.phone || "N/A",
          plan: member.MemberDetail?.membershipPlan?.name || "Not Set",
          expiry: member.MemberDetail?.membershipPlan?.endDate ? new Date(member.MemberDetail.membershipPlan.endDate).toLocaleDateString() : "N/A",
          status: member.is_verified ? "Active" : "Inactive",
        }));

        setMembers(transformedMembers);
      } catch (err) {
        console.error("Error fetching members:", err);
        setError(err.message || "Failed to load members");
        setMembers(INITIAL_MEMBERS);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const year = new Date().getFullYear();

  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast({ msg: "", show: false }), 2600);
  };

  const exportCSV = () => {
    const headers = ["Member ID", "Name", "Email", "Phone", "Plan", "Expiry", "Status"];
    const rows = members.map((m) => [m.id, m.name, m.email, m.phone, m.plan, m.expiry, m.status]);
    const csv = "data:text/csv;charset=utf-8," + [headers, ...rows].map((r) => r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = encodeURI(csv);
    a.download = "gymflow_members.csv";
    a.click();
    showToast("✓ CSV exported successfully!");
  };

  const openAdd = () => {
    setForm({ name: "", email: "", phone: "", plan: plans.length > 0 ? String(plans[0].id) : "", expiry: "", status: "Active" });
    setEditingMemberId(null);
    setShowModal(true);
  };
  const openEdit = (index) => {
    const member = filtered[index];
    if (!member) return;
    setForm({ ...member });
    setEditingMemberId(member.id);
    setShowModal(true);
  };
  const saveMember = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (editingMemberId !== null) {
      const realIdx = members.findIndex((m) => m.id === editingMemberId);
      if (realIdx === -1) return;
      setMembers((prev) => prev.map((m, i) => (i === realIdx ? { ...m, ...form } : m)));
      showToast("✓ Member updated!");
    } else {
      const newId = "GF-" + Math.floor(Math.random() * 9000 + 1000);
      setMembers((prev) => [{ ...form, id: newId }, ...prev]);
      showToast("✓ Member added!");
    }
    setShowModal(false);
    setEditingMemberId(null);
  };
  const deleteMember = (index) => {
    const member = filtered[index];
    if (!member) return;
    if (!window.confirm(`Delete ${member.name}?`)) return;
    const realIdx = members.findIndex((m) => m.id === member.id);
    if (realIdx === -1) return;
    setMembers((prev) => prev.filter((_, i) => i !== realIdx));
    showToast("Member removed.");
  };

  const uniquePlans = [...new Set(members.map((m) => m.plan))];
  const filtered = members.filter((m) => {
    const q = search.toLowerCase();
    const matchSearch = m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.id.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || m.status === statusFilter;
    const matchPlan   = planFilter === "All" || m.plan === planFilter;
    return matchSearch && matchStatus && matchPlan;
  });

  const totalCount   = members.length;
  const activeCount  = members.filter((m) => m.status === "Active").length;
  const expiredCount = members.filter((m) => m.status === "Expired").length;
  const adminName = adminProfile.name || "Admin Staff";
  const adminInitials = getAdminInitials(adminName);

  const isActive = (route) => location.pathname === route;

  return (
    <div className="mm-root">

      {/* ═══ SIDEBAR ═══ */}
      <aside className="mm-sidebar">

        {/* Brand */}
        <div className="mm-sidebar__brand">
          <div className="mm-sidebar__brand-icon"><IconDumbbell /></div>
          <div className="mm-sidebar__brand-name">FitTrack</div>
        </div>

        {/* Nav section label */}
        <div className="mm-sidebar__label">Navigation</div>

        {/* Main nav */}
        <ul className="mm-sidebar__menu">
          {navItems.map((item) => (
            <li
              key={item.route}
              className={isActive(item.route) ? "active" : ""}
              onClick={() => navigate(item.route)}
            >
              <span className="mm-sidebar__icon">{navIcons[item.icon]}</span>
              {item.label}
              {isActive(item.route) && <span className="mm-sidebar__dot" />}
            </li>
          ))}
        </ul>

        {/* Bottom — logout */}
        <div className="mm-sidebar__bottom">
          <ul className="mm-sidebar__menu">
            <li onClick={() => navigate("/login")}>
              <span className="mm-sidebar__icon"><IconLogout /></span>
              Logout
            </li>
          </ul>
        </div>

      </aside>

      {/* ═══ MAIN ═══ */}
      <div className="mm-main">

        {/* TOPBAR */}
        <div className="mm-topbar">
          <div className="mm-topbar__search">
            <IconSearch />
            <input
              type="text"
              placeholder="Search gym resources…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="mm-topbar__right">
            <div className="mm-topbar__notif">
              <IconBell />
              <span className="mm-topbar__notif-dot" />
            </div>
            <div className="mm-topbar__profile" onClick={() => navigate("/admin/profile")} style={{ cursor: "pointer" }}>
              <div className="mm-topbar__avatar">{adminInitials}</div>
              <div className="mm-topbar__profile-info">
                <div className="mm-topbar__profile-name">{adminName}</div>
                <div className="mm-topbar__profile-role">FitTrack Admin</div>
              </div>
              <div className="mm-topbar__globe">🌐</div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="mm-content">

          {/* PAGE HEADER */}
          <div className="mm-page-header">
            <div className="mm-page-header__left">
              <div className="mm-page-header__eyebrow">
                <span className="mm-page-header__dot" />
                Member Management
              </div>
              <h1 className="mm-page-header__title">Manage Members</h1>
              <p className="mm-page-header__sub">
                Oversee your gym's community, track subscriptions and manage access.
              </p>
            </div>
            <div className="mm-page-header__actions">
              <button className="mm-btn mm-btn--outline" onClick={exportCSV}>
                <IconUpload /> Export CSV
              </button>
              <button className="mm-btn mm-btn--primary" onClick={openAdd}>
                <IconPlus /> Add New Member
              </button>
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="mm-stats">
            <div className="mm-stat">
              <div className="mm-stat__top">
                <div className="mm-stat__icon mm-stat__icon--orange"><IconUsers /></div>
                <span className="mm-badge mm-badge--green">↑ +12.5%</span>
              </div>
              <div className="mm-stat__value">{totalCount}</div>
              <div className="mm-stat__label">Total Members</div>
            </div>
            <div className="mm-stat">
              <div className="mm-stat__top">
                <div className="mm-stat__icon mm-stat__icon--green"><IconUser /></div>
                <span className="mm-badge mm-badge--green">↑ +8.2%</span>
              </div>
              <div className="mm-stat__value">{activeCount}</div>
              <div className="mm-stat__label">Active Plans</div>
            </div>
            <div className="mm-stat">
              <div className="mm-stat__top">
                <div className="mm-stat__icon mm-stat__icon--yellow"><IconClock /></div>
                <span className="mm-badge mm-badge--yellow">⚠ 12 days</span>
              </div>
              <div className="mm-stat__value">42</div>
              <div className="mm-stat__label">Expiring Soon</div>
            </div>
            <div className="mm-stat">
              <div className="mm-stat__top">
                <div className="mm-stat__icon mm-stat__icon--red"><IconCard /></div>
                <span className="mm-badge mm-badge--red">↓ -4.1%</span>
              </div>
              <div className="mm-stat__value mm-stat__value--danger">{expiredCount}</div>
              <div className="mm-stat__label">Expired</div>
            </div>
          </div>

          {/* TABLE CARD */}
          <div className="mm-table-card">
            <div className="mm-table-header">
              <div className="mm-table-header__left">
                <div className="mm-table-header__title">Member Directory</div>
                <div className="mm-table-header__sub">
                  Showing <strong>{filtered.length}</strong> of <strong>{totalCount}</strong> members
                </div>
              </div>
              <div className="mm-table-header__filters">
                <div className="mm-filter-search">
                  <IconSearch />
                  <input
                    type="text"
                    placeholder="Name, email or ID…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
                <div className="mm-select-wrap">
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                  </select>
                  <IconChevronDown />
                </div>
                <div className="mm-select-wrap">
                  <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
                    <option value="All">All Plans</option>
                    {uniquePlans.map((p) => <option key={p}>{p}</option>)}
                  </select>
                  <IconChevronDown />
                </div>
              </div>
            </div>

            <div className="mm-table-wrap">
              <table className="mm-table">
                <thead>
                  <tr>
                    <th>Member ID</th>
                    <th>Member</th>
                    <th>Phone</th>
                    <th>Plan</th>
                    <th>Expiry</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="mm-table__empty">
                        <div className="mm-table__empty-inner">
                          <IconSearch />
                          <span>No members found.</span>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((m, i) => (
                      <tr key={m.id}>
                        <td><span className="mm-id">{m.id}</span></td>
                        <td>
                          <div className="mm-member-cell">
                            <div className="mm-avatar">{getInitials(m.name)}</div>
                            <div>
                              <div className="mm-member-name">{m.name}</div>
                              <div className="mm-member-email">{m.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="mm-phone">{m.phone}</td>
                        <td><span className="mm-plan"><IconClock />{m.plan}</span></td>
                        <td className="mm-expiry">{m.expiry}</td>
                        <td>
                          <span className={`mm-status ${m.status === "Active" ? "mm-status--active" : "mm-status--expired"}`}>
                            <span className="mm-status__dot" />
                            {m.status}
                          </span>
                        </td>
                        <td>
                          <div className="mm-actions">
                            <button className="mm-action-btn mm-action-btn--view"   title="View"   onClick={() => setViewMember(m)}><IconEye /></button>
                            <button className="mm-action-btn mm-action-btn--edit"   title="Edit"   onClick={() => openEdit(i)}><IconEdit /></button>
                            <button className="mm-action-btn mm-action-btn--delete" title="Delete" onClick={() => deleteMember(i)}><IconTrash /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="mm-table-footer">
              <span>{filtered.length} result{filtered.length !== 1 ? "s" : ""} displayed</span>
              <span>© {year} FitTrack · System Status: <span className="mm-table-footer__ok">Operational</span></span>
            </div>
          </div>

        </div>{/* /mm-content */}
      </div>{/* /mm-main */}

      {/* ═══ ADD / EDIT MODAL ═══ */}
      {showModal && (
        <div className="mm-overlay" onClick={(e) => e.target === e.currentTarget && setShowModal(false)}>
          <div className="mm-modal">
            <div className="mm-modal__header">
              <div>
                <h2>{editingMemberId !== null ? "Edit Member" : "Add New Member"}</h2>
                <p>{editingMemberId !== null ? "Update member information below." : "Fill in the details to register a new member."}</p>
              </div>
              <button className="mm-modal__close" onClick={() => setShowModal(false)}>✕</button>
            </div>

            <div className="mm-modal__grid">
              <div className="mm-form-group">
                <label>Full Name</label>
                <input placeholder="e.g. John Smith" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="mm-form-group">
                <label>Email Address</label>
                <input type="email" placeholder="john@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="mm-form-group">
                <label>Phone Number</label>
                <input placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="mm-form-group">
                <label>Expiry Date</label>
                <input placeholder="e.g. Dec 15, 2025" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} />
              </div>
              <div className="mm-form-group">
                <label>Membership Plan</label>
                <div className="mm-select-wrap mm-select-wrap--full">
                  <select value={form.plan} onChange={(e) => handlePlanChange(e.target.value)}>
                    <option value="">Select a plan...</option>
                    {plans.map((plan) => (
                      <option key={plan.id} value={plan.id}>
                        {plan.name} ({plan.duration_months} month{plan.duration_months !== 1 ? 's' : ''}) - Rs {plan.price}
                      </option>
                    ))}
                  </select>
                  <IconChevronDown />
                </div>
              </div>
              <div className="mm-form-group">
                <label>Status</label>
                <div className="mm-select-wrap mm-select-wrap--full">
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="Active">Active</option>
                    <option value="Expired">Expired</option>
                  </select>
                  <IconChevronDown />
                </div>
              </div>
            </div>

            <div className="mm-modal__actions">
              <button className="mm-btn mm-btn--outline" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="mm-btn mm-btn--primary" onClick={saveMember}>
                {editingMemberId !== null ? "Update Member" : "Save Member"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ VIEW MODAL ═══ */}
      {viewMember && (
        <div className="mm-overlay" onClick={() => setViewMember(null)}>
          <div className="mm-modal mm-modal--view" onClick={(e) => e.stopPropagation()}>
            <div className="mm-modal__header">
              <div>
                <h2>Member Details</h2>
                <p>Full profile for {viewMember.name}</p>
              </div>
              <button className="mm-modal__close" onClick={() => setViewMember(null)}>✕</button>
            </div>

            <div className="mm-view-profile">
              <div className="mm-view-avatar">{getInitials(viewMember.name)}</div>
              <div>
                <div className="mm-view-name">{viewMember.name}</div>
                <div className="mm-view-id">{viewMember.id}</div>
              </div>
            </div>

            <div className="mm-view-fields">
              {[
                ["Email",  viewMember.email],
                ["Phone",  viewMember.phone],
                ["Plan",   viewMember.plan],
                ["Expiry", viewMember.expiry],
                ["Status", viewMember.status],
              ].map(([k, v]) => (
                <div key={k} className="mm-view-field">
                  <span className="mm-view-field__key">{k}</span>
                  <span className={`mm-view-field__val ${k === "Status" ? (v === "Active" ? "mm-view-field__val--active" : "mm-view-field__val--expired") : ""}`}>{v}</span>
                </div>
              ))}
            </div>

            <div className="mm-modal__actions">
              <button className="mm-btn mm-btn--outline" onClick={() => setViewMember(null)}>Close</button>
              <button className="mm-btn mm-btn--primary" onClick={() => { setViewMember(null); const i = filtered.indexOf(viewMember); if (i !== -1) openEdit(i); }}>Edit Member</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TOAST ═══ */}
      <div className={`mm-toast ${toast.show ? "mm-toast--show" : ""}`}>{toast.msg}</div>

    </div>
  );
}