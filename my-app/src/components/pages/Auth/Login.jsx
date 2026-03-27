// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaDumbbell,
  FaEye,
  FaEyeSlash,
  FaEnvelope,
  FaLock,
  FaUserShield,
} from "react-icons/fa";
import "./Login.css";
import { setMemberDisplayName } from "../../../utils/memberProfile";
import { setAdminProfile } from "../../../utils/adminProfile";

// onClose         → closes the modal
// onSwitchToRegister → opens register modal instead (when used as modal)
export default function GymLogin({ onClose, onSwitchToRegister, closeBtn }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "Member",
    remember: false,
  });
  const [errors,       setErrors]       = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [alert,        setAlert]        = useState({ type: "", message: "" });

  const validate = (field, value) => {
    if (field === "email") {
      if (!value.trim()) return "Email is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
    }
    if (field === "password") {
      if (!value)          return "Password is required.";
      if (value.length < 6) return "Password must be at least 6 characters.";
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
    if (name !== "remember" && name !== "role") {
      setErrors((prev) => ({ ...prev, [name]: validate(name, val) }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {
      email:    validate("email",    formData.email),
      password: validate("password", formData.password),
    };
    setErrors(newErrors);
    if (newErrors.email || newErrors.password) return;

    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 403) {
           setAlert({ type: "error", message: data.message });
           setTimeout(() => {
             if (onClose) onClose();
             navigate("/verify-account", { state: { email: formData.email } });
           }, 2000);
           setLoading(false);
           return;
        }
        throw new Error(data.message || "Login failed");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Store profile data in localStorage for profile page
      if (data.user.role === "member" || String(formData.role).toLowerCase() === "member") {
        localStorage.setItem("fittrack.member.profile", JSON.stringify({
          fullName: data.user.name,
          email: data.user.email,
          memberId: data.user.id ? `FP-${String(data.user.id).padStart(5, "0")}` : "--",
        }));
      }

      const backendName = String(data?.user?.name || "").trim();
      const storedMemberName =
        typeof window !== "undefined"
          ? String(localStorage.getItem("fittrack.member.fullName") || "").trim()
          : "";
      const isDemoFallbackName = backendName === "Member Demo" || backendName === "Admin Demo";
      const resolvedMemberName = isDemoFallbackName ? storedMemberName : backendName;
      if (resolvedMemberName) {
        setMemberDisplayName(resolvedMemberName);
      }

      if (data?.user?.role === "admin") {
        setAdminProfile({
          id: data?.user?.id,
          name: backendName || "Admin Staff",
          email: data?.user?.email || "admin@fittrack.com",
          role: "admin",
        });
      }

      setAlert({ type: "success", message: `✓ Welcome back! Redirecting to your dashboard...` });

      setTimeout(() => {
        const destination = data.user.role === "admin" ? "/admin/dashboard" : "/member/dashboard";
        if (onClose) onClose();
        navigate(destination);
      }, 1000);

    } catch (err) {
      setAlert({ type: "error", message: err.message || "Invalid credentials. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // "Create" button — switch to register modal if available, else navigate
  const goToRegister = () => {
    if (onSwitchToRegister) {
      onSwitchToRegister();
    } else {
      if (onClose) onClose();
      navigate("/register");
    }
  };

  const inputClass = (field) => {
    if (errors[field])                      return "form-input input-error";
    if (formData[field] && !errors[field])  return "form-input input-success";
    return "form-input";
  };

  return (
    // <Navigation/>
    <div className="login-page">
      {closeBtn}
      <div className="login-container">

        {/* ── FORM SIDE ── */}
        <div className="form-side">
          <div className="form-inner">
            <div className="form-header">
              <h2 className="form-title">Hello!</h2>
              <p className="form-subtitle">Sign in to your account</p>
            </div>

            {alert.message && (
              <div className={`login-alert ${alert.type}`}>{alert.message}</div>
            )}

            <form className="login-form" onSubmit={handleSubmit} noValidate>

              <div className="form-group">
                <div className="input-icon-wrap">
                  <FaUserShield className="input-icon" />
                  <select name="role" className="form-input" value={formData.role} onChange={handleChange}>
                    <option value="Member">Member</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <div className="input-icon-wrap">
                  <FaEnvelope className="input-icon" />
                  <input type="email" name="email" className={inputClass("email")} placeholder="E-mail" value={formData.email} onChange={handleChange} onBlur={handleBlur} autoComplete="email" />
                </div>
                {errors.email && <span className="field-error-msg">{errors.email}</span>}
              </div>

              <div className="form-group">
                <div className="input-icon-wrap">
                  <FaLock className="input-icon" />
                  <input type={showPassword ? "text" : "password"} name="password" className={inputClass("password")} placeholder="Password" value={formData.password} onChange={handleChange} onBlur={handleBlur} autoComplete="current-password" />
                  <button type="button" className="toggle-password" onClick={() => setShowPassword((p) => !p)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
                {errors.password && <span className="field-error-msg">{errors.password}</span>}
              </div>

              <div className="form-options">
                <label className="remember-label">
                  <input type="checkbox" name="remember" checked={formData.remember} onChange={handleChange} />
                  Remember me
                </label>
                <button type="button" className="forgot-link" onClick={() => navigate("/forgot-password")}>
                  Forgot password?
                </button>
              </div>

              <button type="submit" className="btn-login-submit" disabled={loading}>
                {loading && <span className="btn-spinner" />}
                {loading ? "Signing in..." : "Sign In"}
              </button>
            </form>

            <div className="divider">
              <span className="divider-line" />
              <span className="divider-text">OR</span>
              <span className="divider-line" />
            </div>

            <p className="register-prompt">
              Don't have an account?{" "}
              <button type="button" className="register-link" onClick={goToRegister}>Create</button>
            </p>
          </div>
        </div>

        {/* ── WELCOME SIDE ── */}
        <div className="image-side">
          <div className="welcome-content">
            <div className="brand-logo">
              <FaDumbbell className="logo-icon" />
              <span className="brand-name">FitTrack</span>
            </div>
            <h1 className="welcome-title">Welcome<br /><span>Back!</span></h1>
            <p className="welcome-desc">
              Your all-in-one gym management platform. Track members, manage
              trainers, and grow your fitness business effortlessly.
            </p>
            <div className="welcome-stats">
              <div className="stat-item">
                <span className="stat-number">500+</span>
                <span className="stat-label">Gyms</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">50k+</span>
                <span className="stat-label">Members</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">99%</span>
                <span className="stat-label">Uptime</span>
              </div>
            </div>
          </div>
          <div className="dumbbell-watermark"><FaDumbbell /></div>
        </div>

      </div>
    </div>
  );
}