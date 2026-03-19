// src/components/Register.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaDumbbell, FaUser, FaEnvelope, FaPhone, FaLock,
  FaEye, FaEyeSlash, FaMapMarkerAlt, FaVenusMars,
  FaCalendarAlt, FaCreditCard, FaCheck, FaBolt, FaShieldAlt,
} from "react-icons/fa";
import "./Register.css";

// onClose        → closes the modal
// onSwitchToLogin → opens login modal instead (when used as modal)
export default function RegisterPage({ onClose, onSwitchToLogin, closeBtn }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", gender: "",
    dob: "", address: "", password: "", confirmPassword: "", plan: "",
  });
  const [errors,       setErrors]       = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm,  setShowConfirm]  = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [alert,        setAlert]        = useState({ type: "", message: "" });

  const validate = (field, value) => {
    switch (field) {
      case "fullName":
        if (!value.trim())           return "Full name is required.";
        if (value.trim().length < 2) return "Name must be at least 2 characters.";
        return "";
      case "email":
        if (!value.trim())           return "Email is required.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email.";
        return "";
     case "phone":
  if (!value.trim())           return "Phone number is required.";
  if (!/^\+?[\d\s-]{7,15}$/.test(value)) return "Enter a valid phone number.";
  return "";
      case "gender":
        if (!value)                  return "Please select a gender.";
        return "";
      case "dob":
        if (!value)                  return "Date of birth is required.";
        if (new Date(value) > new Date()) return "Date cannot be in the future.";
        return "";
      case "address":
        if (!value.trim())           return "Address is required.";
        return "";
      case "password":
        if (!value)                  return "Password is required.";
        if (value.length < 8)        return "Password must be at least 8 characters.";
        if (!/[A-Z]/.test(value))    return "Include at least one uppercase letter.";
        if (!/[0-9]/.test(value))    return "Include at least one number.";
        return "";
      case "confirmPassword":
        if (!value)                  return "Please confirm your password.";
        if (value !== formData.password) return "Passwords do not match.";
        return "";
      case "plan":
        if (!value)                  return "Please select a membership plan.";
        return "";
      default: return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const allErrors = {};
    Object.keys(formData).forEach((field) => {
      const err = validate(field, formData[field]);
      if (err) allErrors[field] = err;
    });
    setErrors(allErrors);
    if (Object.keys(allErrors).length > 0) {
      setAlert({ type: "error", message: "Please fix the errors above before submitting." });
      return;
    }

    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
          role: "member"
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setAlert({ type: "success", message: "✓ Account created! Redirecting to verification..." });

      setTimeout(() => {
        if (onClose) onClose();
        navigate("/verify-account", { state: { email: formData.email } });
      }, 1500);

    } catch (err) {
      setAlert({ type: "error", message: err.message || "Registration failed. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  // "Login" link — switch to login modal if available, else navigate
  const goToLogin = () => {
    if (onSwitchToLogin) {
      onSwitchToLogin();
    } else {
      if (onClose) onClose();
      navigate("/login");
    }
  };

  const inputClass = (field) => {
    if (errors[field])                        return "form-input input-error";
    if (formData[field] && !errors[field])    return "form-input input-success";
    return "form-input";
  };

  return (
    <div className="register-page">
      {closeBtn}
      <div className="register-container">

        {/* ── WELCOME SIDE ── */}
        <div className="welcome-side">
          <div className="welcome-content">
            <div className="brand-logo">
              <FaDumbbell className="logo-icon" />
              <span className="brand-name">FitTrack</span>
            </div>
            <h1 className="welcome-title">Join the<br /><span>Community!</span></h1>
            <p className="welcome-desc">
              Start your fitness journey today. Get access to world-class
              trainers, track your progress, and achieve your goals.
            </p>
            <div className="welcome-perks">
              <div className="perk-item">
                <div className="perk-icon"><FaBolt /></div>
                Instant access after registration
              </div>
              <div className="perk-item">
                <div className="perk-icon"><FaCheck /></div>
                Flexible membership plans
              </div>
              <div className="perk-item">
                <div className="perk-icon"><FaShieldAlt /></div>
                Secure & private data
              </div>
            </div>
          </div>
          <div className="dumbbell-watermark"><FaDumbbell /></div>
        </div>

        {/* ── FORM SIDE ── */}
        <div className="form-side">
          <div className="form-inner">
            <div className="form-header">
              <h2 className="form-title">Create Account</h2>
              <p className="form-subtitle">It's completely free to get started</p>
            </div>

            {alert.message && (
              <div className={`register-alert ${alert.type}`}>{alert.message}</div>
            )}

            <form className="register-form" onSubmit={handleSubmit} noValidate>

              {/* Full Name */}
              <div className="form-group">
                <div className="input-icon-wrap">
                  <FaUser className="input-icon" />
                  <input name="fullName" className={inputClass("fullName")} placeholder="Full Name" value={formData.fullName} onChange={handleChange} onBlur={handleBlur} autoComplete="name" />
                </div>
                {errors.fullName && <span className="field-error-msg">{errors.fullName}</span>}
              </div>

              {/* Email + Phone */}
              <div className="form-row">
                <div className="form-group">
                  <div className="input-icon-wrap">
                    <FaEnvelope className="input-icon" />
                    <input type="email" name="email" className={inputClass("email")} placeholder="Email" value={formData.email} onChange={handleChange} onBlur={handleBlur} autoComplete="email" />
                  </div>
                  {errors.email && <span className="field-error-msg">{errors.email}</span>}
                </div>
                <div className="form-group">
                  <div className="input-icon-wrap">
                    <FaPhone className="input-icon" />
                    <input type="tel" name="phone" className={inputClass("phone")} placeholder="Phone" value={formData.phone} onChange={handleChange} onBlur={handleBlur} autoComplete="tel" />
                  </div>
                  {errors.phone && <span className="field-error-msg">{errors.phone}</span>}
                </div>
              </div>

              {/* Gender + DOB */}
              <div className="form-row">
                <div className="form-group">
                  <div className="input-icon-wrap">
                    <FaVenusMars className="input-icon" />
                    <select name="gender" className={inputClass("gender")} value={formData.gender} onChange={handleChange} onBlur={handleBlur}>
                      <option value="">Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  {errors.gender && <span className="field-error-msg">{errors.gender}</span>}
                </div>
                <div className="form-group">
                  <div className="input-icon-wrap">
                    <FaCalendarAlt className="input-icon" />
                    <input type="date" name="dob" className={inputClass("dob")} value={formData.dob} onChange={handleChange} onBlur={handleBlur} />
                  </div>
                  {errors.dob && <span className="field-error-msg">{errors.dob}</span>}
                </div>
              </div>

              {/* Address */}
              <div className="form-group">
                <div className="input-icon-wrap">
                  <FaMapMarkerAlt className="input-icon" />
                  <input name="address" className={inputClass("address")} placeholder="Address" value={formData.address} onChange={handleChange} onBlur={handleBlur} autoComplete="street-address" />
                </div>
                {errors.address && <span className="field-error-msg">{errors.address}</span>}
              </div>

              {/* Password + Confirm */}
              <div className="form-row">
                <div className="form-group">
                  <div className="input-icon-wrap">
                    <FaLock className="input-icon" />
                    <input type={showPassword ? "text" : "password"} name="password" className={inputClass("password")} placeholder="Password" value={formData.password} onChange={handleChange} onBlur={handleBlur} autoComplete="new-password" />
                    <button type="button" className="toggle-password" onClick={() => setShowPassword((p) => !p)}>
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.password && <span className="field-error-msg">{errors.password}</span>}
                </div>
                <div className="form-group">
                  <div className="input-icon-wrap">
                    <FaLock className="input-icon" />
                    <input type={showConfirm ? "text" : "password"} name="confirmPassword" className={inputClass("confirmPassword")} placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange} onBlur={handleBlur} autoComplete="new-password" />
                    <button type="button" className="toggle-password" onClick={() => setShowConfirm((p) => !p)}>
                      {showConfirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  {errors.confirmPassword && <span className="field-error-msg">{errors.confirmPassword}</span>}
                </div>
              </div>

              {/* Plan */}
              <div className="form-group">
                <div className="input-icon-wrap">
                  <FaCreditCard className="input-icon" />
                  <select name="plan" className={inputClass("plan")} value={formData.plan} onChange={handleChange} onBlur={handleBlur}>
                    <option value="">Select Membership Plan</option>
                    <option value="Monthly">Monthly — $49/mo</option>
                    <option value="Quarterly">Quarterly — $99/3mo</option>
                    <option value="Yearly">Yearly — $199/yr</option>
                  </select>
                </div>
                {errors.plan && <span className="field-error-msg">{errors.plan}</span>}
              </div>

              <button type="submit" className="btn-register-submit" disabled={loading}>
                {loading && <span className="btn-spinner" />}
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </form>

            <p className="login-prompt">
              Already have an account?{" "}
              <button type="button" className="login-link" onClick={goToLogin}>Login</button>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}