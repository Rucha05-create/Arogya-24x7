import { useState, useEffect } from "react";
import axios from "axios";
import "./ManageLabs.css";

function ManageLabs() {

  const [lab, setLab] = useState({
    labName: "",
    location: "",
    labId: "",
    password: ""
  });

  const [labs, setLabs] = useState([]);

  // Editing State
  const [editingId, setEditingId] = useState(null);

  // ============================
  // Handle Input Change
  // ============================

  const handleChange = (e) => {

    setLab({

      ...lab,

      [e.target.name]: e.target.value

    });

  };

  // ============================
  // Fetch All Labs
  // ============================

  const fetchLabs = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/labs"
      );

      setLabs(res.data);

    }

    catch (error) {

      console.log(error);

    }

  };

  // ============================
  // Load Labs
  // ============================

  useEffect(() => {

    fetchLabs();

  }, []);

  // ============================
  // Add Lab
  // ============================

  const addLab = async () => {

    try {

      const res = await axios.post(

        "http://localhost:5000/api/labs/register",

        lab

      );

      alert(res.data.message);

      fetchLabs();

      setLab({

        labName: "",

        location: "",

        labId: "",

        password: ""

      });

    }

    catch (error) {

      alert(

        error.response?.data?.message ||

        "Unable to add laboratory"

      );

    }

  };

  // ============================
  // Start Editing
  // ============================

  const editLab = (item) => {

    setEditingId(item._id);

    setLab({

      labName: item.labName,

      location: item.location,

      labId: item.labId,

      password: ""

    });

  };

  // ============================
  // Update Lab
  // ============================

  const updateLab = async () => {

    try {

      const res = await axios.put(

        `http://localhost:5000/api/labs/${editingId}`,

        lab

      );

      alert(res.data.message);

      fetchLabs();

      setEditingId(null);

      setLab({

        labName: "",

        location: "",

        labId: "",

        password: ""

      });

    }

    catch (error) {

      alert(

        error.response?.data?.message ||

        "Unable to update laboratory"

      );

    }

  };

  // ============================
  // Delete Lab
  // ============================

  const deleteLab = async (id) => {

    const confirmDelete = window.confirm(

      "Are you sure you want to delete this laboratory?"

    );

    if (!confirmDelete) return;

    try {

      const res = await axios.delete(

        `http://localhost:5000/api/labs/${id}`

      );

      alert(res.data.message);

      fetchLabs();

    }

    catch (error) {

      alert(

        error.response?.data?.message ||

        "Unable to delete laboratory"

      );

    }

  };

  return (

    <div className="manage-labs">

      {/* Header */}

      <div className="manage-header">

        <h1>🧪 Laboratory Management</h1>

        <p>

          Add new pathology laboratories and manage all
          diagnostic centers from one place.

        </p>

      </div>

      {/* Form */}

      <div className="lab-form">

        <h2>

          {editingId ? "Edit Laboratory" : "Add New Laboratory"}

        </h2>
                <input
          name="labName"
          placeholder="Lab Name"
          value={lab.labName}
          onChange={handleChange}
        />

        <input
          name="location"
          placeholder="Location"
          value={lab.location}
          onChange={handleChange}
        />

        <input
          name="labId"
          placeholder="Lab ID"
          value={lab.labId}
          onChange={handleChange}
          disabled={editingId !== null}
        />

        <input
          type="password"
          name="password"
          placeholder={
            editingId
              ? "Leave blank to keep existing password"
              : "Password"
          }
          value={lab.password}
          onChange={handleChange}
        />

        {

          editingId ? (

            <>

              <button
                className="update-btn"
                onClick={updateLab}
              >

                💾 Update Laboratory

              </button>

              <button
                className="cancel-btn"
                onClick={() => {

                  setEditingId(null);

                  setLab({

                    labName: "",

                    location: "",

                    labId: "",

                    password: ""

                  });

                }}
              >

                ❌ Cancel

              </button>

            </>

          ) : (

            <button onClick={addLab}>

              ➕ Add Laboratory

            </button>

          )

        }

      </div>

      {/* Lab Count */}

      <h2 className="lab-count">

        All Laboratories ({labs.length})

      </h2>

      {/* Laboratory Cards */}

      <div className="lab-list">

        {

          labs.length > 0 ? (

            labs.map((item) => (

              <div
                className="lab-card"
                key={item._id}
              >

                <div className="lab-info">

                  <h3>

                    🧪 {item.labName}

                  </h3>

                  <p>

                    📍 {item.location}

                  </p>

                  <p>

                    🆔 {item.labId}

                  </p>

                </div>

                <div className="lab-actions">

                  <button
                    className="edit-btn"
                    onClick={() => editLab(item)}
                  >

                    ✏ Edit

                  </button>

                  <button
                    className="delete-btn"
                    onClick={() => deleteLab(item._id)}
                  >

                    🗑 Delete

                  </button>

                </div>

              </div>

            ))

          ) : (

            <div className="lab-card">

              <div className="lab-info">

                <h3>

                  No Laboratories Available

                </h3>

                <p>

                  Add your first laboratory using the form above.

                </p>

              </div>

            </div>

          )

        }

      </div>

    </div>

  );

}

export default ManageLabs;