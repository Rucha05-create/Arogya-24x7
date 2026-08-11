import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function AdminLogin() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    adminId: "",
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
        "http://localhost:5000/api/admin/login",
        formData
      );

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("role", "admin");

      localStorage.setItem(
      "user",
      JSON.stringify({
       ...res.data.admin,
        role: "admin"
      })
   );

      alert("Login Successful");

      navigate("/admin/dashboard");

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

        <h2>Administrator Login</h2>

        <input
          type="text"
          name="adminId"
          placeholder="Administrator ID"
          value={formData.adminId}
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

export default AdminLogin;