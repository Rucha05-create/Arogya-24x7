import { useState, useEffect } from "react";
import axios from "axios";
import "./ManageDoctors.css";

function ManageDoctors() {

  const [doctor, setDoctor] = useState({
    name: "",
    doctorId: "",
    specialization: "",
    password: ""
  });

  const [doctors, setDoctors] = useState([]);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  // ==========================
  // Fetch Doctors
  // ==========================

  const fetchDoctors = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/doctor"
      );

      setDoctors(res.data);

    }

    catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchDoctors();

  }, []);

  // ==========================
  // Handle Input
  // ==========================

  const handleChange = (e) => {

    setDoctor({

      ...doctor,

      [e.target.name]: e.target.value

    });

  };

  // ==========================
  // Add / Update Doctor
  // ==========================

  const addDoctor = async () => {

    if (

      doctor.name === "" ||

      doctor.doctorId === "" ||

      doctor.specialization === "" ||

      doctor.password === ""

    ) {

      alert("Please fill all fields");

      return;

    }

    try {

      if (editingId) {

        await axios.put(

          `http://localhost:5000/api/doctor/${editingId}`,

          doctor

        );

        alert("Doctor Updated Successfully");

        setEditingId(null);

      }

      else {

        const res = await axios.post(

          "http://localhost:5000/api/doctor/register",

          doctor

        );

        alert(res.data.message);

      }

      fetchDoctors();

      setDoctor({

        name: "",

        doctorId: "",

        specialization: "",

        password: ""

      });

    }

    catch (error) {

      alert(

        error.response?.data?.message ||

        "Unable to save doctor"

      );

    }

  };

  // ==========================
  // Edit Doctor
  // ==========================

  const editDoctor = (item) => {

    setDoctor({

      name: item.name,

      doctorId: item.doctorId,

      specialization: item.specialization,

      password: ""

    });

    setEditingId(item._id);

    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  };

  // ==========================
  // Delete Doctor
  // ==========================

  const deleteDoctor = async (id) => {

    if (window.confirm("Delete this doctor?")) {

      try {

        await axios.delete(

          `http://localhost:5000/api/doctor/${id}`

        );

        fetchDoctors();

      }

      catch (error) {

        alert("Unable to delete doctor");

      }

    }

  };

  // ==========================
  // Search
  // ==========================

  const filteredDoctors = doctors.filter((item) =>

    (item.name || "")

      .toLowerCase()

      .includes(search.toLowerCase()) ||

    (item.doctorId || "")

      .toLowerCase()

      .includes(search.toLowerCase()) ||

    (item.specialization || "")

      .toLowerCase()

      .includes(search.toLowerCase())

  );

  return (

    <div className="manage-doctors">

          {/* Hero */}

      <div className="doctor-hero">

        <div>

          <h1>👨‍⚕️ Doctor Management</h1>

          <p>

            Manage doctors, specialists and login credentials
            from one centralized dashboard.

          </p>

        </div>

        <img

          src="https://cdn-icons-png.flaticon.com/512/387/387561.png"

          alt="Doctor"

        />

      </div>

      {/* Statistics */}

      <div className="stats">

        <div className="stat-card">

          <h2>{doctors.length}</h2>

          <p>Total Doctors</p>

        </div>

        <div className="stat-card">

          <h2>24×7</h2>

          <p>Medical Service</p>

        </div>

        <div className="stat-card">

          <h2>100%</h2>

          <p>Verified Doctors</p>

        </div>

      </div>

      {/* Form */}

      <div className="doctor-form">

        <h2>

          {

            editingId

              ? "💾 Update Doctor"

              : "➕ Add New Doctor"

          }

        </h2>

        <input

          type="text"

          name="name"

          placeholder="Doctor Name"

          value={doctor.name}

          onChange={handleChange}

        />

        <input

          type="text"

          name="doctorId"

          placeholder="Doctor ID"

          value={doctor.doctorId}

          onChange={handleChange}

        />

        <input

          type="text"

          name="specialization"

          placeholder="Specialization"

          value={doctor.specialization}

          onChange={handleChange}

        />

        <input

          type="password"

          name="password"

          placeholder={

            editingId

              ? "Leave Blank To Keep Same Password"

              : "Password"

          }

          value={doctor.password}

          onChange={handleChange}

        />

        <button

          className="doctor-btn"

          onClick={addDoctor}

        >

          {

            editingId

              ? "💾 Update Doctor"

              : "👨‍⚕️ Add Doctor"

          }

        </button>

      </div>

      {/* Search */}

      <input

        className="search-box"

        placeholder="🔍 Search Doctor..."

        value={search}

        onChange={(e) =>

          setSearch(e.target.value)

        }

      />

      {/* Count */}

      <h2 className="doctor-count">

        Showing {filteredDoctors.length} of {doctors.length} Doctors

      </h2>

      {/* Doctor Cards */}

      <div className="doctor-list">

        {

          filteredDoctors.length > 0

            ?

            (

              filteredDoctors.map((item) => (

                <div

                  className="doctor-card"

                  key={item._id}

                >

                  <div className="doctor-avatar">

                    {

                      item.name

                        ? item.name.charAt(0).toUpperCase()

                        : "D"

                    }

                  </div>

                  <div className="doctor-info">

                    <h3>

                      👨‍⚕️ {item.name}

                    </h3>

                    <p>

                      🆔 {item.doctorId}

                    </p>

                    <p>

                      🩺 {item.specialization}

                    </p>

                  </div>

                  <div className="doctor-actions">

                    <button

                      className="edit-btn"

                      onClick={() =>

                        editDoctor(item)

                      }

                    >

                      ✏ Edit

                    </button>

                    <button

                      className="delete-btn"

                      onClick={() =>

                        deleteDoctor(item._id)

                      }

                    >

                      🗑 Delete

                    </button>

                  </div>

                </div>

              ))

            )

            :

            (

              <div className="doctor-card empty-card">

                <div className="doctor-info">

                  <h3>

                    No Doctors Available

                  </h3>

                  <p>

                    Add your first doctor using the form above.

                  </p>

                </div>

              </div>

            )

        }

      </div>

    </div>

  );

}

export default ManageDoctors;