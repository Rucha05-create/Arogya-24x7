import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Vendors() {

  const navigate = useNavigate();

  const [labs, setLabs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/labs")
      .then((res) => res.json())
      .then((data) => setLabs(data))
      .catch((err) => console.log(err));
  }, []);

  const chooseLab = (lab) => {

    localStorage.removeItem("selectedPackage");
    localStorage.removeItem("selectedTest");

    localStorage.setItem(
      "selectedLab",
      JSON.stringify({
        name: lab.labName || lab.name,
        location: lab.location,
        tests: lab.tests
      })
    );

    alert(`${lab.labName || lab.name} selected`);

    navigate("/book");
  };

  return (
    <div className="vendors-page">

      <h1>Partner Labs</h1>

      <div className="vendor-grid">

        {labs.map((lab, index) => (

          <div
            key={index}
            className="vendor-card"
          >

            <h2>{lab.labName || lab.name}</h2>

            <p className="vendor-location">
              📍 {lab.location}
            </p>

            <div className="vendor-tests">

              <h4>Available Tests</h4>

              <ul>

                {lab.tests.map((test, i) => (

                  <li key={i}>{test}</li>

                ))}

              </ul>

            </div>

            <button
              className="choose-btn"
              onClick={() => chooseLab(lab)}
            >
              Choose Lab
            </button>

          </div>

        ))}

      </div>

    </div>
  );
}

export default Vendors;