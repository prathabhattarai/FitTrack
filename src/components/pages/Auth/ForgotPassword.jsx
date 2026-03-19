import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope } from "react-icons/fa";
import "./Login.css";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: "", message: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setAlert({ type: "error", message: "Please enter a valid email address." });
      return;
    }

    setLoading(true);
    setAlert({ type: "", message: "" });

    try {
      const res = await fetch("http://localhost:5000/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to request code.");

      setAlert({ type: "success", message: "✓ Secret Code sent. Redirecting to reset page..." });
      setTimeout(() => {
        navigate("/reset-password", { state: { email } });
      }, 1500);
    } catch (err) {
      setAlert({ type: "error", message: err.message || "Something went wrong." });
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
              <h2 className="form-title">Forgot Password</h2>
              <p className="form-subtitle">Enter your email to receive an OTP</p>
            </div>

            {alert.message && (
              <div className={`login-alert ${alert.type}`}>{alert.message}</div>
            )}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <div className="input-icon-wrap">
                  <FaEnvelope className="input-icon" />
                  <input 
                    type="email" 
                    className="form-input" 
                    placeholder="Registered E-mail" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                  />
                </div>
              </div>

              <button type="submit" className="btn-login-submit" disabled={loading}>
                {loading && <span className="btn-spinner" />}
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
            
            <p className="register-prompt" style={{marginTop: '20px'}}>
              Remembered your password?{" "}
              <button type="button" className="register-link" onClick={() => navigate("/login")}>Login</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
