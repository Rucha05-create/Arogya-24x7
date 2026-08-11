import { useState, useEffect } from "react";
import axios from "axios";
import "./ManagePackages.css";

function ManagePackages() {

  const [packageData, setPackageData] = useState({
    packageName: "",
    price: "",
    tests: []
  });

  const [availableTests, setAvailableTests] = useState([]);
  const [packages, setPackages] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  // ==========================
  // Fetch Tests
  // ==========================

  const fetchTests = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/tests"
      );

      setAvailableTests(res.data);

    }

    catch (error) {

      console.log(error);

    }

  };

  // ==========================
  // Fetch Packages
  // ==========================

  const fetchPackages = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/packages"
      );

      setPackages(res.data);

    }

    catch (error) {

      console.log(error);

    }

  };

  useEffect(() => {

    fetchTests();
    fetchPackages();

  }, []);

  // ==========================
  // Handle Input
  // ==========================

  const handleChange = (e) => {

    setPackageData({

      ...packageData,

      [e.target.name]: e.target.value

    });

  };

  // ==========================
  // Checkbox
  // ==========================

  const handleCheckbox = (testName) => {

    if (packageData.tests.includes(testName)) {

      setPackageData({

        ...packageData,

        tests: packageData.tests.filter(
          (test) => test !== testName
        )

      });

    }

    else {

      setPackageData({

        ...packageData,

        tests: [

          ...packageData.tests,

          testName

        ]

      });

    }

  };

  // ==========================
  // Add Package
  // ==========================

  const addPackage = async (e) => {

    e.preventDefault();

    try {

      if (editingId) {

        await axios.put(

          `http://localhost:5000/api/packages/${editingId}`,

          packageData

        );

        alert("Package Updated Successfully");

        setEditingId(null);

      }

      else {

        const res = await axios.post(

          "http://localhost:5000/api/packages",

          packageData

        );

        alert(res.data.message);

      }

      fetchPackages();

      setPackageData({

        packageName: "",

        price: "",

        tests: []

      });

    }

    catch (error) {

      alert(

        error.response?.data?.message ||

        "Unable to save package"

      );

    }

  };

  // ==========================
  // Edit Package
  // ==========================

  const editPackage = (pkg) => {

    setPackageData({

      packageName:

        pkg.packageName ||

        pkg.name ||

        "",

      price: pkg.price,

      tests: pkg.tests || []

    });

    setEditingId(pkg._id);

    window.scrollTo({

      top: 0,

      behavior: "smooth"

    });

  };

  // ==========================
  // Delete Package
  // ==========================

  const deletePackage = async (id) => {

    if (

      window.confirm(

        "Delete this package?"

      )

    ) {

      try {

        await axios.delete(

          `http://localhost:5000/api/packages/${id}`

        );

        fetchPackages();

      }

      catch (error) {

        alert("Unable to delete package");

      }

    }

  };

  // ==========================
  // Search
  // ==========================

  const filteredPackages = packages.filter((pkg) => {

    const name = String(

      pkg.packageName ||

      pkg.name ||

      ""

    );

    return name

      .toLowerCase()

      .includes(

        search.toLowerCase()

      );

  });

  const highestPackage =

    packages.length > 0

      ? Math.max(

          ...packages.map(

            (p) => Number(p.price || 0)

          )

        )

      : 0;

  return (

    <div className="manage-packages">

      {/* Hero */}

      <div className="package-hero">

        <div>

          <h1>

            📦 Package Management

          </h1>

          <p>

            Create affordable health packages by combining multiple pathology tests into complete wellness plans.

          </p>

        </div>

        <img

          src="https://cdn-icons-png.flaticon.com/512/2966/2966480.png"

          alt="Package"

        />

      </div>

      {/* Statistics */}

      <div className="stats">

        <div className="stat-card">

          <h2>{packages.length}</h2>

          <p>Total Packages</p>

        </div>

        <div className="stat-card">

          <h2>{availableTests.length}</h2>

          <p>Available Tests</p>

        </div>

        <div className="stat-card">

          <h2>₹{highestPackage}</h2>

          <p>Highest Package</p>

        </div>

      </div>
            {/* Form */}

      <div className="package-form">

        <h2>

          {editingId

            ? "💾 Update Package"

            : "➕ Create New Package"}

        </h2>

        <form onSubmit={addPackage}>

          <input

            type="text"

            name="packageName"

            placeholder="Package Name"

            value={packageData.packageName}

            onChange={handleChange}

            required

          />

          <input

            type="number"

            name="price"

            placeholder="Package Price"

            value={packageData.price}

            onChange={handleChange}

            required

          />

          <h3>🧪 Select Tests Included</h3>

          <p className="selected-count">

            Selected Tests :

            <strong> {packageData.tests.length}</strong>

          </p>

          <div className="tests-grid">

            {

              availableTests.map((test) => (

                <label
    key={test._id}
    className={`test-option ${
        packageData.tests.includes(test.testName)
            ? "selected"
            : ""
    }`}
>

    <input
        type="checkbox"
        checked={packageData.tests.includes(test.testName)}
        onChange={() => handleCheckbox(test.testName)}
    />

    <div className="test-details">

        <span className="test-icon">
            🧪
        </span>

        <span className="test-name">
            {test.testName}
        </span>

    </div>

</label>

              ))

            }

          </div>

          <button type="submit">

            {

              editingId

                ? "💾 Update Package"

                : "📦 Add Package"

            }

          </button>

        </form>

      </div>

      {/* Search */}

      <input

        className="search-box"

        placeholder="🔍 Search Package..."

        value={search}

        onChange={(e) =>

          setSearch(e.target.value)

        }

      />

      {/* Package Count */}

      <h2 className="package-count">

        Total Packages ({packages.length})

      </h2>

      {/* Package Cards */}

      <div className="package-list">

        {

          filteredPackages.length > 0 ?

          (

            filteredPackages.map((pkg) => (

              <div

                className="package-card"

                key={pkg._id}

              >

                <div className="package-info">

                  <h3>

                    📦 {pkg.packageName || pkg.name}

                  </h3>

                  <p>

                    💰 ₹{pkg.price}

                  </p>

                  <p>

                    🧪 {

                      pkg.tests &&

                      pkg.tests.length > 0

                        ? pkg.tests.join(", ")

                        : "No Tests Added"

                    }

                  </p>

                </div>

                <div className="package-actions">

                  <button

                    className="edit-btn"

                    onClick={() =>

                      editPackage(pkg)

                    }

                  >

                    ✏ Edit

                  </button>

                  <button

                    className="delete-btn"

                    onClick={() =>

                      deletePackage(pkg._id)

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

            <div className="package-card empty-card">

              <h3>

                No Packages Available

              </h3>

              <p>

                Create your first health package using the form above.

              </p>

            </div>

          )

        }

      </div>

    </div>

  );

}

export default ManagePackages;

      