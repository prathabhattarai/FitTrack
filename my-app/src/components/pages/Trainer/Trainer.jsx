import React, { useState, useMemo, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Trainer.css";
import { getAdminProfile, getAdminInitials } from "../../../utils/adminProfile";

const navItems = [
  { label: "Dashboard",        route: "/admin/dashboard", icon: "grid"  },
  { label: "Manage Members",   route: "/members",         icon: "users" },
  { label: "Membership Plans", route: "/membershipplan",  icon: "card"  },
  { label: "Trainers",         route: "/trainer",         icon: "user"  },
  { label: "Attendance",       route: "/attendance",      icon: "list"  },
  { label: "Profile",          route: "/admin/profile",   icon: "user"  },
];

// ── Icons ──────────────────────────────────────────────────────────────────
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
const IconSearch = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconPlus = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
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
const IconFilter = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);
const IconPhone = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/>
  </svg>
);
const IconMail = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconMoreVert = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="5" r="1" fill="currentColor"/><circle cx="12" cy="12" r="1" fill="currentColor"/><circle cx="12" cy="19" r="1" fill="currentColor"/>
  </svg>
);
const IconBell = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);

const navIcons = { grid: <IconGrid />, users: <IconUsers />, card: <IconCard />, user: <IconUser />, list: <IconList /> };

function getInitials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const initialTrainers = [
  { id: "TR-001", name: "Viktor Vane",           specialization: "Powerlifting",    phone: "555-0123", email: "v.vane@fittrack.com",  members: 12 },
  { id: "TR-002", name: "Sarah Steel Jenkins",   specialization: "Crossfit & HIIT", phone: "555-0456", email: "s.steel@fittrack.com", members: 24 },
  { id: "TR-003", name: "Marcus Chen",           specialization: "Yoga & Mobility", phone: "555-0789", email: "m.chen@fittrack.com",  members: 18 },
  { id: "TR-004", name: "Elena Rodriguez",       specialization: "Strength & Cardio", phone: "555-0321", email: "e.rod@fittrack.com",members: 31 },
];

