import { useState } from "react";
import "./Appointments.css";

function Appointments() {

  const [search, setSearch] = useState("");

  const appointments = [
    {
      id: 1,
      patient: "Rucha Patil",
      doctor: "Dr. Amit",
      lab: "Arogya Lab",
      date: "25 Jul 2026",
      time: "10:30 AM",
      status: "Pending"
    },
    {
      id: 2,
      patient: "Rahul Sharma",
      doctor: "Dr. Sneha",
      lab: "Health Plus",
      date: "26 Jul 2026",
      time: "11:00 AM",
      status: "Completed"
    },
    {
      id: 3,
      patient: "Priya Verma",
      doctor: "Dr. Mehta",
      lab: "City Diagnostics",
      date: "27 Jul 2026",
      time: "09:15 AM",
      status: "Approved"
    }
  ];

  const filteredAppointments = appointments.filter((item) =>

    item.patient.toLowerCase().includes(search.toLowerCase()) ||

    item.doctor.toLowerCase().includes(search.toLowerCase()) ||

    item.lab.toLowerCase().includes(search.toLowerCase())

  );

  const pendingCount = appointments.filter(
    item => item.status === "Pending"
  ).length;

  const approvedCount = appointments.filter(
    item => item.status === "Approved"
  ).length;

  const completedCount = appointments.filter(
    item => item.status === "Completed"
  ).length;

  return (

    <div className="manage-appointments">

      {/* Hero */}

      <div className="appointment-hero">

        <div>

          <h1>📅 Appointment Management</h1>

          <p>
            Manage patient appointments, monitor schedules,
            approve requests and keep track of every consultation.
          </p>

        </div>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3652/3652191.png"
          alt="Appointments"
        />

      </div>

      {/* Statistics */}

      <div className="stats">

        <div className="stat-card">

          <h2>{appointments.length}</h2>

          <p>Total Appointments</p>

        </div>

        <div className="stat-card">

          <h2>{pendingCount}</h2>

          <p>Pending</p>

        </div>

        <div className="stat-card">

          <h2>{approvedCount}</h2>

          <p>Approved</p>

        </div>

        <div className="stat-card">

          <h2>{completedCount}</h2>

          <p>Completed</p>

        </div>

      </div>

      {/* Search */}

      <input

        className="search-box"

        type="text"

        placeholder="🔍 Search Patient, Doctor or Lab"

        value={search}

        onChange={(e) => setSearch(e.target.value)}

      />

      <h2 className="appointment-count">

        Showing {filteredAppointments.length} of {appointments.length} Appointments

      </h2>

      {/* Appointment Cards */}

      <div className="appointment-list">

        {

          filteredAppointments.length > 0 ?

          (

            filteredAppointments.map((item) => (

              <div

                className="appointment-card"

                key={item.id}

              >

                <div className="appointment-info">

                  <h3>

                    👤 {item.patient}

                  </h3>

                  <p>

                    👨‍⚕️ {item.doctor}

                  </p>

                  <p>

                    🧪 {item.lab}

                  </p>

                  <p>

                    📅 {item.date}

                  </p>

                  <p>

                    🕒 {item.time}

                  </p>

                </div>

                <div className="appointment-actions">

                  <span
                    className={`status ${item.status.toLowerCase()}`}
                  >

                    {item.status}

                  </span>

                  <button className="view-btn">

                    👁 View

                  </button>

                  <button className="approve-btn">

                    ✔ Approve

                  </button>

                  <button className="cancel-btn">

                    ✖ Cancel

                  </button>

                </div>

              </div>

            ))

          )

          :

          (

            <div className="appointment-card empty-card">

              <h3>No Appointments Found</h3>

              <p>

                No appointment matches your search.

              </p>

            </div>

          )

        }

      </div>

    </div>

  );

}

export default Appointments;