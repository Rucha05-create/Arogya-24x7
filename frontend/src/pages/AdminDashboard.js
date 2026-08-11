import { Link } from "react-router-dom";
import "./AdminDashboard.css";

function AdminDashboard() {

  const today = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (

    <div className="admin-dashboard">

      {/* Hero Section */}

      <div className="admin-hero">

        <div>

          <h1>👋 Welcome Back, Administrator</h1>

          <p>
            Manage your pathology labs, doctors, appointments and reports
            from one central dashboard.
          </p>

          <span className="date">
            Today: {today}
          </span>

        </div>

        <img
          src="https://cdn-icons-png.flaticon.com/512/3774/3774299.png"
          alt="Administrator"
        />

      </div>

      {/* Dashboard Title */}

      <h2 className="dashboard-title">
        Administrator Dashboard
      </h2>

      {/* Dashboard Buttons */}

      <div className="admin-grid">

        <Link to="/manage-labs">
  <button>
    <span className="action-icon">🧪</span>
    <span className="action-text">Manage Labs</span>
    <span className="action-desc">
      Add, edit and manage pathology laboratories.
    </span>
  </button>
</Link>

<Link to="/manage-tests">
  <button>
    <span className="action-icon">🧬</span>
    <span className="action-text">Manage Tests</span>
    <span className="action-desc">
      Create and update diagnostic tests.
    </span>
  </button>
</Link>

<Link to="/manage-packages">
  <button>
    <span className="action-icon">📦</span>
    <span className="action-text">Packages</span>
    <span className="action-desc">
      Create health checkup packages.
    </span>
  </button>
</Link>

<Link to="/manage-doctors">
  <button>
    <span className="action-icon">👨‍⚕️</span>
    <span className="action-text">Doctors</span>
    <span className="action-desc">
      Manage registered doctors.
    </span>
  </button>
</Link>

<Link to="/manage-clients">
  <button>
    <span className="action-icon">👥</span>
    <span className="action-text">Clients</span>
    <span className="action-desc">
      View and manage patient accounts.
    </span>
  </button>
</Link>

<Link to="/appointments">
  <button>
    <span className="action-icon">📅</span>
    <span className="action-text">Appointments</span>
    <span className="action-desc">
      View upcoming bookings and reports.
    </span>
  </button>
</Link>
      </div>

    </div>

  );

}

export default AdminDashboard;