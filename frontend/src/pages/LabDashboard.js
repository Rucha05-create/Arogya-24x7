import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LabDashboard.css";

function LabDashboard() {

    const navigate = useNavigate();

    // ==========================================
    // LAB INFORMATION
    // ==========================================

    const [lab, setLab] = useState({});

    // ==========================================
    // DASHBOARD STATISTICS
    // ==========================================

    const [stats, setStats] = useState({
        bookings: 0,
        pending: 0,
        completed: 0,
        reports: 0
    });

    // ==========================================
    // CURRENT TIME
    // ==========================================

    const [currentTime, setCurrentTime] = useState(
        new Date()
    );

    // ==========================================
    // LOAD LAB DATA
    // ==========================================

    useEffect(() => {

        try {

            const storedLab =
                localStorage.getItem("user");

            if (
                storedLab &&
                storedLab !== "undefined"
            ) {

                const parsedLab =
                    JSON.parse(storedLab);

                setLab(parsedLab);

            }

        }

        catch (error) {

            console.error(
                "Unable to load lab data:",
                error
            );

        }

    }, []);

    // ==========================================
    // CLOCK
    // ==========================================

    useEffect(() => {

        const timer = setInterval(() => {

            setCurrentTime(
                new Date()
            );

        }, 1000);

        return () => clearInterval(timer);

    }, []);

    // ==========================================
    // FETCH DASHBOARD DATA
    // ==========================================

    useEffect(() => {

        const fetchDashboardData = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                /*
                 * Your backend can later return
                 * these values from a dedicated
                 * dashboard API.
                 *
                 * For now we safely keep the
                 * dashboard functional.
                 */

                if (!token) {

                    return;

                }

                /*
                 * When your lab-booking API is connected,
                 * replace this section with the actual
                 * booking/report API calls.
                 */

            }

            catch (error) {

                console.error(
                    "Dashboard Error:",
                    error
                );

            }

        };

        fetchDashboardData();

    }, []);

    // ==========================================
    // GREETING
    // ==========================================

    const hour =
        currentTime.getHours();

    let greeting =
        "Good Evening";

    if (hour < 12) {

        greeting =
            "Good Morning";

    }

    else if (hour < 17) {

        greeting =
            "Good Afternoon";

    }

    // ==========================================
    // DATE
    // ==========================================

    const formattedDate =
        currentTime.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );

    // ==========================================
    // LOGOUT
    // ==========================================

    const logout = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate(
            "/lab/login",
            {
                replace: true
            }
        );

    };

    // ==========================================
    // LAB TESTS
    // ==========================================

    const labTests =
        lab.tests &&
        Array.isArray(lab.tests)
            ? lab.tests
            : [
                "Blood Test",
                "Diabetes Test",
                "Thyroid Profile",
                "Liver Function Test"
            ];

    // ==========================================
    // RECENT ACTIVITY
    // ==========================================

    const recentActivities = [

        {
            icon: "🧪",
            title: "New test booking",
            text: "Blood Test appointment received",
            time: "Today"
        },

        {
            icon: "📄",
            title: "Report activity",
            text: "Patient report section is ready",
            time: "Today"
        },

        {
            icon: "✅",
            title: "Lab system active",
            text: "Dashboard synchronized successfully",
            time: "Just now"
        }

    ];

    return (

        <div className="lab-dashboard">

            {/* ======================================
                DASHBOARD HEADER
            ====================================== */}

            <section className="lab-welcome">

                <div className="welcome-content">

                    <div className="welcome-icon">
                        🧪
                    </div>

                    <div>

                        <p className="welcome-small">
                            {greeting}
                        </p>

                        <h1>
                            {lab.labName ||
                                "Laboratory"}
                        </h1>

                        <p className="welcome-text">

                            Welcome to your laboratory
                            management dashboard.

                        </p>

                        <div className="lab-meta">

                            <span>
                                📍{" "}
                                {lab.location ||
                                    "Location not available"}
                            </span>

                            <span>
                                🆔{" "}
                                {lab.labId ||
                                    "LAB"}
                            </span>

                        </div>

                    </div>

                </div>

                <div className="welcome-date">

                    <div className="date-icon">
                        📅
                    </div>

                    <div>

                        <strong>
                            {formattedDate}
                        </strong>

                        <p>
                            {currentTime.toLocaleTimeString(
                                "en-IN",
                                {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    second: "2-digit"
                                }
                            )}
                        </p>

                    </div>

                </div>

            </section>


            {/* ======================================
                STATISTICS
            ====================================== */}

            <section className="stats-grid">

                <div
                    className="dashboard-stat booking-stat"
                    onClick={() =>
                        navigate("/lab/bookings")
                    }
                >

                    <div className="stat-top">

                        <div className="stat-icon">
                            📅
                        </div>

                        <span className="stat-arrow">
                            →
                        </span>

                    </div>

                    <h2>
                        {stats.bookings}
                    </h2>

                    <p>
                        Today's Bookings
                    </p>

                    <small>
                        Appointments scheduled
                    </small>

                </div>


                <div className="dashboard-stat pending-stat">

                    <div className="stat-top">

                        <div className="stat-icon">
                            ⏳
                        </div>

                        <span className="status-badge">
                            Pending
                        </span>

                    </div>

                    <h2>
                        {stats.pending}
                    </h2>

                    <p>
                        Pending Tests
                    </p>

                    <small>
                        Tests waiting for processing
                    </small>

                </div>


                <div className="dashboard-stat completed-stat">

                    <div className="stat-top">

                        <div className="stat-icon">
                            ✅
                        </div>

                        <span className="status-badge completed">
                            Done
                        </span>

                    </div>

                    <h2>
                        {stats.completed}
                    </h2>

                    <p>
                        Completed Tests
                    </p>

                    <small>
                        Successfully completed
                    </small>

                </div>


                <div
                    className="dashboard-stat report-stat"
                    onClick={() =>
                        navigate("/lab/reports")
                    }
                >

                    <div className="stat-top">

                        <div className="stat-icon">
                            📄
                        </div>

                        <span className="stat-arrow">
                            →
                        </span>

                    </div>

                    <h2>
                        {stats.reports}
                    </h2>

                    <p>
                        Reports
                    </p>

                    <small>
                        Patient reports uploaded
                    </small>

                </div>

            </section>


            {/* ======================================
                MAIN CONTENT
            ====================================== */}

            <section className="dashboard-columns">


                {/* ==================================
                    QUICK ACTIONS
                ================================== */}

                <div className="dashboard-panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                Quick Actions
                            </h2>

                            <p>
                                Manage your laboratory
                                activities
                            </p>

                        </div>

                        <span className="panel-icon">
                            ⚡
                        </span>

                    </div>


                    <div className="quick-actions">

                        <button
                            onClick={() =>
                                navigate(
                                    "/lab/bookings"
                                )
                            }
                        >

                            <span>
                                📅
                            </span>

                            <div>

                                <strong>
                                    View Bookings
                                </strong>

                                <small>
                                    Manage patient bookings
                                </small>

                            </div>

                            <b>
                                →
                            </b>

                        </button>


                        <button
                            onClick={() =>
                                navigate(
                                    "/upload-report"
                                )
                            }
                        >

                            <span>
                                📤
                            </span>

                            <div>

                                <strong>
                                    Upload Report
                                </strong>

                                <small>
                                    Add patient test reports
                                </small>

                            </div>

                            <b>
                                →
                            </b>

                        </button>


                        <button
                            onClick={() =>
                                navigate(
                                    "/lab/reports"
                                )
                            }
                        >

                            <span>
                                📄
                            </span>

                            <div>

                                <strong>
                                    View Reports
                                </strong>

                                <small>
                                    Check submitted reports
                                </small>

                            </div>

                            <b>
                                →
                            </b>

                        </button>

                    </div>

                </div>


                {/* ==================================
                    LAB INFORMATION
                ================================== */}

                <div className="dashboard-panel lab-info-panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                Laboratory Information
                            </h2>

                            <p>
                                Your registered lab details
                            </p>

                        </div>

                        <span className="panel-icon">
                            🏥
                        </span>

                    </div>


                    <div className="info-list">

                        <div className="info-row">

                            <span>
                                🏥
                            </span>

                            <div>

                                <small>
                                    Laboratory
                                </small>

                                <strong>
                                    {lab.labName ||
                                        "Not available"}
                                </strong>

                            </div>

                        </div>


                        <div className="info-row">

                            <span>
                                📍
                            </span>

                            <div>

                                <small>
                                    Location
                                </small>

                                <strong>
                                    {lab.location ||
                                        "Not available"}
                                </strong>

                            </div>

                        </div>


                        <div className="info-row">

                            <span>
                                🆔
                            </span>

                            <div>

                                <small>
                                    Lab ID
                                </small>

                                <strong>
                                    {lab.labId ||
                                        "Not available"}
                                </strong>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* ======================================
                LOWER SECTION
            ====================================== */}

            <section className="dashboard-columns lower-section">


                {/* ==================================
                    TESTS
                ================================== */}

                <div className="dashboard-panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                🧪 Tests Available
                            </h2>

                            <p>
                                Tests handled by your laboratory
                            </p>

                        </div>

                        <span className="test-count">
                            {labTests.length}
                        </span>

                    </div>


                    <div className="tests-grid">

                        {labTests.map(
                            (test, index) => (

                                <div
                                    className="test-item"
                                    key={index}
                                >

                                    <span>
                                        🧬
                                    </span>

                                    <strong>
                                        {test}
                                    </strong>

                                </div>

                            )
                        )}

                    </div>

                </div>


                {/* ==================================
                    RECENT ACTIVITY
                ================================== */}

                <div className="dashboard-panel">

                    <div className="panel-header">

                        <div>

                            <h2>
                                Recent Activity
                            </h2>

                            <p>
                                Latest laboratory updates
                            </p>

                        </div>

                        <span className="panel-icon">
                            🔔
                        </span>

                    </div>


                    <div className="activity-list">

                        {recentActivities.map(
                            (activity, index) => (

                                <div
                                    className="activity-item"
                                    key={index}
                                >

                                    <div className="activity-icon">
                                        {activity.icon}
                                    </div>

                                    <div>

                                        <strong>
                                            {activity.title}
                                        </strong>

                                        <p>
                                            {activity.text}
                                        </p>

                                    </div>

                                    <small>
                                        {activity.time}
                                    </small>

                                </div>

                            )
                        )}

                    </div>

                </div>

            </section>


            {/* ======================================
                PERFORMANCE SECTION
            ====================================== */}

            <section className="performance-panel">

                <div>

                    <div className="performance-icon">
                        📊
                    </div>

                    <div>

                        <h2>
                            Laboratory Performance
                        </h2>

                        <p>
                            Keep your test processing and
                            report uploads up to date.
                        </p>

                    </div>

                </div>


                <div className="performance-items">

                    <div>

                        <span>
                            🧪
                        </span>

                        <strong>
                            {labTests.length}
                        </strong>

                        <small>
                            Test Types
                        </small>

                    </div>


                    <div>

                        <span>
                            📅
                        </span>

                        <strong>
                            {stats.bookings}
                        </strong>

                        <small>
                            Today's Visits
                        </small>

                    </div>


                    <div>

                        <span>
                            📄
                        </span>

                        <strong>
                            {stats.reports}
                        </strong>

                        <small>
                            Reports
                        </small>

                    </div>

                </div>

            </section>


            {/* ======================================
                FOOTER
            ====================================== */}

            <footer className="lab-dashboard-footer">

                <span>
                    🧪 Arogya 24×7 Laboratory Management
                </span>

                <span>
                    Secure • Reliable • Patient Focused
                </span>

            </footer>

        </div>

    );

}

export default LabDashboard;