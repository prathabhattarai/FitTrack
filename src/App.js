import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import LandingPage        from "./components/LandingPage";
import Login              from "./components/Login";
import Register           from "./components/Register";
import AdminDashboard     from "./components/AdminDashboard";
import ManageMembers      from "./components/ManageMembers";
import MembershipPlan     from "./components/MembershipPlan";
import Trainer            from "./components/Trainer";
import AttendanceReport   from "./components/AttendanceReport";
import MemberDashboard    from "./components/MemberDashboard";
import MyMembership       from "./components/MyMembership";
import PaymentHistory     from "./components/Paymenthistory";
import Attendancehistory  from "./components/Attendancehistory";
import BookTrainer        from "./components/BookTrainer";
import MemberProfile      from "./components/MemberProfile";

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
      <Route path="/"          element={<LandingPage />} />
      <Route path="/login"     element={<Login />} />
      <Route path="/register"  element={<Register />} />

      {/* ── Dashboard ── */}
      <Route path="/admin/dashboard"  element={<AdminDashboard />} />
      <Route path="/dashboard"        element={<AdminDashboard />} />
      <Route path="/member/dashboard" element={<MemberDashboard />} />

      {/* ── Admin Pages ── */}
      <Route path="/members"        element={<ManageMembers />} />
      <Route path="/membershipplan" element={<MembershipPlanPage />} />
      <Route path="/trainer"        element={<Trainer />} />
      <Route path="/attendance"     element={<AttendanceReport />} />

      {/* ── Member Pages ── */}
      <Route path="/member/membership" element={<MyMembership />} />
      <Route path="/member/payments"   element={<PaymentHistory />} />
      <Route path="/member/attendance" element={<Attendancehistory />} />
      <Route path="/member/trainer"    element={<BookTrainer />} />
      <Route path="/member/profile"    element={<MemberProfile />} />

    </Routes>
  );
}