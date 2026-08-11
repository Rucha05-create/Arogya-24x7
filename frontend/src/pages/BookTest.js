import { useState } from "react";
import { useNavigate } from "react-router-dom";

function BookTest() {

  const navigate = useNavigate();

  // ==========================
  // User
  // ==========================

  const user =
    JSON.parse(
      localStorage.getItem("user")
    ) || {};

  // ==========================
  // Selected Package
  // ==========================

  const selectedPackage =
    JSON.parse(
      localStorage.getItem("selectedPackage")
    );

  // ==========================
  // Selected Test
  // ==========================

  const selectedTest =
    localStorage.getItem("selectedTest");

  // ==========================
  // Selected Lab
  // ==========================

  const selectedLab =
    JSON.parse(
      localStorage.getItem("selectedLab")
    );

  // ==========================
  // Test Prices
  // ==========================

  const testPrices = {

    "Blood Test": 500,

    "Diabetes Test": 700,

    "Thyroid Profile": 900,

    "COVID-19 Test": 1200,

    "Vitamin Test": 800,

    "Liver Function Test": 1000,

    "CBC": 600,

    "Thyroid": 900,

    "Diabetes": 700,

    "Liver": 1000,

    "Kidney": 1100

  };

  // ==========================
  // Default Tests
  // ==========================

  const defaultTests =

    selectedLab?.tests

      ?

      selectedLab.tests.map(
        (test) => ({

          testName: test,

          amount:
            testPrices[test] || 0

        })
      )

      :

      selectedPackage?.tests

        ?

        selectedPackage.tests.map(
          (test) => ({

            testName: test,

            amount:
              testPrices[test] || 0

          })
        )

        :

        [

          {

            testName:
              selectedTest || "",

            amount:
              testPrices[selectedTest] || 0

          }

        ];

  // ==========================
  // States
  // ==========================

  const [tests, setTests] =
    useState(defaultTests);

  const [booking, setBooking] =
    useState({

      date: "",

      time: ""

    });

  const [coupon, setCoupon] =
    useState("");

  const [discount, setDiscount] =
    useState(0);

  const [isBooking, setIsBooking] =
    useState(false);

  // ==========================
  // Coupons
  // ==========================

  const coupons = {

    HW20: {

      discount: 20,

      role: "health_worker"

    },

    VOL15: {

      discount: 15,

      role: "volunteer"

    },

    INT10: {

      discount: 10,

      role: "intern"

    },

    SAHASH30: {

      discount: 30,

      role: "sahash_employee"

    }

  };

  // ==========================
  // Handle Date & Time
  // ==========================

  const handleBookingChange = (e) => {

    setBooking({

      ...booking,

      [e.target.name]:
        e.target.value

    });

  };

  // ==========================
  // Handle Test Change
  // ==========================

  const handleTestChange = (
    index,
    value
  ) => {

    const updated =
      [...tests];

    updated[index] = {

      testName: value,

      amount:
        testPrices[value] || 0

    };

    setTests(updated);

  };

  // ==========================
  // Add Another Test
  // ==========================

  const addTestField = () => {

    setTests([

      ...tests,

      {

        testName: "",

        amount: 0

      }

    ]);

  };

  // ==========================
  // Apply Coupon
  // ==========================

  const applyCoupon = () => {

    const enteredCoupon =
      coupon.trim().toUpperCase();

    const selected =
      coupons[enteredCoupon];

    if (

      selected &&

      selected.role === user.role

    ) {

      setCoupon(enteredCoupon);

      setDiscount(
        selected.discount
      );

      alert(
        "Coupon Applied Successfully"
      );

    }

    else {

      setDiscount(0);

      alert(
        "Invalid Coupon"
      );

    }

  };

  // ==========================
  // Total Amount
  // ==========================

  const totalAmount =
    tests.reduce(

      (
        total,
        current
      ) => {

        return (
          total +
          Number(current.amount || 0)
        );

      },

      0

    );

  // ==========================
  // Final Amount
  // ==========================

  const finalAmount =

    totalAmount -

    (
      totalAmount *
      discount
    ) / 100;

  // ==========================
  // Submit Booking
  // ==========================

  const submitHandler = async (e) => {

    e.preventDefault();

    // ==========================
    // Check Login
    // ==========================

    const token =
      localStorage.getItem("token");

    if (!token) {

      alert(
        "Please login before booking an appointment."
      );

      navigate("/login");

      return;

    }

    // ==========================
    // Validate Tests
    // ==========================

    const validTests =
      tests
        .filter(
          (test) =>
            test.testName &&
            test.testName.trim() !== ""
        )
        .map(
          (test) =>
            test.testName
        );

    if (
      validTests.length === 0
    ) {

      alert(
        "Please select at least one test."
      );

      return;

    }

    // ==========================
    // Validate Date
    // ==========================

    if (!booking.date) {

      alert(
        "Please select appointment date."
      );

      return;

    }

    // ==========================
    // Validate Time
    // ==========================

    if (!booking.time) {

      alert(
        "Please select appointment time."
      );

      return;

    }

    try {

      setIsBooking(true);

      // ==========================
      // Get IDs
      // ==========================

      const labId =
        selectedLab?._id ||
        selectedLab?.id ||
        null;

      const doctorId =
        selectedLab?.doctorId?._id ||
        selectedLab?.doctorId ||
        null;

      // ==========================
      // Appointment Data
      // ==========================

      const appointmentData = {

        patientId:
          user._id ||
          user.id,

        doctorId,

        labId,

        tests:
          validTests,

        date:
          booking.date,

        time:
          booking.time

      };

      console.log(
        "Sending Appointment:",
        appointmentData
      );

      // ==========================
      // Send To Backend
      // ==========================

      const response =
        await fetch(

          "http://localhost:5000/api/appointments/book",

          {

            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`

            },

            body:
              JSON.stringify(
                appointmentData
              )

          }

        );

      // ==========================
      // Read Response
      // ==========================

      const data =
        await response.json();

      console.log(
        "Appointment Response:",
        data
      );

      // ==========================
      // Check Response
      // ==========================

      if (!response.ok) {

        throw new Error(

          data.message ||
          "Unable to book appointment."

        );

      }

      // ==========================
      // Save Client History
      // ==========================

      const history =

        JSON.parse(

          localStorage.getItem(
            "appointments"
          )

        ) || [];

      history.unshift({

        patient:
          user.name,

        tests:
          tests.filter(
            (test) =>
              test.testName
          ),

        totalAmount:
          finalAmount,

        coupon:
          coupon,

        discount:
          discount,

        date:
          booking.date,

        time:
          booking.time,

        lab:
          selectedLab?.name || "",

        appointmentId:
          data._id,

        status:
          data.status || "Pending"

      });

      localStorage.setItem(

        "appointments",

        JSON.stringify(
          history
        )

      );

      // ==========================
      // Clear Selection
      // ==========================

      localStorage.removeItem(
        "selectedPackage"
      );

      localStorage.removeItem(
        "selectedTest"
      );

      localStorage.removeItem(
        "selectedLab"
      );

      // ==========================
      // Success
      // ==========================

      alert(
        "Appointment Confirmed Successfully!"
      );

      navigate(
        "/profile"
      );

    }

    catch (err) {

      console.error(
        "Booking Error:",
        err
      );

      alert(

        err.message ||
        "Unable to book appointment."

      );

    }

    finally {

      setIsBooking(false);

    }

  };

  // ==========================
  // JSX
  // ==========================

  return (

    <div className="booking-page">

      <div className="booking-container">

        <h1>
          🧪 Schedule Lab Tests
        </h1>

        <form
          onSubmit={
            submitHandler
          }
        >

          {/* ==========================
              Patient Information
          ========================== */}

          <div className="patient-info">

            <input
              value={
                user.name || ""
              }
              disabled
              placeholder="Patient Name"
            />

            <input
              value={
                user.email || ""
              }
              disabled
              placeholder="Email"
            />

          </div>

          {/* ==========================
              Selected Lab
          ========================== */}

          {

            selectedLab && (

              <div className="selected-lab">

                <h3>
                  Selected Lab
                </h3>

                <p>
                  <strong>
                    Name:
                  </strong>{" "}
                  {selectedLab.name}
                </p>

                <p>
                  <strong>
                    Location:
                  </strong>{" "}
                  {selectedLab.location}
                </p>

              </div>

            )

          }

          {/* ==========================
              Tests
          ========================== */}

          <h3>
            Select Tests
          </h3>

          {

            tests.map(

              (
                test,
                index
              ) => (

                <div
                  key={index}
                  className="test-row"
                >

                  <select

                    value={
                      test.testName
                    }

                    onChange={
                      (e) =>
                        handleTestChange(
                          index,
                          e.target.value
                        )
                    }

                    required

                  >

                    <option value="">
                      Select Test
                    </option>

                    {

                      Object.keys(
                        testPrices
                      ).map(

                        (item) => (

                          <option
                            key={item}
                            value={item}
                          >

                            {item}

                          </option>

                        )

                      )

                    }

                  </select>

                  <input
                    value={
                      `₹${test.amount}`
                    }
                    disabled
                  />

                </div>

              )

            )

          }

          {/* ==========================
              Add Test
          ========================== */}

          <button
            type="button"
            className="add-test-btn"
            onClick={
              addTestField
            }
          >

            + Add Another Test

          </button>

          {/* ==========================
              Date & Time
          ========================== */}

          <div className="schedule-section">

            <input
              type="date"
              name="date"
              value={
                booking.date
              }
              required
              onChange={
                handleBookingChange
              }
            />

            <input
              type="time"
              name="time"
              value={
                booking.time
              }
              required
              onChange={
                handleBookingChange
              }
            />

          </div>

          {/* ==========================
              Coupon
          ========================== */}

          <div className="coupon-box">

            <input

              placeholder="Enter Coupon"

              value={
                coupon
              }

              onChange={
                (e) =>
                  setCoupon(
                    e.target.value
                  )
              }

            />

            <button
              type="button"
              onClick={
                applyCoupon
              }
            >

              Apply

            </button>

          </div>

          {/* ==========================
              Total
          ========================== */}

          <div className="total-section">

            <h3>
              Total:
              ₹{totalAmount}
            </h3>

            <h3>
              Discount:
              {discount}%
            </h3>

            <h2>
              Final:
              ₹{finalAmount}
            </h2>

          </div>

          {/* ==========================
              Confirm
          ========================== */}

          <button
            type="submit"
            className="confirm-btn"
            disabled={isBooking}
          >

            {

              isBooking

                ?

                "Booking..."

                :

                "Confirm Appointment"

            }

          </button>

        </form>

      </div>

    </div>

  );

}

export default BookTest;