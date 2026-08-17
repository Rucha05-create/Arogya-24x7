import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function LabLogin() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        labId: "",
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

        if (loading) {
            return;
        }


        // =================================================
        // VALIDATION
        // =================================================

        if (!formData.labId.trim()) {

            alert("Please enter Lab ID.");

            return;
        }

        if (!formData.password) {

            alert("Please enter password.");

            return;
        }


        try {

            setLoading(true);


            // =================================================
            // LOGIN REQUEST
            // =================================================

            console.log(
                "Sending Lab Login Request..."
            );

            const res = await axios.post(

                "http://localhost:5000/api/labs/login",

                {
                    labId: formData.labId.trim(),
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
                "Lab Login Response:",
                res.data
            );


            // =================================================
            // GET TOKEN
            // =================================================

            const token = res.data?.token;


            if (!token) {

                console.error(
                    "No token received:",
                    res.data
                );

                throw new Error(
                    "Login successful, but authentication token was not received."
                );

            }


            // =================================================
            // GET LAB DATA
            // =================================================

            const lab = res.data?.lab;


            if (!lab) {

                console.error(
                    "No lab information received:",
                    res.data
                );

                throw new Error(
                    "Login successful, but lab information was not received."
                );

            }


            // =================================================
            // CREATE LAB USER OBJECT
            // =================================================

            const labUser = {

                ...lab,

                role: "lab"

            };


            // =================================================
            // REMOVE OLD LOGIN DATA
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
            // SAVE ROLE
            // =================================================

            localStorage.setItem(
                "role",
                "lab"
            );


            // =================================================
            // SAVE LAB
            // =================================================

            localStorage.setItem(
                "user",
                JSON.stringify(labUser)
            );


            // =================================================
            // DEBUG INFORMATION
            // =================================================

            console.log(
                "Logged-in Lab:",
                labUser
            );

            console.log(
                "Lab Token:",
                localStorage.getItem("token")
            );

            console.log(
                "Lab Role:",
                localStorage.getItem("role")
            );

            console.log(
                "Lab User:",
                localStorage.getItem("user")
            );


            // =================================================
            // SUCCESS
            // =================================================

            alert(
                "Lab Login Successful!"
            );


            // =================================================
            // REDIRECT TO LAB DASHBOARD
            // =================================================

            navigate(
                "/lab/dashboard",
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
                "Lab Login Error:",
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


                const message =
                    err.response.data?.message;


                if (message) {

                    alert(message);

                }

                else if (
                    err.response.status === 404
                ) {

                    alert(
                        "Lab not found. Please check your Lab ID."
                    );

                }

                else if (
                    err.response.status === 400
                ) {

                    alert(
                        "Invalid Lab ID or password."
                    );

                }

                else if (
                    err.response.status >= 500
                ) {

                    alert(
                        "Server error. Please check the backend."
                    );

                }

                else {

                    alert(
                        "Lab Login Failed."
                    );

                }

            }


            // =================================================
            // BACKEND NOT REACHABLE
            // =================================================

            else if (err.request) {

                console.error(
                    "No response received from backend:",
                    err.request
                );

                alert(
                    "Unable to connect to the server. Make sure the backend is running on port 5000."
                );

            }


            // =================================================
            // OTHER ERROR
            // =================================================

            else {

                alert(
                    err.message ||
                    "Lab Login Failed."
                );

            }


            // =================================================
            // REMOVE INVALID DATA
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
    // UI
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
                    Lab Login
                </h2>


                {/* =================================================
                    LAB ID
                ================================================= */}

                <input
                    type="text"
                    name="labId"
                    placeholder="Lab ID"
                    value={formData.labId}
                    onChange={handleChange}
                    autoComplete="username"
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

            </form>

        </div>

    );

}

export default LabLogin;