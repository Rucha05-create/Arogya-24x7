import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LabBookingsPage.css";

function LabBookingsPage() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  // =====================================================
  // GET TOKEN
  // =====================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =====================================================
  // FETCH LAB BOOKINGS
  // =====================================================

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      if (!token) {
        navigate("/lab/login");
        return;
      }

      const response = await axios.get(
        "http://localhost:5000/api/appointments/lab",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      /*
       * Depending on your backend, response.data may be:
       *
       * [
       *   {...},
       *   {...}
       * ]
       *
       * OR
       *
       * {
       *   bookings: [...]
       * }
       *
       * This handles both.
       */

      let data = response.data;

      if (Array.isArray(data)) {
        setBookings(data);
      } else if (Array.isArray(data.bookings)) {
        setBookings(data.bookings);
      } else if (Array.isArray(data.appointments)) {
        setBookings(data.appointments);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Fetch Lab Bookings Error:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("user");

        navigate("/lab/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load laboratory bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchBookings();
  }, []);

  // =====================================================
  // STATUS COUNTS
  // =====================================================

  const totalBookings = bookings.length;

  const pendingBookings = bookings.filter(
    (booking) =>
      String(booking.status || "Pending").toLowerCase() ===
      "pending"
  ).length;

  const approvedBookings = bookings.filter(
    (booking) =>
      String(booking.status || "").toLowerCase() ===
      "approved"
  ).length;

  const completedBookings = bookings.filter(
    (booking) =>
      String(booking.status || "").toLowerCase() ===
      "completed"
  ).length;

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not specified";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =====================================================
  // PATIENT INFORMATION
  // =====================================================

  const getPatient = (booking) => {
    return booking.patientId || booking.patient || {};
  };

  const getPatientName = (booking) => {
    const patient = getPatient(booking);

    return patient.name || "Patient";
  };

  const getPatientEmail = (booking) => {
    const patient = getPatient(booking);

    return patient.email || "No email available";
  };

  const getPatientPhone = (booking) => {
    const patient = getPatient(booking);

    return patient.phone || "Not available";
  };

  // =====================================================
  // INITIALS
  // =====================================================

  const getInitials = (name) => {
    if (!name) {
      return "P";
    }

    return name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => word.charAt(0))
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  // =====================================================
  // STATUS CLASS
  // =====================================================

  const getStatusClass = (status) => {
    const value = String(
      status || "Pending"
    ).toLowerCase();

    switch (value) {
      case "approved":
        return "status-approved";

      case "completed":
        return "status-completed";

      case "rejected":
        return "status-rejected";

      default:
        return "status-pending";
    }
  };

  // =====================================================
  // FILTER BOOKINGS
  // =====================================================

  const filteredBookings = bookings.filter((booking) => {
    const patientName =
      getPatientName(booking).toLowerCase();

    const patientEmail =
      getPatientEmail(booking).toLowerCase();

    const searchValue =
      search.trim().toLowerCase();

    const matchesSearch =
      patientName.includes(searchValue) ||
      patientEmail.includes(searchValue);

    const bookingStatus =
      String(
        booking.status || "Pending"
      ).toLowerCase();

    const matchesStatus =
      statusFilter === "All" ||
      bookingStatus ===
        statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // =====================================================
  // VIEW BOOKING
  // =====================================================

  const handleViewDetails = (booking) => {
    if (!booking?._id) {
      return;
    }

    /*
     * IMPORTANT:
     * This route should be added to App.js if you
     * want a separate booking details page.
     */
    navigate(`/lab/bookings/${booking._id}`);
  };

  // =====================================================
  // CLEAR FILTERS
  // =====================================================

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("All");
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/lab/login");
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="labBookingsPage">

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="labBookingsContent">

        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <section className="pageIntro">

          <div className="introLeft">

            <div className="introIcon">
              🧪
            </div>

            <div>

              <p className="smallHeading">
                LABORATORY MANAGEMENT
              </p>

              <h1>
                Patient Bookings
              </h1>

              <p className="introDescription">
                View, manage and process test bookings
                assigned to your laboratory.
              </p>

            </div>

          </div>

          <div className="introActions">

            <button
              className="refreshButton"
              onClick={fetchBookings}
              disabled={loading}
              type="button"
            >

              <span
                className={
                  loading
                    ? "refreshSpin"
                    : ""
                }
              >
                ↻
              </span>

              {loading
                ? "Refreshing..."
                : "Refresh"}

            </button>

          </div>

        </section>

        {/* =================================================
            STATISTICS
        ================================================= */}

        <section className="statisticsGrid">

          {/* TOTAL */}

          <div className="statCard totalCard">

            <div className="statIcon">
              📋
            </div>

            <div className="statContent">

              <span>
                Total Bookings
              </span>

              <strong>
                {totalBookings}
              </strong>

              <small>
                All patient bookings
              </small>

            </div>

          </div>


          {/* PENDING */}

          <div className="statCard pendingCard">

            <div className="statIcon">
              ⏳
            </div>

            <div className="statContent">

              <span>
                Pending
              </span>

              <strong>
                {pendingBookings}
              </strong>

              <small>
                Waiting for processing
              </small>

            </div>

          </div>


          {/* APPROVED */}

          <div className="statCard approvedCard">

            <div className="statIcon">
              ✓
            </div>

            <div className="statContent">

              <span>
                Approved
              </span>

              <strong>
                {approvedBookings}
              </strong>

              <small>
                Tests approved
              </small>

            </div>

          </div>


          {/* COMPLETED */}

          <div className="statCard completedCard">

            <div className="statIcon">
              🏆
            </div>

            <div className="statContent">

              <span>
                Completed
              </span>

              <strong>
                {completedBookings}
              </strong>

              <small>
                Tests completed
              </small>

            </div>

          </div>

        </section>

        {/* =================================================
            BOOKINGS SECTION
        ================================================= */}

        <section className="bookingSection">

          {/* SECTION HEADER */}

          <div className="bookingSectionHeader">

            <div>

              <p className="sectionLabel">
                PATIENT MANAGEMENT
              </p>

              <h2>
                Assigned Bookings
              </h2>

              <p>
                Manage tests scheduled at your
                laboratory.
              </p>

            </div>

            <div className="bookingCount">

              {filteredBookings.length}

              {" "}

              Booking
              {filteredBookings.length !== 1
                ? "s"
                : ""}

            </div>

          </div>


          {/* =================================================
              SEARCH AND FILTER
          ================================================= */}

          <div className="bookingControls">

            {/* SEARCH */}

            <div className="searchBox">

              <span>
                🔍
              </span>

              <input
                type="text"
                placeholder="Search patient by name or email..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              {search && (

                <button
                  className="clearSearch"
                  onClick={() =>
                    setSearch("")
                  }
                  type="button"
                  aria-label="Clear search"
                >
                  ×
                </button>

              )}

            </div>


            {/* FILTER */}

            <div className="filterBox">

              <span>
                Filter:
              </span>

              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
              >

                <option value="All">
                  All Status
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Approved">
                  Approved
                </option>

                <option value="Completed">
                  Completed
                </option>

                <option value="Rejected">
                  Rejected
                </option>

              </select>

            </div>

          </div>


          {/* =================================================
              ERROR
          ================================================= */}

          {error && (

            <div className="errorBox">

              <span>
                ⚠️
              </span>

              <div>

                <strong>
                  Unable to load bookings
                </strong>

                <p>
                  {error}
                </p>

              </div>

              <button
                onClick={fetchBookings}
                type="button"
              >
                Try Again
              </button>

            </div>

          )}


          {/* =================================================
              LOADING
          ================================================= */}

          {loading && !error && (

            <div className="loadingContainer">

              <div className="loader"></div>

              <h3>
                Loading bookings...
              </h3>

              <p>
                Please wait while we fetch your
                patient bookings.
              </p>

            </div>

          )}


          {/* =================================================
              EMPTY STATE
          ================================================= */}

          {!loading &&
            !error &&
            filteredBookings.length === 0 && (

              <div className="emptyState">

                <div className="emptyIcon">
                  📅
                </div>

                <h3>

                  {bookings.length === 0
                    ? "No Bookings Yet"
                    : "No Matching Bookings"}

                </h3>

                <p>

                  {bookings.length === 0
                    ? "There are currently no patient bookings assigned to this laboratory."
                    : "No bookings match your current search or status filter."}

                </p>


                {bookings.length === 0 && (

                  <button
                    className="emptyRefresh"
                    onClick={fetchBookings}
                    type="button"
                  >
                    ↻ Refresh Bookings
                  </button>

                )}


                {bookings.length > 0 && (

                  <button
                    className="emptyRefresh"
                    onClick={clearFilters}
                    type="button"
                  >
                    Clear Filters
                  </button>

                )}

              </div>

            )}


          {/* =================================================
              BOOKING CARDS
          ================================================= */}

          {!loading &&
            !error &&
            filteredBookings.length > 0 && (

              <div className="bookingsList">

                {filteredBookings.map(
                  (booking, index) => {

                    const patientName =
                      getPatientName(
                        booking
                      );

                    const patientEmail =
                      getPatientEmail(
                        booking
                      );

                    const patientPhone =
                      getPatientPhone(
                        booking
                      );

                    const status =
                      booking.status ||
                      "Pending";

                    return (

                      <article
                        className="bookingCard"
                        key={
                          booking._id ||
                          index
                        }
                      >

                        {/* =================================================
                            CARD HEADER
                        ================================================= */}

                        <div className="bookingTop">

                          <div className="patientInfo">

                            <div className="patientAvatar">

                              {getInitials(
                                patientName
                              )}

                            </div>

                            <div>

                              <h3>
                                {patientName}
                              </h3>

                              <p>
                                {patientEmail}
                              </p>

                            </div>

                          </div>


                          <span
                            className={
                              `statusBadge ${
                                getStatusClass(
                                  status
                                )
                              }`
                            }
                          >

                            <span className="statusDot"></span>

                            {status}

                          </span>

                        </div>


                        {/* =================================================
                            APPOINTMENT DETAILS
                        ================================================= */}

                        <div className="bookingDetails">

                          {/* DATE */}

                          <div className="detailItem">

                            <span className="detailIcon">
                              📅
                            </span>

                            <div>

                              <small>
                                Appointment Date
                              </small>

                              <strong>
                                {formatDate(
                                  booking.date
                                )}
                              </strong>

                            </div>

                          </div>


                          {/* TIME */}

                          <div className="detailItem">

                            <span className="detailIcon">
                              🕐
                            </span>

                            <div>

                              <small>
                                Appointment Time
                              </small>

                              <strong>
                                {booking.time ||
                                  "Not specified"}
                              </strong>

                            </div>

                          </div>


                          {/* PHONE */}

                          <div className="detailItem">

                            <span className="detailIcon">
                              📞
                            </span>

                            <div>

                              <small>
                                Contact
                              </small>

                              <strong>
                                {patientPhone}
                              </strong>

                            </div>

                          </div>

                        </div>


                        {/* =================================================
                            REQUESTED TESTS
                        ================================================= */}

                        <div className="testsSection">

                          <div className="testsTitle">

                            <span>
                              🧪
                            </span>

                            Requested Tests

                          </div>


                          <div className="testTags">

                            {Array.isArray(
                              booking.tests
                            ) &&
                            booking.tests.length > 0 ? (

                              booking.tests.map(
                                (
                                  test,
                                  testIndex
                                ) => {

                                  let testName =
                                    "Test";

                                  if (
                                    typeof test ===
                                    "string"
                                  ) {
                                    testName =
                                      test;
                                  } else if (
                                    typeof test ===
                                    "object" &&
                                    test !== null
                                  ) {
                                    testName =
                                      test.name ||
                                      test.testName ||
                                      test.title ||
                                      "Test";
                                  }

                                  return (

                                    <span
                                      className="testTag"
                                      key={
                                        testIndex
                                      }
                                    >
                                      {testName}
                                    </span>

                                  );
                                }
                              )

                            ) : (

                              <span className="noTests">
                                No tests specified
                              </span>

                            )}

                          </div>

                        </div>


                        {/* =================================================
                            CARD FOOTER
                        ================================================= */}

                        <div className="bookingFooter">

                          <span className="bookingId">

                            Booking ID:{" "}

                            <strong>

                              {booking._id
                                ? booking._id
                                    .slice(-8)
                                    .toUpperCase()
                                : "N/A"}

                            </strong>

                          </span>


                          <button
                            className="viewButton"
                            onClick={() =>
                              handleViewDetails(
                                booking
                              )
                            }
                            type="button"
                          >

                            View Details

                            <span>
                              →
                            </span>

                          </button>

                        </div>

                      </article>

                    );
                  }
                )}

              </div>

            )}

        </section>

      </main>


      {/* =================================================
          FOOTER
      ================================================= */}

      <footer className="labBookingsFooter">

        <div>

          <strong>
            Arogya 24×7
          </strong>

          <p>
            Laboratory Management Portal
          </p>

        </div>

        <span>
          © {new Date().getFullYear()}
          {" "}
          Arogya 24×7
        </span>

      </footer>

    </div>
  );
}

export default LabBookingsPage;