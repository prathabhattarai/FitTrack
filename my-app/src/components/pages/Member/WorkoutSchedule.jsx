import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./WorkoutSchedule.css";
import { getMemberDisplayName, getMemberInitials } from "../../../utils/memberProfile";

// ─────────────────────────────────────────
// NAV CONFIG — member-facing routes
// ─────────────────────────────────────────
const navItems = [
  { label: "Dashboard",         route: "/member/dashboard",  icon: "grid"     },
  { label: "My Membership",     route: "/member/membership", icon: "card"     },
  { label: "Payment History",   route: "/member/payments",   icon: "payment"  },
  { label: "Attendance History",route: "/member/attendance", icon: "list"     },
  { label: "Workout Schedule",  route: "/member/schedule",   icon: "calendar" },
  { label: "Workout Videos",    route: "/member/videos",     icon: "play"     },
  { label: "BMI Calculator",    route: "/member/bmi",        icon: "bmi"      },
  { label: "Book Trainer",      route: "/member/trainer",    icon: "dumbbell" },
  { label: "Profile",           route: "/member/profile",    icon: "user"     },
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
const IconCalendar = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>
  </svg>
);
const IconPlay = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polygon points="5 3 19 12 5 21 5 3"/>
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
const IconBell = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);
const IconCheck = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12"/></svg>
);
const IconPlus = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <path d="M12 5v14M5 12h14"/>
  </svg>
);
const IconEdit = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L21 7"/>
  </svg>
);
const IconTrash = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/>
  </svg>
);
const IconChevronRight = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const IconLogout = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
);

// ─────────────────────────────────────────
// INITIAL DATA
// ─────────────────────────────────────────
const WORKOUT_TYPES = [
  { id: "strength",  label: "Strength",  color: "#e8302a" },
  { id: "cardio",    label: "Cardio",    color: "#00d4ff" },
  { id: "yoga",      label: "Yoga",      color: "#6bcf7f" },
  { id: "hiit",      label: "HIIT",      color: "#ffd700" },
  { id: "pilates",   label: "Pilates",   color: "#ff6b9d" },
  { id: "stretching",label: "Stretching",color: "#a78bfa" },
];

const INITIAL_SCHEDULES = [
  { id: 1, title: "Chest & Triceps", type: "strength", date: "2026-03-25", time: "06:00 AM", duration: "60", completed: false, notes: "Focus on bench press and dips" },
  { id: 2, title: "Morning Run", type: "cardio", date: "2026-03-25", time: "07:00 AM", duration: "45", completed: false, notes: "5K pace" },
  { id: 3, title: "Legs & Glutes", type: "strength", date: "2026-03-26", time: "05:30 AM", duration: "75", completed: false, notes: "Include squats and lunges" },
  { id: 4, title: "Yoga Session", type: "yoga", date: "2026-03-26", time: "06:00 PM", duration: "60", completed: true, notes: "Relaxing evening flow" },
  { id: 5, title: "HIIT Cardio", type: "hiit", date: "2026-03-27", time: "06:30 AM", duration: "30", completed: false, notes: "Burpees, mountain climbs, jump squats" },
];

