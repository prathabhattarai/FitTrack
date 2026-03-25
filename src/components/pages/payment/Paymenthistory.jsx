import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Paymenthistory.css";

// ─────────────────────────────────────────
// NAV CONFIG
// ─────────────────────────────────────────
const navItems = [
  { label: "Dashboard",          route: "/member/dashboard",  icon: "grid"     },
  { label: "My Membership",      route: "/member/membership", icon: "card"     },
  { label: "Payment History",    route: "/member/payments",   icon: "payment"  },
  { label: "Attendance History", route: "/member/attendance", icon: "list"     },
  { label: "Book Trainer",       route: "/member/trainer",    icon: "dumbbell" },
  { label: "Profile",            route: "/member/profile",    icon: "user"     },
];

// ─────────────────────────────────────────
// MOCK DATA — 18 transactions across 3 pages
// ─────────────────────────────────────────
const ALL_TRANSACTIONS = [
  { id: "PAY-9281", amount: 120.00, date: "Oct 12, 2023", method: "visa",    last4: "4242", status: "Paid"    },
  { id: "PAY-8752", amount: 120.00, date: "Sep 12, 2023", method: "visa",    last4: "4242", status: "Paid"    },
  { id: "PAY-8120", amount:  45.00, date: "Aug 25, 2023", method: "apple",   last4: null,   status: "Paid"    },
  { id: "PAY-7641", amount: 120.00, date: "Aug 12, 2023", method: "visa",    last4: "4242", status: "Paid"    },
  { id: "PAY-7109", amount: 120.00, date: "Jul 12, 2023", method: "master",  last4: "5555", status: "Paid"    },
  { id: "PAY-6582", amount:  15.00, date: "Jun 30, 2023", method: "wallet",  last4: null,   status: "Paid"    },
  { id: "PAY-6201", amount: 120.00, date: "Jun 12, 2023", method: "visa",    last4: "4242", status: "Paid"    },
  { id: "PAY-5844", amount: 120.00, date: "May 12, 2023", method: "master",  last4: "5555", status: "Paid"    },
  { id: "PAY-5490", amount:  30.00, date: "Apr 30, 2023", method: "apple",   last4: null,   status: "Paid"    },
  { id: "PAY-5112", amount: 120.00, date: "Apr 12, 2023", method: "visa",    last4: "4242", status: "Paid"    },
  { id: "PAY-4803", amount: 120.00, date: "Mar 12, 2023", method: "visa",    last4: "4242", status: "Paid"    },
  { id: "PAY-4401", amount:  60.00, date: "Feb 28, 2023", method: "wallet",  last4: null,   status: "Paid"    },
  { id: "PAY-4100", amount: 120.00, date: "Feb 12, 2023", method: "master",  last4: "5555", status: "Paid"    },
  { id: "PAY-3750", amount: 120.00, date: "Jan 31, 2023", method: "visa",    last4: "4242", status: "Refunded"},
  { id: "PAY-3401", amount: 120.00, date: "Jan 12, 2023", method: "visa",    last4: "4242", status: "Paid"    },
  { id: "PAY-3050", amount:  45.00, date: "Dec 25, 2022", method: "apple",   last4: null,   status: "Paid"    },
  { id: "PAY-2700", amount: 120.00, date: "Dec 12, 2022", method: "master",  last4: "5555", status: "Paid"    },
  { id: "PAY-2310", amount: 120.00, date: "Nov 12, 2022", method: "visa",    last4: "4242", status: "Pending" },
];

const ROWS_PER_PAGE = 6;

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
    <polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);
const IconBell = () => (
  <svg width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 01-3.46 0"/>
  </svg>
);
const IconDollar = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
  </svg>
);
const IconCalendar = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconCreditCard = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
  </svg>
);
const IconSearch = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
);
const IconFilter = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
);
const IconDownload = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IconVisa = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>
  </svg>
);
const IconApple = () => (
  <svg width="13" height="13" fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
  </svg>
);
const IconWallet = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M20 12V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2h13a2 2 0 002-2v-4"/>
    <circle cx="17" cy="12" r="1"/>
  </svg>
);
const IconSupport = () => (
  <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="9" y1="13" x2="15" y2="13"/>
    <line x1="9" y1="17" x2="12" y2="17"/>
  </svg>
);
const IconChevronLeft = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const IconChevronRight = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="9 18 15 12 9 6"/>
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

