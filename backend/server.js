const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const connectDB = require("./config/db");

// ==========================
// Environment Configuration
// ==========================

dotenv.config();

// ==========================
// Connect MongoDB
// ==========================

connectDB();

// ==========================
// Create Express App
// ==========================

const app = express();

// ==========================
// Middleware
// ==========================

app.use(
    cors({
        origin: "http://localhost:3000",
        credentials: true
    })
);

app.use(express.json());

// ==========================
// Import Routes
// ==========================

const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const couponRoutes = require("./routes/couponRoutes");
const packageRoutes = require("./routes/packageRoutes");
const labRoutes = require("./routes/labRoutes");
const clientRoutes = require("./routes/clientRoutes");
const adminRoutes = require("./routes/adminRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const testRoutes = require("./routes/testRoutes");
const userRoutes = require("./routes/userRoutes");
const reportRoutes = require("./routes/reportRoutes");

// ==========================
// API Routes
// ==========================

// Authentication
app.use("/api/auth", authRoutes);

// Tests
app.use("/api/tests", testRoutes);

// Appointments
app.use("/api/appointments", appointmentRoutes);

// Vendors
app.use("/api/vendors", vendorRoutes);

// Coupons
app.use("/api/coupons", couponRoutes);

// Packages
app.use("/api/packages", packageRoutes);

// Labs
app.use("/api/labs", labRoutes);

// Client
app.use("/api/client", clientRoutes);

// Admin
app.use("/api/admin", adminRoutes);

// Doctor
app.use("/api/doctor", doctorRoutes);

// Users
app.use("/api/users", userRoutes);

// Reports
app.use("/api/reports", reportRoutes);

// ==========================
// Test Routes
// ==========================

app.get("/", (req, res) => {
    res.send("Arogya 24×7 API Running");
});

app.get("/test", (req, res) => {
    res.send("Test Route Working");
});

// ==========================
// Error Handler
// ==========================

app.use((err, req, res, next) => {
    console.error("Server Error:", err);

    res.status(500).json({
        message: "Internal Server Error",
        error: err.message
    });
});

// ==========================
// Start Server
// ==========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log("All Routes Registered");
});