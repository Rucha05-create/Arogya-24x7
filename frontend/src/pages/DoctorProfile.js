import "./DoctorPatients.css";

function DoctorPatients() {

    const patients = [
        {
            id: 1,
            name: "Rucha Patil",
            age: 21,
            gender: "Female",
            bloodGroup: "B+",
            phone: "9876543210",
            email: "rucha@example.com"
        },
        {
            id: 2,
            name: "Rahul Sharma",
            age: 25,
            gender: "Male",
            bloodGroup: "O+",
            phone: "9876501234",
            email: "rahul@example.com"
        },
        {
            id: 3,
            name: "Priya Verma",
            age: 28,
            gender: "Female",
            bloodGroup: "A+",
            phone: "9988776655",
            email: "priya@example.com"
        }
    ];

    return (
        <div className="doctor-patients-page">

            {/* =========================
                PAGE HEADER
            ========================= */}

            <div className="patients-header">

                <div className="patients-title-section">

                    <div className="patients-icon">
                        👥
                    </div>

                    <div>
                        <h1>My Patients</h1>

                        <p>
                            View and manage patients registered with
                            Arogya 24×7.
                        </p>
                    </div>

                </div>


                <div className="patient-count">

                    <span>
                        {patients.length}
                    </span>

                    <small>
                        Registered Patients
                    </small>

                </div>

            </div>


            {/* =========================
                PATIENTS CONTAINER
            ========================= */}

            <div className="patients-container">

                {patients.length === 0 ? (

                    <div className="no-patients">

                        <div className="no-patients-icon">
                            👥
                        </div>

                        <h2>
                            No Patients Found
                        </h2>

                        <p>
                            No patients have registered yet.
                        </p>

                    </div>

                ) : (

                    <div className="patients-grid">

                        {patients.map((patient) => (

                            <div
                                className="patient-card"
                                key={patient.id}
                            >

                                {/* =========================
                                    CARD HEADER
                                ========================= */}

                                <div className="patient-card-header">

                                    <div className="patient-avatar">

                                        {patient.name
                                            ? patient.name
                                                .charAt(0)
                                                .toUpperCase()
                                            : "P"}

                                    </div>


                                    <div className="patient-name-section">

                                        <h2>
                                            {patient.name}
                                        </h2>

                                        <p>
                                            {patient.email ||
                                                "No email available"}
                                        </p>

                                    </div>

                                </div>


                                {/* =========================
                                    PATIENT DETAILS
                                ========================= */}

                                <div className="patient-details">

                                    <div className="patient-detail">

                                        <span>
                                            Age : </span>

                                        <strong>
                                            { patient.age || "N/A"}
                                        </strong>

                                    </div>


                                    <div className="patient-detail">

                                        <span> Gender : </span>

                                        <strong>
                                            { patient.gender || "N/A"}
                                        </strong>

                                    </div>


                                    <div className="patient-detail">

                                        <span>
                                            Blood Group : </span>

                                        <strong>
                                            { patient.bloodGroup || "N/A"}
                                        </strong>

                                    </div>


                                    <div className="patient-detail">

                                        <span>
                                            Phone : </span>

                                        <strong>
                                            { patient.phone || "N/A"}
                                        </strong>

                                    </div>

                                </div>


                                {/* =========================
                                    VIEW PATIENT BUTTON
                                ========================= */}

                                <button
                                    className="view-patient-btn"
                                    onClick={() =>
                                        alert(
                                            `Patient: ${patient.name}`
                                        )
                                    }
                                >
                                    View Patient
                                </button>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}

export default DoctorPatients;