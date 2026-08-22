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
    // NORMALIZE ROLE
    // ======================================================

    const normalizeRole = (role) => {
        const value = String(role || "")
            .toLowerCase()
            .trim()
            .replace(/-/g, "_")
            .replace(/\s+/g, "_");

        if (
            value === "client" ||
            value === "user" ||
            value === "patient"
        ) {
            return "client";
        }

        if (
            value === "health_worker" ||
            value === "healthworker" ||
            value === "health-worker"
        ) {
            return "health_worker";
        }

        if (value === "volunteer") {
            return "volunteer";
        }

        if (value === "intern") {
            return "intern";
        }

        if (
            value === "social_worker" ||
            value === "socialworker"
        ) {
            return "social_worker";
        }

        if (
            value === "sahash_employee" ||
            value === "sahashemployee" ||
            value === "sahash-employee"
        ) {
            return "sahash_employee";
        }

        if (
            value === "employee" ||
            value === "staff"
        ) {
            return "employee";
        }

        return value;
    };

    const normalizedRole = normalizeRole(
        user?.role || "client"
    );

    // ======================================================
    // ROLE DISPLAY NAME
    // ======================================================

    const getRoleDisplayName = (role) => {
        const normalized = normalizeRole(role);

        const roleNames = {
            client: "Client",
            health_worker: "Health Worker",
            volunteer: "Volunteer",
            intern: "Intern",
            social_worker: "Social Worker",
            sahash_employee: "Sahash Employee",
            employee: "Employee",
            admin: "Admin",
            doctor: "Doctor",
            lab: "Laboratory"
        };

        return (
            roleNames[normalized] ||
            String(role || "")
                .replace(/_/g, " ")
                .replace(/\b\w/g, (char) =>
                    char.toUpperCase()
                )
        );
    };

    // ======================================================
    // LAB STATES
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
        CBC: 600,
        Thyroid: 900,
        Diabetes: 700,
        Liver: 1000,
        Kidney: 1100
    };

    // ======================================================
    // TEST STATES
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

    const [coupon, setCoupon] = useState("");
    const [discount, setDiscount] = useState(0);

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
    // TODAY'S DATE
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
    // CHECK COUPON ID REQUIREMENT
    // ======================================================

    const couponRequiresId = (selectedCoupon) => {
        if (!selectedCoupon) {
            return false;
        }

        const value = selectedCoupon.requiresId;

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
    // ID LABEL
    // ======================================================

    const getIdLabel = () => {
        const role = normalizeCouponRole(
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
    // ID PLACEHOLDER
    // ======================================================

    const getIdPlaceholder = () => {
        const role = normalizeCouponRole(
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
                setCouponError("");

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
    // AVAILABLE COUPONS
    // ======================================================
    //
    // IMPORTANT:
    // Show ALL coupons in the dropdown.
    //
    // The user's role is checked later inside
    // applyCoupon().
    //
    // This means a Client can SEE all available
    // coupon types, but cannot APPLY a Volunteer,
    // Intern, Employee, etc. coupon.
    // ======================================================

    const availableCoupons = coupons;

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
        const updatedTests = [
            ...tests
        ];

        updatedTests[index] = {
            testName: value,
            amount:
                testPrices[value] || 0
        };

        setTests(updatedTests);

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

    const removeTestField = (index) => {
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

        setTests(updatedTests);

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

        setCoupon(selectedCode);

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
            (total, current) => {
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

        if (!coupon) {
            setCouponError(
                "Please select a coupon."
            );

            return;
        }

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

        // ==================================================
        // CHECK LOGGED-IN USER ROLE
        // ==================================================

        const couponRole =
            normalizeCouponRole(
                selected.allowedRole
            );

        const loggedInRole =
            normalizeRole(
                normalizedRole
            );

        console.log(
            "Logged-in role:",
            loggedInRole
        );

        console.log(
            "Coupon allowed role:",
            couponRole
        );

        // ==================================================
        // ROLE VALIDATION
        // ==================================================

        if (
            couponRole !==
            loggedInRole
        ) {
            setCouponError(
                `This coupon is only available for ${getRoleDisplayName(
                    couponRole
                )} accounts. You are logged in as ${getRoleDisplayName(
                    loggedInRole
                )}.`
            );

            return;
        }

        // ==================================================
        // TEST VALIDATION
        // ==================================================

        if (totalAmount <= 0) {
            setCouponError(
                "Please select at least one test before applying the coupon."
            );

            return;
        }

        // ==================================================
        // SPECIAL ID VALIDATION
        // ==================================================

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

        // ==================================================
        // APPLY DISCOUNT
        // ==================================================

        const discountValue =
            Number(
                selected.discount || 0
            );

        if (
            discountValue <= 0
        ) {
            setCouponError(
                "This coupon does not have a valid discount."
            );

            return;
        }

        setDiscount(
            discountValue
        );

        setCouponMessage(
            `${selected.code} applied successfully! You received ${discountValue}% discount.`
        );
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

        const token =
            localStorage.getItem(
                "token"
            );

        if (!token) {
            alert(
                "Please login before booking an appointment."
            );

            navigate("/login");

            return;
        }

        if (!selectedLabId) {
            alert(
                "Please select a laboratory."
            );

            return;
        }

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

        if (!booking.date) {
            alert(
                "Please select appointment date."
            );

            return;
        }

        if (!booking.time) {
            alert(
                "Please select appointment time."
            );

            return;
        }

        // ==================================================
        // VERIFY COUPON ROLE AGAIN BEFORE BOOKING
        // ==================================================

        if (selectedCoupon) {
            const couponRole =
                normalizeCouponRole(
                    selectedCoupon.allowedRole
                );

            if (
                couponRole !==
                normalizedRole
            ) {
                alert(
                    `The selected coupon is only available for ${getRoleDisplayName(
                        couponRole
                    )} accounts.`
                );

                return;
            }

            if (
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
        }

        try {
            setIsBooking(true);

            const appointmentData = {
                patientId:
                    user._id ||
                    user.id,

                doctorId: null,

                labId:
                    selectedLabId,

                tests:
                    validTests,

                date:
                    booking.date,

                time:
                    booking.time,

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

            const data =
                await response.json();

            console.log(
                "Appointment Response:",
                data
            );

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

            localStorage.removeItem(
                "selectedPackage"
            );

            localStorage.removeItem(
                "selectedTest"
            );

            setTests([
                {
                    testName: "",
                    amount: 0
                }
            ]);

            setBooking({
                date: "",
                time: ""
            });

            setCoupon("");
            setDiscount(0);
            setSpecialId("");
            setCouponMessage("");
            setCouponError("");

            alert(
                `Appointment Confirmed Successfully!\n\nTotal: ₹${totalAmount}\nDiscount: ₹${discountAmount.toFixed(
                    2
                )}\nFinal Amount: ₹${finalAmount.toFixed(
                    2
                )}`
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

                <div className="booking-header">

                    <div className="header-icon">
                        🧪
                    </div>

                    <div>
                        <h1>
                            Schedule Lab Tests
                        </h1>

                        <p>
                            Book your laboratory tests quickly and conveniently.
                        </p>
                    </div>

                </div>

                <form
                    onSubmit={submitHandler}
                >

                    {/* ==================================================
                        PATIENT INFORMATION
                    ================================================== */}

                    <section className="form-section">

                        <div className="section-title">
                            <span>👤</span>
                            Patient Information
                        </div>

                        <div className="patient-info">

                            <div className="input-group">

                                <label>
                                    Patient Name
                                </label>

                                <input
                                    value={
                                        user.name || ""
                                    }
                                    disabled
                                />

                            </div>

                            <div className="input-group">

                                <label>
                                    Email Address
                                </label>

                                <input
                                    value={
                                        user.email || ""
                                    }
                                    disabled
                                />

                            </div>

                        </div>

                    </section>

                    {/* ==================================================
                        LAB SELECTION
                    ================================================== */}

                    <section className="form-section">

                        <div className="section-title">
                            <span>🏥</span>
                            Select Laboratory
                        </div>

                        <p className="section-description">
                            Select the laboratory where you want to perform your tests.
                        </p>

                        <select
                            className="full-select"
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

                        {selectedLab && (
                            <div className="selected-lab">

                                <div>
                                    <strong>
                                        Laboratory
                                    </strong>

                                    <span>
                                        {
                                            selectedLab.labName ||
                                            selectedLab.name
                                        }
                                    </span>
                                </div>

                                <div>
                                    <strong>
                                        Location
                                    </strong>

                                    <span>
                                        {
                                            selectedLab.location ||
                                            "Not specified"
                                        }
                                    </span>
                                </div>

                            </div>
                        )}

                    </section>

                    {/* ==================================================
                        TESTS
                    ================================================== */}

                    <section className="form-section">

                        <div className="section-title">
                            <span>🔬</span>
                            Select Tests
                        </div>

                        <p className="section-description">
                            Select the tests you want to book.
                        </p>

                        <div className="tests-wrapper">

                            {tests.map(
                                (
                                    test,
                                    index
                                ) => (

                                    <div
                                        key={index}
                                        className="test-row"
                                    >

                                        <div className="test-select-wrapper">

                                            <label>
                                                Test {index + 1}
                                            </label>

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

                                        </div>

                                        <div className="price-wrapper">

                                            <label>
                                                Price
                                            </label>

                                            <input
                                                value={
                                                    test.amount
                                                        ? `₹${test.amount}`
                                                        : ""
                                                }
                                                disabled
                                                placeholder="Price"
                                            />

                                        </div>

                                        {tests.length >
                                            1 && (

                                                <button
                                                    type="button"
                                                    className="remove-test-btn"
                                                    onClick={() =>
                                                        removeTestField(
                                                            index
                                                        )
                                                    }
                                                    title="Remove test"
                                                >
                                                    ✕
                                                </button>

                                            )}

                                    </div>

                                )
                            )}

                        </div>

                        <button
                            type="button"
                            className="add-test-btn"
                            onClick={
                                addTestField
                            }
                        >
                            + Add Another Test
                        </button>

                    </section>

                    {/* ==================================================
                        DATE & TIME
                    ================================================== */}

                    <section className="form-section">

                        <div className="section-title">
                            <span>📅</span>
                            Appointment Schedule
                        </div>

                        <div className="schedule-section">

                            <div className="input-group">

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

                            <div className="input-group">

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

                    </section>

                    {/* ==================================================
                        COUPON
                    ================================================== */}

                    <section className="form-section coupon-section">

                        <div className="section-title">
                            <span>🎟️</span>
                            Discount Coupon
                        </div>

                        <div className="account-type">

                            Logged-in Account:

                            <strong>
                                {" "}
                                {
                                    getRoleDisplayName(
                                        normalizedRole
                                    )
                                }
                            </strong>

                        </div>

                        <div className="coupon-grid">

                            <div className="input-group">

                                <label>
                                    Select Coupon
                                </label>

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

                                                    {item.code}
                                                    {" - "}
                                                    {item.discount}
                                                    %
                                                    {" Discount - "}
                                                    {
                                                        getRoleDisplayName(
                                                            normalizeCouponRole(
                                                                item.allowedRole
                                                            )
                                                        )
                                                    }

                                                </option>

                                            )
                                        )

                                    ) : (

                                        !loadingCoupons && (
                                            <option
                                                value=""
                                                disabled
                                            >
                                                No coupons available
                                            </option>
                                        )

                                    )}

                                </select>

                            </div>

                            {selectedCoupon && (

                                <div className="coupon-details">

                                    <strong>
                                        Coupon:
                                    </strong>

                                    <span>
                                        {
                                            selectedCoupon.code
                                        }
                                    </span>

                                    <strong>
                                        Discount:
                                    </strong>

                                    <span>
                                        {
                                            selectedCoupon.discount
                                        }%
                                    </span>

                                    <strong>
                                        Available For:
                                    </strong>

                                    <span>
                                        {
                                            getRoleDisplayName(
                                                normalizeCouponRole(
                                                    selectedCoupon.allowedRole
                                                )
                                            )
                                        }
                                    </span>

                                </div>

                            )}

                        </div>

                        {/* ==================================================
                            ID FIELD
                        ================================================== */}

                        {selectedCoupon &&
                            couponRequiresId(
                                selectedCoupon
                            ) && (

                                <div className="special-id-box">

                                    <div className="input-group">

                                        <label>
                                            {
                                                getIdLabel()
                                            }
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

                                        <small>
                                            Enter your valid{" "}
                                            {
                                                getIdLabel()
                                            }{" "}
                                            to avail this discount.
                                        </small>

                                    </div>

                                </div>

                            )}

                        {selectedCoupon &&
                            !couponRequiresId(
                                selectedCoupon
                            ) && (

                                <div className="no-id-message">
                                    ✓ This coupon is available without an additional ID.
                                </div>

                            )}

                        <button
                            type="button"
                            className="apply-coupon-btn"
                            onClick={
                                applyCoupon
                            }
                            disabled={
                                !coupon ||
                                totalAmount <= 0
                            }
                        >
                            Apply Coupon
                        </button>

                        {couponMessage && (
                            <div className="coupon-success">
                                ✓ {couponMessage}
                            </div>
                        )}

                        {couponError && (
                            <div className="coupon-error">
                                ⚠ {couponError}
                            </div>
                        )}

                    </section>

                    {/* ==================================================
                        BILL SUMMARY
                    ================================================== */}

                    <section className="total-section">

                        <div className="summary-row">

                            <span>
                                Total Amount
                            </span>

                            <strong>
                                ₹{totalAmount}
                            </strong>

                        </div>

                        <div className="summary-row">

                            <span>
                                Discount
                            </span>

                            <strong>
                                {discount}%
                            </strong>

                        </div>

                        <div className="summary-row">

                            <span>
                                Discount Amount
                            </span>

                            <strong>
                                ₹
                                {discountAmount.toFixed(
                                    2
                                )}
                            </strong>

                        </div>

                        <div className="final-row">

                            <span>
                                Final Amount
                            </span>

                            <strong>
                                ₹
                                {finalAmount.toFixed(
                                    2
                                )}
                            </strong>

                        </div>

                    </section>

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
