import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import LandingPage       from "./components/pages/Home/LandingPage";
import Login             from "./components/pages/Auth/Login";
import Register          from "./components/pages/Auth/Register";
import AdminDashboard    from "./components/pages/Admin/AdminDashboard";
import ManageMembers     from "./components/pages/Member/ManageMembers";
import MembershipPlan    from "./components/pages/Member/MembershipPlan";
import Trainer           from "./components/pages/Trainer/Trainer";
import AttendanceReport  from "./components/pages/Attendance/AttendanceReport";
import MemberDashboard   from "./components/pages/Member/MemberDashboard";
import MyMembership      from "./components/pages/Member/MyMembership";
import PaymentHistory    from "./components/pages/payment/Paymenthistory";
import Attendancehistory from "./components/pages/Attendance/Attendancehistory";
import BookTrainer       from "./components/pages/Trainer/BookTrainer";
import MemberProfile     from "./components/pages/Member/MemberProfile";
import Adminsettings     from "./components/pages/Admin/Adminsettings";


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
  return (
    <Routes>

      {/* ── Public ── */}
      <Route path="/"         element={<LandingPage />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ── Dashboard ── */}
      <Route path="/admin/dashboard"  element={<AdminDashboard />} />
      <Route path="/dashboard"        element={<AdminDashboard />} />
      <Route path="/member/dashboard" element={<MemberDashboard />} />

      {/* ── Admin Pages ── */}
      <Route path="/members"        element={<ManageMembers />} />
      <Route path="/membershipplan" element={<MembershipPlanPage />} />
      <Route path="/trainer"        element={<Trainer />} />
      <Route path="/attendance"     element={<AttendanceReport />} />
      <Route path="/admin/settings" element={<Adminsettings />} />

      {/* ── Member Pages ── */}
      <Route path="/member/membership" element={<MyMembership />} />
      <Route path="/member/payments"   element={<PaymentHistory />} />
      <Route path="/member/attendance" element={<Attendancehistory />} />
      <Route path="/member/trainer"    element={<BookTrainer />} />
      <Route path="/member/profile"    element={<MemberProfile />} />

    </Routes>
  );
}