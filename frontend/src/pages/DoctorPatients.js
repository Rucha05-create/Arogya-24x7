import { useEffect, useState } from "react";
import "./DoctorPatients.css";

function DoctorPatients() {

    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // ==========================
    // Fetch Patients
    // ==========================

    const fetchPatients = async () => {

        try {

            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:5000/api/doctor/patients",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Unable to fetch patients"
                );

            }

            const data = await response.json();

            console.log(
                "Registered Patients:",
                data
            );

            setPatients(
                Array.isArray(data)
                    ? data
                    : []
            );

        }

        catch (err) {

            console.error(
                "Patients Fetch Error:",
                err
            );

            setError(
                "Unable to load patients."
            );

        }

        finally {

            setLoading(false);

        }

    };

    // ==========================
    // Load Patients
    // ==========================

    useEffect(() => {

        fetchPatients();

    }, []);

    // ==========================
    // Loading
    // ==========================

    if (loading) {

        return (

            <div className="doctor-patients">

                <div className="patients-loading">

                    <h2>Loading Patients...</h2>

                    <p>
                        Please wait while we fetch
                        registered clients.
                    </p>

                </div>

            </div>

        );

    }

    // ==========================
    // Error
    // ==========================

    if (error) {

        return (

            <div className="doctor-patients">

                <div className="patients-error">

                    <h2>❌ {error}</h2>

                    <button
                        onClick={fetchPatients}
                    >
                        🔄 Try Again
                    </button>

                </div>

            </div>

        );

    }

    // ==========================
    // Main Page
    // ==========================

    return (

        <div className="doctor-patients">

            <div className="patients-header">

                <div>

                    <h1>
                        👥 Doctor Patients
                    </h1>

                    <p>
                        View all clients who have
                        successfully registered with
                        Arogya 24×7.
                    </p>

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

            {patients.length === 0 ? (

                <div className="no-patients">

                    <div className="empty-icon">
                        👥
                    </div>

                    <h2>
                        No Patients Found
                    </h2>

                    <p>
                        No clients have registered yet.
                    </p>

                </div>

            ) : (

                <div className="patients-grid">

                    {patients.map(
                        (patient) => (

                            <div
                                className="patient-card"
                                key={patient._id}
                            >

                                <div className="patient-card-header">

                                    <div className="patient-avatar">
                                        👤
                                    </div>

                                    <div>

                                        <h2>
                                            {patient.name}
                                        </h2>

                                        <span>
                                            {patient.status || "Active"}
                                        </span>

                                    </div>

                                </div>

                                <div className="patient-details">

                                    <p>
                                        <strong>
                                            📧 Email:
                                        </strong>

                                        {patient.email || "Not provided"}
                                    </p>

                                    <p>
                                        <strong>
                                            📞 Phone:
                                        </strong>

                                        {patient.phone || "Not provided"}
                                    </p>

                                    <p>
                                        <strong>
                                            🎂 Age:
                                        </strong>

                                        {patient.age || "Not provided"}
                                    </p>

                                    <p>
                                        <strong>
                                            ⚧ Gender:
                                        </strong>

                                        {patient.gender || "Not provided"}
                                    </p>

                                    <p>
                                        <strong>
                                            🩸 Blood Group:
                                        </strong>

                                        {patient.bloodGroup || "Not provided"}
                                    </p>

                                    <p>
                                        <strong>
                                            🏠 Address:
                                        </strong>

                                        {patient.address || "Not provided"}
                                    </p>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}

        </div>

    );

}

export default DoctorPatients;