
import axios from "axios";
import { useState, useEffect } from "react";
import "./ManageTests.css";

function ManageTests() {

  const [test, setTest] = useState({
    testName: "",
    price: "",
    description: ""
  });

  const [tests, setTests] = useState([]);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  // ============================
  // Fetch Tests from MongoDB
  // ============================

  const fetchTests = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/tests"
      );

      setTests(res.data);

    }

    catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchTests();

  }, []);

  // ============================
  // Handle Input
  // ============================

  const handleChange = (e) => {

    setTest({

      ...test,

      [e.target.name]: e.target.value

    });

  };

  // ============================
  // Edit Button
  // ============================

  const editTest = (item) => {

    setTest({

      testName: item.testName,

      price: item.price,

      description: item.description

    });

    setEditingId(item._id);

  };

  // ============================
  // Delete Test
  // ============================

  const deleteTest = async (id) => {

    if (!window.confirm("Delete this test?"))
      return;

    try {

      await axios.delete(

        `http://localhost:5000/api/tests/${id}`

      );

      fetchTests();

      alert("Test Deleted Successfully");

    }

    catch (error) {

      console.log(error);

      alert("Unable to delete test");

    }

  };

  // ============================
  // Add / Update Test
  // ============================

  const addTest = async () => {

    if (

      test.testName === "" ||

      test.price === "" ||

      test.description === ""

    ) {

      alert("Please fill all fields");

      return;

    }

    try {

      if (editingId) {

        await axios.put(

          `http://localhost:5000/api/tests/${editingId}`,

          test

        );

        alert("Test Updated Successfully");

      }

      else {

        await axios.post(

          "http://localhost:5000/api/tests",

          test

        );

        alert("Test Added Successfully");

      }

      setEditingId(null);

      setTest({

        testName: "",

        price: "",

        description: ""

      });

      fetchTests();

    }

    catch (error) {

      console.log(error);

      alert("Something went wrong");

    }

  };

  // ============================
  // Search
  // ============================

  const filteredTests = tests.filter((item) =>

    item.testName

      .toLowerCase()

      .includes(search.toLowerCase())

  );

  return (

    <div className="manage-tests">

      {/* Hero */}

      <div className="test-hero">

        <div>

          <h1>🧪 Test Management</h1>

          <p>

            Manage pathology tests, pricing and descriptions
            from one central dashboard.

          </p>

        </div>

        <img

          src="https://cdn-icons-png.flaticon.com/512/4320/4320371.png"

          alt="Laboratory"

        />

      </div>

      {/* Statistics */}

      <div className="stats">

        <div className="stat-card">

          <h2>{tests.length}</h2>

          <p>Total Tests</p>

        </div>

        <div className="stat-card">

          <h2>₹650</h2>

          <p>Average Price</p>

        </div>

        <div className="stat-card">

          <h2>100%</h2>

          <p>Available</p>

        </div>

      </div>

      {/* Form */}

      <div className="test-form">

        <h2>

          {editingId

            ? "💾 Update Test"

            : "➕ Add New Test"}

        </h2>

        <input

          type="text"

          name="testName"

          placeholder="Test Name"

          value={test.testName}

          onChange={handleChange}

        />

        <input

          type="number"

          name="price"

          placeholder="Price"

          value={test.price}

          onChange={handleChange}

        />

        <textarea

          name="description"

          rows="5"

          placeholder="Description"

          value={test.description}

          onChange={handleChange}

        />

        <button onClick={addTest}>

          {editingId

            ? "💾 Update Test"

            : "➕ Add Test"}

        </button>

      </div>

      {/* Counter */}

      <h2 className="test-count">

        Total Tests ({tests.length})

      </h2>

      {/* Search */}

      <input

        className="search-box"

        placeholder="🔍 Search Test..."

        value={search}

        onChange={(e) =>

          setSearch(e.target.value)

        }

      />

      {/* Cards */}

      <div className="test-list">

        {

          filteredTests.length > 0 ?

          (

            filteredTests.map((item) => (

              <div

                className="test-card"

                key={item._id}

              >

                <div className="test-info">

                  <h3>

                    🩸 {item.testName}

                  </h3>

                  <p>

                    💰 ₹{item.price}

                  </p>

                  <p>

                    📝 {item.description}

                  </p>

                </div>

                <div className="test-actions">

                  <button

                    className="edit-btn"

                    onClick={() => editTest(item)}

                  >

                    ✏ Edit

                  </button>

                  <button

                    className="delete-btn"

                    onClick={() => deleteTest(item._id)}

                  >

                    🗑 Delete

                  </button>

                </div>

              </div>

            ))

          )

          :

          (

            <div className="test-card">

              <div className="test-info">

                <h3>No Tests Available</h3>

                <p>

                  Add your first pathology test using the form above.

                </p>

              </div>

            </div>

          )

        }

      </div>

    </div>

  );

}

export default ManageTests;

