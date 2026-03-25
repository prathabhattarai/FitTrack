import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaKey, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./Login.css";

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [formData, setFormData] = useState({ otp: "", newPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.otp.length !== 6 || formData.newPassword.length < 6) {
      setAlert({ type: "error", message: "Invalid OTP or password less than 6 characters." });
      return;
    }

    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: formData.otp, newPassword: formData.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Reset failed.");

      setAlert({ type: "success", message: "✓ Password reset successfully! Redirecting to login..." });
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setAlert({ type: "error", message: err.message || "Failed to reset password." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container" style={{ maxWidth: '500px' }}>
        <div className="form-side" style={{ borderRadius: '20px' }}>
          <div className="form-inner">
            <div className="form-header">
              <h2 className="form-title">Reset Password</h2>
              <p className="form-subtitle">Enter your OTP and new password</p>
            </div>

            {alert.message && (
              <div className={`login-alert ${alert.type}`}>{alert.message}</div>
            )}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <div className="input-icon-wrap">
                  <FaKey className="input-icon" />
                  <input 
                    type="text" 
                    name="otp"
                    className="form-input" 
                    placeholder="6-digit OTP" 
                    value={formData.otp} 
                    onChange={handleChange}
                    maxLength={6}
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-icon-wrap">
                  <FaLock className="input-icon" />
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="newPassword" 
                    className="form-input" 
                    placeholder="New Password" 
                    value={formData.newPassword} 
                    onChange={handleChange} 
                  />
                  <button type="button" className="toggle-password" onClick={() => setShowPassword((p) => !p)}>
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button type="submit" className="btn-login-submit" disabled={loading}>
                {loading && <span className="btn-spinner" />}
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
