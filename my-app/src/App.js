import React from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import LandingPage       from "./components/pages/Home/LandingPage";
import Login             from "./components/pages/Auth/Login";
import Register          from "./components/pages/Auth/Register";
import VerifyAccount     from "./components/pages/Auth/VerifyAccount";
import ForgotPassword    from "./components/pages/Auth/ForgotPassword";
import ResetPassword     from "./components/pages/Auth/ResetPassword";
import AdminDashboard    from "./components/pages/Admin/AdminDashboard";
import AdminProfile      from "./components/pages/Admin/AdminProfile";
import Adminsettings     from "./components/pages/Admin/Adminsettings";
import ManageMembers     from "./components/pages/Member/ManageMembers";
import MembershipPlan    from "./components/pages/Member/MembershipPlan";
import Trainer           from "./components/pages/Trainer/Trainer";
import AttendanceReport  from "./components/pages/Attendance/AttendanceReport";
import MemberDashboard   from "./components/pages/Member/MemberDashboard";
import MyMembership      from "./components/pages/Member/MyMembership";
import BMICalculator     from "./components/pages/Member/BMICalculator";
import PaymentHistory    from "./components/pages/payment/Paymenthistory";
import Attendancehistory from "./components/pages/Attendance/Attendancehistory";
import BookTrainer       from "./components/pages/Trainer/BookTrainer";
import MemberProfile     from "./components/pages/Member/MemberProfile";
import WorkoutSchedule   from "./components/pages/Member/WorkoutSchedule";
import WorkoutVideos     from "./components/pages/Member/WorkoutVideos";

function MembershipPlanPage() {
  const navigate = useNavigate();
  return (
    <MembershipPlan
      onClose={() => navigate("/admin/dashboard")}
      onSave={(data) => {
        console.log("Saved plan:", data);
        navigate("/admin/dashboard");
      }}
    />
  );
}

export default function App() {
  const location = useLocation();

  const withPageTransition = (component) => (
    <motion.div
      className="route-transition"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.26, ease: "easeOut" }}
    >
      {component}
    </motion.div>
  );

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>

      {/* ── Public ── */}
      <Route path="/"         element={withPageTransition(<LandingPage />)} />
      <Route path="/login"    element={withPageTransition(<Login />)} />
      <Route path="/register" element={withPageTransition(<Register />)} />
      <Route path="/verify-account" element={withPageTransition(<VerifyAccount />)} />
      <Route path="/forgot-password" element={withPageTransition(<ForgotPassword />)} />
      <Route path="/reset-password" element={withPageTransition(<ResetPassword />)} />

      {/* ── Dashboard ── */}
      <Route path="/admin/dashboard"  element={withPageTransition(<AdminDashboard />)} />
      <Route path="/dashboard"        element={withPageTransition(<AdminDashboard />)} />
      <Route path="/member/dashboard" element={withPageTransition(<MemberDashboard />)} />

      {/* ── Admin Pages ── */}
      <Route path="/members"        element={withPageTransition(<ManageMembers />)} />
      <Route path="/membershipplan" element={withPageTransition(<MembershipPlanPage />)} />
      <Route path="/trainer"        element={withPageTransition(<Trainer />)} />
      <Route path="/attendance"     element={withPageTransition(<AttendanceReport />)} />
      <Route path="/admin/profile"  element={withPageTransition(<AdminProfile />)} />
      <Route path="/admin/settings" element={withPageTransition(<Adminsettings />)} />

      {/* ── Member Pages ── */}
      <Route path="/member/membership" element={withPageTransition(<MyMembership />)} />
      <Route path="/member/bmi"        element={withPageTransition(<BMICalculator />)} />
      <Route path="/member/payments"   element={withPageTransition(<PaymentHistory />)} />
      <Route path="/member/attendance" element={withPageTransition(<Attendancehistory />)} />
      <Route path="/member/schedule"   element={withPageTransition(<WorkoutSchedule />)} />
      <Route path="/member/videos"     element={withPageTransition(<WorkoutVideos />)} />
      <Route path="/member/trainer"    element={withPageTransition(<BookTrainer />)} />
      <Route path="/member/profile"    element={withPageTransition(<MemberProfile />)} />

        </Routes>
      </AnimatePresence>

    </>
  );
}