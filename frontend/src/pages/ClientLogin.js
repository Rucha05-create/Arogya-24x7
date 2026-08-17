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

    const [loading, setLoading] = useState(false);


    // =====================================================
    // HANDLE INPUT CHANGE
    // =====================================================

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

    };


    // =====================================================
    // LOGIN
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        // Prevent multiple clicks
        if (loading) {
            return;
        }

        // =================================================
        // Basic Validation
        // =================================================

        if (!formData.email.trim()) {

            alert("Please enter your email.");

            return;
        }

        if (!formData.password) {

            alert("Please enter your password.");

            return;
        }


        try {

            setLoading(true);


            // =================================================
            // SEND LOGIN REQUEST
            // =================================================

            console.log(
                "Sending Client Login Request..."
            );

            const res = await axios.post(
                "http://localhost:5000/api/client/login",
                {
                    email: formData.email.trim(),
                    password: formData.password
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: 10000
                }
            );


            console.log(
                "Client Login Response:",
                res.data
            );


            // =================================================
            // GET TOKEN
            // =================================================

            const token = res.data?.token;


            if (!token) {

                console.error(
                    "Login response does not contain a token:",
                    res.data
                );

                throw new Error(
                    "Login successful response did not contain an authentication token."
                );

            }


            // =================================================
            // GET USER
            // =================================================

            /*
                Normally backend should return:

                {
                    token: "...",
                    user: {
                        name: "...",
                        email: "...",
                        role: "client"
                    }
                }

                We also handle client/user response variations.
            */

            const userFromResponse =
                res.data?.user ||
                res.data?.client;


            if (!userFromResponse) {

                console.error(
                    "Login response does not contain user information:",
                    res.data
                );

                throw new Error(
                    "Login successful, but client information was not returned by the server."
                );

            }


            // =================================================
            // CREATE USER OBJECT
            // =================================================

            const user = {

                ...userFromResponse,

                role:
                    userFromResponse.role ||
                    "client",

                phone:
                    userFromResponse.phone ||
                    "",

                emergencyContact:
                    userFromResponse.emergencyContact ||
                    userFromResponse.emergency ||
                    "",

                bloodGroup:
                    userFromResponse.bloodGroup ||
                    "",

                height:
                    userFromResponse.height ||
                    "",

                weight:
                    userFromResponse.weight ||
                    "",

                address:
                    userFromResponse.address ||
                    "",

                allergies:
                    userFromResponse.allergies ||
                    "",

                disease:
                    userFromResponse.disease ||
                    userFromResponse.diseases ||
                    "",

                medications:
                    userFromResponse.medications ||
                    ""

            };


            // =================================================
            // CLEAR OLD LOGIN DATA
            // =================================================

            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");


            // =================================================
            // SAVE NEW TOKEN
            // =================================================

            localStorage.setItem(
                "token",
                token
            );


            // =================================================
            // SAVE ROLE
            // =================================================

            localStorage.setItem(
                "role",
                "client"
            );


            // =================================================
            // SAVE USER
            // =================================================

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            // =================================================
            // VERIFY LOCAL STORAGE
            // =================================================

            console.log(
                "Logged-in Client:",
                user
            );

            console.log(
                "Token saved:",
                Boolean(
                    localStorage.getItem("token")
                )
            );

            console.log(
                "Role saved:",
                localStorage.getItem("role")
            );


            // =================================================
            // SUCCESS
            // =================================================

            alert(
                "Client Login Successful!"
            );


            // =================================================
            // REDIRECT
            // =================================================

            navigate(
                "/client/home",
                {
                    replace: true
                }
            );

        }


        // =====================================================
        // ERROR
        // =====================================================

        catch (err) {

            console.error(
                "Client Login Error:",
                err
            );


            // =================================================
            // BACKEND ERROR
            // =================================================

            if (err.response) {

                console.error(
                    "Backend Status:",
                    err.response.status
                );

                console.error(
                    "Backend Response:",
                    err.response.data
                );


                const backendMessage =
                    err.response.data?.message ||
                    err.response.data?.error;


                if (backendMessage) {

                    alert(
                        backendMessage
                    );

                }

                else if (
                    err.response.status === 401
                ) {

                    alert(
                        "Invalid email or password."
                    );

                }

                else if (
                    err.response.status === 404
                ) {

                    alert(
                        "Client login service was not found. Please check the backend route."
                    );

                }

                else if (
                    err.response.status >= 500
                ) {

                    alert(
                        "Server error. Please make sure the backend is running correctly."
                    );

                }

                else {

                    alert(
                        "Login failed. Please try again."
                    );

                }

            }


            // =================================================
            // SERVER NOT REACHABLE
            // =================================================

            else if (err.request) {

                console.error(
                    "No response received from backend:",
                    err.request
                );

                alert(
                    "Unable to connect to the server. Make sure your backend is running on port 5000."
                );

            }


            // =================================================
            // OTHER ERROR
            // =================================================

            else {

                alert(
                    err.message ||
                    "Login Failed."
                );

            }


            // =================================================
            // REMOVE INVALID AUTH DATA
            // =================================================

            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");

        }


        finally {

            setLoading(false);

        }

    };


    // =====================================================
    // JSX
    // =====================================================

    return (

        <div className="loginContainer">

            <form
                className="loginCard"
                onSubmit={handleSubmit}
            >

                {/* =================================================
                    TITLE
                ================================================= */}

                <h2>
                    Client Login
                </h2>


                {/* =================================================
                    EMAIL
                ================================================= */}

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                    disabled={loading}
                />


                {/* =================================================
                    PASSWORD
                ================================================= */}

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                    disabled={loading}
                />


                {/* =================================================
                    LOGIN BUTTON
                ================================================= */}

                <button
                    type="submit"
                    disabled={loading}
                >

                    {loading
                        ? "Logging in..."
                        : "Login"
                    }

                </button>


                {/* =================================================
                    REGISTER
                ================================================= */}

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