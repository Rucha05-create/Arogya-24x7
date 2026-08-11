import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {

    const navigate = useNavigate();

    const user =
        JSON.parse(localStorage.getItem("user")) || null;

    const appointments =
        JSON.parse(localStorage.getItem("appointments")) || [];


    // =========================
    // LOGOUT
    // =========================

    const logoutHandler = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        alert("Logged Out Successfully");

        navigate("/");
    };


    // =========================
    // EDIT PROFILE
    // =========================

    const editProfile = () => {

        navigate("/edit-profile");
    };


    // =========================
    // NO USER
    // =========================

    if (!user) {

        return (

            <div className="dashboard-empty">

                <h1>
                    No User Found
                </h1>

                <button
                    onClick={() => navigate("/")}
                >
                    Go to Login
                </button>

            </div>

        );
    }


    return (

        <div className="dashboard-page">

            <div className="dashboard-container">


                {/* =====================================
                    TOP BAR
                ===================================== */}

                <div className="top-bar">

                    <h1>
                        Welcome, {user.name || "User"}
                    </h1>


                    <div className="top-buttons">

                        <button
                            type="button"
                            className="edit-btn"
                            onClick={editProfile}
                        >
                            ✏️ Edit Profile
                        </button>


                        <button
                            type="button"
                            className="logout-btn"
                            onClick={logoutHandler}
                        >
                            Logout
                        </button>

                    </div>

                </div>



                {/* =====================================
                    MEDICAL INFORMATION
                ===================================== */}

                <div className="profile-card">

                    <h2>
                        Medical Information
                    </h2>


                    <div className="profile-grid">


                        {/* NAME */}

                        <p>
                            <strong>Name:</strong>{" "}
                            {user.name || "Not Added"}
                        </p>


                        {/* EMAIL */}

                        <p>
                            <strong>Email:</strong>{" "}
                            {user.email || "Not Added"}
                        </p>


                        {/* AGE */}

                        <p>
                            <strong>Age:</strong>{" "}
                            {user.age || "Not Added"}
                        </p>


                        {/* GENDER */}

                        <p>
                            <strong>Gender:</strong>{" "}
                            {user.gender || "Not Added"}
                        </p>


                        {/* PHONE */}

                        <p>
                            <strong>Phone:</strong>{" "}
                            {user.phone || "Not Added"}
                        </p>


                        {/* BLOOD GROUP */}

                        <p>
                            <strong>Blood Group:</strong>{" "}
                            {user.bloodGroup || "Not Added"}
                        </p>


                        {/* HEIGHT */}

                        <p>
                            <strong>Height:</strong>{" "}
                            {user.height || "Not Added"}
                        </p>


                        {/* WEIGHT */}

                        <p>
                            <strong>Weight:</strong>{" "}
                            {user.weight || "Not Added"}
                        </p>


                        {/* ALLERGIES */}

                        <p>
                            <strong>Allergies:</strong>{" "}
                            {user.allergies || "Not Added"}
                        </p>


                        {/* DISEASE */}

                        <p>
                            <strong>Diseases:</strong>{" "}
                            {user.disease ||
                             user.diseases ||
                             "Not Added"}
                        </p>


                        {/* MEDICATIONS */}

                        <p>
                            <strong>Medications:</strong>{" "}
                            {user.medications || "Not Added"}
                        </p>


                        {/* EMERGENCY CONTACT */}

                        <p>
                            <strong>Emergency Contact:</strong>{" "}
                            {user.emergencyContact ||
                             user.emergency ||
                             "Not Added"}
                        </p>


                        {/* ADDRESS */}

                        <p>
                            <strong>Address:</strong>{" "}
                            {user.address || "Not Added"}
                        </p>

                    </div>

                </div>



                {/* =====================================
                    PREVIOUS MEDICAL TESTS
                ===================================== */}

                <div className="history-card">

                    <h2>
                        Previous Medical Tests
                    </h2>


                    {appointments.length === 0 ? (

                        <div className="empty-history">

                            No Test History Available

                        </div>

                    ) : (

                        <div className="appointments-list">

                            {appointments.map(
                                (appointment, index) => (

                                    <div
                                        key={index}
                                        className="appointment-card"
                                    >


                                        {/* DATE */}

                                        <p>

                                            <strong>
                                                Date:
                                            </strong>{" "}

                                            {appointment.date}

                                        </p>


                                        {/* TIME */}

                                        <p>

                                            <strong>
                                                Time:
                                            </strong>{" "}

                                            {appointment.time}

                                        </p>


                                        {/* TESTS */}

                                        <div className="appointment-tests">

                                            <strong>
                                                Tests:
                                            </strong>


                                            {appointment.tests &&
                                             appointment.tests.length > 0 ? (

                                                <ul>

                                                    {appointment.tests.map(
                                                        (test, i) => (

                                                            <li key={i}>

                                                                {test.testName ||
                                                                 test.name ||
                                                                 "Test"}

                                                            </li>

                                                        )
                                                    )}

                                                </ul>

                                            ) : (

                                                <span>
                                                    No tests listed
                                                </span>

                                            )}

                                        </div>


                                        {/* TOTAL */}

                                        <p>

                                            <strong>
                                                Total:
                                            </strong>{" "}

                                            ₹{appointment.totalAmount || 0}

                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>

        </div>

    );
}

export default Dashboard;