// ─────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────
export default function WorkoutSchedule() {
  const navigate = useNavigate();
  const location = useLocation();
  const [schedules, setSchedules] = useState(INITIAL_SCHEDULES);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [showToast, setShowToast] = useState(null);

  const memberName = getMemberDisplayName();
  const memberInitials = getMemberInitials(memberName);

  // ─── Form State ───
  const [formData, setFormData] = useState({
    title: "",
    type: "strength",
    date: new Date().toISOString().split('T')[0],
    time: "06:00 AM",
    duration: "60",
    notes: "",
  });

  // ─── Filtered & Sorted Schedules ───
  const filtered = useMemo(() => {
    return schedules.filter(s => {
      const matchesType = filterType === "all" || s.type === filterType;
      const matchesSearch = s.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesType && matchesSearch;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [schedules, filterType, searchTerm]);

  // ─── Stats ───
  const stats = useMemo(() => ({
    total: schedules.length,
    completed: schedules.filter(s => s.completed).length,
    upcoming: schedules.filter(s => !s.completed).length,
  }), [schedules]);

  // ─── Toast ───
  const showNotification = (message) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  // ─── Handlers ───
  const handleAddNew = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setFormData({
      title: "",
      type: "strength",
      date: new Date().toISOString().split('T')[0],
      time: "06:00 AM",
      duration: "60",
      notes: "",
    });
  };

  const handleEdit = (schedule) => {
    setEditingId(schedule.id);
    setIsAddingNew(true);
    setFormData({
      title: schedule.title,
      type: schedule.type,
      date: schedule.date,
      time: schedule.time,
      duration: schedule.duration,
      notes: schedule.notes,
    });
  };

  const handleSave = () => {
    if (!formData.title.trim()) {
      showNotification("Please enter a title");
      return;
    }

    if (editingId) {
      setSchedules(schedules.map(s =>
        s.id === editingId ? { ...s, ...formData } : s
      ));
      showNotification("Schedule updated successfully!");
    } else {
      const newSchedule = {
        id: Math.max(...schedules.map(s => s.id), 0) + 1,
        ...formData,
        completed: false,
      };
      setSchedules([...schedules, newSchedule]);
      showNotification("Workout added to schedule!");
    }

    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleDelete = (id) => {
    setSchedules(schedules.filter(s => s.id !== id));
    showNotification("Workout removed from schedule");
  };

  const handleToggleComplete = (id) => {
    setSchedules(schedules.map(s =>
      s.id === id ? { ...s, completed: !s.completed } : s
    ));
    const schedule = schedules.find(s => s.id === id);
    showNotification(schedule?.completed ? "Marked as upcoming" : "Great workout! 🔥");
  };

  const handleNotificationClick = () => {
    showNotification("You're all caught up! 🎉");
  };

  const getTypeColor = (typeId) => {
    return WORKOUT_TYPES.find(t => t.id === typeId)?.color || "#6b6b78";
  };

  const getTypeLabel = (typeId) => {
    return WORKOUT_TYPES.find(t => t.id === typeId)?.label || typeId;
  };

  const navIcons = {
    grid: <IconGrid />,
    card: <IconCard />,
    payment: <IconPayment />,
    list: <IconList />,
    calendar: <IconCalendar />,
    play: <IconPlay />,
    bmi: <IconCard />,
    dumbbell: <IconDumbbell />,
    user: <IconUser />,
  };

  const isActive = (route) => location.pathname === route;

  return (
    <div className="ws-root">
      {/* SIDEBAR */}
      <aside className="ft-sidebar">
        {/* Brand */}
        <div className="ft-sidebar__brand">
          <div className="ft-sidebar__brand-icon">
            <IconDumbbellBrand />
          </div>
          <div className="ft-sidebar__brand-name">FitTrack</div>
        </div>

        {/* Nav section label */}
        <div className="ft-sidebar__label">Navigation</div>

        {/* Navigation */}
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

        {/* Footer */}
        <div className="ft-sidebar__bottom">
          <ul className="ft-sidebar__menu">
            <li onClick={() => navigate("/login")}>
              <span className="ft-sidebar__icon"><IconLogout /></span>
              Logout
            </li>
          </ul>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="ws-main">
        {/* Topbar */}
        <header className="ft-topbar">
          <div className="ft-topbar__left">
            <h1 className="ft-topbar__title">Workout Schedule</h1>
            <p className="ft-topbar__subtitle">Plan and track your daily fitness routine</p>
          </div>
          <div className="ft-topbar__right">
            <button className="ft-topbar__bell" onClick={handleNotificationClick}>
              <IconBell />
              <span className="ft-topbar__bell-dot"></span>
            </button>
            <div className="ft-profile" onClick={() => navigate("/member/profile")}>
              <div className="ft-profile__avatar">{memberInitials}</div>
              <span className="ft-profile__name">{memberName}</span>
              <div className="ft-profile__globe">🌐</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="ws-content">
          {/* Stats */}
          <div className="ws-stats">
            <div className="ws-stat-card">
              <div className="ws-stat-value">{stats.total}</div>
              <div className="ws-stat-label">Total Workouts</div>
            </div>
            <div className="ws-stat-card">
              <div className="ws-stat-value">{stats.completed}</div>
              <div className="ws-stat-label">Completed</div>
            </div>
            <div className="ws-stat-card">
              <div className="ws-stat-value">{stats.upcoming}</div>
              <div className="ws-stat-label">Upcoming</div>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="ws-filters">
            <div className="ws-search-box">
              <input
                type="text"
                className="ws-search-input"
                placeholder="Search workouts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="ws-filter-buttons">
              {["all", ...WORKOUT_TYPES.map(t => t.id)].map((type) => (
                <button
                  key={type}
                  className={`ws-filter-btn ${filterType === type ? "active" : ""}`}
                  onClick={() => setFilterType(type)}
                >
                  {type === "all" ? "All" : getTypeLabel(type)}
                </button>
              ))}
            </div>
          </div>

          {/* Add New Button */}
          <button className="ws-add-new-btn" onClick={handleAddNew}>
            <IconPlus />
            <span>Add Workout Schedule</span>
          </button>

          {/* Add/Edit Form */}
          {isAddingNew && (
            <div className="ws-form-modal">
              <div className="ws-form-card">
                <h2 className="ws-form-title">
                  {editingId ? "Edit Workout Schedule" : "Add New Workout Schedule"}
                </h2>

                <div className="ws-form-group">
                  <label className="ws-label">Workout Title *</label>
                  <input
                    type="text"
                    className="ws-input"
                    placeholder="e.g., Chest & Triceps"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  />
                </div>

                <div className="ws-form-row">
                  <div className="ws-form-group">
                    <label className="ws-label">Type</label>
                    <select
                      className="ws-select"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      {WORKOUT_TYPES.map(t => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="ws-form-group">
                    <label className="ws-label">Duration (mins)</label>
                    <input
                      type="number"
                      className="ws-input"
                      placeholder="60"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    />
                  </div>
                </div>

                <div className="ws-form-row">
                  <div className="ws-form-group">
                    <label className="ws-label">Date</label>
                    <input
                      type="date"
                      className="ws-input"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    />
                  </div>
                  <div className="ws-form-group">
                    <label className="ws-label">Time</label>
                    <input
                      type="time"
                      className="ws-input"
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    />
                  </div>
                </div>

                <div className="ws-form-group">
                  <label className="ws-label">Notes</label>
                  <textarea
                    className="ws-textarea"
                    placeholder="Add any notes or instructions..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows="3"
                  />
                </div>

                <div className="ws-form-buttons">
                  <button className="ws-btn ws-btn--cancel" onClick={handleCancel}>Cancel</button>
                  <button className="ws-btn ws-btn--save" onClick={handleSave}>
                    {editingId ? "Update" : "Add Schedule"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Schedules List */}
          <div className="ws-schedules">
            {filtered.length === 0 ? (
              <div className="ws-empty-state">
                <div className="ws-empty-icon">📋</div>
                <p className="ws-empty-title">No workouts scheduled</p>
                <p className="ws-empty-desc">Create your first workout schedule to get started!</p>
              </div>
            ) : (
              filtered.map((schedule) => (
                <div key={schedule.id} className={`ws-schedule-card ${schedule.completed ? "completed" : ""}`}>
                  <div className="ws-schedule-left">
                    <button
                      className={`ws-checkbox ${schedule.completed ? "checked" : ""}`}
                      onClick={() => handleToggleComplete(schedule.id)}
                      title={schedule.completed ? "Mark as upcoming" : "Mark as completed"}
                    >
                      {schedule.completed && <IconCheck />}
                    </button>
                    <div className="ws-schedule-info">
                      <h3 className="ws-schedule-title">{schedule.title}</h3>
                      <div className="ws-schedule-meta">
                        <span
                          className="ws-schedule-type"
                          style={{ backgroundColor: `${getTypeColor(schedule.type)}22`, color: getTypeColor(schedule.type) }}
                        >
                          {getTypeLabel(schedule.type)}
                        </span>
                        <span className="ws-schedule-datetime">
                          {new Date(schedule.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {schedule.time}
                        </span>
                        <span className="ws-schedule-duration">{schedule.duration} min</span>
                      </div>
                      {schedule.notes && (
                        <p className="ws-schedule-notes">{schedule.notes}</p>
                      )}
                    </div>
                  </div>
                  <div className="ws-schedule-right">
                    <button
                      className="ws-icon-btn ws-edit-btn"
                      onClick={() => handleEdit(schedule)}
                      title="Edit"
                    >
                      <IconEdit />
                    </button>
                    <button
                      className="ws-icon-btn ws-delete-btn"
                      onClick={() => handleDelete(schedule.id)}
                      title="Delete"
                    >
                      <IconTrash />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* ═════════════════════════════════════════
          TOAST NOTIFICATION
      ═════════════════════════════════════════ */}
      {showToast && (
        <div className="ws-toast">
          <div className="ws-toast-content">
            <span className="ws-toast-icon">✓</span>
            <p className="ws-toast-message">{showToast}</p>
          </div>
        </div>
      )}
    </div>
  );
}