// ─────────────────────────────────────────
// METHOD DISPLAY
// ─────────────────────────────────────────
function MethodCell({ method, last4 }) {
  if (method === "visa")   return <span className="ph-method"><IconVisa />&nbsp; Visa •••• {last4}</span>;
  if (method === "master") return <span className="ph-method"><IconVisa />&nbsp; Mastercard •••• {last4}</span>;
  if (method === "apple")  return <span className="ph-method"><IconApple />&nbsp; Apple Pay</span>;
  if (method === "wallet") return <span className="ph-method"><IconWallet />&nbsp; Wallet Balance</span>;
  return <span className="ph-method">—</span>;
}

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
export default function PaymentHistory() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [search, setSearch]   = useState("");
  const [filter, setFilter]   = useState("All");
  const [page, setPage]       = useState(1);
  const [showFilter, setShowFilter] = useState(false);
  const [downloading, setDownloading] = useState(null);
  const [showSupportToast, setShowSupportToast] = useState(false);

  const isActive = (route) => location.pathname === route;

  // Filter + search
  const filtered = useMemo(() => {
    return ALL_TRANSACTIONS.filter((t) => {
      const matchSearch =
        t.id.toLowerCase().includes(search.toLowerCase()) ||
        t.date.toLowerCase().includes(search.toLowerCase()) ||
        t.amount.toString().includes(search);
      const matchFilter = filter === "All" || t.status === filter;
      return matchSearch && matchFilter;
    });
  }, [search, filter]);

  const totalPages = Math.ceil(filtered.length / ROWS_PER_PAGE);
  const paginated  = filtered.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE);

  const totalPaid = ALL_TRANSACTIONS
    .filter((t) => t.status === "Paid")
    .reduce((s, t) => s + t.amount, 0);

  // Simulate receipt download
  const handleDownload = (id) => {
    setDownloading(id);
    setTimeout(() => {
      setDownloading(null);
      // Create a fake receipt blob
      const text = `FITTRACK RECEIPT\n${"─".repeat(30)}\nTransaction: ${id}\nStatus: Paid\nFitTrack Gym Automation\n© 2026`;
      const blob = new Blob([text], { type: "text/plain" });
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `${id}-receipt.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }, 800);
  };

  const handleSupportContact = () => {
    setShowSupportToast(true);
    setTimeout(() => setShowSupportToast(false), 3000);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleFilterChange = (val) => {
    setFilter(val);
    setPage(1);
    setShowFilter(false);
  };

  return (
    <div className="ph-root">

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className="md-sidebar">
        <div className="md-sidebar__brand">
          <div className="md-sidebar__brand-icon"><IconDumbbellBrand /></div>
          <div className="md-sidebar__brand-name">FitTrack</div>
        </div>

        <div className="md-sidebar__label">Navigation</div>

        <ul className="md-sidebar__menu">
          {navItems.map((item) => (
            <li
              key={item.route}
              className={isActive(item.route) ? "active" : ""}
              onClick={() => navigate(item.route)}
            >
              <span className="md-sidebar__icon">{navIcons[item.icon]}</span>
              {item.label}
              {isActive(item.route) && <span className="md-sidebar__dot" />}
            </li>
          ))}
        </ul>

        <div className="md-sidebar__bottom">
          <ul className="md-sidebar__menu">
            <li onClick={() => navigate("/login")}>
              <span className="md-sidebar__icon"><IconLogout /></span>
              Logout
            </li>
          </ul>
        </div>
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <main className="ph-main">

        {/* TOPBAR */}
        <header className="md-topbar">
          <div className="md-topbar__title">Payment History</div>
          <div className="md-topbar__right">
            <button className="md-notif">
              <IconBell />
              <span className="md-notif__dot" />
            </button>
            <div className="md-profile">
              <div className="md-profile__avatar">AT</div>
              <span className="md-profile__name">Alex Thompson</span>
              <div className="md-profile__globe">🌐</div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="ph-content">

          {/* PAGE HEADER */}
          <div className="ph-page-header">
            <h1 className="ph-page-title">Financial Overview</h1>
            <p className="ph-page-sub">Manage your subscription payments and download invoices.</p>
          </div>

          {/* SUMMARY CARDS */}
          <div className="ph-summary">

            <div className="ph-summary-card ph-summary-card--brand">
              <div className="ph-summary-card__body">
                <div className="ph-summary-card__label">TOTAL PAID</div>
                <div className="ph-summary-card__value">${totalPaid.toLocaleString("en-US", { minimumFractionDigits: 2 })}</div>
                <div className="ph-summary-card__note">Since joining in Jan 2023</div>
              </div>
              <div className="ph-summary-card__icon ph-summary-card__icon--brand">
                <IconDollar />
              </div>
            </div>

            <div className="ph-summary-card">
              <div className="ph-summary-card__body">
                <div className="ph-summary-card__label">LAST PAYMENT</div>
                <div className="ph-summary-card__value">$120.00</div>
                <div className="ph-summary-card__note">Processed on Oct 12, 2023</div>
              </div>
              <div className="ph-summary-card__icon">
                <IconCalendar />
              </div>
            </div>

            <div className="ph-summary-card">
              <div className="ph-summary-card__body">
                <div className="ph-summary-card__label">NEXT PAYMENT</div>
                <div className="ph-summary-card__value">$120.00</div>
                <div className="ph-summary-card__note">Due on Nov 12, 2023</div>
              </div>
              <div className="ph-summary-card__icon">
                <IconCreditCard />
              </div>
            </div>

          </div>

          {/* TRANSACTION LEDGER */}
          <div className="ph-ledger">

            <div className="ph-ledger__header">
              <div>
                <div className="ph-ledger__title">Transaction Ledger</div>
                <div className="ph-ledger__sub">A complete list of all charges applied to your account.</div>
              </div>
              <div className="ph-ledger__controls">
                <div className="ph-search">
                  <IconSearch />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={search}
                    onChange={handleSearchChange}
                  />
                </div>
                <div className="ph-filter-wrap">
                  <button
                    className={`ph-filter-btn ${showFilter ? "ph-filter-btn--open" : ""}`}
                    onClick={() => setShowFilter((v) => !v)}
                    title="Filter by status"
                  >
                    <IconFilter />
                    {filter !== "All" && <span className="ph-filter-badge" />}
                  </button>
                  {showFilter && (
                    <div className="ph-filter-dropdown">
                      {["All", "Paid", "Pending", "Refunded"].map((f) => (
                        <button
                          key={f}
                          className={`ph-filter-option ${filter === f ? "ph-filter-option--active" : ""}`}
                          onClick={() => handleFilterChange(f)}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* TABLE */}
            <div className="ph-table-wrap">
              <table className="ph-table">
                <thead>
                  <tr>
                    <th>Payment ID</th>
                    <th>Amount</th>
                    <th>Date</th>
                    <th>Method</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="ph-table__empty">No transactions found.</td>
                    </tr>
                  ) : (
                    paginated.map((t) => (
                      <tr key={t.id} className="ph-table__row">
                        <td className="ph-table__id">{t.id}</td>
                        <td className="ph-table__amount">${t.amount.toFixed(2)}</td>
                        <td className="ph-table__date">{t.date}</td>
                        <td><MethodCell method={t.method} last4={t.last4} /></td>
                        <td>
                          <span className={`ph-status ph-status--${t.status.toLowerCase()}`}>
                            {t.status}
                          </span>
                        </td>
                        <td>
                          <button
                            className={`ph-receipt-btn ${downloading === t.id ? "ph-receipt-btn--loading" : ""}`}
                            onClick={() => handleDownload(t.id)}
                            disabled={downloading === t.id}
                            title="Download receipt"
                          >
                            {downloading === t.id ? (
                              <span className="ph-spinner" />
                            ) : (
                              <><IconDownload />&nbsp; Receipt</>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* PAGINATION */}
            <div className="ph-pagination">
              <span className="ph-pagination__info">
                Showing {filtered.length === 0 ? 0 : (page - 1) * ROWS_PER_PAGE + 1} to{" "}
                {Math.min(page * ROWS_PER_PAGE, filtered.length)} of {filtered.length} transactions
              </span>
              <div className="ph-pagination__pages">
                <button
                  className="ph-page-btn ph-page-btn--nav"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <IconChevronLeft /> Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`ph-page-btn ${page === p ? "ph-page-btn--active" : ""}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="ph-page-btn ph-page-btn--nav"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages || totalPages === 0}
                >
                  Next <IconChevronRight />
                </button>
              </div>
            </div>

          </div>

          {/* SUPPORT BANNER */}
          <div className="ph-support">
            <div className="ph-support__icon"><IconSupport /></div>
            <div className="ph-support__text">
              <div className="ph-support__title">Missing a payment?</div>
              <div className="ph-support__sub">
                If you don't see a recent transaction or need a custom tax invoice,<br />
                please contact our billing department.
              </div>
            </div>
            <button className="ph-support__btn" onClick={handleSupportContact}>
              Contact Billing Support
            </button>
          </div>

        </div>{/* /ph-content */}

        {/* FOOTER */}
        <footer className="md-footer">
          <span>© 2026 FitPanel Gym Automation. All rights reserved.</span>
        </footer>

      </main>

      {/* TOAST */}
      {showSupportToast && (
        <div className="ph-toast">
          ✓ Support request sent! We'll get back to you within 24 hours.
        </div>
      )}

    </div>
  );
}