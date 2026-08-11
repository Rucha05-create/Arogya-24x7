import {
  Link,
  useNavigate
} from "react-router-dom"

function Navbar() {

  const navigate =
    useNavigate()

    let user = null;

    try {
     const storedUser = localStorage.getItem("user");

     if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  }
catch (error) {
  console.log("Invalid user in localStorage");
}

    const role = user?.role;

    const logout = () => {

  localStorage.removeItem("token");

  localStorage.removeItem("role");

  localStorage.removeItem("user");

  navigate("/login-selection");

};

   return (

    <nav className="navbar">

      <div className="logo">

        🩺 Arogya 24×7

      </div>

      <div className="nav-links">

  {/* Guest */}

  {
  !user && (
    <>
      <Link to="/">Home</Link>

      <Link to="/login-selection">
        Login
      </Link>

      <Link to="/client/register">
        Register
      </Link>
    </>
  )
}

  {/* Client */}

  {
    role === "client" && (
      <>
        <Link to="/">Home</Link>

        <Link to="/book">
          Book Test
        </Link>

        <Link to="/packages">
          Packages
        </Link>

        <Link to="/vendors">
          Labs
        </Link>

        <Link to="/client/dashboard">
          Dashboard
        </Link>
      </>
    )
  }

  {/* Administrator */}

  {
    role === "admin" && (
      <>
        <Link to="/admin/dashboard">
          Dashboard
        </Link>

        <Link to="/manage-labs">
          Labs
        </Link>

        <Link to="/manage-tests">
          Tests
        </Link>

        <Link to="/manage-packages">
          Packages
        </Link>

        <Link to="/manage-doctors">
          Doctors
       </Link>

        <Link to="/manage-clients">
          Clients
        </Link>

        <Link to="/appointments">
          Appointments
       </Link>
      </>
    )
  }

  {/* Doctor */}

  {
    role === "doctor" && (
      <>
        <Link to="/doctor/dashboard">
          Dashboard
        </Link>

        <Link to="/patients">
          Patients
        </Link>

        <Link to="/appointments">
          Appointments
        </Link>

        <Link to="/prescriptions">
          Prescriptions
        </Link>
      </>
    )
  }

  {/* Lab */}

  {
    role === "lab" && (
      <>
        <Link to="/lab/dashboard">
          Dashboard
        </Link>

        <Link to="/lab-bookings">
          Bookings
        </Link>

        <Link to="/upload-report">
          Reports
        </Link>
      </>
    )
  }

  {/* Logout */}

  {
    user && (
      <button
        onClick={logout}
        className="logout-btn"
      >
        Logout
      </button>
    )
  }

</div>

    </nav>

  )

}

export default Navbar