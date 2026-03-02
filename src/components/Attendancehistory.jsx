import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./AttendanceReport.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const navItems = [
  { label: "Dashboard",        route: "/admin/dashboard", icon: "grid"  },
  { label: "Manage Members",   route: "/members",         icon: "users" },
  { label: "Membership Plans", route: "/membershipplan",  icon: "card"  },
  { label: "Trainers",         route: "/trainer",         icon: "user"  },
  { label: "Attendance",       route: "/attendance",      icon: "list"  },
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
const IconPrint = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="6 9 6 2 18 2 18 9"/>
    <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/>
    <rect x="6" y="14" width="12" height="8"/>
  </svg>
);
const IconDownload = () => (
  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
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
const IconBell = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);

const navIcons = { grid: <IconGrid />, users: <IconUsers />, card: <IconCard />, user: <IconUser />, list: <IconList /> };

function getInitials(name) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

const initialData = [
  { id: 1, name: "John Doe",      date: "2026-02-10", checkIn: "08:00 AM", checkOut: "10:00 AM", status: "Present", plan: "Premium"  },
  { id: 2, name: "Emma Watson",   date: "2026-02-10", checkIn: "09:15 AM", checkOut: "11:00 AM", status: "Present", plan: "Standard" },
  { id: 3, name: "Michael Smith", date: "2026-02-10", checkIn: "—",        checkOut: "—",        status: "Absent",  plan: "Basic"    },
  { id: 4, name: "Sophia Lee",    date: "2026-02-10", checkIn: "07:45 AM", checkOut: "09:30 AM", status: "Present", plan: "Premium"  },
  { id: 5, name: "James Carter",  date: "2026-02-10", checkIn: "06:50 AM", checkOut: "08:40 AM", status: "Present", plan: "Premium"  },
  { id: 6, name: "Olivia Brown",  date: "2026-02-10", checkIn: "—",        checkOut: "—",        status: "Absent",  plan: "Standard" },
  { id: 7, name: "Liam Johnson",  date: "2026-02-10", checkIn: "10:00 AM", checkOut: "12:00 PM", status: "Present", plan: "Basic"    },
  { id: 8, name: "Ava Martinez",  date: "2026-02-10", checkIn: "08:30 AM", checkOut: "10:15 AM", status: "Present", plan: "Standard" },
];

