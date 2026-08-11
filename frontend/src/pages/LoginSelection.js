import { useNavigate } from "react-router-dom";
import "./LoginSelection.css";

function LoginSelection() {

  const navigate = useNavigate();

  return (

    <div className="loginSelection">

      <h1>Welcome to Arogya 24×7</h1>

      <p>Select Login Type</p>

      <div className="circleContainer">

        <div
          className="circle"
          onClick={() => navigate("/client/login")}
        >
          👤
          <span>Client</span>
        </div>

        <div
          className="circle"
          onClick={() => navigate("/doctor/login")}
        >
          👨‍⚕️
          <span>Doctor</span>
        </div>

        <div
          className="circle"
          onClick={() => navigate("/lab/login")}
        >
          🧪
          <span>Lab</span>
        </div>

        <div
          className="circle"
          onClick={() => navigate("/admin/login")}
        >
          🛡️
          <span>Administrator</span>
        </div>

      </div>

    </div>

  );

}

export default LoginSelection;