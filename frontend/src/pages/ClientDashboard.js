import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./ClientDashboard.css";

const API_URL = "http://localhost:5000";

function ClientDashboard() {
    const [user, setUser] = useState(null);
    const [reports, setReports] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ========================================
    // GET LOGGED-IN USER
    // ========================================

    useEffect(() => {
        const storedUser = localStorage.getItem("user");

        if (storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setUser(parsedUser);
            } catch (err) {
                console.error("Unable to read user data:", err);
            }
        }
    }, []);

    // ========================================
    // FETCH DASHBOARD DATA
    // ========================================

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                setError("");

                const [reportsResponse, appointmentsResponse] =
                    await Promise.all([
                        fetch(`${API_URL}/api/reports`),
                        fetch(`${API_URL}/api/appointments`)
                    ]);

                // -----------------------------
                // Reports
                // -----------------------------

                if (reportsResponse.ok) {
                    const reportsData = await reportsResponse.json();

                    if (Array.isArray(reportsData)) {
                        setReports(reportsData);
                    } else if (reportsData.reports) {
                        setReports(reportsData.reports);
                    }
                }

                // -----------------------------
                // Appointments
                // -----------------------------

                if (appointmentsResponse.ok) {
                    const appointmentsData =
                        await appointmentsResponse.json();

                    if (Array.isArray(appointmentsData)) {
                        setAppointments(appointmentsData);
                    } else if (appointmentsData.appointments) {
                        setAppointments(
                            appointmentsData.appointments
                        );
                    }
                }

            } catch (err) {
                console.error(
                    "Dashboard data error:",
                    err
                );

                setError(
                    "Unable to load some dashboard information."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    // ========================================
    // GET USER ID
    // ========================================

    const userId =
        user?._id ||
        user?.id ||
        user?.userId ||
        null;

    // ========================================
    // FILTER REPORTS FOR CURRENT USER
    // ========================================

    const myReports = reports.filter((report) => {
        const patient =
            report.patientId;

        if (!userId) {
            return true;
        }

        if (typeof patient === "string") {
            return patient === userId;
        }

        if (patient?._id) {
            return patient._id === userId;
        }

        return false;
    });

    // ========================================
    // FILTER APPOINTMENTS FOR CURRENT USER
    // ========================================

    const myAppointments = appointments.filter(
        (appointment) => {

            if (!userId) {
                return true;
            }

            const patient =
                appointment.patientId ||
                appointment.userId ||
                appointment.clientId;

            if (typeof patient === "string") {
                return patient === userId;
            }

            if (patient?._id) {
                return patient._id === userId;
            }

            return false;
        }
    );

    // ========================================
    // COMPLETED REPORTS
    // ========================================

    const completedReports =
        myReports.filter(
            (report) =>
                String(report.status).toLowerCase() ===
                "completed"
        );

    // ========================================
    // PENDING REPORTS
    // ========================================

    const pendingReports =
        myReports.filter(
            (report) =>
                String(report.status).toLowerCase() ===
                "pending"
        );

    // ========================================
    // UPCOMING APPOINTMENTS
    // ========================================

    const upcomingAppointments =
        myAppointments
            .filter((appointment) => {

                const appointmentDate =
                    appointment.date ||
                    appointment.appointmentDate ||
                    appointment.appointmentTime ||
                    appointment.createdAt;

                if (!appointmentDate) {
                    return true;
                }

                return (
                    new Date(appointmentDate) >=
                    new Date()
                );
            })
            .sort((a, b) => {

                const dateA =
                    new Date(
                        a.date ||
                        a.appointmentDate ||
                        a.appointmentTime ||
                        a.createdAt
                    );

                const dateB =
                    new Date(
                        b.date ||
                        b.appointmentDate ||
                        b.appointmentTime ||
                        b.createdAt
                    );

                return dateA - dateB;
            });

    // ========================================
    // RECENT REPORTS
    // ========================================

    const recentReports =
        [...myReports]
            .sort((a, b) => {

                const dateA =
                    new Date(
                        a.reportDate ||
                        a.createdAt
                    );

                const dateB =
                    new Date(
                        b.reportDate ||
                        b.createdAt
                    );

                return dateB - dateA;
            })
            .slice(0, 4);

    // ========================================
    // FORMAT DATE
    // ========================================

    const formatDate = (date) => {

        if (!date) {
            return "Date not available";
        }

        const parsedDate =
            new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return "Date not available";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric"
            }
        );
    };

    // ========================================
    // FORMAT TIME
    // ========================================

    const formatTime = (date) => {

        if (!date) {
            return "";
        }

        const parsedDate =
            new Date(date);

        if (isNaN(parsedDate.getTime())) {
            return "";
        }

        return parsedDate.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    };

    // ========================================
    // DOCTOR NAME
    // ========================================

    const getDoctorName = (appointment) => {

        const doctor =
            appointment.doctorId ||
            appointment.doctor;

        if (typeof doctor === "object") {

            return (
                doctor.name ||
                doctor.doctorName ||
                "Doctor"
            );
        }

        return (
            appointment.doctorName ||
            "Doctor"
        );
    };

    // ========================================
    // APPOINTMENT DATE
    // ========================================

    const getAppointmentDate = (appointment) => {

        return (
            appointment.date ||
            appointment.appointmentDate ||
            appointment.appointmentTime ||
            appointment.createdAt
        );
    };

    // ========================================
    // USER NAME
    // ========================================

    const userName =
        user?.name ||
        user?.fullName ||
        user?.username ||
        "Client";

    // ========================================
    // LOADING
    // ========================================

    if (loading) {

        return (
            <div className="client-dashboard-page">

                <div className="dashboard-loading">

                    <div className="loading-spinner"></div>

                    <h3>
                        Loading your dashboard...
                    </h3>

                    <p>
                        Please wait while we fetch your health information.
                    </p>

                </div>

            </div>
        );
    }

    // ========================================
    // RETURN DASHBOARD
    // ========================================

    return (

        <div className="client-dashboard-page">

            {/* ==================================
                WELCOME SECTION
            ================================== */}

            <section className="client-welcome">

                <div className="welcome-content">

                    <div className="welcome-icon">
                        👋
                    </div>

                    <div>

                        <p className="welcome-small">
                            Welcome back
                        </p>

                        <h1>
                            {userName}
                        </h1>

                        <p className="welcome-description">
                            Here's an overview of your health
                            activities and recent updates.
                        </p>

                    </div>

                </div>

                <div className="health-status">

                    <span className="status-dot"></span>

                    <span>
                        Health Portal Active
                    </span>

                </div>

            </section>


            {/* ==================================
                ERROR MESSAGE
            ================================== */}

            {error && (

                <div className="dashboard-warning">
                    ⚠️ {error}
                </div>

            )}


            {/* ==================================
                SUMMARY CARDS
            ================================== */}

            <section className="summary-grid">

                {/* Appointments */}

                <div className="summary-card blue-card">

                    <div className="summary-icon">
                        📅
                    </div>

                    <div className="summary-info">

                        <span>
                            Upcoming Appointments
                        </span>

                        <strong>
                            {upcomingAppointments.length}
                        </strong>

                    </div>

                </div>


                {/* Reports */}

                <div className="summary-card purple-card">

                    <div className="summary-icon">
                        📄
                    </div>

                    <div className="summary-info">

                        <span>
                            Total Reports
                        </span>

                        <strong>
                            {myReports.length}
                        </strong>

                    </div>

                </div>


                {/* Completed Tests */}

                <div className="summary-card green-card">

                    <div className="summary-icon">
                        🧪
                    </div>

                    <div className="summary-info">

                        <span>
                            Completed Tests
                        </span>

                        <strong>
                            {completedReports.length}
                        </strong>

                    </div>

                </div>


                {/* Pending */}

                <div className="summary-card orange-card">

                    <div className="summary-icon">
                        ⏳
                    </div>

                    <div className="summary-info">

                        <span>
                            Pending Reports
                        </span>

                        <strong>
                            {pendingReports.length}
                        </strong>

                    </div>

                </div>

            </section>


            {/* ==================================
                MAIN DASHBOARD GRID
            ================================== */}

            <div className="dashboard-main-grid">


                {/* ==================================
                    UPCOMING APPOINTMENT
                ================================== */}

                <section className="dashboard-section">

                    <div className="section-header">

                        <div>

                            <h2>
                                📅 Upcoming Appointments
                            </h2>

                            <p>
                                Your scheduled appointments
                            </p>

                        </div>

                        <Link
                            to="/appointments"
                            className="view-all-link"
                        >
                            View All
                        </Link>

                    </div>


                    {upcomingAppointments.length === 0 ? (

                        <div className="empty-section">

                            <div className="empty-icon">
                                📅
                            </div>

                            <h3>
                                No Upcoming Appointments
                            </h3>

                            <p>
                                You don't have any upcoming
                                appointments.
                            </p>

                            <Link
                                to="/book-appointment"
                                className="primary-small-btn"
                            >
                                Book Appointment
                            </Link>

                        </div>

                    ) : (

                        <div className="appointment-list">

                            {upcomingAppointments
                                .slice(0, 3)
                                .map(
                                    (appointment, index) => {

                                        const appointmentDate =
                                            getAppointmentDate(
                                                appointment
                                            );

                                        return (

                                            <div
                                                className="appointment-item"
                                                key={
                                                    appointment._id ||
                                                    appointment.id ||
                                                    index
                                                }
                                            >

                                                <div className="appointment-date">

                                                    <span>
                                                        {appointmentDate
                                                            ? new Date(
                                                                appointmentDate
                                                            ).toLocaleDateString(
                                                                "en-IN",
                                                                {
                                                                    day: "2-digit"
                                                                }
                                                            )
                                                            : "--"}
                                                    </span>

                                                    <small>
                                                        {appointmentDate
                                                            ? new Date(
                                                                appointmentDate
                                                            ).toLocaleDateString(
                                                                "en-IN",
                                                                {
                                                                    month: "short"
                                                                }
                                                            )
                                                            : ""}
                                                    </small>

                                                </div>


                                                <div className="appointment-info">

                                                    <h3>
                                                        {getDoctorName(
                                                            appointment
                                                        )}
                                                    </h3>

                                                    <p>
                                                        {appointment.specialization ||
                                                            appointment.reason ||
                                                            appointment.testName ||
                                                            "Medical Appointment"}
                                                    </p>

                                                    <span>
                                                        🕐{" "}
                                                        {formatTime(
                                                            appointmentDate
                                                        )}
                                                    </span>

                                                </div>


                                                <div className="appointment-status">

                                                    <span>
                                                        {appointment.status ||
                                                            "Scheduled"}
                                                    </span>

                                                </div>

                                            </div>

                                        );
                                    }
                                )}

                        </div>

                    )}

                </section>


                {/* ==================================
                    RECENT REPORTS
                ================================== */}

                <section className="dashboard-section">

                    <div className="section-header">

                        <div>

                            <h2>
                                📄 Recent Reports
                            </h2>

                            <p>
                                Your latest test reports
                            </p>

                        </div>

                        <Link
                            to="/reports"
                            className="view-all-link"
                        >
                            View All
                        </Link>

                    </div>


                    {recentReports.length === 0 ? (

                        <div className="empty-section">

                            <div className="empty-icon">
                                📄
                            </div>

                            <h3>
                                No Reports Available
                            </h3>

                            <p>
                                Your test reports will appear
                                here after your tests are completed.
                            </p>

                            <Link
                                to="/book-test"
                                className="primary-small-btn"
                            >
                                Book a Test
                            </Link>

                        </div>

                    ) : (

                        <div className="report-list">

                            {recentReports.map(
                                (report, index) => (

                                    <div
                                        className="report-item"
                                        key={
                                            report._id ||
                                            report.id ||
                                            index
                                        }
                                    >

                                        <div className="report-icon">
                                            🧪
                                        </div>


                                        <div className="report-info">

                                            <h3>
                                                {report.testName ||
                                                    "Medical Test"}
                                            </h3>

                                            <p>
                                                {formatDate(
                                                    report.reportDate ||
                                                    report.createdAt
                                                )}
                                            </p>

                                        </div>


                                        <div
                                            className={`report-status ${
                                                String(
                                                    report.status ||
                                                    "Pending"
                                                ).toLowerCase()
                                            }`}
                                        >
                                            {report.status ||
                                                "Pending"}
                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </section>

            </div>


            {/* ==================================
                QUICK ACTIONS
            ================================== */}

            <section className="quick-actions-section">

                <div className="section-header">

                    <div>

                        <h2>
                            ⚡ Quick Actions
                        </h2>

                        <p>
                            Access your most-used services
                        </p>

                    </div>

                </div>


                <div className="quick-actions-grid">

                    <Link
                        to="/book-test"
                        className="quick-action-card"
                    >

                        <div className="quick-action-icon">
                            🧪
                        </div>

                        <div>

                            <h3>
                                Book a Test
                            </h3>

                            <p>
                                Schedule your pathology test
                            </p>

                        </div>

                        <span className="arrow">
                            →
                        </span>

                    </Link>


                    <Link
                        to="/packages"
                        className="quick-action-card"
                    >

                        <div className="quick-action-icon">
                            💊
                        </div>

                        <div>

                            <h3>
                                Health Packages
                            </h3>

                            <p>
                                Explore health checkup packages
                            </p>

                        </div>

                        <span className="arrow">
                            →
                        </span>

                    </Link>


                    <Link
                        to="/labs"
                        className="quick-action-card"
                    >

                        <div className="quick-action-icon">
                            🏥
                        </div>

                        <div>

                            <h3>
                                Find a Lab
                            </h3>

                            <p>
                                Browse our partner laboratories
                            </p>

                        </div>

                        <span className="arrow">
                            →
                        </span>

                    </Link>


                    <Link
                        to="/profile"
                        className="quick-action-card"
                    >

                        <div className="quick-action-icon">
                            👤
                        </div>

                        <div>

                            <h3>
                                My Profile
                            </h3>

                            <p>
                                Manage your personal information
                            </p>

                        </div>

                        <span className="arrow">
                            →
                        </span>

                    </Link>

                </div>

            </section>


            {/* ==================================
                HEALTH TIP
            ================================== */}

            <section className="health-tip">

                <div className="health-tip-icon">
                    💙
                </div>

                <div>

                    <h3>
                        Your Health Matters
                    </h3>

                    <p>
                        Regular health checkups can help
                        detect potential health issues early.
                        Stay proactive and keep your health
                        information up to date.
                    </p>

                </div>

            </section>

        </div>
    );
}

export default ClientDashboard;