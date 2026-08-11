import "./DoctorDashboard.css";
import { useNavigate } from "react-router-dom";

function DoctorDashboard() {

    const navigate = useNavigate();

    // ===========================
    // Get Doctor From LocalStorage
    // ===========================

    let doctor = {};

    try {

        const storedDoctor = localStorage.getItem("user");

        if (storedDoctor && storedDoctor !== "undefined") {

            doctor = JSON.parse(storedDoctor);

        }

    }

    catch (err) {

        console.log("Doctor data not found.");

    }

    // ===========================
    // Statistics
    // ===========================

    const totalAppointments = 12;
    const pendingAppointments = 5;
    const completedAppointments = 7;
    const totalReports = 18;

    // ===========================
    // Greeting
    // ===========================

    const hour = new Date().getHours();

    let greeting = "Good Evening";

    if (hour < 12) {

        greeting = "Good Morning";

    }

    else if (hour < 17) {

        greeting = "Good Afternoon";

    }

    // ===========================
    // Logout
    // ===========================

    const logout = () => {

        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/doctor/login");

    };

    return (

        <div className="doctor-dashboard">

            {/* HERO */}

            <div className="doctor-hero">

                <div className="hero-left">

                    <h1>👨‍⚕️ Doctor Dashboard</h1>

                    <h2>

                        Welcome Dr. {doctor.name || "Doctor"}

                    </h2>

                    <p>{greeting}!</p>

                    <p>

                        Manage appointments, view patient records,
                        review reports and monitor today's schedule.

                    </p>

                </div>

                <div className="hero-right">

                    <img
                        src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
                        alt="Doctor"
                    />

                </div>

            </div>

            {/* STATISTICS */}

            <div className="dashboard-stats">

                <div className="stat-card">

                    <span>📅</span>

                    <h2>{totalAppointments}</h2>

                    <p>Today's Appointments</p>

                </div>

                <div className="stat-card">

                    <span>⏳</span>

                    <h2>{pendingAppointments}</h2>

                    <p>Pending</p>

                </div>

                <div className="stat-card">

                    <span>✅</span>

                    <h2>{completedAppointments}</h2>

                    <p>Completed</p>

                </div>

                <div className="stat-card">

                    <span>📄</span>

                    <h2>{totalReports}</h2>

                    <p>Reports</p>

                </div>

            </div>

            {/* QUICK ACTIONS */}

            <h2 className="section-title">

                Quick Actions

            </h2>

            <div className="quick-actions">

                <div
                    className="action-card"
                    onClick={() => navigate("/doctor/appointments")}
                >

                    <div className="icon">🩺</div>

                    <h3>Appointments</h3>

                    <p>Manage Today's Visits</p>

                </div>

                <div
                    className="action-card"
                    onClick={() => navigate("/doctor/patients")}
                >

                    <div className="icon">👤</div>

                    <h3>Patients</h3>

                    <p>View Patient Details</p>

                </div>

                <div
                    className="action-card"
                    onClick={() => navigate("/doctor/reports")}
                >

                    <div className="icon">📄</div>

                    <h3>Reports</h3>

                    <p>View Test Reports</p>

                </div>

                <div
                    className="action-card"
                    onClick={() => navigate("/doctor/profile")}
                >

                    <div className="icon">⚙️</div>

                    <h3>Profile</h3>

                    <p>Manage Profile</p>

                </div>

                <div
                    className="action-card logout-card"
                    onClick={logout}
                >

                    <div className="icon">🚪</div>

                    <h3>Logout</h3>

                    <p>Secure Logout</p>

                </div>

            </div>

        </div>

    );

}

export default DoctorDashboard;