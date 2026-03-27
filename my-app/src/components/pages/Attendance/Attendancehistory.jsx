import React, { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Attendancehistory.css";
import { getMemberDisplayName, getMemberInitials } from "../../../utils/memberProfile";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts";

// ── Member nav items (correct member routes) ──────────────────────────────
const navItems = [
  { label: "Dashboard",        route: "/member/dashboard",   icon: "grid"     },
  { label: "My Membership",    route: "/member/membership",  icon: "card"     },
  { label: "Payment History",  route: "/member/payments",    icon: "payment"  },
  { label: "Attendance History", route: "/member/attendance", icon: "list"    },
  { label: "Workout Schedule",   route: "/member/schedule",   icon: "calendar" },
  { label: "Workout Videos",     route: "/member/videos",     icon: "play"     },
  { label: "BMI Calculator",   route: "/member/bmi",         icon: "bmi"      },
  { label: "Book Trainer",     route: "/member/trainer",     icon: "dumbbell" },
  { label: "Profile",          route: "/member/profile",     icon: "user"     },
];

// ── Icons ─────────────────────────────────────────────────────────────────
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
const IconCard = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
  </svg>
);
const IconDollar = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
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
const IconUser = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="7" r="4"/><path d="M5.5 21a6.5 6.5 0 0113 0"/>
  </svg>
);
const IconProfile = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
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
const IconFire = () => (
  <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 2C6.5 2 2 6.5 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10C22 6.5 17.5 2 12 2z" fill="rgba(232,100,20,0.3)" stroke="none"/>
    <path d="M12 22c3.5-3 6-6.5 6-10a6 6 0 00-12 0c0 3.5 2.5 7 6 10z" stroke="currentColor"/>
    <path d="M12 18c2-2 3-4 3-6a3 3 0 00-6 0c0 2 1 4 3 6z" fill="rgba(232,100,20,0.5)" stroke="none"/>
  </svg>
);
const IconClock = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
  </svg>
);
const IconDownload = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IconChevron = ({ dir = "down" }) => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"
    style={{ transform: dir === "up" ? "rotate(180deg)" : dir === "left" ? "rotate(90deg)" : dir === "right" ? "rotate(-90deg)" : "none" }}>
    <polyline points="6 9 12 15 18 9"/>
  </svg>
);
const IconFilter = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);

const navIcons = {
  grid: <IconGrid />,
  card: <IconCard />,
  payment: <IconDollar />,
  list: <IconList />,
  calendar: <IconCalendar />,
  play: <IconPlay />,
  bmi: <IconCard />,
  dumbbell: <IconDumbbell />,
  user: <IconUser />,
};

// ── Initial state will be replaced by API calls ──
const initialAttendanceData = [
  { id: 1, date: "2026-03-26", checkIn: "06:00 AM", checkOut: "07:30 AM", duration: "1h 30m", type: "strength", verified: true },
  { id: 2, date: "2026-03-25", checkIn: "05:45 AM", checkOut: "07:00 AM", duration: "1h 15m", type: "cardio", verified: true },
  { id: 3, date: "2026-03-24", checkIn: "06:15 AM", checkOut: "07:45 AM", duration: "1h 30m", type: "yoga", verified: true },
  { id: 4, date: "2026-03-23", checkIn: "06:30 AM", checkOut: "08:00 AM", duration: "1h 30m", type: "hiit", verified: true },
  { id: 5, date: "2026-03-22", checkIn: "05:50 AM", checkOut: "07:20 AM", duration: "1h 30m", type: "strength", verified: true },
  { id: 6, date: "2026-03-21", checkIn: "06:00 AM", checkOut: "07:30 AM", duration: "1h 30m", type: "pilates", verified: true },
];
const initialChartData = [
  { week: "W1", sessions: 2 },
  { week: "W2", sessions: 3 },
  { week: "W3", sessions: 1 },
];

const TYPES = ["All", "workout", "cardio", "yoga", "hiit", "pilates", "strength"];
const PERIODS = ["This Month", "Last Month", "Last 3 Months", "This Year"];
const PER_PAGE = 6;

const parseDate = (dateStr) => new Date(`${dateStr}T00:00:00`);

const formatDuration = (mins) => {
  if (!Number.isFinite(mins) || mins <= 0) return "0m";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

const durationToMinutes = (duration) => {
  const match = duration.match(/(\d+)h\s*(\d+)m/i);
  if (!match) return 0;
  return Number(match[1]) * 60 + Number(match[2]);
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="ah-tooltip">
        <div className="ah-tooltip__label">{label}</div>
        <div className="ah-tooltip__value">{payload[0].value} sessions</div>
      </div>
    );
  }
  return null;
};

