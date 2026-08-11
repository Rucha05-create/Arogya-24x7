import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function ClientRegister() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({

    name: "",
    email: "",
    password: "",
    phone: "",
    age: "",
    gender: "",
    bloodGroup: "",
    height: "",
    weight: "",
    allergies: "",
    diseases: "",
    medications: "",
    emergencyContact: "",
    address: ""

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

        "http://localhost:5000/api/client/register",

        formData

      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", "client");
      localStorage.setItem("user", JSON.stringify(res.data.user));

      alert("Registration Successful");

      navigate("/client/dashboard");

    }

    catch (err) {

      alert(

        err.response?.data?.message ||

        "Registration Failed"

      );

    }

  };

  return (

    <div className="registerContainer">

      <form
        className="registerCard"
        onSubmit={handleSubmit}
      >

        <h2>Client Registration</h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="age"
          placeholder="Age"
          onChange={handleChange}
          required
        />

        <select
          name="gender"
          onChange={handleChange}
          required
        >

          <option value="">Select Gender</option>

          <option>Male</option>

          <option>Female</option>

          <option>Other</option>

        </select>

        <input
          type="text"
          name="bloodGroup"
          placeholder="Blood Group"
          onChange={handleChange}
        />

        <input
          type="number"
          name="height"
          placeholder="Height (cm)"
          onChange={handleChange}
        />

        <input
          type="number"
          name="weight"
          placeholder="Weight (kg)"
          onChange={handleChange}
        />

        <textarea
          name="allergies"
          placeholder="Allergies"
          onChange={handleChange}
        />

        <textarea
          name="diseases"
          placeholder="Existing Diseases"
          onChange={handleChange}
        />

        <textarea
          name="medications"
          placeholder="Current Medications"
          onChange={handleChange}
        />

        <input
          type="text"
          name="emergencyContact"
          placeholder="Emergency Contact"
          onChange={handleChange}
        />

        <textarea
          name="address"
          placeholder="Address"
          onChange={handleChange}
        />

        <button type="submit">

          Register

        </button>

        <p>

          Already Registered?

          <Link to="/client/login">

            Login

          </Link>

        </p>

      </form>

    </div>

  );

}

export default ClientRegister;