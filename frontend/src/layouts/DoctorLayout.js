import { Outlet, NavLink, useNavigate } from "react-router-dom";
import "./DoctorLayout.css";

function DoctorLayout() {

    const navigate = useNavigate();

    // ============================
    // Logged In Doctor
    // ============================

    let doctor = {};

    try {

        const storedDoctor = localStorage.getItem("doctor");

        if (storedDoctor && storedDoctor !== "undefined") {

            doctor = JSON.parse(storedDoctor);

        }

    }

    catch {

        doctor = {};

    }

    // ============================
    // Logout
    // ============================

    const logout = () => {

        localStorage.removeItem("doctor");
        localStorage.removeItem("token");
        localStorage.removeItem("role");

        navigate("/doctor/login", { replace: true });

    };

    return (

        <div className="doctor-layout">

            {/* ===================== TOP NAVBAR ===================== */}

            <header className="doctor-navbar">

                <div className="doctor-logo">

                    👨‍⚕️ Doctor Panel

                </div>

                <div className="doctor-name">

                    Welcome, Dr. {doctor.name || "Doctor"}

                </div>

                <nav className="doctor-nav">

                    <NavLink
                        to="/doctor/dashboard"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/doctor/appointments"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Appointments
                    </NavLink>

                    <NavLink
                        to="/doctor/patients"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Patients
                    </NavLink>

                    <NavLink
                        to="/doctor/reports"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Reports
                    </NavLink>

                    <NavLink
                        to="/doctor/profile"
                        className={({ isActive }) =>
                            isActive ? "active" : ""
                        }
                    >
                        Profile
                    </NavLink>

                    <button
                        className="logout-btn"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </nav>

            </header>

            {/* ===================== PAGE CONTENT ===================== */}

            <main className="doctor-main">

                <Outlet />

            </main>

        </div>

    );

}

export default DoctorLayout;