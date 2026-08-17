import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./LabReports.css";

function LabReports() {
  const navigate = useNavigate();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        navigate("/lab/login");
        return;
      }

      const response =
        await axios.get(
          "http://localhost:5000/api/reports/lab",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      setReports(
        response.data || []
      );

    } catch (err) {
      console.error(
        "Fetch reports error:",
        err
      );

      setError(
        err.response?.data?.message ||
          "Unable to load reports."
      );
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchReports();
  }, []);


  const getPatientName = (report) => {
    return (
      report.patientId?.name ||
      "Patient"
    );
  };


  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(
      date
    ).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  return (
    <div className="labReportsPage">

      <div className="reportsHeader">

        <div>
          <span>
            LABORATORY MANAGEMENT
          </span>

          <h1>
            Patient Reports
          </h1>

          <p>
            View and manage reports
            uploaded by your laboratory.
          </p>
        </div>

        <button
          onClick={() =>
            navigate("/upload-report")
          }
        >
          + Upload Report
        </button>

      </div>


      {error && (
        <div className="reportError">
          ⚠ {error}
        </div>
      )}


      {loading ? (

        <div className="reportsLoading">
          Loading reports...
        </div>

      ) : reports.length === 0 ? (

        <div className="reportsEmpty">

          <div className="emptyReportIcon">
            📄
          </div>

          <h2>
            No Reports Yet
          </h2>

          <p>
            Reports uploaded for completed
            patient tests will appear here.
          </p>

          <button
            onClick={() =>
              navigate("/upload-report")
            }
          >
            Upload First Report
          </button>

        </div>

      ) : (

        <div className="reportsGrid">

          {reports.map((report) => (

            <div
              className="reportCard"
              key={report._id}
            >

              <div className="reportCardTop">

                <div className="reportIcon">
                  📄
                </div>

                <span className="reportStatus">
                  {report.status}
                </span>

              </div>


              <h3>
                {getPatientName(report)}
              </h3>


              <p className="reportTest">
                🧪 {report.testName}
              </p>


              <div className="reportInfo">

                <span>
                  📅
                  {" "}
                  {formatDate(
                    report.createdAt
                  )}
                </span>

                <span>
                  📎
                  {" "}
                  {report.fileName}
                </span>

              </div>


              <div className="reportActions">

                <a
                  href={
                    `http://localhost:5000${report.fileUrl}`
                  }
                  target="_blank"
                  rel="noreferrer"
                >
                  View Report
                </a>

                <a
                  href={
                    `http://localhost:5000${report.fileUrl}`
                  }
                  download
                >
                  Download
                </a>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default LabReports;