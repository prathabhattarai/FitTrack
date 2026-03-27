import React, { useState, useMemo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./WorkoutVideos.css";
import { getMemberDisplayName, getMemberInitials } from "../../../utils/memberProfile";
import WorkoutCard from "./WorkoutCard";
import VideoModal from "./VideoModal";

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
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
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
const IconStar = () => (
  <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);
const IconClock = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
  </svg>
);
const IconEye = () => (
  <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconLogout = () => (
  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9"/>
  </svg>
);

// ─────────────────────────────────────────
// SAMPLE VIDEOS DATA
// ─────────────────────────────────────────
const SAMPLE_VIDEOS = [
  {
    id: 1,
    title: "Full Body Workout - 30 Minutes",
    description: "Complete full body workout routine that builds strength and endurance.",
    videoId: "UBMk30rjy0o",
    category: "Full Body",
    difficulty: "Beginner",
    duration: 30,
    targetArea: "Full Body",
    trainer: "Mike Johnson",
    rating: 4.8,
    views: 1250
  },
  {
    id: 2,
    title: "HIIT Cardio Blast - 20 Minutes",
    description: "High-intensity interval training to boost cardiovascular fitness and burn maximum calories.",
    videoId: "50kH47ZztHs",
    category: "Cardio",
    difficulty: "Intermediate",
    duration: 20,
    targetArea: "Cardio",
    trainer: "Sarah Chen",
    rating: 4.9,
    views: 2100
  },
  {
    id: 3,
    title: "Chest & Triceps Workout",
    description: "Focused upper body workout targeting chest and triceps with effective strength-building exercises.",
    videoId: "gC_L9qAHVJ8",
    category: "Strength Training",
    difficulty: "Intermediate",
    duration: 45,
    targetArea: "Chest & Triceps",
    trainer: "Mike Johnson",
    rating: 4.7,
    views: 1850
  },
  {
    id: 4,
    title: "Back & Biceps Strength",
    description: "Build a strong back and biceps with this comprehensive workout routine.",
    videoId: "VHyGqsPOUHs",
    category: "Strength Training",
    difficulty: "Intermediate",
    duration: 40,
    targetArea: "Back & Biceps",
    trainer: "David Kumar",
    rating: 4.8,
    views: 1720
  },
  {
    id: 5,
    title: "Legs & Glutes - Lower Body",
    description: "Complete lower body workout focusing on legs and glutes to build strength and shape.",
    videoId: "3p8EBPVZ2Iw",
    category: "Strength Training",
    difficulty: "Intermediate",
    duration: 50,
    targetArea: "Legs & Glutes",
    trainer: "Emma Wilson",
    rating: 5.0,
    views: 2340
  },
  {
    id: 6,
    title: "Core & Abs Workout",
    description: "Targeted core and abdominal exercises to strengthen your midsection and improve stability.",
    videoId: "ml6cT4AZdqI",
    category: "Core Training",
    difficulty: "Beginner",
    duration: 20,
    targetArea: "Core & Abs",
    trainer: "Sarah Chen",
    rating: 4.6,
    views: 1500
  },
  {
    id: 7,
    title: "Yoga for Flexibility",
    description: "Gentle yoga session designed to improve flexibility, reduce stress, and increase mobility.",
    videoId: "v7AYKMP6rOE",
    category: "Yoga",
    difficulty: "Beginner",
    duration: 35,
    targetArea: "Full Body",
    trainer: "Priya Sharma",
    rating: 4.9,
    views: 980
  },
  {
    id: 8,
    title: "Pilates Core Strength",
    description: "Pilates-based exercises focusing on core strength, stability, and proper alignment.",
    videoId: "Mvo2snJGhtM",
    category: "Pilates",
    difficulty: "Intermediate",
    duration: 30,
    targetArea: "Core",
    trainer: "Alex Rodriguez",
    rating: 4.7,
    views: 1100
  },
  {
    id: 9,
    title: "Morning Stretch Routine",
    description: "Gentle stretching routine to start your day energized and improve range of motion.",
    videoId: "L_xrDAtykMI",
    category: "Stretching",
    difficulty: "Beginner",
    duration: 15,
    targetArea: "Full Body",
    trainer: "Emma Wilson",
    rating: 4.5,
    views: 850
  },
  {
    id: 10,
    title: "Advanced HIIT Challenge",
    description: "High-intensity workout for advanced athletes. Expect intense intervals and maximum calorie burn.",
    videoId: "ixkQaZXVQjs",
    category: "Cardio",
    difficulty: "Advanced",
    duration: 25,
    targetArea: "Cardio",
    trainer: "Mike Johnson",
    rating: 4.9,
    views: 1650
  },
  {
    id: 11,
    title: "Shoulder & Arms Workout",
    description: "Targeted shoulder and arm exercises to build definition and increase upper body strength.",
    videoId: "kL_NJAkCQBg",
    category: "Strength Training",
    difficulty: "Intermediate",
    duration: 35,
    targetArea: "Shoulders & Arms",
    trainer: "David Kumar",
    rating: 4.8,
    views: 1320
  },
  {
    id: 12,
    title: "Cool Down Stretching",
    description: "Post-workout stretching routine to aid recovery and reduce muscle soreness.",
    videoId: "inpok4MKVLM",
    category: "Stretching",
    difficulty: "Beginner",
    duration: 10,
    targetArea: "Full Body",
    trainer: "Priya Sharma",
    rating: 4.7,
    views: 920
  }
];

// ─────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────
export default function WorkoutVideos() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterDifficulty, setFilterDifficulty] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [showToast, setShowToast] = useState(null);

  const memberName = getMemberDisplayName();
  const memberInitials = getMemberInitials(memberName);

  const workouts = useMemo(
    () =>
      SAMPLE_VIDEOS.map((v) => ({
        ...v,
        videoId: v.videoId || v.youtubeId,
        level: v.level || v.difficulty,
        target: v.target || v.targetArea,
        duration: typeof v.duration === "number" ? `${v.duration}m` : v.duration,
      })),
    []
  );

  // Get unique categories from videos
  const categories = useMemo(() => {
    const cats = [...new Set(workouts.map(v => v.category))];
    return cats;
  }, [workouts]);

  // Filter videos
  const filteredVideos = useMemo(() => {
    return workouts.filter(video => {
      const matchCategory = filterCategory === "all" || video.category === filterCategory;
      const matchDifficulty = filterDifficulty === "all" || video.level === filterDifficulty;
      const matchSearch = video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         video.target.toLowerCase().includes(searchTerm.toLowerCase());
      return matchCategory && matchDifficulty && matchSearch;
    });
  }, [workouts, filterCategory, filterDifficulty, searchTerm]);

  const showNotification = (message) => {
    setShowToast(message);
    setTimeout(() => setShowToast(null), 3000);
  };

  const handleNotificationClick = () => {
    showNotification("You're all caught up! 🎉");
  };

  const handleVideoSelect = (video) => {
    setSelectedWorkout(video);
    showNotification(`Now playing: ${video.title}`);
  };

  const handleCloseModal = () => {
    setSelectedWorkout(null);
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
    <div className="wv-root">
      {/* ═════════════════════════════════════════
          SIDEBAR
      ═════════════════════════════════════════ */}
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

      {/* ═════════════════════════════════════════
          MAIN CONTENT
      ═════════════════════════════════════════ */}
      <main className="wv-main">
        {/* Topbar */}
        <header className="wv-topbar">
          <div className="wv-topbar__left">
            <h1 className="wv-topbar__title">Workout Videos</h1>
            <p className="wv-topbar__subtitle">Learn and follow along with expert-led workout tutorials</p>
          </div>
          <div className="wv-topbar__right">
            <button className="wv-topbar__bell" onClick={handleNotificationClick}>
              <IconBell />
              <span className="wv-topbar__bell-dot"></span>
            </button>
            <div className="ft-profile" onClick={() => navigate("/member/profile")}>
              <div className="ft-profile__avatar">{memberInitials}</div>
              <span className="ft-profile__name">{memberName}</span>
              <div className="ft-profile__globe">🌐</div>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="wv-content">
          {/* Search & Filters */}
          <div className="wv-search-section">
            <div className="wv-search-box">
              <input
                type="text"
                className="wv-search-input"
                placeholder="Search by workout name, target area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="wv-filters">
              <div className="wv-filter-group">
                <label className="wv-filter-label">Category</label>
                <select
                  className="wv-filter-select"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="wv-filter-group">
                <label className="wv-filter-label">Difficulty</label>
                <select
                  className="wv-filter-select"
                  value={filterDifficulty}
                  onChange={(e) => setFilterDifficulty(e.target.value)}
                >
                  <option value="all">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* Videos Grid */}
          {filteredVideos.length === 0 ? (
            <div className="wv-empty-state">
              <div className="wv-empty-icon">🎬</div>
              <p className="wv-empty-title">No videos found</p>
              <p className="wv-empty-desc">Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <div className="wv-grid">
              {filteredVideos.map((video) => (
                <WorkoutCard
                  key={video.id}
                  workout={video}
                  onSelect={handleVideoSelect}
                  IconEye={IconEye}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ═════════════════════════════════════════
          VIDEO PLAYER MODAL
      ═════════════════════════════════════════ */}
      <VideoModal workout={selectedWorkout} onClose={handleCloseModal} />

      {/* ═════════════════════════════════════════
          TOAST NOTIFICATION
      ═════════════════════════════════════════ */}
      {showToast && (
        <div className="wv-toast">
          <div className="wv-toast-content">
            <span className="wv-toast-icon">✓</span>
            <p className="wv-toast-message">{showToast}</p>
          </div>
        </div>
      )}
    </div>
  );
}
