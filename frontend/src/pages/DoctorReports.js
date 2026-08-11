import { useEffect, useState } from "react";
import "./DoctorReports.css";

function DoctorReports() {

    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchReports = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/reports",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {

                throw new Error(
                    "Unable to fetch reports"
                );

            }

            const data =
                await response.json();

            console.log(
                "Reports:",
                data
            );

            setReports(
                Array.isArray(data)
                    ? data
                    : []
            );

        }

        catch (error) {

            console.error(
                "Fetch Reports Error:",
                error
            );

            setError(
                "Unable to load reports."
            );

        }

        finally {

            setLoading(false);

        }

    };

    useEffect(() => {

        fetchReports();

    }, []);

    const getStatusClass = (status) => {

        switch (status) {

            case "Completed":
                return "completed";

            case "Pending":
                return "pending";

            case "Reviewed":
                return "reviewed";

            default:
                return "";

        }

    };

    return (

        <div className="doctor-reports-page">

            {/* =========================
                HEADER
            ========================= */}

            <div className="reports-header">

                <div>

                    <h1>
                        📋 Doctor Reports
                    </h1>

                    <p>
                        View patient laboratory
                        reports and test results.
                    </p>

                </div>

                <div className="reports-count">

                    <span>
                        {reports.length}
                    </span>

                    <small>
                        Reports
                    </small>

                </div>

            </div>


            {/* =========================
                LOADING
            ========================= */}

            {loading && (

                <div className="reports-message">

                    <div className="loading-icon">
                        ⏳
                    </div>

                    <h2>
                        Loading Reports...
                    </h2>

                    <p>
                        Please wait while we
                        fetch the reports.
                    </p>

                </div>

            )}


            {/* =========================
                ERROR
            ========================= */}

            {!loading && error && (

                <div className="reports-message error-message">

                    <div className="message-icon">
                        ❌
                    </div>

                    <h2>
                        Unable to Load Reports
                    </h2>

                    <p>
                        {error}
                    </p>

                    <button
                        onClick={fetchReports}
                    >
                        🔄 Try Again
                    </button>

                </div>

            )}


            {/* =========================
                NO REPORTS
            ========================= */}

            {!loading &&
                !error &&
                reports.length === 0 && (

                    <div className="reports-message">

                        <div className="message-icon">
                            📋
                        </div>

                        <h2>
                            No Reports Found
                        </h2>

                        <p>
                            There are no laboratory
                            reports available yet.
                        </p>

                    </div>

                )}


            {/* =========================
                REPORT CARDS
            ========================= */}

            {!loading &&
                !error &&
                reports.length > 0 && (

                    <div className="reports-list">

                        {reports.map(
                            (report) => (

                                <div
                                    className="report-card"
                                    key={report._id}
                                >

                                    {/* Patient */}

                                    <div className="report-top">

                                        <div>

                                            <h2>
                                                👤{" "}
                                                {report.patientId?.name ||
                                                    "Unknown Patient"}
                                            </h2>

                                            <p>
                                                📧{" "}
                                                {report.patientId?.email ||
                                                    "No email"}
                                            </p>

                                        </div>

                                        <span
                                            className={
                                                `report-status ${
                                                    getStatusClass(
                                                        report.status
                                                    )
                                                }`
                                            }
                                        >
                                            {report.status}
                                        </span>

                                    </div>


                                    {/* Report Information */}

                                    <div className="report-info">

                                        <div>

                                            <span>
                                                🧪 Test
                                            </span>

                                            <strong>
                                                {report.testName ||
                                                    "Laboratory Test"}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                👨‍⚕️ Doctor
                                            </span>

                                            <strong>
                                                {report.doctorId?.name ||
                                                    "Doctor"}
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                📅 Date
                                            </span>

                                            <strong>
                                                {report.createdAt
                                                    ? new Date(
                                                        report.createdAt
                                                    ).toLocaleDateString()
                                                    : "N/A"}
                                            </strong>

                                        </div>

                                    </div>


                                    {/* Results */}

                                    {report.results &&
                                        report.results.length > 0 && (

                                            <div className="results-section">

                                                <h3>
                                                    🧪 Test Results
                                                </h3>

                                                <div className="results-table">

                                                    <div className="result-header">

                                                        <span>
                                                            Parameter
                                                        </span>

                                                        <span>
                                                            Result
                                                        </span>

                                                        <span>
                                                            Normal Range
                                                        </span>

                                                    </div>


                                                    {report.results.map(
                                                        (
                                                            result,
                                                            index
                                                        ) => (

                                                            <div
                                                                className="result-row"
                                                                key={index}
                                                            >

                                                                <span>
                                                                    {
                                                                        result.parameter
                                                                    }
                                                                </span>

                                                                <strong>
                                                                    {
                                                                        result.result
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        result.normalRange ||
                                                                        "N/A"
                                                                    }
                                                                </span>

                                                            </div>

                                                        )
                                                    )}

                                                </div>

                                            </div>

                                        )}


                                    {/* Doctor Notes */}

                                    {report.doctorNotes && (

                                        <div className="doctor-notes">

                                            <h3>
                                                📝 Doctor Notes
                                            </h3>

                                            <p>
                                                {
                                                    report.doctorNotes
                                                }
                                            </p>

                                        </div>

                                    )}

                                </div>

                            )
                        )}

                    </div>

                )}

        </div>

    );

}

export default DoctorReports;