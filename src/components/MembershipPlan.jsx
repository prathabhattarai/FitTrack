import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./MembershipPlan.css";

const navItems = [
  { label: "Dashboard",        route: "/admin/dashboard", icon: "grid"  },
  { label: "Manage Members",   route: "/members",         icon: "users" },
  { label: "Membership Plans", route: "/membershipplan",  icon: "card"  },
  { label: "Trainers",         route: "/trainer",         icon: "user"  },
  { label: "Attendance",       route: "/attendance",      icon: "list"  },
];

/* ── Icons ─────────────────────────────────────────────────── */
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
const IconPlan = () => (
  <svg width="22" height="22" fill="none" stroke="#fff" strokeWidth="2.2" viewBox="0 0 24 24">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <path d="M2 10h20M6 15h4"/>
  </svg>
);
const IconSave = () => (
  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/>
    <polyline points="17 21 17 13 7 13 7 21"/>
    <polyline points="7 3 7 8 15 8"/>
  </svg>
);
const IconTrashSm = () => (
  <svg width="11" height="11" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <polyline points="3 6 5 6 21 6"/>
    <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
    <path d="M10 11v6M14 11v6"/>
  </svg>
);
const IconBack = () => (
  <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

const navIcons = {
  grid:  <IconGrid />,
  users: <IconUsers />,
  card:  <IconCard />,
  user:  <IconUser />,
  list:  <IconList />,
};

const DEFAULT_FEATURES = ["24/7 Gym Access", "Sauna Access", "Group Classes", "Personal Training"];
const CATEGORY_PILLS   = ["Starter", "Popular", "Elite", "Custom"];
const MAX_DESC         = 160;

export default function MembershipPlan({ onClose, onSave }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [billing,     setBilling]     = useState("Monthly");
  const [planName,    setPlanName]    = useState("");
  const [price,       setPrice]       = useState("");
  const [category,    setCategory]    = useState("");
  const [description, setDescription] = useState("");
  const [features,    setFeatures]    = useState([...DEFAULT_FEATURES]);
  const [adding,      setAdding]      = useState(false);
  const [newFeat,     setNewFeat]     = useState("");
  const [errors,      setErrors]      = useState({});
  const [toast,       setToast]       = useState({ msg: "", show: false });

  const isActive = (route) => location.pathname === route;

  const showToast = (msg) => {
    setToast({ msg, show: true });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 2800);
  };

  const validate = () => {
    const e = {};
    if (!planName.trim())                       e.planName = "Plan name is required.";
    if (!price || isNaN(+price) || +price <= 0) e.price    = "Enter a valid price.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const confirmFeature = () => {
    if (newFeat.trim()) { setFeatures(f => [...f, newFeat.trim()]); showToast("Feature added!"); }
    setNewFeat(""); setAdding(false);
  };
  const removeFeature = (i) => setFeatures(f => f.filter((_, idx) => idx !== i));

  const discard = () => {
    setPlanName(""); setPrice(""); setCategory(""); setDescription("");
    setBilling("Monthly"); setFeatures([...DEFAULT_FEATURES]);
    setErrors({}); setAdding(false); setNewFeat("");
    showToast("Changes discarded.");
  };

  const save = () => {
    if (!validate()) return;
    const data = { planName, price: +price, billing, category, description, features };
    showToast("✓ Membership plan saved!");
    if (onSave) setTimeout(() => onSave(data), 900);
  };

  const previewName  = planName.trim() || "Plan Name";
  const previewPrice = price ? `$${price}` : "—";

  return (
    <>
      <div className="mp-root">

        {/* ════════════════ SIDEBAR — mirrors AdminDashboard exactly ════════════════ */}
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
              <li onClick={() => showToast("Settings coming soon.")}>
                <span className="ft-sidebar__icon"><IconSettings /></span>
                Settings
              </li>
              <li onClick={() => navigate("/login")}>
                <span className="ft-sidebar__icon"><IconLogout /></span>
                Logout
              </li>
            </ul>
          </div>

        </aside>
        {/* ════════════════════════════════════════════════════════════════════════ */}

        <div className="mp-main">
          <div className="mp-page">
            <div className="mp-shell">

              <div className="mp-header">
                <div className="mp-header__left">
                  <div className="mp-header__icon"><IconPlan /></div>
                  <div>
                    <div className="mp-header__title">Create New Membership Plan</div>
                    <div className="mp-header__sub">Configure your new offering for the FitTrack community.</div>
                  </div>
                </div>
                <button className="mp-close" onClick={onClose || discard}>✕</button>
              </div>

              <div className="mp-preview">
                <div className="mp-preview__info">
                  <div className="mp-preview__label">Live Preview</div>
                  <div className="mp-preview__name">{previewName}</div>
                </div>
                {category && <div className="mp-preview__tag">{category}</div>}
                <div className="mp-preview__right">
                  <div className="mp-preview__price">{previewPrice}</div>
                  <div className="mp-preview__billing">/ {billing}</div>
                </div>
              </div>

              <div className="mp-body">

                <div className="mp-row">
                  <div className="mp-field">
                    <label className="mp-label">Plan Name <span className="mp-required">*</span></label>
                    <input
                      className={`mp-input ${errors.planName ? "mp-input--error" : ""}`}
                      placeholder="e.g. Gold Elite"
                      value={planName}
                      onChange={e => { setPlanName(e.target.value); setErrors(v => ({ ...v, planName: "" })); }}
                    />
                    {errors.planName && <div className="mp-error">{errors.planName}</div>}
                  </div>
                  <div className="mp-field">
                    <label className="mp-label">Price <span className="mp-required">*</span></label>
                    <div className="mp-price-wrap">
                      <span className="mp-price-prefix">$</span>
                      <input
                        className={`mp-input ${errors.price ? "mp-input--error" : ""}`}
                        type="number" min="0" placeholder="0.00" value={price}
                        onChange={e => { setPrice(e.target.value); setErrors(v => ({ ...v, price: "" })); }}
                      />
                    </div>
                    {errors.price && <div className="mp-error">{errors.price}</div>}
                  </div>
                </div>

                <div className="mp-row">
                  <div className="mp-field">
                    <label className="mp-label">Billing Cycle</label>
                    <div className="mp-billing">
                      {["Monthly", "Quarterly", "Yearly"].map(b => (
                        <button key={b} className={`mp-billing-btn ${billing === b ? "active" : ""}`} onClick={() => setBilling(b)}>{b}</button>
                      ))}
                    </div>
                  </div>
                  <div className="mp-field">
                    <label className="mp-label">Category</label>
                    <div className="mp-cat-pills">
                      {CATEGORY_PILLS.map(c => (
                        <button key={c} className={`mp-cat-pill ${category === c ? "active" : ""}`} onClick={() => setCategory(prev => prev === c ? "" : c)}>{c}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mp-field">
                  <label className="mp-label">Description</label>
                  <textarea
                    className="mp-textarea"
                    placeholder="Briefly describe what makes this plan special..."
                    maxLength={MAX_DESC}
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                  <div className="mp-char-counter">{description.length} / {MAX_DESC}</div>
                </div>

                <div className="mp-field">
                  <label className="mp-label">Included Features</label>
                  <div className="mp-features-grid">
                    {features.map((f, i) => (
                      <div key={i} className="mp-feat" style={{ animationDelay: `${i * 0.04}s` }}>
                        <div className="mp-feat__check">✓</div>
                        <span className="mp-feat__text">{f}</span>
                        <button className="mp-feat__remove" onClick={() => removeFeature(i)} title="Remove"><IconTrashSm /></button>
                      </div>
                    ))}
                    {adding ? (
                      <div className="mp-feat-input-row">
                        <input
                          className="mp-input"
                          autoFocus
                          placeholder="e.g. Pool Access"
                          value={newFeat}
                          onChange={e => setNewFeat(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === "Enter") confirmFeature();
                            if (e.key === "Escape") { setAdding(false); setNewFeat(""); }
                          }}
                        />
                        <button className="mp-feat-confirm" onClick={confirmFeature}>Add</button>
                        <button className="mp-feat-cancel" onClick={() => { setAdding(false); setNewFeat(""); }}>✕</button>
                      </div>
                    ) : (
                      <div className="mp-feat-add" onClick={() => setAdding(true)}>
                        <span className="mp-feat-add-icon">+</span>Add Feature
                      </div>
                    )}
                  </div>
                </div>

              </div>

              <hr className="mp-divider" />

              <div className="mp-footer">
                <button className="mp-discard" onClick={discard}><IconBack /> Discard Changes</button>
                <div className="mp-footer__right">
                  <button className="mp-btn-cancel" onClick={onClose || discard}>Cancel</button>
                  <button className="mp-btn-save" onClick={save}><IconSave /> Save Membership Plan</button>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>

      <div className={`mp-toast ${toast.show ? "show" : ""}`}>
        <div className="mp-toast__dot" />
        {toast.msg}
      </div>
    </>
  );
}