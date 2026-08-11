import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function DoctorLogin() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
  doctorId: "",
  password: ""
});

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(
        "http://localhost:5000/api/doctor/login",
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "doctor");
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful");

      navigate("/doctor/dashboard");

    }

    catch (err) {

      alert(
        err.response?.data?.message ||
        "Login Failed"
      );

    }

  };

  return (

    <div className="loginContainer">

      <form
        className="loginCard"
        onSubmit={handleSubmit}
      >

        <h2>Doctor Login</h2>

        <input
          type="text"
          name="doctorId"
          placeholder="Doctor ID"
          value={formData.doctorId}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">
          Login
        </button>

        

      </form>

    </div>

  );

}

export default DoctorLogin;