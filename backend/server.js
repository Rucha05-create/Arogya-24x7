const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

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
// PORT
// ==========================

const PORT = process.env.PORT || 5000;

// ==========================
// UPLOADS DIRECTORY
// ==========================

// Create uploads folder if it does not exist

const uploadsPath = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadsPath)) {
    fs.mkdirSync(uploadsPath, {
        recursive: true
    });
}

// ==========================
// CORS CONFIGURATION
// ==========================

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3002"
];

app.use(
    cors({
        origin: function (origin, callback) {

            // Allow requests without an origin
            // Example: Postman / server-side requests

            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            return callback(
                new Error(
                    `CORS Error: Origin ${origin} is not allowed`
                )
            );
        },

        credentials: true
    })
);

// ==========================
// BODY PARSERS
// ==========================

app.use(express.json());

app.use(
    express.urlencoded({
        extended: true
    })
);

// ==========================
// SERVE UPLOADED FILES
// ==========================

// Uploaded reports can be accessed through:
//
// http://localhost:5000/uploads/filename.pdf

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

// ==========================
// REQUEST LOGGER
// ==========================

app.use((req, res, next) => {

    console.log(
        `${req.method} ${req.originalUrl}`
    );

    next();

});

// ==========================
// IMPORT ROUTES
// ==========================

const authRoutes =
    require("./routes/authRoutes");

const appointmentRoutes =
    require("./routes/appointmentRoutes");

const vendorRoutes =
    require("./routes/vendorRoutes");

const couponRoutes =
    require("./routes/couponRoutes");

const packageRoutes =
    require("./routes/packageRoutes");

const labRoutes =
    require("./routes/labRoutes");

const clientRoutes =
    require("./routes/clientRoutes");

const adminRoutes =
    require("./routes/adminRoutes");

const doctorRoutes =
    require("./routes/doctorRoutes");

const testRoutes =
    require("./routes/testRoutes");

const userRoutes =
    require("./routes/userRoutes");

const reportRoutes =
    require("./routes/reportRoutes");

// ==========================
// API ROUTES
// ==========================

// ==========================
// Authentication
// ==========================

app.use(
    "/api/auth",
    authRoutes
);

// ==========================
// Tests
// ==========================

app.use(
    "/api/tests",
    testRoutes
);

// ==========================
// Appointments
// ==========================

app.use(
    "/api/appointments",
    appointmentRoutes
);

// ==========================
// Vendors
// ==========================

app.use(
    "/api/vendors",
    vendorRoutes
);

// ==========================
// Coupons
// ==========================

app.use(
    "/api/coupons",
    couponRoutes
);

// ==========================
// Packages
// ==========================

app.use(
    "/api/packages",
    packageRoutes
);

// ==========================
// Labs
// ==========================

app.use(
    "/api/labs",
    labRoutes
);

// ==========================
// Client
// ==========================

app.use(
    "/api/client",
    clientRoutes
);

// ==========================
// Admin
// ==========================

app.use(
    "/api/admin",
    adminRoutes
);

// ==========================
// Doctor
// ==========================

app.use(
    "/api/doctor",
    doctorRoutes
);

// ==========================
// Users
// ==========================

app.use(
    "/api/users",
    userRoutes
);

// ==========================
// Reports
// ==========================

app.use(
    "/api/reports",
    reportRoutes
);

// ==========================
// ROOT TEST ROUTE
// ==========================

app.get("/", (req, res) => {

    res.status(200).send(
        "Arogya 24×7 API Running"
    );

});

// ==========================
// SERVER TEST ROUTE
// ==========================

app.get("/test", (req, res) => {

    res.status(200).json({

        success: true,

        message:
            "Test Route Working",

        server:
            "Arogya 24×7 Backend",

        port:
            PORT

    });

});

// ==========================
// UPLOADS TEST ROUTE
// ==========================

app.get("/uploads", (req, res) => {

    res.status(200).json({

        success: true,

        message:
            "Uploads folder is available",

        path:
            "/uploads"

    });

});

// ==========================
// 404 HANDLER
// ==========================

app.use((req, res) => {

    res.status(404).json({

        success: false,

        message:
            "API route not found",

        path:
            req.originalUrl

    });

});

// ==========================
// GLOBAL ERROR HANDLER
// ==========================

app.use(
    (err, req, res, next) => {

        console.error(
            "================================="
        );

        console.error(
            "SERVER ERROR:"
        );

        console.error(
            err
        );

        console.error(
            "================================="
        );

        // ==========================
        // CORS ERROR
        // ==========================

        if (
            err.message &&
            err.message.startsWith(
                "CORS Error"
            )
        ) {

            return res.status(403).json({

                success: false,

                message:
                    "CORS Error",

                error:
                    err.message

            });

        }

        // ==========================
        // MULTER / FILE ERROR
        // ==========================

        if (
            err.code === "LIMIT_FILE_SIZE"
        ) {

            return res.status(400).json({

                success: false,

                message:
                    "Uploaded file is too large."

            });

        }

        // ==========================
        // GENERAL ERROR
        // ==========================

        res.status(500).json({

            success: false,

            message:
                "Internal Server Error",

            error:
                err.message

        });

    }
);

// ==========================
// START SERVER
// ==========================

app.listen(
    PORT,
    () => {

        console.log(
            "================================="
        );

        console.log(
            "       AROGYA 24×7 BACKEND"
        );

        console.log(
            "================================="
        );

        console.log(
            `Server running on port ${PORT}`
        );

        console.log(
            `http://localhost:${PORT}`
        );

        console.log(
            "---------------------------------"
        );

        console.log(
            "MongoDB connection initialized"
        );

        console.log(
            "---------------------------------"
        );

        console.log(
            "CORS allowed origins:"
        );

        console.log(
            " - http://localhost:3000"
        );

        console.log(
            " - http://localhost:3002"
        );

        console.log(
            "---------------------------------"
        );

        console.log(
            "Uploaded files:"
        );

        console.log(
            `http://localhost:${PORT}/uploads`
        );

        console.log(
            "---------------------------------"
        );

        console.log(
            "API Routes:"
        );

        console.log(
            " - /api/auth"
        );

        console.log(
            " - /api/tests"
        );

        console.log(
            " - /api/appointments"
        );

        console.log(
            " - /api/vendors"
        );

        console.log(
            " - /api/coupons"
        );

        console.log(
            " - /api/packages"
        );

        console.log(
            " - /api/labs"
        );

        console.log(
            " - /api/client"
        );

        console.log(
            " - /api/admin"
        );

        console.log(
            " - /api/doctor"
        );

        console.log(
            " - /api/users"
        );

        console.log(
            " - /api/reports"
        );

        console.log(
            "================================="
        );

        console.log(
            "All Routes Registered"
        );

        console.log(
            "================================="
        );

    }
);