export default function AttendanceReport() {
  const navigate = useNavigate();
  const location = useLocation();

  const [search,       setSearch] = useState("");
  const [filterStatus, setFilter] = useState("All");

  const isActive = (route) => location.pathname === route;

  const filtered = useMemo(() => {
    return initialData.filter((m) => {
      const matchSearch = m.name.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "All" || m.status === filterStatus;
      return matchSearch && matchStatus;
    });
  }, [search, filterStatus]);

  const total   = initialData.length;
  const present = initialData.filter((m) => m.status === "Present").length;
  const absent  = initialData.filter((m) => m.status === "Absent").length;
  const rate    = Math.round((present / total) * 100);

  const handleDownloadPDF = () => {
    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();

    doc.setFillColor(17, 17, 20); doc.rect(0, 0, pageW, 28, "F");
    doc.setFillColor(232, 48, 42); doc.rect(0, 0, 4, 28, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.setTextColor(240, 239, 244);
    doc.text("FitTrack", 12, 12);
    doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(107, 107, 120);
    doc.text("GYM MANAGEMENT SYSTEM", 12, 19);
    doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(232, 48, 42);
    doc.text("ATTENDANCE REPORT", pageW - 12, 12, { align: "right" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(107, 107, 120);
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    doc.text(`Generated: ${today}`, pageW - 12, 19, { align: "right" });
    doc.setDrawColor(232, 48, 42); doc.setLineWidth(0.4); doc.line(12, 30, pageW - 12, 30);

    const stats = [
      { label: "TOTAL MEMBERS", value: String(total),   color: [78, 110, 242] },
      { label: "PRESENT TODAY", value: String(present), color: [62, 207, 110] },
      { label: "ABSENT TODAY",  value: String(absent),  color: [232, 48, 42]  },
      { label: "ATTENDANCE RATE", value: `${rate}%`,    color: [240, 165, 0]  },
    ];
    const boxW = (pageW - 24 - 9) / 4;
    stats.forEach((s, i) => {
      const x = 12 + i * (boxW + 3);
      doc.setFillColor(24, 24, 28); doc.roundedRect(x, 34, boxW, 18, 2, 2, "F");
      doc.setFillColor(...s.color); doc.roundedRect(x, 34, boxW, 2, 1, 1, "F");
      doc.setFont("helvetica", "normal"); doc.setFontSize(6.5); doc.setTextColor(107, 107, 120);
      doc.text(s.label, x + boxW / 2, 40, { align: "center" });
      doc.setFont("helvetica", "bold"); doc.setFontSize(14); doc.setTextColor(...s.color);
      doc.text(s.value, x + boxW / 2, 48, { align: "center" });
    });
    doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(107, 107, 120);
    doc.text("DAILY ATTENDANCE LOG", 12, 60);

    const rows = filtered.map((m) => [
      `#${String(m.id).padStart(3, "0")}`, m.name, m.plan, m.date,
      m.checkIn, m.checkOut, m.status === "Absent" ? "—" : "2h 00m", m.status,
    ]);
    autoTable(doc, {
      startY: 63,
      head: [["ID", "Member Name", "Plan", "Date", "Check In", "Check Out", "Duration", "Status"]],
      body: rows,
      margin: { left: 12, right: 12 },
      styles: { font: "helvetica", fontSize: 9, cellPadding: 4, fillColor: [17,17,20], textColor: [146,146,160], lineColor: [32,32,38], lineWidth: 0.3 },
      headStyles: { fillColor: [24,24,28], textColor: [107,107,120], fontStyle: "bold", fontSize: 7.5, cellPadding: { top:5, bottom:5, left:4, right:4 } },
      alternateRowStyles: { fillColor: [20,20,24] },
      columnStyles: { 0: { textColor: [107,107,120], fontStyle: "bold" }, 1: { textColor: [240,239,244], fontStyle: "bold" }, 7: { halign: "center" } },
      didParseCell(data) {
        if (data.column.index === 7 && data.section === "body") {
          if (data.cell.raw === "Present") { data.cell.styles.textColor = [62,207,110]; data.cell.styles.fontStyle = "bold"; }
          else if (data.cell.raw === "Absent") { data.cell.styles.textColor = [232,48,42]; data.cell.styles.fontStyle = "bold"; }
        }
        if (data.column.index === 2 && data.section === "body") {
          if (data.cell.raw === "Premium")  data.cell.styles.textColor = [240,165,0];
          if (data.cell.raw === "Standard") data.cell.styles.textColor = [78,110,242];
        }
      },
    });
    const finalY = doc.lastAutoTable.finalY + 6;
    doc.setFont("helvetica", "normal"); doc.setFontSize(7); doc.setTextColor(75, 75, 85);
    doc.text(`FitTrack Gym Management System  ·  Confidential  ·  ${today}`, pageW / 2, finalY, { align: "center" });
    doc.setDrawColor(50, 50, 58); doc.setLineWidth(0.3); doc.line(12, finalY - 3, pageW - 12, finalY - 3);
    doc.save(`fittrack-attendance-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="at-root">

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className="at-sidebar">
        <div className="at-sidebar__brand">
          <div className="at-sidebar__brand-icon"><IconDumbbell /></div>
          <div className="at-sidebar__brand-name">FitTrack</div>
        </div>

        <div className="at-sidebar__label">Navigation</div>

        <ul className="at-sidebar__menu">
          {navItems.map((item) => (
            <li key={item.route} className={isActive(item.route) ? "active" : ""} onClick={() => navigate(item.route)}>
              <span className="at-sidebar__icon">{navIcons[item.icon]}</span>
              {item.label}
              {isActive(item.route) && <span className="at-sidebar__dot" />}
            </li>
          ))}
        </ul>

        <div className="at-sidebar__bottom">
          <ul className="at-sidebar__menu">
            <li onClick={() => navigate("/settings")}>
              <span className="at-sidebar__icon"><IconSettings /></span>Settings
            </li>
            <li onClick={() => navigate("/login")}>
              <span className="at-sidebar__icon"><IconLogout /></span>Logout
            </li>
          </ul>
        </div>
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <div className="at-main">

        {/* TOPBAR */}
        <div className="at-topbar">
          <div className="at-topbar__search">
            <IconSearch />
            <input type="text" placeholder="Search gym resources…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="at-topbar__right">
            <div className="at-topbar__notif">
              <IconBell />
              <span className="at-topbar__notif-dot" />
            </div>
            <div className="at-topbar__profile">
              <div className="at-topbar__avatar">AD</div>
              <div className="at-topbar__profile-info">
                <div className="at-topbar__profile-name">Admin Staff</div>
                <div className="at-topbar__profile-role">FitTrack Admin</div>
              </div>
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="at-content">

          {/* PAGE HEADER */}
          <div className="at-page-header">
            <div className="at-page-header__left">
              <div className="at-page-header__eyebrow"><span className="at-page-header__dot" />Attendance Management</div>
              <h1 className="at-page-header__title">Attendance Report</h1>
              <p className="at-page-header__sub">Daily attendance tracking — Feb 10, 2026</p>
            </div>
            <div className="at-page-header__actions">
              <button className="at-btn at-btn--outline" onClick={() => window.print()}><IconPrint /> Print Report</button>
              <button className="at-btn at-btn--primary" onClick={handleDownloadPDF}><IconDownload /> Download PDF</button>
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="at-stats">
            <div className="at-stat">
              <div className="at-stat__top">
                <div className="at-stat__icon at-stat__icon--blue">
                  <IconUsers />
                </div>
                <span className="at-badge at-badge--blue">100%</span>
              </div>
              <div className="at-stat__value">{total}</div>
              <div className="at-stat__label">Total Members</div>
              <div className="at-stat__bar"><div className="at-stat__fill" style={{ width: "100%", background: "#4e6ef2" }} /></div>
            </div>
            <div className="at-stat">
              <div className="at-stat__top">
                <div className="at-stat__icon at-stat__icon--green">
                  <IconUser />
                </div>
                <span className="at-badge at-badge--green">↑ {rate}%</span>
              </div>
              <div className="at-stat__value">{present}</div>
              <div className="at-stat__label">Present Today</div>
              <div className="at-stat__bar"><div className="at-stat__fill" style={{ width: `${rate}%`, background: "#3ecf6e" }} /></div>
            </div>
            <div className="at-stat">
              <div className="at-stat__top">
                <div className="at-stat__icon at-stat__icon--red">
                  <IconList />
                </div>
                <span className="at-badge at-badge--red">↓ {100 - rate}%</span>
              </div>
              <div className="at-stat__value at-stat__value--danger">{absent}</div>
              <div className="at-stat__label">Absent Today</div>
              <div className="at-stat__bar"><div className="at-stat__fill" style={{ width: `${100 - rate}%`, background: "#e8302a" }} /></div>
            </div>
            <div className="at-stat">
              <div className="at-stat__top">
                <div className="at-stat__icon at-stat__icon--gold">
                  <IconClock />
                </div>
                <span className="at-badge at-badge--gold">Rate</span>
              </div>
              <div className="at-stat__value at-stat__value--gold">{rate}%</div>
              <div className="at-stat__label">Attendance Rate</div>
              <div className="at-stat__bar"><div className="at-stat__fill" style={{ width: `${rate}%`, background: "#f0a500" }} /></div>
            </div>
          </div>

          {/* TABLE CARD */}
          <div className="at-table-card">
            <div className="at-table-header">
              <div className="at-table-header__left">
                <div className="at-table-header__title">Daily Log</div>
                <div className="at-table-header__sub">Showing <strong>{filtered.length}</strong> of <strong>{total}</strong> records</div>
              </div>
              <div className="at-table-header__controls">
                <div className="at-filter-search">
                  <IconSearch />
                  <input placeholder="Search member…" value={search} onChange={(e) => setSearch(e.target.value)} />
                </div>
                <div className="at-filter-pills">
                  {["All", "Present", "Absent"].map((f) => (
                    <button key={f} className={`at-pill ${filterStatus === f ? "active" : ""}`} onClick={() => setFilter(f)}>{f}</button>
                  ))}
                </div>
              </div>
            </div>

            <div className="at-table-wrap">
              <table className="at-table">
                <thead>
                  <tr>
                    <th>ID</th><th>Member</th><th>Plan</th><th>Date</th>
                    <th>Check In</th><th>Check Out</th><th>Duration</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan="8" className="at-empty">No records found.</td></tr>
                  ) : (
                    filtered.map((m) => {
                      const duration = m.status === "Absent" ? "—" : "2h 00m";
                      return (
                        <tr key={m.id} className="at-row">
                          <td><span className="at-id">#{String(m.id).padStart(3, "0")}</span></td>
                          <td>
                            <div className="at-member-cell">
                              <div className="at-avatar">{getInitials(m.name)}</div>
                              <div>
                                <div className="at-member-name">{m.name}</div>
                              </div>
                            </div>
                          </td>
                          <td><span className={`at-plan at-plan--${m.plan.toLowerCase()}`}>{m.plan}</span></td>
                          <td className="at-date">{m.date}</td>
                          <td className="at-time">{m.checkIn !== "—" && <IconClock />}{m.checkIn}</td>
                          <td className="at-time">{m.checkOut !== "—" && <IconClock />}{m.checkOut}</td>
                          <td className="at-duration">{duration}</td>
                          <td>
                            <span className={`at-status at-status--${m.status.toLowerCase()}`}>
                              <span className="at-status__dot" />{m.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            <div className="at-table-footer">
              <span>{filtered.length} result{filtered.length !== 1 ? "s" : ""} displayed</span>
              <span>© {new Date().getFullYear()} FitTrack · System Status: <span className="at-table-footer__ok">Operational</span></span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}