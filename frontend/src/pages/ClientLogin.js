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
    // HANDLE LOGIN
    // =====================================================

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (loading) {
            return;
        }


        // =================================================
        // VALIDATION
        // =================================================

        const email = formData.email.trim();
        const password = formData.password;

        if (!email) {

            alert("Please enter your email.");

            return;
        }

        if (!password) {

            alert("Please enter your password.");

            return;
        }


        try {

            setLoading(true);


            // =================================================
            // LOGIN REQUEST
            // =================================================

            console.log("Sending Login Request...");


            const res = await axios.post(
                "http://localhost:5000/api/client/login",
                {
                    email,
                    password
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    timeout: 10000
                }
            );


            console.log(
                "Login Response:",
                res.data
            );


            // =================================================
            // GET TOKEN
            // =================================================

            const token = res.data?.token;


            if (!token) {

                console.error(
                    "Token missing from login response:",
                    res.data
                );

                throw new Error(
                    "Login successful, but authentication token was not returned."
                );

            }


            // =================================================
            // GET USER
            // =================================================

            const userFromResponse =
                res.data?.user ||
                res.data?.client;


            if (!userFromResponse) {

                console.error(
                    "User information missing from login response:",
                    res.data
                );

                throw new Error(
                    "Login successful, but user information was not returned."
                );

            }


            // =================================================
            // GET ACTUAL ROLE
            // =================================================
            //
            // IMPORTANT:
            // Do NOT hardcode:
            //
            // localStorage.setItem("role", "client");
            //
            // The role must come from the backend.
            //

            const userRole =
                String(
                    userFromResponse.role ||
                    res.data?.role ||
                    "client"
                )
                    .trim()
                    .toLowerCase();


            // =================================================
            // SUPPORTED ROLES
            // =================================================

            const supportedRoles = [
                "client",
                "volunteer",
                "social_worker",
                "health_worker",
                "intern",
                "sahash_employee",
                "employee",
                "vendor",
                "admin"
            ];


            if (!supportedRoles.includes(userRole)) {

                console.error(
                    "Unsupported user role:",
                    userRole
                );

                throw new Error(
                    `Unsupported user role received from server: ${userRole}`
                );

            }


            // =================================================
            // CREATE USER OBJECT
            // =================================================

            const user = {

                ...userFromResponse,

                role: userRole,

                name:
                    userFromResponse.name ||
                    "",

                email:
                    userFromResponse.email ||
                    email,

                phone:
                    userFromResponse.phone ||
                    "",

                age:
                    userFromResponse.age ||
                    "",

                gender:
                    userFromResponse.gender ||
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

                diseases:
                    userFromResponse.diseases ||
                    userFromResponse.disease ||
                    "",

                medications:
                    userFromResponse.medications ||
                    "",

                emergencyContact:
                    userFromResponse.emergencyContact ||
                    userFromResponse.emergency ||
                    ""

            };


            // =================================================
            // CLEAR OLD LOGIN DATA
            // =================================================

            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("user");


            // =================================================
            // SAVE TOKEN
            // =================================================

            localStorage.setItem(
                "token",
                token
            );


            // =================================================
            // SAVE ACTUAL ROLE
            // =================================================

            localStorage.setItem(
                "role",
                userRole
            );


            // =================================================
            // SAVE USER
            // =================================================

            localStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            // =================================================
            // DEBUG INFORMATION
            // =================================================

            console.log(
                "Logged-in User:",
                user
            );

            console.log(
                "User Role:",
                userRole
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
            // SUCCESS MESSAGE
            // =================================================

            alert(
                `${userRole.replace(/_/g, " ")} login successful!`
            );


            // =================================================
            // ROLE-BASED REDIRECT
            // =================================================

            switch (userRole) {

                case "admin":

                    navigate(
                        "/admin/dashboard",
                        {
                            replace: true
                        }
                    );

                    break;


                case "doctor":

                    navigate(
                        "/doctor/dashboard",
                        {
                            replace: true
                        }
                    );

                    break;


                case "volunteer":

                    navigate(
                        "/volunteer/dashboard",
                        {
                            replace: true
                        }
                    );

                    break;


                case "social_worker":

                    navigate(
                        "/social-worker/dashboard",
                        {
                            replace: true
                        }
                    );

                    break;


                case "health_worker":

                    navigate(
                        "/health-worker/dashboard",
                        {
                            replace: true
                        }
                    );

                    break;


                case "intern":

                    navigate(
                        "/intern/dashboard",
                        {
                            replace: true
                        }
                    );

                    break;


                case "sahash_employee":

                    navigate(
                        "/sahash/dashboard",
                        {
                            replace: true
                        }
                    );

                    break;


                case "employee":

                    navigate(
                        "/employee/dashboard",
                        {
                            replace: true
                        }
                    );

                    break;


                case "vendor":

                    navigate(
                        "/vendor/dashboard",
                        {
                            replace: true
                        }
                    );

                    break;


                case "client":

                default:

                    navigate(
                        "/client/dashboard",
                        {
                            replace: true
                        }
                    );

                    break;

            }

        }


        // =====================================================
        // ERROR HANDLING
        // =====================================================

        catch (err) {

            console.error(
                "Login Error:",
                err
            );


            // =================================================
            // BACKEND RESPONSE ERROR
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
                    err.response.status === 403
                ) {

                    alert(
                        "You are not authorized to login with this account."
                    );

                }

                else if (
                    err.response.status === 404
                ) {

                    alert(
                        "Login service was not found. Please check the backend route."
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
            // NO SERVER RESPONSE
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
                    "Login failed."
                );

            }


            // =================================================
            // REMOVE INVALID LOGIN DATA
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

