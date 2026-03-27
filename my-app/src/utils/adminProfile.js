const ADMIN_PROFILE_KEY = "fittrack.admin.profile";

const DEFAULT_ADMIN_PROFILE = {
  name: "Admin Staff",
  email: "admin@fittrack.com",
  role: "admin",
  phone: "",
  address: "",
  department: "Management",
  avatar_url: "",
};

export function getAdminProfile() {
  if (typeof window === "undefined") return { ...DEFAULT_ADMIN_PROFILE };

  try {
    const raw = localStorage.getItem(ADMIN_PROFILE_KEY);
    if (!raw) return { ...DEFAULT_ADMIN_PROFILE };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_ADMIN_PROFILE,
      ...parsed,
      name: String(parsed?.name || DEFAULT_ADMIN_PROFILE.name).trim() || DEFAULT_ADMIN_PROFILE.name,
      email: String(parsed?.email || DEFAULT_ADMIN_PROFILE.email).trim() || DEFAULT_ADMIN_PROFILE.email,
    };
  } catch {
    return { ...DEFAULT_ADMIN_PROFILE };
  }
}

export function setAdminProfile(profile) {
  if (typeof window === "undefined" || !profile) return;
  const next = {
    ...getAdminProfile(),
    ...profile,
    name: String(profile?.name || "").trim() || getAdminProfile().name,
    email: String(profile?.email || "").trim() || getAdminProfile().email,
  };
  localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(next));
}

export function getAdminDisplayName() {
  return getAdminProfile().name;
}

export function getAdminInitials(name) {
  const safeName = String(name || getAdminDisplayName()).trim();
  const parts = safeName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AD";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
