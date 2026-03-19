const express = require("express");
const healthRoutes = require("./health.routes");

const router = express.Router();

const authRoutes = require("./auth.routes");
const adminRoutes = require("./admin.routes");
const memberRoutes = require("./member.routes");
const trainerRoutes = require("./trainer.routes");
const attendanceRoutes = require("./attendance.routes");
const paymentRoutes = require("./payment.routes");

router.use("/api/health", healthRoutes);
router.use("/api/auth", authRoutes);
router.use("/api/admin", adminRoutes);
router.use("/api/members", memberRoutes);
router.use("/api/trainers", trainerRoutes);
router.use("/api/attendance", attendanceRoutes);
router.use("/api/payments", paymentRoutes);

module.exports = router;
