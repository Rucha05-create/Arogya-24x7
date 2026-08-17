import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./UploadReport.css";

function UploadReport() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const appointmentFromUrl =
    searchParams.get("appointmentId");

  // =====================================================
  // STATE
  // =====================================================

  const [bookings, setBookings] = useState([]);

  const [appointmentId, setAppointmentId] =
    useState(appointmentFromUrl || "");

  const [patientId, setPatientId] =
    useState("");

  const [testName, setTestName] =
    useState("");

  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [fetching, setFetching] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  // File input reference
  const fileInputRef = useRef(null);


  // =====================================================
  // FETCH LAB BOOKINGS
  // =====================================================

  const fetchBookings = async () => {
    try {
      setFetching(true);
      setError("");

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/lab/login");
        return;
      }

      const response =
        await axios.get(
          "http://localhost:5000/api/appointments/lab",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const bookingData =
        Array.isArray(response.data)
          ? response.data
          : [];

      setBookings(bookingData);

      // =================================================
      // AUTO SELECT BOOKING FROM URL
      // =================================================

      if (appointmentFromUrl) {

        const selectedBooking =
          bookingData.find(
            (booking) =>
              booking._id === appointmentFromUrl
          );

        if (selectedBooking) {

          setAppointmentId(
            selectedBooking._id
          );

          const selectedPatient =
            selectedBooking.patientId;

          const selectedPatientId =
            selectedPatient?._id ||
            selectedPatient ||
            "";

          setPatientId(
            selectedPatientId
          );

          let tests =
            selectedBooking.tests;

          if (Array.isArray(tests)) {

            tests =
              tests
                .map((test) => {

                  if (
                    typeof test ===
                    "object"
                  ) {

                    return (
                      test.name ||
                      test.testName ||
                      "Test"
                    );

                  }

                  return test;

                })
                .join(", ");

          }

          setTestName(
            tests || ""
          );

        }

      }

    } catch (err) {

      console.error(
        "Fetch bookings error:",
        err
      );

      if (
        err.response?.status === 401
      ) {

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "role"
        );

        localStorage.removeItem(
          "user"
        );

        navigate("/lab/login");

        return;
      }

      setError(
        err.response?.data?.message ||
        "Unable to load bookings."
      );

    } finally {

      setFetching(false);

    }
  };


  // =====================================================
  // LOAD BOOKINGS
  // =====================================================

  useEffect(() => {

    fetchBookings();

  }, []);


  // =====================================================
  // BOOKING SELECTION
  // =====================================================

  const handleBookingChange = (e) => {

    const selectedId =
      e.target.value;

    setAppointmentId(
      selectedId
    );

    setMessage("");
    setError("");

    if (!selectedId) {

      setPatientId("");
      setTestName("");

      return;

    }

    const selectedBooking =
      bookings.find(
        (booking) =>
          booking._id === selectedId
      );

    if (!selectedBooking) {

      setPatientId("");
      setTestName("");

      return;

    }

    // =================================================
    // PATIENT
    // =================================================

    const selectedPatient =
      selectedBooking.patientId;

    const selectedPatientId =
      selectedPatient?._id ||
      selectedPatient ||
      "";

    setPatientId(
      selectedPatientId
    );


    // =================================================
    // TEST NAME
    // =================================================

    let tests =
      selectedBooking.tests;

    if (Array.isArray(tests)) {

      tests =
        tests
          .map((test) => {

            if (
              typeof test ===
              "object"
            ) {

              return (
                test.name ||
                test.testName ||
                "Test"
              );

            }

            return test;

          })
          .join(", ");

    }

    setTestName(
      tests || ""
    );

  };


  // =====================================================
  // FILE SELECTION
  // =====================================================

  const handleFileChange = (e) => {

    const selectedFile =
      e.target.files?.[0];

    setError("");
    setMessage("");

    if (!selectedFile) {

      setFile(null);

      return;

    }


    // =================================================
    // ALLOWED FILE TYPES
    // =================================================

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/jpg",
    ];

    const allowedExtensions = [
      ".pdf",
      ".jpg",
      ".jpeg",
      ".png",
    ];

    const fileName =
      selectedFile.name.toLowerCase();

    const hasValidType =
      allowedTypes.includes(
        selectedFile.type
      );

    const hasValidExtension =
      allowedExtensions.some(
        (extension) =>
          fileName.endsWith(extension)
      );

    if (
      !hasValidType &&
      !hasValidExtension
    ) {

      setError(
        "Only PDF, JPG, JPEG and PNG files are allowed."
      );

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;

    }


    // =================================================
    // FILE SIZE
    // =================================================

    if (
      selectedFile.size >
      10 * 1024 * 1024
    ) {

      setError(
        "File size must be less than 10 MB."
      );

      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;

    }


    setFile(
      selectedFile
    );

  };


  // =====================================================
  // OPEN FILE SELECTOR
  // =====================================================

  const openFileSelector = () => {

    if (fileInputRef.current) {

      fileInputRef.current.click();

    }

  };


  // =====================================================
  // REMOVE SELECTED FILE
  // =====================================================

  const removeFile = () => {

    setFile(null);

    setError("");

    if (fileInputRef.current) {

      fileInputRef.current.value = "";

    }

  };


  // =====================================================
  // UPLOAD REPORT
  // =====================================================

  const handleUpload = async (e) => {

    e.preventDefault();

    setMessage("");
    setError("");


    // =================================================
    // VALIDATION
    // =================================================

    if (!appointmentId) {

      setError(
        "Please select a booking."
      );

      return;

    }


    if (!patientId) {

      setError(
        "Patient information is missing."
      );

      return;

    }


    if (
      !testName ||
      testName.trim() === ""
    ) {

      setError(
        "Please enter the test name."
      );

      return;

    }


    if (!file) {

      setError(
        "Please select a report file."
      );

      return;

    }


    try {

      setLoading(true);


      const token =
        localStorage.getItem("token");


      if (!token) {

        navigate("/lab/login");

        return;

      }


      // =================================================
      // FORM DATA
      // =================================================

      const formData =
        new FormData();

      formData.append(
        "appointmentId",
        appointmentId
      );

      formData.append(
        "patientId",
        patientId
      );

      formData.append(
        "testName",
        testName.trim()
      );

      formData.append(
        "report",
        file
      );


      // =================================================
      // API REQUEST
      // =================================================

      const response =
        await axios.post(

          "http://localhost:5000/api/reports/upload",

          formData,

          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }

        );


      console.log(
        "Upload response:",
        response.data
      );


      // =================================================
      // SUCCESS
      // =================================================

      setMessage(
        "Report uploaded successfully!"
      );


      // Reset form

      setAppointmentId("");
      setPatientId("");
      setTestName("");
      setFile(null);


      if (fileInputRef.current) {

        fileInputRef.current.value = "";

      }


      // Refresh bookings

      await fetchBookings();


      // Optional redirect after upload

      setTimeout(() => {

        navigate("/lab-reports");

      }, 1200);


    } catch (err) {

      console.error(
        "Upload report error:",
        err
      );


      if (
        err.response?.status === 401
      ) {

        localStorage.removeItem(
          "token"
        );

        localStorage.removeItem(
          "role"
        );

        localStorage.removeItem(
          "user"
        );

        navigate("/lab/login");

        return;

      }


      setError(
        err.response?.data?.message ||
        "Unable to upload report."
      );

    } finally {

      setLoading(false);

    }

  };


  // =====================================================
  // GET PATIENT NAME
  // =====================================================

  const getPatientName = () => {

    if (!appointmentId) {

      return "";

    }

    const booking =
      bookings.find(
        (item) =>
          item._id === appointmentId
      );

    if (!booking) {

      return "";

    }

    return (
      booking.patientId?.name ||
      booking.patient?.name ||
      "Patient"
    );

  };


  // =====================================================
  // MAIN JSX
  // =====================================================

  return (

    <div className="uploadReportPage">

      {/* =================================================
          HEADER
      ================================================= */}

      <section className="uploadHeader">

        <div className="headerIcon">
          📄
        </div>

        <div>

          <span>
            LABORATORY MANAGEMENT
          </span>

          <h1>
            Upload Patient Report
          </h1>

          <p>
            Upload completed test reports
            for your patients.
          </p>

        </div>

      </section>


      {/* =================================================
          MAIN CARD
      ================================================= */}

      <div className="uploadCard">

        <div className="cardHeader">

          <h2>
            Report Details
          </h2>

          <p>
            Select a patient booking and
            upload the completed report.
          </p>

        </div>


        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {message && (

          <div className="successMessage">

            ✓ {message}

          </div>

        )}


        {/* =================================================
            ERROR MESSAGE
        ================================================= */}

        {error && (

          <div className="errorMessage">

            ⚠ {error}

          </div>

        )}


        <form
          onSubmit={handleUpload}
          className="reportForm"
        >

          {/* =================================================
              PATIENT BOOKING
          ================================================= */}

          <div className="formGroup">

            <label htmlFor="appointmentId">
              Select Patient Booking
            </label>

            <select
              id="appointmentId"
              name="appointmentId"
              value={appointmentId}
              onChange={
                handleBookingChange
              }
              disabled={fetching}
            >

              <option value="">

                {fetching
                  ? "Loading bookings..."
                  : bookings.length === 0
                  ? "No bookings available"
                  : "Select a booking"}

              </option>


              {bookings.map(
                (booking) => {

                  const patient =
                    booking.patientId;

                  const patientName =
                    patient?.name ||
                    booking.patient?.name ||
                    "Patient";


                  return (

                    <option
                      key={booking._id}
                      value={booking._id}
                    >

                      {patientName}

                      {" - Booking "}

                      {booking._id
                        ?.slice(-6)
                        .toUpperCase()}

                    </option>

                  );

                }
              )}

            </select>

            {!fetching &&
              bookings.length === 0 && (

                <small className="fieldHelp">

                  No patient bookings are
                  currently assigned to this lab.

                </small>

              )}

          </div>


          {/* =================================================
              PATIENT
          ================================================= */}

          <div className="formGroup">

            <label htmlFor="patientName">
              Patient
            </label>

            <input
              id="patientName"
              type="text"
              value={
                getPatientName()
              }
              placeholder="Select a booking first"
              readOnly
            />

          </div>


          {/* =================================================
              TEST NAME
          ================================================= */}

          <div className="formGroup">

            <label htmlFor="testName">
              Test Name
            </label>

            <input
              id="testName"
              name="testName"
              type="text"
              value={testName}
              onChange={(e) => {

                setTestName(
                  e.target.value
                );

                setError("");

              }}
              placeholder="Enter test name"
            />

            <small className="fieldHelp">

              You can edit the test name
              before uploading.

            </small>

          </div>


          {/* =================================================
              FILE UPLOAD
          ================================================= */}

          <div className="formGroup">

            <label htmlFor="reportFile">
              Upload Report
            </label>


            {/* Actual file input */}

            <input
              ref={fileInputRef}
              id="reportFile"
              name="report"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
              onChange={
                handleFileChange
              }
              className="realFileInput"
            />


            {/* Clickable upload area */}

            <button
              type="button"
              className="fileUpload"
              onClick={
                openFileSelector
              }
            >

              <div className="uploadPlaceholder">

                <span className="fileIcon">
                  📎
                </span>

                <strong>
                  {file
                    ? "Change report file"
                    : "Choose report file"}
                </strong>

                <small>
                  PDF, JPG, JPEG or PNG
                  • Maximum 10 MB
                </small>

              </div>

            </button>


            {/* Selected file */}

            {file && (

              <div className="selectedFile">

                <span>
                  ✓
                </span>

                <span>
                  {file.name}
                </span>

                <button
                  type="button"
                  onClick={
                    removeFile
                  }
                  className="removeFileButton"
                >
                  ×
                </button>

              </div>

            )}

          </div>


          {/* =================================================
              UPLOAD BUTTON
          ================================================= */}

          <button
            type="submit"
            className="uploadButton"
            disabled={
              loading ||
              fetching
            }
          >

            {loading
              ? "Uploading..."
              : "📤 Upload Report"}

          </button>

        </form>

      </div>


      {/* =================================================
          INFO
      ================================================= */}

      <div className="uploadInfo">

        <div>
          🔒
        </div>

        <div>

          <h3>
            Secure Report Upload
          </h3>

          <p>
            Patient reports are securely
            stored and associated with the
            selected appointment.
          </p>

        </div>

      </div>

    </div>

  );

}

export default UploadReport;