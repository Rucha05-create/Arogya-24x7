import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./EditProfile.css";

function EditProfile() {

    const navigate = useNavigate();

    // ==========================================
    // GET CURRENT USER
    // ==========================================

    const storedUser =
        JSON.parse(
            localStorage.getItem("user")
        ) || {};


    // ==========================================
    // FORM DATA
    // ==========================================

    const [formData, setFormData] = useState({

        name: storedUser.name || "",

        email: storedUser.email || "",

        age: storedUser.age || "",

        gender: storedUser.gender || "",

        phone: storedUser.phone || "",

        bloodGroup:
            storedUser.bloodGroup || "",

        height:
            storedUser.height || "",

        weight:
            storedUser.weight || "",

        address:
            storedUser.address || "",

        allergies:
            storedUser.allergies || "",

        diseases:
            storedUser.diseases ||
            storedUser.disease ||
            "",

        medications:
            storedUser.medications || "",

        emergencyContact:
            storedUser.emergencyContact ||
            storedUser.emergency ||
            ""

    });


    // ==========================================
    // HANDLE INPUT CHANGE
    // ==========================================

    const changeHandler = (e) => {

        setFormData({

            ...formData,

            [e.target.name]:
                e.target.value

        });

    };


    // ==========================================
    // SAVE PROFILE
    // ==========================================

    const submitHandler = async (e) => {

        e.preventDefault();


        // Make sure we have MongoDB user ID

        const userId =
            storedUser._id ||
            storedUser.id;


        if (!userId) {

            alert(
                "User ID not found. Please login again."
            );

            return;

        }


        try {

            // ==========================================
            // UPDATE USER IN MONGODB
            // ==========================================

            const res = await axios.put(

                `http://localhost:5000/api/users/${userId}`,

                {

                    phone:
                        formData.phone,

                    bloodGroup:
                        formData.bloodGroup,

                    height:
                        formData.height,

                    weight:
                        formData.weight,

                    address:
                        formData.address,

                    allergies:
                        formData.allergies,

                    diseases:
                        formData.diseases,

                    medications:
                        formData.medications,

                    emergencyContact:
                        formData.emergencyContact

                }

            );


            // ==========================================
            // GET UPDATED USER FROM BACKEND
            // ==========================================

            const updatedUser =
                res.data.user;


            // ==========================================
            // SAVE UPDATED USER IN LOCAL STORAGE
            // ==========================================

            localStorage.setItem(

                "user",

                JSON.stringify(
                    updatedUser
                )

            );


            // ==========================================
            // SUCCESS
            // ==========================================

            alert(
                "Profile Updated Successfully"
            );


            navigate(
                "/profile"
            );


        }

        catch (error) {

            console.error(
                "Profile Update Error:",
                error
            );


            alert(

                error.response?.data?.message ||

                "Failed to update profile"

            );

        }

    };


    return (

        <div className="edit-page">

            <div className="edit-card">

                <h1>
                    Edit Profile
                </h1>


                <form
                    onSubmit={
                        submitHandler
                    }
                >


                    {/* =========================
                        NAME
                    ========================== */}

                    <input
                        type="text"
                        name="name"
                        placeholder="Full Name"
                        value={
                            formData.name
                        }
                        onChange={
                            changeHandler
                        }
                    />


                    {/* =========================
                        EMAIL
                    ========================== */}

                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={
                            formData.email
                        }
                        disabled
                    />


                    {/* =========================
                        AGE
                    ========================== */}

                    <input
                        type="number"
                        name="age"
                        placeholder="Age"
                        value={
                            formData.age
                        }
                        onChange={
                            changeHandler
                        }
                    />


                    {/* =========================
                        GENDER
                    ========================== */}

                    <input
                        type="text"
                        name="gender"
                        placeholder="Gender"
                        value={
                            formData.gender
                        }
                        onChange={
                            changeHandler
                        }
                    />


                    {/* =========================
                        PHONE
                    ========================== */}

                    <input
                        type="tel"
                        name="phone"
                        placeholder="Phone Number"
                        value={
                            formData.phone
                        }
                        onChange={
                            changeHandler
                        }
                    />


                    {/* =========================
                        BLOOD GROUP
                    ========================== */}

                    <input
                        type="text"
                        name="bloodGroup"
                        placeholder="Blood Group"
                        value={
                            formData.bloodGroup
                        }
                        onChange={
                            changeHandler
                        }
                    />


                    {/* =========================
                        HEIGHT
                    ========================== */}

                    <input
                        type="text"
                        name="height"
                        placeholder="Height (cm)"
                        value={
                            formData.height
                        }
                        onChange={
                            changeHandler
                        }
                    />


                    {/* =========================
                        WEIGHT
                    ========================== */}

                    <input
                        type="text"
                        name="weight"
                        placeholder="Weight (kg)"
                        value={
                            formData.weight
                        }
                        onChange={
                            changeHandler
                        }
                    />


                    {/* =========================
                        ADDRESS
                    ========================== */}

                    <input
                        type="text"
                        name="address"
                        placeholder="Address"
                        value={
                            formData.address
                        }
                        onChange={
                            changeHandler
                        }
                    />


                    {/* =========================
                        ALLERGIES
                    ========================== */}

                    <input
                        type="text"
                        name="allergies"
                        placeholder="Allergies"
                        value={
                            formData.allergies
                        }
                        onChange={
                            changeHandler
                        }
                    />


                    {/* =========================
                        DISEASES
                    ========================== */}

                    <input
                        type="text"
                        name="diseases"
                        placeholder="Existing Diseases"
                        value={
                            formData.diseases
                        }
                        onChange={
                            changeHandler
                        }
                    />


                    {/* =========================
                        MEDICATIONS
                    ========================== */}

                    <input
                        type="text"
                        name="medications"
                        placeholder="Medications"
                        value={
                            formData.medications
                        }
                        onChange={
                            changeHandler
                        }
                    />


                    {/* =========================
                        EMERGENCY CONTACT
                    ========================== */}

                    <input
                        type="tel"
                        name="emergencyContact"
                        placeholder="Emergency Contact Number"
                        value={
                            formData.emergencyContact
                        }
                        onChange={
                            changeHandler
                        }
                    />


                    {/* =========================
                        SAVE BUTTON
                    ========================== */}

                    <button
                        type="submit"
                        className="save-btn"
                    >
                        Save Profile
                    </button>

                </form>

            </div>

        </div>

    );

}

export default EditProfile;