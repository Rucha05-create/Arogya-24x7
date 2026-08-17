import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BookTest.css";

function BookTest() {

    const navigate = useNavigate();

    // ======================================================
    // USER
    // ======================================================

    let user = {};

    try {

        const storedUser =
            localStorage.getItem("user");

        if (
            storedUser &&
            storedUser !== "undefined"
        ) {

            user = JSON.parse(
                storedUser
            );

        }

    }

    catch (error) {

        console.log(
            "Invalid user data."
        );

        user = {};

    }


    // ======================================================
    // STATES
    // ======================================================

    // Available labs from MongoDB
    const [labs, setLabs] = useState([]);

    // Selected lab MongoDB _id
    const [selectedLabId, setSelectedLabId] =
        useState("");

    // Selected lab object
    const [selectedLab, setSelectedLab] =
        useState(null);


    // ======================================================
    // TEST PRICES
    // ======================================================

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


    // ======================================================
    // TESTS
    // ======================================================

    /*
        IMPORTANT:

        Start with ONE EMPTY TEST.

        We do NOT load:
        - selectedPackage
        - selectedTest
        - selectedLab.tests

        Therefore old package tests will NOT
        automatically appear here.
    */

    const [tests, setTests] = useState([
        {
            testName: "",
            amount: 0
        }
    ]);


    // ======================================================
    // BOOKING DATE / TIME
    // ======================================================

    const [booking, setBooking] = useState({

        date: "",

        time: ""

    });


    // ======================================================
    // COUPON
    // ======================================================

    const [coupon, setCoupon] =
        useState("");

    const [discount, setDiscount] =
        useState(0);


    // ======================================================
    // BOOKING LOADING
    // ======================================================

    const [isBooking, setIsBooking] =
        useState(false);


    // ======================================================
    // LOAD LABS FROM DATABASE
    // ======================================================

    useEffect(() => {

        const fetchLabs = async () => {

            try {

                const response =
                    await fetch(
                        "http://localhost:5000/api/labs"
                    );

                if (!response.ok) {

                    throw new Error(
                        "Unable to fetch labs."
                    );

                }

                const data =
                    await response.json();

                console.log(
                    "Labs received:",
                    data
                );

                setLabs(
                    Array.isArray(data)
                        ? data
                        : []
                );

            }

            catch (error) {

                console.error(
                    "Error fetching labs:",
                    error
                );

                alert(
                    "Unable to load laboratories. Please try again."
                );

            }

        };

        fetchLabs();

    }, []);


    // ======================================================
    // HANDLE LAB CHANGE
    // ======================================================

    const handleLabChange = (e) => {

        const labId =
            e.target.value;

        setSelectedLabId(
            labId
        );

        const lab =
            labs.find(
                (item) =>
                    item._id === labId
            );

        setSelectedLab(
            lab || null
        );

        // Keep selected lab available
        // for the next booking
        if (lab) {

            localStorage.setItem(
                "selectedLab",
                JSON.stringify(lab)
            );

        }

    };


    // ======================================================
    // HANDLE DATE / TIME
    // ======================================================

    const handleBookingChange = (e) => {

        setBooking({

            ...booking,

            [e.target.name]:
                e.target.value

        });

    };


    // ======================================================
    // HANDLE TEST CHANGE
    // ======================================================

    const handleTestChange = (
        index,
        value
    ) => {

        const updatedTests =
            [...tests];

        updatedTests[index] = {

            testName: value,

            amount:
                testPrices[value] || 0

        };

        setTests(
            updatedTests
        );

    };


    // ======================================================
    // ADD TEST
    // ======================================================

    const addTestField = () => {

        setTests([

            ...tests,

            {
                testName: "",
                amount: 0
            }

        ]);

    };


    // ======================================================
    // REMOVE TEST
    // ======================================================

    const removeTestField = (
        index
    ) => {

        // Keep at least one field
        if (tests.length === 1) {

            setTests([

                {
                    testName: "",
                    amount: 0
                }

            ]);

            return;

        }


        const updatedTests =
            tests.filter(
                (_, testIndex) =>
                    testIndex !== index
            );


        setTests(
            updatedTests
        );

    };


    // ======================================================
    // COUPONS
    // ======================================================

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


    // ======================================================
    // APPLY COUPON
    // ======================================================

    const applyCoupon = () => {

        const enteredCoupon =
            coupon
                .trim()
                .toUpperCase();


        const selectedCoupon =
            coupons[enteredCoupon];


        if (

            selectedCoupon &&

            selectedCoupon.role ===
            user.role

        ) {

            setCoupon(
                enteredCoupon
            );

            setDiscount(
                selectedCoupon.discount
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


    // ======================================================
    // TOTAL AMOUNT
    // ======================================================

    const totalAmount =
        tests.reduce(

            (
                total,
                current
            ) => {

                return (

                    total +
                    Number(
                        current.amount || 0
                    )

                );

            },

            0

        );


    // ======================================================
    // FINAL AMOUNT
    // ======================================================

    const finalAmount =

        totalAmount -

        (
            totalAmount *
            discount
        ) / 100;


    // ======================================================
    // SUBMIT BOOKING
    // ======================================================

    const submitHandler = async (e) => {

        e.preventDefault();


        // ==================================================
        // CHECK LOGIN
        // ==================================================

        const token =
            localStorage.getItem(
                "token"
            );


        if (!token) {

            alert(
                "Please login before booking an appointment."
            );

            navigate(
                "/login"
            );

            return;

        }


        // ==================================================
        // VALIDATE LAB
        // ==================================================

        if (!selectedLabId) {

            alert(
                "Please select a laboratory."
            );

            return;

        }


        // ==================================================
        // VALIDATE TESTS
        // ==================================================

        const validTests =

            tests

                .filter(

                    (test) =>

                        test.testName &&

                        test.testName
                            .trim() !== ""

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


        // ==================================================
        // VALIDATE DATE
        // ==================================================

        if (!booking.date) {

            alert(
                "Please select appointment date."
            );

            return;

        }


        // ==================================================
        // VALIDATE TIME
        // ==================================================

        if (!booking.time) {

            alert(
                "Please select appointment time."
            );

            return;

        }


        try {

            setIsBooking(true);


            // ==================================================
            // DOCTOR ID
            // ==================================================

            /*
                Currently your BookTest page does not have
                a separate doctor selection.

                Therefore doctorId is kept null.

                Your Appointment schema allows doctorId
                without required: true.
            */

            const doctorId = null;


            // ==================================================
            // APPOINTMENT DATA
            // ==================================================

            const appointmentData = {

                /*
                    patientId is taken from JWT
                    in your backend.

                    It is not necessary to send it,
                    but we keep it for compatibility.
                */

                patientId:

                    user._id ||

                    user.id,


                doctorId:


                    doctorId,


                // IMPORTANT:
                // This is the MongoDB _id
                // of the selected laboratory.

                labId:

                    selectedLabId,


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


            // ==================================================
            // SEND TO BACKEND
            // ==================================================

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


            // ==================================================
            // READ RESPONSE
            // ==================================================

            const data =
                await response.json();


            console.log(
                "Appointment Response:",
                data
            );


            // ==================================================
            // CHECK RESPONSE
            // ==================================================

            if (!response.ok) {

                throw new Error(

                    data.message ||

                    "Unable to book appointment."

                );

            }


            // ==================================================
            // SAVE CLIENT HISTORY
            // ==================================================

            const history =

                JSON.parse(

                    localStorage.getItem(
                        "appointments"
                    )

                ) || [];


            history.unshift({

                patient:
                    user.name || "",


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

                    selectedLab?.labName ||

                    selectedLab?.name ||

                    "",


                labId:

                    selectedLab?._id ||

                    selectedLab?.id ||

                    selectedLabId,


                appointmentId:
                    data._id,


                status:
                    data.status ||
                    "Pending"

            });


            localStorage.setItem(

                "appointments",

                JSON.stringify(
                    history
                )

            );


            // ==================================================
            // REMOVE OLD PACKAGE SELECTIONS
            // ==================================================

            /*
                This prevents old package tests
                from appearing in future bookings.
            */

            localStorage.removeItem(
                "selectedPackage"
            );

            localStorage.removeItem(
                "selectedTest"
            );


            // ==================================================
            // RESET TESTS
            // ==================================================

            setTests([

                {
                    testName: "",
                    amount: 0
                }

            ]);


            // ==================================================
            // RESET DATE / TIME
            // ==================================================

            setBooking({

                date: "",

                time: ""

            });


            // ==================================================
            // RESET COUPON
            // ==================================================

            setCoupon("");

            setDiscount(0);


            // ==================================================
            // SUCCESS
            // ==================================================

            alert(
                "Appointment Confirmed Successfully!"
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


    // ======================================================
    // JSX
    // ======================================================

    return (

        <div className="booking-page">

            <div className="booking-container">

                {/* ==================================================
                    HEADING
                ================================================== */}

                <h1>
                    🧪 Schedule Lab Tests
                </h1>


                {/* ==================================================
                    FORM
                ================================================== */}

                <form
                    onSubmit={
                        submitHandler
                    }
                >

                    {/* ==================================================
                        PATIENT INFORMATION
                    ================================================== */}

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


                    {/* ==================================================
                        LAB SELECTION
                    ================================================== */}

                    <div className="lab-selection">

                        <h3>
                            Select Laboratory
                        </h3>

                        <p
                            style={{
                                marginBottom:
                                    "10px",
                                color:
                                    "#666"
                            }}
                        >
                            Select the laboratory where
                            you want to perform your tests.
                        </p>


                        <select

                            value={
                                selectedLabId
                            }

                            onChange={
                                handleLabChange
                            }

                            required

                        >

                            <option
                                value=""
                            >
                                Select Laboratory
                            </option>


                            {labs.map(
                                (lab) => (

                                    <option
                                        key={
                                            lab._id
                                        }
                                        value={
                                            lab._id
                                        }
                                    >

                                        {
                                            lab.labName
                                        }

                                        {lab.location
                                            ? ` - ${lab.location}`
                                            : ""
                                        }

                                    </option>

                                )
                            )}

                        </select>


                        {/* ==================================================
                            SELECTED LAB DETAILS
                        ================================================== */}

                        {selectedLab && (

                            <div
                                className="selected-lab"
                                style={{
                                    marginTop:
                                        "15px",
                                    padding:
                                        "15px",
                                    borderRadius:
                                        "10px",
                                    background:
                                        "#f4f8ff"
                                }}
                            >

                                <h3>
                                    🏥 Selected Lab
                                </h3>


                                <p>

                                    <strong>
                                        Name:
                                    </strong>{" "}

                                    {
                                        selectedLab.labName ||
                                        selectedLab.name
                                    }

                                </p>


                                <p>

                                    <strong>
                                        Location:
                                    </strong>{" "}

                                    {
                                        selectedLab.location ||
                                        "Not specified"
                                    }

                                </p>


                                <p>

                                    <strong>
                                        Lab ID:
                                    </strong>{" "}

                                    {
                                        selectedLab.labId
                                    }

                                </p>

                            </div>

                        )}

                    </div>


                    {/* ==================================================
                        TESTS
                    ================================================== */}

                    <h3>
                        Select Tests
                    </h3>


                    <p
                        style={{
                            marginBottom:
                                "15px",
                            color:
                                "#666"
                        }}
                    >

                        Select the tests you
                        want to book.

                    </p>


                    {tests.map(

                        (
                            test,
                            index
                        ) => (

                            <div
                                key={index}
                                className="test-row"
                            >

                                {/* ==================================================
                                    TEST SELECTION
                                ================================================== */}

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

                                    <option
                                        value=""
                                    >
                                        Select Test
                                    </option>


                                    {

                                        Object.keys(
                                            testPrices
                                        ).map(

                                            (item) => (

                                                <option
                                                    key={
                                                        item
                                                    }
                                                    value={
                                                        item
                                                    }
                                                >

                                                    {
                                                        item
                                                    }

                                                </option>

                                            )

                                        )

                                    }

                                </select>


                                {/* ==================================================
                                    PRICE
                                ================================================== */}

                                <input

                                    value={

                                        test.amount

                                            ? `₹${test.amount}`

                                            : ""

                                    }

                                    disabled

                                    placeholder="Price"

                                />


                                {/* ==================================================
                                    REMOVE
                                ================================================== */}

                                {

                                    tests.length >
                                        1 && (

                                        <button

                                            type="button"

                                            className="remove-test-btn"

                                            onClick={() =>

                                                removeTestField(
                                                    index
                                                )

                                            }

                                        >

                                            ✕

                                        </button>

                                    )

                                }

                            </div>

                        )

                    )}


                    {/* ==================================================
                        ADD TEST
                    ================================================== */}

                    <button

                        type="button"

                        className="add-test-btn"

                        onClick={
                            addTestField
                        }

                    >

                        + Add Another Test

                    </button>


                    {/* ==================================================
                        DATE & TIME
                    ================================================== */}

                    <div
                        className="schedule-section"
                    >

                        <div>

                            <label>
                                Appointment Date
                            </label>

                            <input

                                type="date"

                                name="date"

                                value={
                                    booking.date
                                }

                                required

                                min={
                                    new Date()
                                        .toISOString()
                                        .split("T")[0]
                                }

                                onChange={
                                    handleBookingChange
                                }

                            />

                        </div>


                        <div>

                            <label>
                                Appointment Time
                            </label>

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

                    </div>


                    {/* ==================================================
                        COUPON
                    ================================================== */}

                    <div
                        className="coupon-box"
                    >

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


                    {/* ==================================================
                        TOTAL
                    ================================================== */}

                    <div
                        className="total-section"
                    >

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


                    {/* ==================================================
                        CONFIRM
                    ================================================== */}

                    <button

                        type="submit"

                        className="confirm-btn"

                        disabled={
                            isBooking
                        }

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