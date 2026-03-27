import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaShieldAlt, FaKey } from "react-icons/fa";
import "./Login.css";

export default function VerifyAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setAlert({ type: "error", message: "Please enter a valid 6-digit OTP." });
      return;
    }

    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const res = await fetch("http://localhost:5000/api/auth/verify-account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Verification failed");

      setAlert({ type: "success", message: "✓ Account verified successfully! Redirecting to login..." });
      
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      setAlert({ type: "error", message: err.message || "Verification failed. Please try again." });
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
              <h2 className="form-title">Verify Account</h2>
              <p className="form-subtitle">
                {email ? `OTP sent to ${email}` : "Enter your email and OTP"}
              </p>
            </div>

            {alert.message && (
              <div className={`login-alert ${alert.type}`}>{alert.message}</div>
            )}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              
              {!email && (
                 <div className="form-group">
                   <div className="input-icon-wrap">
                     <FaShieldAlt className="input-icon" />
                     <input type="email" className="form-input" placeholder="Email" value={email} disabled />
                   </div>
                 </div>
              )}

              <div className="form-group">
                <div className="input-icon-wrap">
                  <FaKey className="input-icon" />
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="Enter 6-digit OTP" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength={6}
                  />
                </div>
              </div>

              <button type="submit" className="btn-login-submit" disabled={loading}>
                {loading && <span className="btn-spinner" />}
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
