import { useState, useEffect } from "react";
import "./DoctorAppointments.css";

function DoctorAppointments() {

    const [appointments, setAppointments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    // ==========================
    // Fetch Appointments
    // ==========================

    const fetchAppointments = async () => {

        try {

            const token =
                localStorage.getItem("token");

            if (!token) {

                console.log(
                    "No login token found"
                );

                return;

            }

            const response = await fetch(
                "http://localhost:5000/api/appointments/doctor",
                {
                    method: "GET",

                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {

                const errorData =
                    await response.json();

                throw new Error(
                    errorData.message ||
                    "Unable to fetch appointments"
                );

            }

            const data =
                await response.json();

            console.log(
                "Doctor Appointments:",
                data
            );

            setAppointments(
                Array.isArray(data)
                    ? data
                    : []
            );

        }

        catch (err) {

            console.error(
                "Fetch Appointments Error:",
                err
            );

            setAppointments([]);

        }

    };

    // ==========================
    // Load Appointments
    // ==========================

    useEffect(() => {

        fetchAppointments();

    }, []);

    // ==========================
    // Update Appointment Status
    // ==========================

    const updateStatus = async (
        id,
        status
    ) => {

        try {

            const token =
                localStorage.getItem("token");

            if (!token) {

                alert(
                    "Please login again."
                );

                return;

            }

            const response = await fetch(

                `http://localhost:5000/api/appointments/${id}`,

                {
                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`

                    },

                    body: JSON.stringify({
                        status
                    })

                }

            );

            if (!response.ok) {

                const errorData =
                    await response.json();

                throw new Error(
                    errorData.message ||
                    "Unable to update appointment"
                );

            }

            console.log(
                `Appointment ${status}`
            );

            // Refresh appointments
            await fetchAppointments();

        }

        catch (err) {

            console.error(
                "Update Status Error:",
                err
            );

            alert(
                "Unable to update appointment."
            );

        }

    };

    // ==========================
    // Status Badge Class
    // ==========================

    const getStatusClass = (
        status
    ) => {

        if (
            status === "Pending"
        )
            return "pending";

        if (
            status === "Approved"
        )
            return "approved";

        if (
            status === "Completed"
        )
            return "completed";

        if (
            status === "Rejected"
        )
            return "rejected";

        return "";

    };

    // ==========================
    // View Patient
    // ==========================

    const viewPatient = (
        appointment
    ) => {

        setSelectedPatient(
            appointment
        );

        setShowModal(true);

    };

    // ==========================
    // Close Modal
    // ==========================

    const closeModal = () => {

        setShowModal(false);

        setSelectedPatient(null);

    };

    // ==========================
    // Render
    // ==========================

    return (

        <div className="doctor-appointments">

            {/* ==========================
                Header
            ========================== */}

            <div className="appointments-header">

                <div>

                    <h1>
                        🩺 Doctor Appointments
                    </h1>

                    <p>
                        Manage today's appointments,
                        approve requests,
                        reject invalid bookings
                        and view patient details.
                    </p>

                </div>

            </div>


            {/* ==========================
                Appointment Cards
            ========================== */}

            <div
                className="appointments-grid"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px"
                }}
            >

                {appointments.length === 0 ? (

                    <div
                        className="no-appointments"
                        style={{
                            textAlign: "center",
                            padding: "50px",
                            background: "#ffffff",
                            borderRadius: "16px",
                            boxShadow:
                                "0 4px 15px rgba(0,0,0,0.08)"
                        }}
                    >

                        <h2>
                            📅 No Appointments
                        </h2>

                        <p>
                            There are currently no
                            appointments booked.
                        </p>

                    </div>

                ) : (

                    appointments.map(
                        (appointment) => (

                            <div
                                className="appointment-card"
                                key={
                                    appointment._id
                                }
                                style={{
                                    marginBottom: "0",
                                    width: "100%",
                                    boxSizing:
                                        "border-box"
                                }}
                            >

                                {/* ==========================
                                    TOP SECTION
                                ========================== */}

                                <div
                                    className="appointment-top"
                                    style={{
                                        display: "flex",
                                        justifyContent:
                                            "space-between",
                                        alignItems:
                                            "center",
                                        gap: "20px"
                                    }}
                                >

                                    <div
                                        className="patient-heading"
                                    >

                                        <div
                                            className="patient-icon"
                                        >
                                            👤
                                        </div>

                                        <div>

                                            <h2>

                                                {
                                                    appointment
                                                        .patientId
                                                        ?.name ||

                                                    appointment
                                                        .patient ||

                                                    "Unknown Patient"

                                                }

                                            </h2>

                                            <span
                                                className={
                                                    `status ${getStatusClass(
                                                        appointment.status
                                                    )}`
                                                }
                                            >

                                                {
                                                    appointment.status ||
                                                    "Pending"
                                                }

                                            </span>

                                        </div>

                                    </div>


                                    <div
                                        className="appointment-id"
                                    >

                                        Appointment ID:

                                        <span>

                                            {
                                                appointment._id
                                            }

                                        </span>

                                    </div>

                                </div>


                                {/* ==========================
                                    APPOINTMENT INFORMATION
                                ========================== */}

                                <div
                                    className="appointment-info"
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns:
                                            "repeat(auto-fit, minmax(180px, 1fr))",
                                        gap: "20px",
                                        marginTop: "20px"
                                    }}
                                >

                                    {/* Date */}

                                    <div
                                        className="info-item"
                                    >

                                        <div
                                            className="info-icon date-icon"
                                        >
                                            📅
                                        </div>

                                        <div>

                                            <small>
                                                Date
                                            </small>

                                            <strong>

                                                {
                                                    appointment.date ||
                                                    "N/A"
                                                }

                                            </strong>

                                        </div>

                                    </div>


                                    {/* Time */}

                                    <div
                                        className="info-item"
                                    >

                                        <div
                                            className="info-icon time-icon"
                                        >
                                            ⏰
                                        </div>

                                        <div>

                                            <small>
                                                Time
                                            </small>

                                            <strong>

                                                {
                                                    appointment.time ||
                                                    "N/A"
                                                }

                                            </strong>

                                        </div>

                                    </div>


                                    {/* Tests */}

                                    <div
                                        className="info-item"
                                    >

                                        <div
                                            className="info-icon test-icon"
                                        >
                                            🧪
                                        </div>

                                        <div>

                                            <small>
                                                Tests
                                            </small>

                                            <strong>

                                                {
                                                    appointment.tests &&
                                                    appointment.tests.length >

                                                    0

                                                        ? appointment.tests.join(
                                                            ", "
                                                        )

                                                        : "No tests"
                                                }

                                            </strong>

                                        </div>

                                    </div>


                                    {/* Email */}

                                    <div
                                        className="info-item"
                                    >

                                        <div
                                            className="info-icon email-icon"
                                        >
                                            ✉️
                                        </div>

                                        <div>

                                            <small>
                                                Email
                                            </small>

                                            <strong>

                                                {
                                                    appointment
                                                        .patientId
                                                        ?.email ||

                                                    "No email"
                                                }

                                            </strong>

                                        </div>

                                    </div>


                                    {/* Phone */}

                                    <div
                                        className="info-item"
                                    >

                                        <div
                                            className="info-icon phone-icon"
                                        >
                                            📞
                                        </div>

                                        <div>

                                            <small>
                                                Phone
                                            </small>

                                            <strong>

                                                {
                                                    appointment
                                                        .patientId
                                                        ?.phone ||

                                                    "No phone number"
                                                }

                                            </strong>

                                        </div>

                                    </div>

                                </div>
                                {/* ==========================
                                    BUTTONS
                                ========================== */}

                                <div
                                    className="appointment-actions"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent:
                                            "flex-end",
                                        gap: "14px",
                                        marginTop: "24px",
                                        paddingTop: "18px",
                                        borderTop:
                                            "1px solid #eeeeee",
                                        flexWrap: "wrap"
                                    }}
                                >

                                    {/* Approve */}

                                    <button
                                        className="approve-btn"
                                        onClick={() =>
                                            updateStatus(
                                                appointment._id,
                                                "Approved"
                                            )
                                        }
                                        disabled={
                                            appointment.status ===
                                            "Approved"
                                        }
                                        style={{
                                            margin: "0",
                                            minWidth:
                                                "110px"
                                        }}
                                    >

                                        ✓ Approve

                                    </button>


                                    {/* Reject */}

                                    <button
                                        className="reject-btn"
                                        onClick={() =>
                                            updateStatus(
                                                appointment._id,
                                                "Rejected"
                                            )
                                        }
                                        disabled={
                                            appointment.status ===
                                            "Rejected"
                                        }
                                        style={{
                                            margin: "0",
                                            minWidth:
                                                "110px"
                                        }}
                                    >

                                        ✕ Reject

                                    </button>


                                    {/* View */}

                                    <button
                                      type="button"
                                      className="view-btn"
                                      onClick=
                                      {() =>
                                            viewPatient(appointment)
                                      }
                                    >
                                    <span>👁</span>
                                    <span>View</span>
                                    </button>

                                </div>

                            </div>

                        )
                    )

                )}

            </div>


            {/* ==========================
                Patient Modal
            ========================== */}

            {showModal &&
                selectedPatient && (

                    <div
                        className="modal-overlay"
                    >

                        <div
                            className="patient-modal"
                        >

                            <h2>
                                👤 Patient Details
                            </h2>


                            <p>

                                <strong>
                                    Name:
                                </strong>{" "}

                                {
                                    selectedPatient
                                        .patientId
                                        ?.name ||

                                    "Not available"
                                }

                            </p>


                            <p>

                                <strong>
                                    Email:
                                </strong>{" "}

                                {
                                    selectedPatient
                                        .patientId
                                        ?.email ||

                                    "Not available"
                                }

                            </p>


                            <p>

                                <strong>
                                    Phone:
                                </strong>{" "}

                                {
                                    selectedPatient
                                        .patientId
                                        ?.phone ||

                                    "Not available"
                                }

                            </p>


                            <p>

                                <strong>
                                    Age:
                                </strong>{" "}

                                {
                                    selectedPatient
                                        .patientId
                                        ?.age ||

                                    "Not available"
                                }

                            </p>


                            <p>

                                <strong>
                                    Blood Group:
                                </strong>{" "}

                                {
                                    selectedPatient
                                        .patientId
                                        ?.bloodGroup ||

                                    "Not available"
                                }

                            </p>


                            <p>

                                <strong>
                                    Tests:
                                </strong>{" "}

                                {
                                    selectedPatient.tests &&
                                    selectedPatient.tests.length >

                                    0

                                        ? selectedPatient.tests.join(
                                            ", "
                                        )

                                        : "No tests"
                                }

                            </p>


                            <p>

                                <strong>
                                    Date:
                                </strong>{" "}

                                {
                                    selectedPatient.date ||
                                    "Not available"
                                }

                            </p>


                            <p>

                                <strong>
                                    Time:
                                </strong>{" "}

                                {
                                    selectedPatient.time ||
                                    "Not available"
                                }

                            </p>


                            <p>

                                <strong>
                                    Status:
                                </strong>{" "}

                                {
                                    selectedPatient.status ||
                                    "Pending"
                                }

                            </p>


                            <button
                                className="close-btn"
                                onClick={
                                    closeModal
                                }
                            >

                                Close

                            </button>

                        </div>

                    </div>

                )}

        </div>

    );

}

export default DoctorAppointments;