export default function Trainer() {
  const navigate = useNavigate();
  const location = useLocation();

  const [trainers,       setTrainers]       = useState(initialTrainers);
  const [search,         setSearch]         = useState("");
  const [modalOpen,      setModalOpen]      = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [formState,      setFormState]      = useState({ name: "", specialization: "", phone: "", email: "", members: 0 });
  const [toast,          setToast]          = useState({ msg: "", show: false });
  const [adminProfile]                      = useState(() => getAdminProfile());
  const [bookings,       setBookings]       = useState([]);
  const [bookingsLoading, setBookingsLoading] = useState(true);

  const isActive = (route) => location.pathname === route;

  // Fetch trainer bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setBookingsLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/admin/bookings", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setBookings(Array.isArray(data.data) ? data.data : []);
        }
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      } finally {
        setBookingsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2600);
  };

  const handleBookingAction = async (bookingId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showToast("Session expired. Please login again.");
        return;
      }

      const res = await fetch(`http://localhost:5000/api/admin/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();

      if (!res.ok || !data?.success) {
        showToast(data?.message || "Failed to update booking. Try again.");
        return;
      }

      // Update the local bookings list
      if (newStatus === 'cancelled') {
        // Remove from list when cancelled
        setBookings(prev => prev.filter(b => b.id !== bookingId));
        showToast("✗ Booking cancelled and removed");
      } else {
        // Update status when confirmed
        setBookings(prev => 
          prev.map(b => 
            b.id === bookingId ? { ...b, status: newStatus } : b
          )
        );
        showToast(`✓ Booking confirmed`);
      }
    } catch (err) {
      console.error("Error updating booking:", err);
      showToast("Error updating booking. Please try again.");
    }
  };

  const filtered = useMemo(
    () => trainers.filter((t) => t.name.toLowerCase().includes(search.toLowerCase()) || t.specialization.toLowerCase().includes(search.toLowerCase())),
    [search, trainers]
  );

  const totalMembers = trainers.reduce((sum, t) => sum + t.members, 0);
  const adminName = adminProfile.name || "Admin Staff";
  const adminInitials = getAdminInitials(adminName);

  const openAddModal = () => {
    setEditingTrainer(null);
    setFormState({ name: "", specialization: "", phone: "", email: "", members: 0 });
    setModalOpen(true);
  };
  const openEditModal = (trainer) => {
    setEditingTrainer(trainer);
    setFormState({ ...trainer });
    setModalOpen(true);
  };
  const handleDelete = (id) => {
    if (!window.confirm("Remove this trainer?")) return;
    setTrainers((prev) => prev.filter((t) => t.id !== id));
    showToast("Trainer removed.");
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: name === "members" ? Number(value) : value }));
  };
  const handleModalSubmit = (e) => {
    e.preventDefault();
    if (!formState.name || !formState.specialization) return;
    const newTrainer = {
      id:             editingTrainer ? editingTrainer.id : `TR-${String(trainers.length + 1).padStart(3, "0")}`,
      name:           formState.name,
      specialization: formState.specialization,
      phone:          formState.phone,
      email:          formState.email,
      members:        formState.members,
    };
    setTrainers((prev) =>
      editingTrainer ? prev.map((t) => (t.id === editingTrainer.id ? newTrainer : t)) : [...prev, newTrainer]
    );
    showToast(editingTrainer ? "✓ Trainer updated!" : "✓ Trainer added!");
    setModalOpen(false);
  };

  return (
    <div className="tr-root">

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className="tr-sidebar">
        <div className="tr-sidebar__brand">
          <div className="tr-sidebar__brand-icon"><IconDumbbell /></div>
          <div className="tr-sidebar__brand-name">FitTrack</div>
        </div>

        <div className="tr-sidebar__label">Navigation</div>

        <ul className="tr-sidebar__menu">
          {navItems.map((item) => (
            <li key={item.route} className={isActive(item.route) ? "active" : ""} onClick={() => navigate(item.route)}>
              <span className="tr-sidebar__icon">{navIcons[item.icon]}</span>
              {item.label}
              {isActive(item.route) && <span className="tr-sidebar__dot" />}
            </li>
          ))}
        </ul>

        <div className="tr-sidebar__bottom">
          <ul className="tr-sidebar__menu">
            <li onClick={() => navigate("/login")}>
              <span className="tr-sidebar__icon"><IconLogout /></span>Logout
            </li>
          </ul>
        </div>
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <div className="tr-main">

        {/* TOPBAR */}
        <div className="tr-topbar">
          <div className="tr-topbar__search">
            <IconSearch />
            <input type="text" placeholder="Search trainers…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="tr-topbar__right">
            <div className="tr-topbar__notif">
              <IconBell />
              <span className="tr-topbar__notif-dot" />
            </div>
            <div className="tr-topbar__profile" onClick={() => navigate("/admin/profile")} style={{ cursor: "pointer" }}>
              <div className="tr-topbar__avatar">{adminInitials}</div>
              <div className="tr-topbar__profile-info">
                <div className="tr-topbar__profile-name">{adminName}</div>
                <div className="tr-topbar__profile-role">FitTrack Admin</div>
              </div>
              <div className="tr-topbar__globe">🌐</div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="tr-content">

          {/* PAGE HEADER */}
          <div className="tr-page-header">
            <div className="tr-page-header__left">
              <div className="tr-page-header__eyebrow"><span className="tr-page-header__dot" />Trainer Management</div>
              <h1 className="tr-page-header__title">Trainers Roster</h1>
              <p className="tr-page-header__sub">Manage your gym's training staff, specializations and client assignments.</p>
            </div>
            <button className="tr-btn tr-btn--primary" onClick={openAddModal}>
              <IconPlus /> Add New Trainer
            </button>
          </div>

          {/* STAT CARDS */}
          <div className="tr-stats">
            <div className="tr-stat">
              <div className="tr-stat__label">Active Staff</div>
              <div className="tr-stat__value">{trainers.length}</div>
              <div className="tr-stat__sub">Elite Trainers</div>
            </div>
            <div className="tr-stat">
              <div className="tr-stat__label">Total Clients</div>
              <div className="tr-stat__value">{totalMembers}</div>
              <div className="tr-stat__sub">Members Assigned</div>
            </div>
            <div className="tr-stat">
              <div className="tr-stat__label">Training Hours</div>
              <div className="tr-stat__value">1,280</div>
              <div className="tr-stat__sub">Per Month</div>
            </div>
            <div className="tr-stat">
              <div className="tr-stat__label">Avg Clients</div>
              <div className="tr-stat__value">{trainers.length ? Math.round(totalMembers / trainers.length) : 0}</div>
              <div className="tr-stat__sub">Per Trainer</div>
            </div>
          </div>

          {/* TABLE CARD */}
          <div className="tr-table-card">
            <div className="tr-table-header">
              <div>
                <div className="tr-table-header__title">Staff Directory</div>
                <div className="tr-table-header__sub">
                  Showing <strong>{filtered.length}</strong> of <strong>{trainers.length}</strong> trainers
                </div>
              </div>
              <button className="tr-filter-btn" onClick={() => showToast("Use the search box to filter trainers.")}><IconFilter /> Filter & Sort</button>
            </div>

            <div className="tr-table-wrap">
              <table className="tr-table">
                <thead>
                  <tr>
                    <th>Trainer ID</th>
                    <th>Trainer</th>
                    <th>Specialization</th>
                    <th>Contact</th>
                    <th>Assignments</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="6" className="tr-empty">No trainers found.</td></tr>
                  ) : (
                    filtered.map((trainer) => (
                      <tr key={trainer.id} className="tr-row">
                        <td><span className="tr-id">{trainer.id}</span></td>
                        <td>
                          <div className="tr-member-cell">
                            <div className="tr-avatar">{getInitials(trainer.name)}</div>
                            <div>
                              <div className="tr-member-name">{trainer.name}</div>
                              <div className="tr-member-email">{trainer.email}</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="tr-badge">{trainer.specialization}</span></td>
                        <td className="tr-contact">
                          <div><IconPhone />{trainer.phone}</div>
                          <div><IconMail />{trainer.email}</div>
                        </td>
                        <td>
                          <div className="tr-members-cell">
                            <span className="tr-members-count">{trainer.members}</span>
                            <span className="tr-members-label">members</span>
                          </div>
                        </td>
                        <td>
                          <div className="tr-actions">
                            <button className="tr-action-btn tr-action-btn--edit"   title="Edit"   onClick={() => openEditModal(trainer)}><IconEdit /></button>
                            <button className="tr-action-btn tr-action-btn--delete" title="Delete" onClick={() => handleDelete(trainer.id)}><IconTrash /></button>
                            <button className="tr-action-btn"                       title="More" onClick={() => showToast(`More actions for ${trainer.name} coming soon.`)}><IconMoreVert /></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="tr-table-footer">
              <span>{filtered.length} result{filtered.length !== 1 ? "s" : ""} displayed</span>
              <span>© {new Date().getFullYear()} FitTrack · System Status: <span className="tr-table-footer__ok">Operational</span></span>
            </div>
          </div>

          {/* BOOKING QUEUE SECTION */}
          {!bookingsLoading && bookings.length > 0 && (
            <div className="tr-booking-card">
              <div className="tr-table-header">
                <div>
                  <div className="tr-table-header__title">Booking Requests</div>
                  <div className="tr-table-header__sub">
                    Member booking requests for trainers
                  </div>
                </div>
              </div>

              <div className="tr-booking-list">
                {bookings.map((booking) => {
                  const trainerName = booking.trainer?.name || "Unknown Trainer";
                  const memberEmail = booking.user?.email || "Unknown Member";
                  const bookingDate = new Date(booking.date);
                  const formattedDate = bookingDate.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                  });
                  const formattedTime = bookingDate.toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit"
                  });
                  
                  return (
                    <div key={booking.id} className="tr-booking-item">
                      <div className="tr-booking-info">
                        <div className="tr-booking-header">
                          <div className="tr-booking-trainer">{trainerName}</div>
                          <div className={`tr-booking-status tr-booking-status--${booking.status}`}>
                            {booking.status?.toUpperCase() || "PENDING"}
                          </div>
                        </div>
                        <div className="tr-booking-member">{memberEmail}</div>
                        <div className="tr-booking-details">
                          <span>{formattedDate} at {formattedTime}</span>
                        </div>
                      </div>
                      <div className="tr-booking-actions">
                        <button 
                          className="tr-btn tr-btn--sm tr-btn--primary" 
                          onClick={() => handleBookingAction(booking.id, 'confirmed')}
                          disabled={booking.status === 'confirmed'}
                          title="Confirm booking"
                        >
                          Confirm
                        </button>
                        <button 
                          className="tr-btn tr-btn--sm tr-btn--outline" 
                          onClick={() => handleBookingAction(booking.id, 'cancelled')}
                          disabled={booking.status === 'cancelled'}
                          title="Cancel booking"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ══════════ MODAL ══════════ */}
      {modalOpen && (
        <div className="tr-overlay" onClick={(e) => e.target === e.currentTarget && setModalOpen(false)}>
          <div className="tr-modal">
            <div className="tr-modal__header">
              <div>
                <h2>{editingTrainer ? "Edit Trainer" : "Add New Trainer"}</h2>
                <p>{editingTrainer ? "Update trainer information below." : "Fill in the details to register a new trainer."}</p>
              </div>
              <button className="tr-modal__close" onClick={() => setModalOpen(false)}>✕</button>
            </div>
            <form className="tr-modal__form" onSubmit={handleModalSubmit}>
              <div className="tr-modal__grid">
                <div className="tr-form-group">
                  <label>Full Name</label>
                  <input type="text" name="name" value={formState.name} onChange={handleInputChange} placeholder="e.g. John Smith" required />
                </div>
                <div className="tr-form-group">
                  <label>Specialization</label>
                  <input type="text" name="specialization" value={formState.specialization} onChange={handleInputChange} placeholder="e.g. Crossfit & HIIT" required />
                </div>
                <div className="tr-form-group">
                  <label>Phone Number</label>
                  <input type="text" name="phone" value={formState.phone} onChange={handleInputChange} placeholder="555-0000" />
                </div>
                <div className="tr-form-group">
                  <label>Email Address</label>
                  <input type="email" name="email" value={formState.email} onChange={handleInputChange} placeholder="trainer@fittrack.com" />
                </div>
                <div className="tr-form-group">
                  <label>Members Assigned</label>
                  <input type="number" name="members" value={formState.members} onChange={handleInputChange} placeholder="0" min="0" />
                </div>
              </div>
              <div className="tr-modal__actions">
                <button type="button" className="tr-btn tr-btn--outline" onClick={() => setModalOpen(false)}>Cancel</button>
                <button type="submit" className="tr-btn tr-btn--primary">{editingTrainer ? "Update Trainer" : "Save Trainer"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TOAST */}
      <div className={`tr-toast ${toast.show ? "tr-toast--show" : ""}`}>{toast.msg}</div>

    </div>
  );
}