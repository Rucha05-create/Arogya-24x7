import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function ClientLogin() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });


    // =========================
    // HANDLE INPUT CHANGE
    // =========================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    // =========================
    // LOGIN
    // =========================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            const res = await axios.post(
                "http://localhost:5000/api/client/login",
                formData
            );


            // =========================
            // SAVE TOKEN
            // =========================

            localStorage.setItem(
                "token",
                res.data.token
            );


            // =========================
            // SAVE ROLE
            // =========================

            localStorage.setItem(
                "role",
                "client"
            );


            // =========================
            // SAVE USER
            // =========================

            const user = res.data.user;

            localStorage.setItem(
                "user",
                JSON.stringify({
                    ...user,

                    // Keep the correct field names
                    phone: user.phone || "",

                    emergencyContact:
                        user.emergencyContact ||
                        user.emergency ||
                        "",

                    bloodGroup:
                        user.bloodGroup || "",

                    height:
                        user.height || "",

                    weight:
                        user.weight || "",

                    address:
                        user.address || "",

                    allergies:
                        user.allergies || "",

                    disease:
                        user.disease ||
                        user.diseases ||
                        "",

                    medications:
                        user.medications || ""
                })
            );


            alert("Login Successful");


            // =========================
            // GO TO CLIENT HOME
            // =========================

            navigate("/client/home");

        }

        catch (err) {

            console.error(
                "Client Login Error:",
                err
            );

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

                <h2>
                    Client Login
                </h2>


                {/* EMAIL */}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />


                {/* PASSWORD */}

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />


                {/* LOGIN BUTTON */}

                <button type="submit">
                    Login
                </button>


                {/* REGISTER */}

                <p>

                    New Client?{" "}

                    <Link to="/client/register">
                        Register
                    </Link>

                </p>

            </form>

        </div>

    );

}

export default ClientLogin;