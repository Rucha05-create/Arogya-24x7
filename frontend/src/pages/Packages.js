import React from "react";
import "./Packages.css";

function Packages() {
    const packages = [
        {
            name: "Basic Health Package",
            price: 1500,
            description: "Basic preventive health checkup package",
            tests: [
                "Blood Test",
                "Vitamin Test",
                "CBC"
            ]
        },
        {
            name: "Full Body Checkup",
            price: 2500,
            description: "Complete health analysis package",
            tests: [
                "Blood Test",
                "Thyroid Profile",
                "Liver Function Test",
                "Diabetes Test"
            ]
        },
        {
            name: "Executive Health Package",
            price: 3200,
            description: "Advanced executive health screening",
            tests: [
                "Blood Test",
                "COVID-19 Test",
                "Vitamin Test",
                "Thyroid Profile"
            ]
        }
    ];

    const choosePackage = (pkg) => {
        localStorage.setItem("selectedPackage", JSON.stringify(pkg));
        window.location.href = "/book-test";
    };

    return (
        <div className="packages-page">

            <div className="packages-header">
                <h1>🧪 Health Packages</h1>
                <p>
                    Choose a health package that suits your healthcare needs.
                </p>
            </div>

            <div className="packages-grid">

                {packages.map((pkg, index) => (

                    <div className="package-card" key={index}>

                        <div className="package-card-top">

                            <h2>{pkg.name}</h2>

                            <div className="package-price">
                                ₹{pkg.price}
                            </div>

                        </div>

                        <p className="package-description">
                            {pkg.description}
                        </p>

                        <div className="included-tests">

                            <h3>Included Tests</h3>

                            <ul>
                                {pkg.tests.map((test, testIndex) => (
                                    <li key={testIndex}>
                                        {test}
                                    </li>
                                ))}
                            </ul>

                        </div>

                        <button
                            className="choose-package-btn"
                            onClick={() => choosePackage(pkg)}
                        >
                            Choose Package
                        </button>

                    </div>

                ))}

            </div>

        </div>
    );
}

export default Packages;