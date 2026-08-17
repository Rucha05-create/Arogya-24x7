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
import LabReports from "./pages/LabReports";

// ================= GENERAL =================

import Appointments from "./pages/Appointments";

// ================= DOCTOR =================

import DoctorLayout from "./layouts/DoctorLayout";
import DoctorDashboard from "./pages/DoctorDashboard";
import DoctorAppointments from "./pages/DoctorAppointments";
import DoctorPatients from "./pages/DoctorPatients";
import DoctorReports from "./pages/DoctorReports";


// ======================================================
// APP CONTENT
// ======================================================

function AppContent() {

  const location = useLocation();

  // ======================================================
  // HIDE COMMON NAVBAR ON DOCTOR PAGES
  // ======================================================

  const hideNavbar =
    location.pathname.startsWith("/doctor");

  return (
    <>

      {/* ==================================================
          COMMON NAVBAR
      ================================================== */}

      {!hideNavbar && <Navbar />}


      <Routes>


        {/* ==================================================
            PUBLIC
        ================================================== */}

        <Route
          path="/"
          element={
            <Navigate
              to="/client/home"
              replace
            />
          }
        />

        <Route
          path="/client/home"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/profile"
          element={<Dashboard />}
        />

        <Route
          path="/book"
          element={<BookTest />}
        />

        <Route
          path="/edit-profile"
          element={<EditProfile />}
        />

        <Route
          path="/packages"
          element={<Packages />}
        />

        <Route
          path="/vendors"
          element={<Vendors />}
        />


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
          element={
            <ProtectedRoute allowedRole="admin">
              <ManageLabs />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-tests"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManageTests />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-packages"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManagePackages />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-doctors"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManageDoctors />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manage-clients"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManageClients />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            LAB
        ================================================== */}

        {/* ==================================================
            LAB DASHBOARD
        ================================================== */}

        <Route
          path="/lab/dashboard"
          element={
            <ProtectedRoute allowedRole="lab">
              <LabDashboard />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            LAB BOOKINGS
        ================================================== */}

        {/* Main Lab Bookings Route */}

        <Route
          path="/lab/bookings"
          element={
            <ProtectedRoute allowedRole="lab">
              <LabBookingsPage />
            </ProtectedRoute>
          }
        />

        {/* Old Route - Compatibility */}

        <Route
          path="/lab-bookings"
          element={
            <ProtectedRoute allowedRole="lab">
              <LabBookingsPage />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            LAB PATIENTS
        ================================================== */}

        <Route
          path="/lab/patients"
          element={
            <ProtectedRoute allowedRole="lab">
              <Patients />
            </ProtectedRoute>
          }
        />

        {/* Old Route - Compatibility */}

        <Route
          path="/patients"
          element={
            <ProtectedRoute allowedRole="lab">
              <Patients />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            LAB PRESCRIPTIONS
        ================================================== */}

        <Route
          path="/lab/prescriptions"
          element={
            <ProtectedRoute allowedRole="lab">
              <Prescriptions />
            </ProtectedRoute>
          }
        />

        {/* Old Route - Compatibility */}

        <Route
          path="/prescriptions"
          element={
            <ProtectedRoute allowedRole="lab">
              <Prescriptions />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            LAB UPLOAD REPORT
        ================================================== */}

        {/* 
          This is the page where the laboratory
          uploads a new report.
        */}

        <Route
          path="/lab/reports"
          element={
            <ProtectedRoute allowedRole="lab">
              <UploadReport />
            </ProtectedRoute>
          }
        />

        {/* Old Upload Report Route - Compatibility */}

        <Route
          path="/upload-report"
          element={
            <ProtectedRoute allowedRole="lab">
              <UploadReport />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            LAB REPORTS
        ================================================== */}

        {/* 
          This page displays reports already
          created/uploaded by the laboratory.
        */}

        <Route
          path="/lab-reports"
          element={
            <ProtectedRoute allowedRole="lab">
              <LabReports />
            </ProtectedRoute>
          }
        />


        {/* 
          Additional clean route for Lab Reports.
        */}

        <Route
          path="/lab/report-list"
          element={
            <ProtectedRoute allowedRole="lab">
              <LabReports />
            </ProtectedRoute>
          }
        />


        {/* ==================================================
            GENERAL APPOINTMENTS
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

          {/* ==================================================
              /doctor → /doctor/dashboard
          ================================================== */}

          <Route
            index
            element={
              <Navigate
                to="dashboard"
                replace
              />
            }
          />


          {/* ==================================================
              DOCTOR DASHBOARD
          ================================================== */}

          <Route
            path="dashboard"
            element={<DoctorDashboard />}
          />


          {/* ==================================================
              DOCTOR APPOINTMENTS
          ================================================== */}

          <Route
            path="appointments"
            element={<DoctorAppointments />}
          />


          {/* ==================================================
              DOCTOR PATIENTS
          ================================================== */}

          <Route
            path="patients"
            element={<DoctorPatients />}
          />


          {/* ==================================================
              DOCTOR REPORTS
          ================================================== */}

          <Route
            path="reports"
            element={<DoctorReports />}
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