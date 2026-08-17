import "./DoctorDashboard.css";
import {
    useEffect,
    useState
} from "react";
import { useNavigate } from "react-router-dom";


function DoctorDashboard() {

    const navigate = useNavigate();


    // ===========================
    // Doctor Information
    // ===========================

    let doctor = {};

    try {

        const storedDoctor =
            localStorage.getItem("doctor") ||
            localStorage.getItem("user");

        if (
            storedDoctor &&
            storedDoctor !== "undefined"
        ) {

            doctor = JSON.parse(
                storedDoctor
            );

        }

    }

    catch (err) {

        console.log(
            "Doctor data not found."
        );

    }


    // ===========================
    // Dashboard Statistics
    // ===========================

    const [
        totalAppointments,
        setTotalAppointments
    ] = useState(0);


    const [
        pendingAppointments,
        setPendingAppointments
    ] = useState(0);


    const [
        completedAppointments,
        setCompletedAppointments
    ] = useState(0);


    const [
        totalReports,
        setTotalReports
    ] = useState(0);


    // ===========================
    // Loading State
    // ===========================

    const [
        loading,
        setLoading
    ] = useState(true);


    // ===========================
    // Fetch Dashboard Statistics
    // ===========================

    useEffect(() => {

        const fetchDashboardStats =
            async () => {

                try {

                    const token =
                        localStorage.getItem(
                            "token"
                        );


                    if (!token) {

                        console.log(
                            "No authentication token found."
                        );

                        navigate(
                            "/doctor/login"
                        );

                        return;

                    }


                    const response =
                        await fetch(
                            "http://localhost:5000/api/appointments/doctor/dashboard",
                            {

                                method: "GET",

                                headers: {

                                    Authorization:
                                        `Bearer ${token}`,

                                    "Content-Type":
                                        "application/json"

                                }

                            }
                        );


                    const data =
                        await response.json();


                    if (!response.ok) {

                        throw new Error(
                            data.message ||
                            "Unable to fetch dashboard statistics"
                        );

                    }


                    // ===========================
                    // Set Real Statistics
                    // ===========================

                    setTotalAppointments(
                        data.totalAppointments || 0
                    );


                    setPendingAppointments(
                        data.pendingAppointments || 0
                    );


                    setCompletedAppointments(
                        data.completedAppointments || 0
                    );


                    // Reports API is not connected yet
                    setTotalReports(
                        data.totalReports || 0
                    );

                }

                catch (error) {

                    console.error(
                        "Dashboard statistics error:",
                        error
                    );


                    setTotalAppointments(0);

                    setPendingAppointments(0);

                    setCompletedAppointments(0);

                    setTotalReports(0);

                }

                finally {

                    setLoading(false);

                }

            };


        fetchDashboardStats();

    }, [navigate]);


    // ===========================
    // Greeting
    // ===========================

    const hour =
        new Date().getHours();


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


    // ===========================
    // Logout
    // ===========================

    const logout = () => {

        localStorage.removeItem(
            "doctor"
        );

        localStorage.removeItem(
            "user"
        );

        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "role"
        );


        navigate(
            "/doctor/login",
            {
                replace: true
            }
        );

    };


    // ===========================
    // Loading Display
    // ===========================

    const displayTotal =
        loading
            ? "..."
            : totalAppointments;


    const displayPending =
        loading
            ? "..."
            : pendingAppointments;


    const displayCompleted =
        loading
            ? "..."
            : completedAppointments;


    const displayReports =
        loading
            ? "..."
            : totalReports;


    // ===========================
    // RETURN
    // ===========================

    return (

        <div className="doctor-dashboard">


            {/* ===========================
                HERO
            =========================== */}

            <div className="doctor-hero">


                <div className="hero-left">


                    <h1>
                        👨‍⚕️ Doctor Dashboard
                    </h1>


                    <h2>

                        Welcome Dr.{" "}

                        {doctor.name ||
                            "Doctor"}

                    </h2>


                    <p>
                        {greeting}!
                    </p>


                    <p>

                        Manage appointments,
                        view patient records,
                        review reports and
                        monitor today's schedule.

                    </p>


                </div>


                <div className="hero-right">

                    <img
                        src="https://cdn-icons-png.flaticon.com/512/387/387561.png"
                        alt="Doctor"
                    />

                </div>


            </div>


            {/* ===========================
                STATISTICS
            =========================== */}

            <div className="dashboard-stats">


                {/* Today's Appointments */}

                <div className="stat-card">

                    <span>
                        📅
                    </span>


                    <h2>
                        {displayTotal}
                    </h2>


                    <p>
                        Today's Appointments
                    </p>

                </div>


                {/* Pending */}

                <div className="stat-card">

                    <span>
                        ⏳
                    </span>


                    <h2>
                        {displayPending}
                    </h2>


                    <p>
                        Pending
                    </p>

                </div>


                {/* Completed */}

                <div className="stat-card">

                    <span>
                        ✅
                    </span>


                    <h2>
                        {displayCompleted}
                    </h2>


                    <p>
                        Completed
                    </p>

                </div>


                {/* Reports */}

                <div className="stat-card">

                    <span>
                        📄
                    </span>


                    <h2>
                        {displayReports}
                    </h2>


                    <p>
                        Reports
                    </p>

                </div>


            </div>


            {/* ===========================
                QUICK ACTIONS
            =========================== */}

            <h2 className="section-title">

                Quick Actions

            </h2>


            <div className="quick-actions">


                {/* Appointments */}

                <div
                    className="action-card"
                    onClick={() =>
                        navigate(
                            "/doctor/appointments"
                        )
                    }
                >

                    <div className="icon">
                        🩺
                    </div>


                    <h3>
                        Appointments
                    </h3>


                    <p>
                        Manage Today's Visits
                    </p>

                </div>


                {/* Patients */}

                <div
                    className="action-card"
                    onClick={() =>
                        navigate(
                            "/doctor/patients"
                        )
                    }
                >

                    <div className="icon">
                        👤
                    </div>


                    <h3>
                        Patients
                    </h3>


                    <p>
                        View Patient Details
                    </p>

                </div>


                {/* Reports */}

                <div
                    className="action-card"
                    onClick={() =>
                        navigate(
                            "/doctor/reports"
                        )
                    }
                >

                    <div className="icon">
                        📄
                    </div>


                    <h3>
                        Reports
                    </h3>


                    <p>
                        View Test Reports
                    </p>

                </div>


                {/* Logout */}

                <div
                    className="action-card logout-card"
                    onClick={logout}
                >

                    <div className="icon">
                        🚪
                    </div>


                    <h3>
                        Logout
                    </h3>


                    <p>
                        Secure Logout
                    </p>

                </div>


            </div>


        </div>

    );

}


export default DoctorDashboard;