export default function Attendancehistory() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const memberName = getMemberDisplayName();
  const memberInitials = getMemberInitials(memberName);

  const [typeFilter,    setTypeFilter]    = useState("All");
  const [period,        setPeriod]        = useState("This Month");
  const [page,          setPage]          = useState(1);
  const [attendanceData, setAttendanceData] = useState(initialAttendanceData);
  const [chartData, setChartData] = useState(initialChartData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeOpen,      setTypeOpen]      = useState(false);
  const [periodOpen,    setPeriodOpen]    = useState(false);

  const typeRef   = useRef(null);
  const periodRef = useRef(null);

  // close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (typeRef.current   && !typeRef.current.contains(e.target))   setTypeOpen(false);
      if (periodRef.current && !periodRef.current.contains(e.target)) setPeriodOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Fetch attendance data from API
  useEffect(() => {
    const fetchAttendanceData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem("token");
        
        if (!token) {
          setError("Not authenticated. Please login again.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:5000/api/attendance/history", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Attendance API Response:", data);
        
        let records = Array.isArray(data.data) ? data.data : [];
        console.log("Records count:", records.length);
        
        // Use sample data if no real records exist
        if (records.length === 0) {
          console.log("No attendance records found, using sample data for demonstration");
          records = initialAttendanceData;
        }
        
        // Transform API data to match component format
        const transformedRecords = records.map(record => {
          // Check if this is already in the correct format (sample data)
          if (record.checkIn && record.checkOut && record.duration) {
            return record;
          }
          
          // Otherwise transform API data
          const checkInDateTime = record.check_in_time ? new Date(record.check_in_time) : null;
          const recordDate = record.date || (checkInDateTime ? checkInDateTime.toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
          
          return {
            id: record.id || Math.random(),
            date: recordDate,
            checkIn: checkInDateTime ? checkInDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) : "N/A",
            checkOut: record.check_out_time ? record.check_out_time : "N/A",
            duration: record.duration || "0m",
            type: record.workoutType || "workout",
            verified: true,
          };
        });

        console.log("Transformed records:", transformedRecords);
        setAttendanceData(transformedRecords);

        // Calculate chart data by week
        const weekData = {};
        transformedRecords.forEach(record => {
          const date = new Date(record.date);
          const week = Math.ceil(date.getDate() / 7);
          const key = `W${week}`;
          weekData[key] = (weekData[key] || 0) + 1;
        });

        const chartDataFromRecords = Object.entries(weekData).map(([week, sessions]) => ({
          week,
          sessions,
        }));
        setChartData(chartDataFromRecords.length > 0 ? chartDataFromRecords : initialChartData);
        
      } catch (err) {
        console.error("Error fetching attendance:", err);
        setError(err.message || "Failed to load attendance data. Showing sample data.");
        // Use sample data on error
        setAttendanceData(initialAttendanceData);
        setChartData(initialChartData);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceData();
  }, []);

  const isActive = (route) => location.pathname === route;

  const filtered = useMemo(() => {
    const allDates = attendanceData.map((r) => parseDate(r.date));
    const refDate = allDates.length
      ? new Date(Math.max(...allDates.map((d) => d.getTime())))
      : new Date();

    const refYear = refDate.getFullYear();
    const refMonth = refDate.getMonth();
    const lastMonthDate = new Date(refYear, refMonth - 1, 1);
    const last3Start = new Date(refYear, refMonth - 2, 1);
    const thisMonthEnd = new Date(refYear, refMonth + 1, 0, 23, 59, 59, 999);

    const matchesPeriod = (d) => {
      if (period === "This Month") {
        return d.getFullYear() === refYear && d.getMonth() === refMonth;
      }
      if (period === "Last Month") {
        return d.getFullYear() === lastMonthDate.getFullYear() && d.getMonth() === lastMonthDate.getMonth();
      }
      if (period === "Last 3 Months") {
        return d >= last3Start && d <= thisMonthEnd;
      }
      if (period === "This Year") {
        return d.getFullYear() === refYear;
      }
      return true;
    };

    return attendanceData.filter((r) => {
      const byType = typeFilter === "All" || r.type === typeFilter;
      const byPeriod = matchesPeriod(parseDate(r.date));
      return byType && byPeriod;
    });
  }, [typeFilter, period]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paged = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalSessions = filtered.length;

  const avgDuration = useMemo(() => {
    if (!filtered.length) return "0m";
    const totalMins = filtered.reduce((sum, r) => sum + durationToMinutes(r.duration), 0);
    return formatDuration(Math.round(totalMins / filtered.length));
  }, [filtered]);

  const streak = useMemo(() => {
    if (!filtered.length) return 0;
    const uniqueDays = [...new Set(filtered.map((r) => r.date))]
      .map((d) => parseDate(d))
      .sort((a, b) => b - a);

    if (!uniqueDays.length) return 0;
    let count = 1;
    for (let i = 1; i < uniqueDays.length; i += 1) {
      const prev = uniqueDays[i - 1];
      const curr = uniqueDays[i];
      const dayDiff = Math.round((prev - curr) / (1000 * 60 * 60 * 24));
      if (dayDiff === 1) count += 1;
      else break;
    }
    return count;
  }, [filtered]);

  const handleExport = () => {
    if (!filtered.length) return;

    const header = ["Date", "Check In", "Check Out", "Duration", "Type", "Status"];
    const rows = filtered.map((r) => [
      r.date,
      r.checkIn,
      r.checkOut,
      r.duration,
      r.type,
      r.verified ? "Verified" : "Pending",
    ]);

    const escapeCell = (value) => `"${String(value).replace(/"/g, '""')}"`;
    const csv = [header, ...rows].map((row) => row.map(escapeCell).join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    const stamp = new Date().toISOString().slice(0, 10);
    anchor.href = url;
    anchor.download = `attendance-history-${typeFilter.toLowerCase()}-${stamp}.csv`;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="ah-root">

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className="ah-sidebar">
        <div className="ah-sidebar__brand">
          <div className="ah-sidebar__brand-icon"><IconDumbbell /></div>
          <div className="ah-sidebar__brand-name">FitTrack</div>
        </div>

        <div className="ah-sidebar__label">Navigation</div>

        <ul className="ah-sidebar__menu">
          {navItems.map((item) => (
            <li
              key={item.route}
              className={isActive(item.route) ? "active" : ""}
              onClick={() => navigate(item.route)}
            >
              <span className="ah-sidebar__icon">{navIcons[item.icon]}</span>
              {item.label}
              {isActive(item.route) && <span className="ah-sidebar__dot" />}
            </li>
          ))}
        </ul>

        <div className="ah-sidebar__bottom">
          <ul className="ah-sidebar__menu">
            <li onClick={() => navigate("/login")}>
              <span className="ah-sidebar__icon"><IconLogout /></span>Logout
            </li>
          </ul>
        </div>
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <div className="ah-main">

        {/* TOPBAR */}
        <div className="ah-topbar">
          <div className="ah-topbar__title">Attendance History</div>
          <div className="ah-topbar__right">
            <button className="ah-topbar__bell" type="button">
              <IconBell />
              <span className="ah-topbar__bell-dot" />
            </button>
            <div className="ft-profile" onClick={() => navigate("/member/profile")}>
              <div className="ft-profile__avatar">{memberInitials}</div>
              <span className="ft-profile__name">{memberName}</span>
              <div className="ft-profile__globe">🌐</div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="ah-content">

          {/* TOP ROW: stats + chart */}
          <div className="ah-top-row">

            {/* Stat cards */}
            <div className="ah-stats">

              {/* Streak card */}
              <div className="ah-stat-card ah-stat-card--streak">
                <div className="ah-streak-icon"><IconFire /></div>
                <div className="ah-stat-card__body">
                  <div className="ah-stat-card__label ah-stat-card__label--light">Current Streak</div>
                  <div className="ah-stat-card__value ah-stat-card__value--lg">{streak} days</div>
                  <div className="ah-stat-card__note ah-stat-card__note--brand">🔥 Keep it up!</div>
                </div>
              </div>

              {/* Total sessions */}
              <div className="ah-stat-card">
                <div className="ah-stat-card__body">
                  <div className="ah-stat-card__label">Total Sessions</div>
                  <div className="ah-stat-card__value">{totalSessions}</div>
                  <div className="ah-stat-card__note ah-stat-card__note--green">↑ This month</div>
                </div>
                <div className="ah-stat-card__icon"><IconList /></div>
              </div>

              {/* Avg duration */}
              <div className="ah-stat-card">
                <div className="ah-stat-card__body">
                  <div className="ah-stat-card__label">Avg Duration</div>
                  <div className="ah-stat-card__value">{avgDuration}</div>
                  <div className="ah-stat-card__note ah-stat-card__note--brand">Per session</div>
                </div>
                <div className="ah-stat-card__icon ah-stat-card__icon--clock"><IconClock /></div>
              </div>

            </div>

            {/* Chart */}
            <div className="ah-chart-card">
              <div className="ah-chart-card__header">
                <div>
                  <div className="ah-chart-card__title">Weekly Sessions</div>
                  <div className="ah-chart-card__sub">Sessions per week — Feb 2026</div>
                </div>
                <div className="ah-period-wrap" ref={periodRef}>
                  <button
                    className={`ah-period-btn${periodOpen ? " ah-period-btn--open" : ""}`}
                    onClick={() => setPeriodOpen((p) => !p)}
                  >
                    {period} <IconChevron dir={periodOpen ? "up" : "down"} />
                  </button>
                  {periodOpen && (
                    <div className="ah-period-dropdown">
                      {PERIODS.map((p) => (
                        <button
                          key={p}
                          className={`ah-period-option${period === p ? " ah-period-option--active" : ""}`}
                          onClick={() => { setPeriod(p); setPeriodOpen(false); setPage(1); }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <ResponsiveContainer width="100%" height={180}>
                <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="brandGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#e86414" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#e86414" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                  <XAxis dataKey="week" tick={{ fill: "#6b6b78", fontSize: 11, fontFamily: "Sora" }} axisLine={false} tickLine={false}/>
                  <YAxis tick={{ fill: "#6b6b78", fontSize: 11, fontFamily: "Sora" }} axisLine={false} tickLine={false} allowDecimals={false}/>
                  <Tooltip content={<CustomTooltip />}/>
                  <Area
                    type="monotone" dataKey="sessions"
                    stroke="#e86414" strokeWidth={2.5}
                    fill="url(#brandGrad)"
                    dot={{ fill: "#e86414", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6, fill: "#ff7a2e", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LOG CARD */}
          <div className="ah-log-card">
            <div className="ah-log-card__header">
              <div className="ah-log-card__title-row">
                <span className="ah-log-card__icon"><IconList /></span>
                <span className="ah-log-card__title">Attendance Log</span>
              </div>
              <div className="ah-log-card__actions">

                {/* Type filter */}
                <div className="ah-type-wrap" ref={typeRef}>
                  <button
                    className={`ah-type-btn${typeOpen ? " ah-type-btn--open" : ""}`}
                    onClick={() => setTypeOpen((o) => !o)}
                  >
                    <IconFilter />
                    {typeFilter === "All" ? "All Types" : typeFilter}
                    <span className="ah-type-badge" />
                    <IconChevron dir={typeOpen ? "up" : "down"} />
                  </button>
                  {typeOpen && (
                    <div className="ah-type-dropdown">
                      {TYPES.map((t) => (
                        <button
                          key={t}
                          className={`ah-type-option${typeFilter === t ? " ah-type-option--active" : ""}`}
                          onClick={() => { setTypeFilter(t); setTypeOpen(false); setPage(1); }}
                        >
                          {t === "All" ? "All Types" : t.charAt(0).toUpperCase() + t.slice(1)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Export */}
                <button className="ah-export-btn" onClick={handleExport}>
                  <IconDownload /> Export
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="ah-table-wrap">
              <table className="ah-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Date</th>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Duration</th>
                    <th>Type</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paged.length === 0 ? (
                    <tr><td colSpan="7" className="ah-table__empty">No records found.</td></tr>
                  ) : (
                    paged.map((r, i) => (
                      <tr key={r.id} className="ah-table__row">
                        <td style={{ color: "var(--muted)", fontWeight: 600, fontSize: 12 }}>
                          {String((page - 1) * PER_PAGE + i + 1).padStart(2, "0")}
                        </td>
                        <td className="ah-table__date">{r.date}</td>
                        <td>
                          <div className="ah-table__time">
                            <span className="ah-time-icon"><IconClock /></span>
                            {r.checkIn}
                          </div>
                        </td>
                        <td>
                          <div className="ah-table__time">
                            <span className="ah-time-icon"><IconClock /></span>
                            {r.checkOut}
                          </div>
                        </td>
                        <td className="ah-table__dur">{r.duration}</td>
                        <td>
                          <span className={`ah-type-tag ah-type-tag--${r.type}`}>
                            {r.type.charAt(0).toUpperCase() + r.type.slice(1)}
                          </span>
                        </td>
                        <td>
                          <span className="ah-status">
                            {r.verified ? "✓ Verified" : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="ah-pagination">
              <div className="ah-pagination__info">
                Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} records
              </div>
              <div className="ah-pagination__pages">
                <button
                  className="ah-page-btn ah-page-btn--nav"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <IconChevron dir="left" /> Prev
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    className={`ah-page-btn${page === n ? " ah-page-btn--active" : ""}`}
                    onClick={() => setPage(n)}
                  >
                    {n}
                  </button>
                ))}
                <button
                  className="ah-page-btn ah-page-btn--nav"
                  disabled={page === totalPages || totalPages === 0}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next <IconChevron dir="right" />
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* FOOTER */}
        <div className="ah-footer">
          © {new Date().getFullYear()} FitTrack · Attendance History · Member Portal
        </div>
      </div>
    </div>
  );
}