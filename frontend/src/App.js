import "./styles/style.css";

import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// ================= COMMON =================

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import BookTest from "./pages/BookTest";
import EditProfile from "./pages/EditProfile";
import Packages from "./pages/Packages";
import Vendors from "./pages/Vendors";

// ================= LOGIN =================

import LoginSelection from "./pages/LoginSelection";
import ClientLogin from "./pages/ClientLogin";
import AdminLogin from "./pages/AdminLogin";
import DoctorLogin from "./pages/DoctorLogin";
import LabLogin from "./pages/LabLogin";
import ClientRegister from "./pages/ClientRegister";

// ================= DASHBOARDS =================

import ClientDashboard from "./pages/ClientDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LabDashboard from "./pages/LabDashboard";

// ================= ADMIN =================

import ManageLabs from "./pages/ManageLabs";
import ManageTests from "./pages/ManageTests";
import ManagePackages from "./pages/ManagePackages";
import ManageDoctors from "./pages/ManageDoctors";
import ManageClients from "./pages/ManageClients";

// ================= LAB =================

import Patients from "./pages/Patients";
import Prescriptions from "./pages/Prescriptions";
import LabBookingsPage from "./pages/LabBookingsPage";
import UploadReport from "./pages/UploadReport";

// ================= GENERAL =================

import Appointments from "./pages/Appointments";

// ================= DOCTOR =================

import DoctorLayout from "./layouts/DoctorLayout";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorPatients from "./pages/DoctorPatients";
import DoctorReports from "./pages/DoctorReports";
import DoctorProfile from "./pages/DoctorProfile";

// ======================================================
// APP CONTENT
// ======================================================

function AppContent() {
  const location = useLocation();

  // Hide the common/public Navbar on all Doctor pages
  const hideNavbar = location.pathname.startsWith("/doctor");

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ==================================================
            PUBLIC
        ================================================== */}

        <Route path="/" element={<Navigate to="/client/home" replace />} />

        <Route path="/client/home" element={<Home />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/profile" element={<Dashboard />} />

        <Route path="/book" element={<BookTest />} />

        <Route path="/edit-profile" element={<EditProfile />} />

        <Route path="/packages" element={<Packages />} />

        <Route path="/vendors" element={<Vendors />} />

        {/* ==================================================
            LOGIN
        ================================================== */}

        <Route
          path="/login-selection"
          element={<LoginSelection />}
        />

        <Route
          path="/client/login"
          element={<ClientLogin />}
        />

        <Route
          path="/admin/login"
          element={<AdminLogin />}
        />

        <Route
          path="/doctor/login"
          element={<DoctorLogin />}
        />

        <Route
          path="/lab/login"
          element={<LabLogin />}
        />

        <Route
          path="/client/register"
          element={<ClientRegister />}
        />

        {/* ==================================================
            CLIENT
        ================================================== */}

        <Route
          path="/client/dashboard"
          element={
            <ProtectedRoute allowedRole="client">
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        {/* ==================================================
            ADMIN
        ================================================== */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-labs"
          element={<ManageLabs />}
        />

        <Route
          path="/manage-tests"
          element={<ManageTests />}
        />

        <Route
          path="/manage-packages"
          element={<ManagePackages />}
        />

        <Route
          path="/manage-doctors"
          element={<ManageDoctors />}
        />

        <Route
          path="/manage-clients"
          element={<ManageClients />}
        />

        {/* ==================================================
            LAB
        ================================================== */}

        <Route
          path="/lab/dashboard"
          element={
            <ProtectedRoute allowedRole="lab">
              <LabDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patients"
          element={<Patients />}
        />

        <Route
          path="/prescriptions"
          element={<Prescriptions />}
        />

        <Route
          path="/lab-bookings"
          element={<LabBookingsPage />}
        />

        <Route
          path="/upload-report"
          element={<UploadReport />}
        />

        {/* ==================================================
            GENERAL
        ================================================== */}

        <Route
          path="/appointments"
          element={<Appointments />}
        />

        {/* ==================================================
            DOCTOR
        ================================================== */}

        <Route
          path="/doctor"
          element={
            <ProtectedRoute allowedRole="doctor">
              <DoctorLayout />
            </ProtectedRoute>
          }
        >
          {/* /doctor → /doctor/dashboard */}

          <Route
            index
            element={
              <Navigate
                to="dashboard"
                replace
              />
            }
          />

          {/* Doctor Dashboard */}

          <Route
            path="dashboard"
            element={<DoctorDashboard />}
          />

          {/* Doctor Appointments */}

          <Route
            path="appointments"
            element={<DoctorAppointments />}
          />

          {/* Doctor Patients */}

          <Route
            path="patients"
            element={<DoctorPatients />}
          />

          {/* Doctor Reports */}

          <Route
            path="reports"
            element={<DoctorReports />}
          />

          {/* Doctor Profile */}

          <Route
            path="profile"
            element={<DoctorProfile />}
          />
        </Route>

        {/* ==================================================
            INVALID / UNKNOWN ROUTE
        ================================================== */}

        <Route
          path="*"
          element={
            <Navigate
              to="/client/home"
              replace
            />
          }
        />
      </Routes>
    </>
  );
}

// ======================================================
// MAIN APP
// ======================================================

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
