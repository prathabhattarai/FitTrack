import "./LandingPage.css";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaUsers,
  FaUserCheck,
  FaQrcode,
  FaCreditCard,
  FaChartLine,
  FaShieldAlt,
  FaCheck,
  FaStar,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaTimes,
} from "react-icons/fa";
import { useState, useEffect, useRef } from "react";
import GymLogin from "../Auth/Login";
import RegisterPage from "../Auth/Register";

// Using a public placeholder gym image URL
const GymImg = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1000&h=600&fit=crop";

function LandingPage() {

  // ── MODAL STATE ─────────────────────────────────────────────────
  const [activeModal, setActiveModal] = useState(null);

  const openLogin    = () => setActiveModal("login");
  const openRegister = () => setActiveModal("register");
  const closeModal   = () => setActiveModal(null);
  // ────────────────────────────────────────────────────────────────

  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState({ name: "", email: "", message: "" });
  const [formStatus, setFormStatus] = useState({ type: "", text: "" });
  const [fadeOut, setFadeOut] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);

  const validateField = (name, value) => {
    if (name === "name") {
      if (!value.trim()) return "Full name is required.";
      if (value.trim().length < 2) return "Name must be at least 2 characters.";
      return "";
    }
    if (name === "email") {
      if (!value.trim()) return "Email address is required.";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address.";
      return "";
    }
    if (name === "message") {
      if (!value.trim()) return "Message is required.";
      if (value.trim().length < 10) return "Message must be at least 10 characters.";
      return "";
    }
    return "";
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleFormBlur = (e) => {
    const { name, value } = e.target;
    setFieldErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const showMessage = (type, text) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setFadeOut(false);
    setFormStatus({ type, text });
    timerRef.current = setTimeout(() => {
      setFadeOut(true);
      timerRef.current = setTimeout(() => {
        setFormStatus({ type: "", text: "" });
        setFadeOut(false);
      }, 400);
    }, 1200);
  };

  const handleFormSubmit = () => {
    const errors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      message: validateField("message", formData.message),
    };
    setFieldErrors(errors);
    if (errors.name || errors.email || errors.message) {
      showMessage("error", "Please fix the errors above before sending.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      showMessage("success", "✓ Redirecting to WhatsApp...");
      
      // Create WhatsApp message with form data
      const whatsappMessage = `*New Inquiry from FitTrack*\n\nName: ${formData.name}\nEmail: ${formData.email}\n\nMessage: ${formData.message}`;
      const whatsappNumber = "9800956956"; // WhatsApp Number
      const encodedMessage = encodeURIComponent(whatsappMessage);
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
      
      // Reset form
      setFormData({ name: "", email: "", message: "" });
      setFieldErrors({ name: "", email: "", message: "" });
      
      // Redirect to WhatsApp after 1.5 seconds
      setTimeout(() => {
        window.open(whatsappURL, "_blank");
      }, 1500);
    }, 800);
  };

  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScrollTop = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", handleScrollTop);
    return () => window.removeEventListener("scroll", handleScrollTop);
  }, []);

  // Lock body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = activeModal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [activeModal]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleScroll = (id) => {
    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const elements = document.querySelectorAll(".animate-fade-up");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="app">

      {/* ── MODAL OVERLAY ── */}
      {activeModal && (
        <div
          className="login-modal-overlay"
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
        >
          <div className="login-modal-box">
            <div className="modal-content-switcher">
              {activeModal === "login" && (
                <GymLogin
                  onClose={closeModal}
                  onSwitchToRegister={openRegister}
                  closeBtn={
                    <button className="login-modal-close" onClick={closeModal} aria-label="Close">
                      <FaTimes />
                    </button>
                  }
                />
              )}
              {activeModal === "register" && (
                <RegisterPage
                  onClose={closeModal}
                  onSwitchToLogin={openLogin}
                  closeBtn={
                    <button className="login-modal-close" onClick={closeModal} aria-label="Close">
                      <FaTimes />
                    </button>
                  }
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="logo" onClick={() => handleScroll("home")}>
          <span className="logo-text">FitTrack</span>
        </div>
        <ul className="navbar-links">
          <li onClick={() => handleScroll("home")}>Home</li>
          <li onClick={() => handleScroll("features")}>Features</li>
          <li onClick={() => handleScroll("pricing")}>Plans</li>
          <li onClick={() => handleScroll("testimonials")}>Reviews</li>
          <li onClick={() => handleScroll("contact")}>Contact</li>
        </ul>
        <div className="navbar-right">
          <button className="btn-login" onClick={openLogin}>Login</button>
          <button className="btn-register" onClick={openRegister}>Register</button>
        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="hero-dark">
        <div className="hero-bg">
          <img src={GymImg} alt="Gym Background" className="hero-bg-img" />
          <div className="hero-bg-overlay" />
        </div>
        <div className="hero-container">
          <h1 className="hero-title animate-fade-up">
            Transform Your Gym.<br />Empower Your Members.
          </h1>
          <p className="hero-description animate-fade-up delay-1">
            Streamline operations, boost member engagement, and grow your
            fitness business with FitTrack's all-in-one automation system.
          </p>
          <div className="hero-buttons-dark animate-fade-up delay-2">
            <button className="btn-join" onClick={openRegister}>Join Now</button>
            <button className="btn-login-dark" onClick={openLogin}>Login</button>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="features-wrapper">
        <h2 className="features-title animate-fade-up">
          Streamline Your Operations. Enhance Member Experience.
        </h2>
        <div className="features-box">
          <Feature icon={<FaUsers />}     title="Membership Management" desc="Effortlessly manage member profiles, subscriptions, and attendance." />
          <Feature icon={<FaUserCheck />} title="Trainer Assignment"    desc="Optimize trainer schedules and assign clients efficiently." />
          <Feature icon={<FaQrcode />}    title="Attendance Tracking"   desc="Automate check-ins with QR codes or RFID." />
          <Feature icon={<FaCreditCard />}title="Online Payments"       desc="Securely process memberships and payments online." />
          <Feature icon={<FaChartLine />} title="Performance Tracking"  desc="Monitor member progress and analytics." />
          <Feature icon={<FaShieldAlt />} title="Secure Access"         desc="Smart access systems for secure 24/7 entry." />
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="pricing">
        <h2 className="section-title animate-fade-up">Flexible Plans for Every Gym.</h2>
        <div className="pricing-grid">
          <PricingCard title="Basic"    price="Rs 49"  features={["Membership Management","Attendance Tracking","Basic Reporting","Email Support"]} />
          <PricingCard popular title="Standard" price="Rs 99"  features={["All Basic features","Trainer Assignment","Online Payments","Performance Tracking","Priority Support"]} />
          <PricingCard title="Premium" price="Rs 199" features={["All Standard features","Secure Access Integration","Custom Branding","Dedicated Account Manager"]} />
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="testimonials">
        <h2 className="section-title animate-fade-up">Hear From Our Satisfied Gym Owners</h2>
        <div className="testimonial-grid">
          <Testimonial name="Sarah Chen"   role="Owner, Elite Fitness"          text="FitTrack has revolutionized how we manage our gym."                          image="https://i.pravatar.cc/100?img=1" />
          <Testimonial name="Mark Davis"   role="Manager, Peak Performance Gym" text="The online payment system helped us grow faster."                           image="https://i.pravatar.cc/100?img=2" />
          <Testimonial name="Jessica Lee"  role="Founder, Zenith Strength"      text="From membership management to secure access, it covers everything."         image="https://i.pravatar.cc/100?img=3" />
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section">
        <h2 className="contact-title animate-fade-up">Ready to Transform Your Gym?</h2>
        <div className="contact-container contact-with-image">
          <div className="contact-form-card animate-fade-up delay-1">
            <h3>Send us a message</h3>
            <div className={`contact-form-group ${fieldErrors.name ? "has-error" : formData.name && !fieldErrors.name ? "has-success" : ""}`}>
              <label htmlFor="contact-name">Full Name</label>
              <input id="contact-name" type="text" name="name" placeholder="Enter your name" value={formData.name} onChange={handleFormChange} onBlur={handleFormBlur} />
              {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
            </div>
            <div className={`contact-form-group ${fieldErrors.email ? "has-error" : formData.email && !fieldErrors.email ? "has-success" : ""}`}>
              <label htmlFor="contact-email">Email</label>
              <input id="contact-email" type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleFormChange} onBlur={handleFormBlur} />
              {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
            </div>
            <div className={`contact-form-group ${fieldErrors.message ? "has-error" : formData.message && !fieldErrors.message ? "has-success" : ""}`}>
              <label htmlFor="contact-message">Message</label>
              <textarea id="contact-message" name="message" placeholder="Your message..." value={formData.message} onChange={handleFormChange} onBlur={handleFormBlur} />
              {fieldErrors.message && <span className="field-error">{fieldErrors.message}</span>}
              <span className="char-count">{formData.message.length} / 500</span>
            </div>
            <button className={`btn-send-message ${submitting ? "sending" : ""}`} onClick={handleFormSubmit} disabled={submitting}>
              {submitting ? "Sending..." : "Send Message"}
            </button>
            {formStatus.text && (
              <div className={`form-msg ${formStatus.type}${fadeOut ? " fade-out" : ""}`}>{formStatus.text}</div>
            )}
          </div>

          <div className="contact-info-card animate-fade-up delay-2">
            <div className="contact-image"><img src={GymImg} alt="Gym" /></div>
            <h3>Contact Information</h3>
            <div className="contact-info-list">
              <div className="contact-info-item">
                <span className="contact-icon"><FaEnvelope /></span>
                <a href="mailto:support@fittrack.com">support@fittrack.com</a>
              </div>
              <div className="contact-info-item">
                <span className="contact-icon"><FaPhone /></span>
                <a href="https://wa.me/9800956956?text=Hello%20FitTrack" target="_blank" rel="noopener noreferrer">📱 WhatsApp: +977 9800956956</a>
              </div>
              <div className="contact-info-item">
                <span className="contact-icon"><FaMapMarkerAlt /></span>
                <span>Kathmandu, Nepal</span>
              </div>
            </div>
            <div className="contact-social-section">
              <p className="contact-social-label">Follow Us</p>
              <div className="contact-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                <a href="https://twitter.com"   target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                <a href="https://youtube.com"   target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <div className="footer-logo">FitTrack</div>
            <p>Smart gym management for modern fitness centers. Simplify operations, grow your members, and take control.</p>
            <div className="footer-social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebookF /></a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
              <a href="https://twitter.com"   target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
              <a href="https://youtube.com"   target="_blank" rel="noopener noreferrer"><FaYoutube /></a>
            </div>
          </div>
          <div className="footer-column">
            <h4>Quick Links</h4>
            <span className="footer-address" onClick={() => handleScroll("home")}>Home</span>
            <span className="footer-address" onClick={() => handleScroll("features")}>Features</span>
            <span className="footer-address" onClick={() => handleScroll("pricing")}>Plans</span>
            <span className="footer-address" onClick={() => handleScroll("contact")}>Contact</span>
          </div>
          <div className="footer-column">
            <h4>Contact</h4>
            <a href="mailto:support@fittrack.com">support@fittrack.com</a>
            <a href="tel:+9779800000000">+977 9800000000</a>
            <span className="footer-address">Kathmandu, Nepal</span>
          </div>
          <div className="footer-column">
            <h4>Follow Us</h4>
            <div className="footer-social-text">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a>
              <a href="https://twitter.com"   target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://youtube.com"   target="_blank" rel="noopener noreferrer">YouTube</a>
            </div>
          </div>
        </div>
        <div className="footer-divider" />
        <div className="footer-bottom">
          <span>© 2026 FitTrack. All rights reserved.</span>
          <div className="footer-bottom-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
          </div>
        </div>
      </footer>

      <button
        className={`scroll-top-btn ${showTop ? "show" : ""}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >↑</button>
    </div>
  );
}

/* ── SUB-COMPONENTS ── */
function Feature({ icon, title, desc }) {
  return (
    <div className="feature-card animate-fade-up">
      <div className="feature-icon">{icon}</div>
      <h4>{title}</h4>
      <p>{desc}</p>
    </div>
  );
}

function PricingCard({ title, price, features, popular }) {
  return (
    <div className={`pricing-card animate-fade-up ${popular ? "popular" : ""}`}>
      {popular && <span className="popular-badge">Most Popular</span>}
      <h3>{title}</h3>
      <span className="price">{price}/month</span>
      <ul>{features.map((f, i) => <li key={i}><FaCheck /> {f}</li>)}</ul>
      <button className="btn-plan" onClick={() => (window.location.href = "/register")}>Choose Plan</button>
    </div>
  );
}

function Testimonial({ name, role, text, image }) {
  return (
    <div className="testimonial-card animate-fade-up">
      <div className="testimonial-image"><img src={image} alt={name} /></div>
      <div className="testimonial-stars"><FaStar /><FaStar /><FaStar /><FaStar /><FaStar /></div>
      <p className="testimonial-text">"{text}"</p>
      <h4 className="testimonial-name">{name}</h4>
      <span className="testimonial-role">{role}</span>
    </div>
  );
}

export default LandingPage;