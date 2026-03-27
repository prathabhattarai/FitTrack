const MEMBER_NAME_KEY = "fittrack.member.fullName";
const MEMBER_PROFILE_KEY = "fittrack.member.profile";
const DEFAULT_MEMBER_NAME = "Alex Thompson";

export function getMemberDisplayName() {
  const stored = typeof window !== "undefined" ? localStorage.getItem(MEMBER_NAME_KEY) : null;
  const value = (stored || "").trim();
  return value || DEFAULT_MEMBER_NAME;
}

export function setMemberDisplayName(name) {
  if (typeof window === "undefined") return;
  const value = (name || "").trim();
  if (!value) return;
  localStorage.setItem(MEMBER_NAME_KEY, value);
}

export function getMemberInitials(name) {
  const safeName = (name || DEFAULT_MEMBER_NAME).trim();
  const parts = safeName.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "AT";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}

export function getMemberProfile() {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(MEMBER_PROFILE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : null;
  } catch {
    return null;
  }
}

export function setMemberProfile(profile) {
  if (typeof window === "undefined") return;
  if (!profile || typeof profile !== "object") return;
  localStorage.setItem(MEMBER_PROFILE_KEY, JSON.stringify(profile));
  if (profile.fullName) {
    setMemberDisplayName(profile.fullName);
  }
}
