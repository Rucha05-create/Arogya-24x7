import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BookTest.css";

function BookTest() {
    const navigate = useNavigate();

    // ======================================================
    // GET LOGGED-IN USER
    // ======================================================

    let user = {};

    try {
        const storedUser = localStorage.getItem("user");

        if (
            storedUser &&
            storedUser !== "undefined" &&
            storedUser !== "null"
        ) {
            user = JSON.parse(storedUser);
        }
    } catch (error) {
        console.error("Invalid user data:", error);
        user = {};
    }

    // ======================================================
    // USER ROLE
    // ======================================================

    const userRole = String(
        user?.role || "client"
    )
        .toLowerCase()
        .trim();

    // ======================================================
    // NORMALIZE ROLE
    // IMPORTANT:
    // Keep each role separate because each role has
    // its own coupon in MongoDB.
    // ======================================================

    const normalizeRole = (role) => {
        const value = String(role || "")
            .toLowerCase()
            .trim()
            .replace(/-/g, "_")
            .replace(/\s+/g, "_");

        // Client
        if (
            value === "client" ||
            value === "user" ||
            value === "patient"
        ) {
            return "client";
        }

        // Health Worker
        if (
            value === "health_worker" ||
            value === "healthworker"
        ) {
            return "health_worker";
        }

        // Volunteer
        if (
            value === "volunteer"
        ) {
            return "volunteer";
        }

        // Intern
        if (
            value === "intern"
        ) {
            return "intern";
        }

        // Social Worker
        if (
            value === "social_worker" ||
            value === "socialworker"
        ) {
            return "social_worker";
        }

        // Sahash Employee
        if (
            value === "sahash_employee" ||
            value === "sahashemployee"
        ) {
            return "sahash_employee";
        }

        // Normal Employee
        if (
            value === "employee" ||
            value === "staff"
        ) {
            return "employee";
        }

        return value;
    };

    const normalizedRole =
        normalizeRole(userRole);

    // ======================================================
    // ROLE DISPLAY NAME
    // ======================================================

    const getRoleDisplayName = (role) => {
        const roleNames = {
            client: "Client",
            health_worker: "Health Worker",
            volunteer: "Volunteer",
            intern: "Intern",
            social_worker: "Social Worker",
            sahash_employee: "Sahash Employee",
            employee: "Employee"
        };

        return (
            roleNames[role] ||
            role
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                )
        );
    };

    // ======================================================
    // STATES - LAB
    // ======================================================

    const [labs, setLabs] = useState([]);

    const [selectedLabId, setSelectedLabId] =
        useState("");

    const [selectedLab, setSelectedLab] =
        useState(null);

    const [loadingLabs, setLoadingLabs] =
        useState(true);

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
    // COUPON STATES
    // ======================================================

    const [coupons, setCoupons] = useState([]);

    const [loadingCoupons, setLoadingCoupons] =
        useState(true);

    const [coupon, setCoupon] =
        useState("");

    const [discount, setDiscount] =
        useState(0);

    const [couponMessage, setCouponMessage] =
        useState("");

    const [couponError, setCouponError] =
        useState("");

    const [specialId, setSpecialId] =
        useState("");

    // ======================================================
    // BOOKING LOADING
    // ======================================================

    const [isBooking, setIsBooking] =
        useState(false);

    // ======================================================
    // GET TODAY'S DATE
    // ======================================================

    const today = new Date()
        .toISOString()
        .split("T")[0];

    // ======================================================
    // NORMALIZE COUPON ROLE
    // ======================================================

    const normalizeCouponRole = (role) => {
        return String(role || "")
            .toLowerCase()
            .trim()
            .replace(/-/g, "_")
            .replace(/\s+/g, "_");
    };

    // ======================================================
    // CONVERT requiresId FROM MONGODB
    //
    // MongoDB screenshot contains values such as:
    //
    // requiresId: "true"
    // requiresId: "false"
    //
    // This function supports both strings and booleans.
    // ======================================================

    const couponRequiresId = (selectedCoupon) => {
        if (!selectedCoupon) {
            return false;
        }

        const value =
            selectedCoupon.requiresId;

        if (value === true) {
            return true;
        }

        if (value === false) {
            return false;
        }

        return (
            String(value)
                .toLowerCase()
                .trim() === "true"
        );
    };

    // ======================================================
    // GET ID LABEL
    // ======================================================

    const getIdLabel = () => {
        const role =
            normalizeCouponRole(
                selectedCoupon?.allowedRole
            );

        switch (role) {
            case "volunteer":
                return "Volunteer ID";

            case "intern":
                return "Intern ID";

            case "employee":
                return "Employee ID";

            case "sahash_employee":
                return "Sahash Employee ID";

            case "social_worker":
                return "Social Worker ID";

            case "health_worker":
                return "Health Worker ID";

            case "client":
                return "Client ID";

            default:
                return "ID";
        }
    };

    // ======================================================
    // GET ID PLACEHOLDER
    // ======================================================

    const getIdPlaceholder = () => {
        const role =
            normalizeCouponRole(
                selectedCoupon?.allowedRole
            );

        switch (role) {
            case "volunteer":
                return "Enter your Volunteer ID";

            case "intern":
                return "Enter your Intern ID";

            case "employee":
                return "Enter your Employee ID";

            case "sahash_employee":
                return "Enter your Sahash Employee ID";

            case "social_worker":
                return "Enter your Social Worker ID";

            case "health_worker":
                return "Enter your Health Worker ID";

            case "client":
                return "Enter your Client ID";

            default:
                return "Enter ID";
        }
    };

    // ======================================================
    // LOAD LABS
    // ======================================================

    useEffect(() => {
        const fetchLabs = async () => {
            try {
                setLoadingLabs(true);

                const response = await fetch(
                    "http://localhost:5000/api/labs"
                );

                if (!response.ok) {
                    throw new Error(
                        "Unable to fetch laboratories."
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
            } catch (error) {
                console.error(
                    "Error fetching labs:",
                    error
                );

                alert(
                    "Unable to load laboratories. Please try again."
                );
            } finally {
                setLoadingLabs(false);
            }
        };

        fetchLabs();
    }, []);

    // ======================================================
    // LOAD COUPONS
    // ======================================================

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                setLoadingCoupons(true);

                const response = await fetch(
                    "http://localhost:5000/api/coupons"
                );

                if (!response.ok) {
                    throw new Error(
                        "Unable to fetch coupons."
                    );
                }

                const data =
                    await response.json();

                console.log(
                    "Coupons received:",
                    data
                );

                setCoupons(
                    Array.isArray(data)
                        ? data
                        : []
                );
            } catch (error) {
                console.error(
                    "Fetch coupons error:",
                    error
                );

                setCoupons([]);

                setCouponError(
                    "Unable to load discount coupons."
                );
            } finally {
                setLoadingCoupons(false);
            }
        };

        fetchCoupons();
    }, []);

    // ======================================================
    // AVAILABLE COUPONS FOR CURRENT USER
    //
    // IMPORTANT:
    // The coupon allowedRole must match the user's role.
    //
    // Example:
    //
    // user role = volunteer
    // allowedRole = volunteer
    // => VOL15 appears
    //
    // user role = intern
    // allowedRole = intern
    // => INT10 appears
    //
    // user role = health_worker
    // allowedRole = health_worker
    // => HW20 appears
    // ======================================================

    const availableCoupons =
        coupons.filter((item) => {

            const couponRole =
                normalizeCouponRole(
                    item.allowedRole
                );

            return (
                couponRole ===
                normalizedRole
            );
        });

    // ======================================================
    // SELECTED COUPON
    // ======================================================

    const selectedCoupon =
        coupons.find(
            (item) =>
                String(item.code || "")
                    .trim()
                    .toUpperCase() ===
                String(coupon || "")
                    .trim()
                    .toUpperCase()
        ) || null;

    // ======================================================
    // HANDLE LAB CHANGE
    // ======================================================

    const handleLabChange = (e) => {
        const labId = e.target.value;

        setSelectedLabId(labId);

        const lab = labs.find(
            (item) =>
                String(item._id) ===
                String(labId)
        );

        setSelectedLab(
            lab || null
        );

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

        // Reset coupon when test changes
        if (coupon) {
            setCouponMessage(
                "Test selection changed. Please apply the coupon again."
            );

            setDiscount(0);
        }
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

        if (coupon) {
            setDiscount(0);

            setCouponMessage(
                "Tests changed. Please apply the coupon again."
            );
        }
    };

    // ======================================================
    // REMOVE TEST
    // ======================================================

    const removeTestField = (
        index
    ) => {
        if (tests.length === 1) {
            setTests([
                {
                    testName: "",
                    amount: 0
                }
            ]);

            setDiscount(0);
            setCoupon("");
            setSpecialId("");
            setCouponMessage("");
            setCouponError("");

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

        setDiscount(0);

        if (coupon) {
            setCouponMessage(
                "Tests changed. Please apply the coupon again."
            );
        }
    };

    // ======================================================
    // HANDLE COUPON CHANGE
    // ======================================================

    const handleCouponChange = (e) => {
        const selectedCode =
            e.target.value;

        setCoupon(
            selectedCode
        );

        setDiscount(0);

        setCouponMessage("");

        setCouponError("");

        setSpecialId("");
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
    // APPLY COUPON
    // ======================================================

    const applyCoupon = () => {

        setCouponMessage("");

        setCouponError("");

        setDiscount(0);

        // --------------------------------------------------
        // NO COUPON
        // --------------------------------------------------

        if (!coupon) {
            setCouponError(
                "Please select a coupon."
            );

            return;
        }

        // --------------------------------------------------
        // FIND COUPON
        // --------------------------------------------------

        const selected =
            coupons.find(
                (item) =>
                    String(item.code || "")
                        .trim()
                        .toUpperCase() ===
                    String(coupon || "")
                        .trim()
                        .toUpperCase()
            );

        if (!selected) {
            setCouponError(
                "Invalid coupon."
            );

            return;
        }

        // --------------------------------------------------
        // CHECK ROLE
        // --------------------------------------------------

        const couponRole =
            normalizeCouponRole(
                selected.allowedRole
            );

        if (
            couponRole !==
            normalizedRole
        ) {
            setCouponError(
                `This coupon is only available for ${getRoleDisplayName(
                    couponRole
                )} accounts.`
            );

            return;
        }

        // --------------------------------------------------
        // CHECK TOTAL
        // --------------------------------------------------

        if (totalAmount <= 0) {
            setCouponError(
                "Please select at least one test before applying the coupon."
            );

            return;
        }

        // --------------------------------------------------
        // CHECK ID ONLY IF MONGODB SAYS requiresId = true
        // --------------------------------------------------

        if (
            couponRequiresId(
                selected
            )
        ) {
            if (
                !specialId ||
                specialId.trim() === ""
            ) {
                setCouponError(
                    `Please enter your ${getIdLabel()}.`
                );

                return;
            }

            if (
                specialId.trim().length < 3
            ) {
                setCouponError(
                    `Please enter a valid ${getIdLabel()}.`
                );

                return;
            }
        }

        // --------------------------------------------------
        // APPLY DISCOUNT
        // --------------------------------------------------

        const discountValue =
            Number(
                selected.discount || 0
            );

        setDiscount(
            discountValue
        );

        if (
            couponRequiresId(
                selected
            )
        ) {
            setCouponMessage(
                `${selected.code} applied successfully! You received ${discountValue}% discount.`
            );
        } else {
            setCouponMessage(
                `${selected.code} applied successfully! You received ${discountValue}% discount.`
            );
        }
    };

    // ======================================================
    // DISCOUNT AMOUNT
    // ======================================================

    const discountAmount =
        (
            totalAmount *
            Number(discount || 0)
        ) / 100;

    // ======================================================
    // FINAL AMOUNT
    // ======================================================

    const finalAmount =
        Math.max(
            0,
            totalAmount -
            discountAmount
        );

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

        // ==================================================
        // VALIDATE COUPON ID
        // ==================================================

        if (
            selectedCoupon &&
            couponRequiresId(
                selectedCoupon
            )
        ) {

            if (
                !specialId ||
                specialId.trim() === ""
            ) {

                alert(
                    `Please enter your ${getIdLabel()}.`
                );

                return;
            }
        }

        try {

            setIsBooking(true);

            // ==================================================
            // DOCTOR ID
            // ==================================================

            const doctorId = null;

            // ==================================================
            // APPOINTMENT DATA
            // ==================================================

            const appointmentData = {

                patientId:
                    user._id ||
                    user.id,

                doctorId:

                    doctorId,

                labId:

                    selectedLabId,

                tests:

                    validTests,

                date:

                    booking.date,

                time:

                    booking.time,

                // ------------------------------------------
                // COUPON INFORMATION
                // ------------------------------------------

                coupon:

                    coupon || null,

                discount:

                    Number(
                        discount || 0
                    ),

                specialId:

                    selectedCoupon &&
                    couponRequiresId(
                        selectedCoupon
                    )
                        ? specialId.trim()
                        : null,

                totalAmount:

                    totalAmount,

                discountAmount:

                    discountAmount,

                finalAmount:

                    finalAmount
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

            let history = [];

            try {

                history =
                    JSON.parse(
                        localStorage.getItem(
                            "appointments"
                        )
                    ) || [];

            } catch {
                history = [];
            }

            history.unshift({

                patient:
                    user.name || "",

                tests:

                    tests.filter(
                        (test) =>
                            test.testName
                    ),

                totalAmount:

                    totalAmount,

                coupon:

                    coupon || "",

                discount:

                    discount,

                discountAmount:

                    discountAmount,

                finalAmount:

                    finalAmount,

                specialId:

                    selectedCoupon &&
                    couponRequiresId(
                        selectedCoupon
                    )
                        ? specialId
                        : "",

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

                    data.appointment?._id ||
                    data._id,

                status:

                    data.appointment?.status ||
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

            setSpecialId("");

            setCouponMessage("");

            setCouponError("");

            // ==================================================
            // SUCCESS
            // ==================================================

            alert(
                `Appointment Confirmed Successfully!\n\nTotal: ₹${totalAmount}\nDiscount: ₹${discountAmount}\nFinal Amount: ₹${finalAmount}`
            );

        } catch (err) {

            console.error(
                "Booking Error:",
                err
            );

            alert(
                err.message ||
                "Unable to book appointment."
            );

        } finally {

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
                            disabled={
                                loadingLabs
                            }
                        >

                            <option value="">
                                {loadingLabs
                                    ? "Loading laboratories..."
                                    : "Select Laboratory"}
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
                                            : ""}
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
                                        selectedLab.labId ||
                                        selectedLab._id
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

                                {/* TEST */}

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

                                    {Object.keys(
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
                                    )}

                                </select>

                                {/* PRICE */}

                                <input
                                    value={
                                        test.amount
                                            ? `₹${test.amount}`
                                            : ""
                                    }
                                    disabled
                                    placeholder="Price"
                                />

                                {/* REMOVE */}

                                {tests.length > 1 && (
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
                                )}

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
                                    today
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
                        COUPON SECTION
                    ================================================== */}

                    <div
                        className="coupon-box"
                    >

                        <h3>
                            🎟️ Discount Coupon
                        </h3>

                        <p
                            style={{
                                marginBottom:
                                    "12px",
                                color:
                                    "#666"
                            }}
                        >
                            Account Type:{" "}

                            <strong>
                                {
                                    getRoleDisplayName(
                                        normalizedRole
                                    )
                                }
                            </strong>
                        </p>

                        {/* ==================================================
                            COUPON SELECT
                        ================================================== */}

                        <select
                            value={
                                coupon
                            }
                            onChange={
                                handleCouponChange
                            }
                            disabled={
                                loadingCoupons
                            }
                        >

                            <option value="">
                                {loadingCoupons
                                    ? "Loading coupons..."
                                    : "Select Coupon"}
                            </option>

                            {availableCoupons.length >
                            0 ? (

                                availableCoupons.map(
                                    (item) => (
                                        <option
                                            key={
                                                item._id ||
                                                item.code
                                            }
                                            value={
                                                item.code
                                            }
                                        >
                                            {
                                                item.code
                                            }
                                            {" - "}
                                            {
                                                item.discount
                                            }%
                                            {" Discount"}
                                        </option>
                                    )
                                )

                            ) : (

                                !loadingCoupons && (
                                    <option
                                        value=""
                                        disabled
                                    >
                                        No coupon available for your account
                                    </option>
                                )
                            )}

                        </select>

                        {/* ==================================================
                            ID MESSAGE / INPUT
                        ================================================== */}

                        {selectedCoupon &&
                            couponRequiresId(
                                selectedCoupon
                            ) && (

                                <div
                                    style={{
                                        marginTop:
                                            "12px"
                                    }}
                                >

                                    <label
                                        style={{
                                            display:
                                                "block",
                                            marginBottom:
                                                "6px",
                                            fontWeight:
                                                "600"
                                        }}
                                    >
                                        {getIdLabel()}
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            specialId
                                        }
                                        onChange={
                                            (e) => {
                                                setSpecialId(
                                                    e.target.value
                                                );

                                                setCouponError(
                                                    ""
                                                );

                                                setCouponMessage(
                                                    ""
                                                );

                                                setDiscount(
                                                    0
                                                );
                                            }
                                        }
                                        placeholder={
                                            getIdPlaceholder()
                                        }
                                    />

                                    <small
                                        style={{
                                            display:
                                                "block",
                                            marginTop:
                                                "5px",
                                            color:
                                                "#777"
                                        }}
                                    >
                                        Enter your valid{" "}
                                        {getIdLabel()}{" "}
                                        to avail this discount.
                                    </small>

                                </div>
                            )}

                        {/* ==================================================
                            NO ID MESSAGE
                        ================================================== */}

                        {selectedCoupon &&
                            !couponRequiresId(
                                selectedCoupon
                            ) && (

                                <div
                                    style={{
                                        marginTop:
                                            "10px",
                                        color:
                                            "#666",
                                        fontSize:
                                            "14px"
                                    }}
                                >
                                    This coupon is available
                                    without an additional ID.
                                </div>
                            )}

                        {/* ==================================================
                            APPLY BUTTON
                        ================================================== */}

                        <button
                            type="button"
                            onClick={
                                applyCoupon
                            }
                            style={{
                                marginTop:
                                    "12px"
                            }}
                            disabled={
                                !coupon ||
                                totalAmount <= 0
                            }
                        >
                            Apply Coupon
                        </button>

                        {/* ==================================================
                            SUCCESS MESSAGE
                        ================================================== */}

                        {couponMessage && (
                            <div
                                style={{
                                    marginTop:
                                        "10px",
                                    padding:
                                        "10px",
                                    borderRadius:
                                        "6px",
                                    background:
                                        "#e8f7ee",
                                    color:
                                        "#187a3d"
                                }}
                            >
                                ✓{" "}
                                {
                                    couponMessage
                                }
                            </div>
                        )}

                        {/* ==================================================
                            ERROR MESSAGE
                        ================================================== */}

                        {couponError && (
                            <div
                                style={{
                                    marginTop:
                                        "10px",
                                    padding:
                                        "10px",
                                    borderRadius:
                                        "6px",
                                    background:
                                        "#fff0f0",
                                    color:
                                        "#d32f2f"
                                }}
                            >
                                ⚠{" "}
                                {
                                    couponError
                                }
                            </div>
                        )}

                    </div>

                    {/* ==================================================
                        BILL SUMMARY
                    ================================================== */}

                    <div
                        className="total-section"
                    >

                        <h3>
                            Total:
                            {" "}
                            ₹{totalAmount}
                        </h3>

                        <h3>
                            Discount:
                            {" "}
                            {discount}%
                        </h3>

                        <h3>
                            Discount Amount:
                            {" "}
                            ₹
                            {discountAmount.toFixed(
                                2
                            )}
                        </h3>

                        <h2>
                            Final:
                            {" "}
                            ₹
                            {finalAmount.toFixed(
                                2
                            )}
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
                        {isBooking
                            ? "Booking..."
                            : "Confirm Appointment"}
                    </button>

                </form>

            </div>

        </div>
    );
}

export default BookTest;