import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function LabLogin() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    labId: "",
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
        "http://localhost:5000/api/lab/login",
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "lab");
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Login Successful");

      navigate("/lab/dashboard");

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

        <h2>Lab Login</h2>

        <input
          type="text"
          name="labId"
          placeholder="Lab ID"
          value={formData.labId}
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

export default LabLogin;