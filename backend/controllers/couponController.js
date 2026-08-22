const mongoose = require("mongoose");
const Coupon = require("../models/Coupon");
const User = require("../models/User");


// ======================================================
// HELPER: NORMALIZE ROLE
// ======================================================

const normalizeRole = (role) => {

    if (!role) {
        return "";
    }

    const value = String(role)
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");

    // --------------------------------------------------
    // ROLE ALIASES
    // --------------------------------------------------

    if (
        value === "healthworker" ||
        value === "health_worker"
    ) {
        return "health_worker";
    }

    if (
        value === "sahashemployee" ||
        value === "sahash_employee"
    ) {
        return "sahash_employee";
    }

    if (
        value === "socialworker" ||
        value === "social_worker"
    ) {
        return "social_worker";
    }

    if (
        value === "employee" ||
        value === "staff"
    ) {
        return "employee";
    }

    if (value === "volunteer") {
        return "volunteer";
    }

    if (value === "intern") {
        return "intern";
    }

    if (
        value === "client" ||
        value === "user" ||
        value === "patient"
    ) {
        return "client";
    }

    return value;
};


// ======================================================
// HELPER: NORMALIZE CODE
// ======================================================

const normalizeCode = (code) => {

    if (!code) {
        return "";
    }

    return String(code)
        .trim()
        .toUpperCase();
};


// ======================================================
// HELPER: NORMALIZE ID
// ======================================================

const normalizeId = (id) => {

    if (!id) {
        return "";
    }

    return String(id)
        .trim()
        .toUpperCase();
};


// ======================================================
// ALL SUPPORTED USER ROLES
// ======================================================

const allowedRoles = [
    "client",
    "admin",
    "doctor",
    "lab",
    "health_worker",
    "intern",
    "volunteer",
    "sahash_employee",
    "employee",
    "social_worker"
];


// ======================================================
// ROLES THAT REQUIRE SPECIAL ID
// ======================================================

const rolesRequiringId = [
    "volunteer",
    "employee",
    "social_worker"
];


// ======================================================
// GET DEFAULT ID TYPE
// ======================================================

const getDefaultIdType = (role) => {

    switch (role) {

        case "volunteer":
            return "volunteer_id";

        case "employee":
            return "employee_id";

        case "social_worker":
            return "social_worker_id";

        default:
            return null;
    }
};


// ======================================================
// GET USER ID FIELD
// ======================================================
//
// This allows the system to work with different field
// names if you later add dedicated IDs to User.js.
//
// ======================================================

const getUserIdFields = (role) => {

    switch (role) {

        case "volunteer":
            return [
                "volunteerId",
                "volunteerID",
                "specialId",
                "employeeId",
                "_id"
            ];

        case "employee":
            return [
                "employeeId",
                "employeeID",
                "specialId",
                "_id"
            ];

        case "social_worker":
            return [
                "socialWorkerId",
                "socialWorkerID",
                "specialId",
                "_id"
            ];

        default:
            return [
                "_id"
            ];
    }
};


// ======================================================
// CHECK WHETHER ENTERED ID BELONGS TO USER
// ======================================================

const verifyUserSpecialId = async (
    enteredId,
    role,
    userId
) => {

    const normalizedEnteredId =
        normalizeId(enteredId);

    if (!normalizedEnteredId) {
        return false;
    }

    if (!userId) {
        return false;
    }

    // --------------------------------------------------
    // FIND LOGGED-IN USER
    // --------------------------------------------------

    const user =
        await User.findById(userId).select(
            "+password"
        );

    if (!user) {
        return false;
    }

    // --------------------------------------------------
    // VERIFY ROLE
    // --------------------------------------------------

    const userRole =
        normalizeRole(user.role);

    if (
        userRole !==
        normalizeRole(role)
    ) {
        return false;
    }

    // --------------------------------------------------
    // CHECK POSSIBLE ID FIELDS
    // --------------------------------------------------

    const possibleFields =
        getUserIdFields(role);

    for (
        const field of possibleFields
    ) {

        if (
            user[field] !== undefined &&
            user[field] !== null
        ) {

            const value =
                normalizeId(
                    user[field]
                );

            if (
                value ===
                normalizedEnteredId
            ) {
                return true;
            }
        }
    }

    // --------------------------------------------------
    // ALSO ALLOW MONGODB USER ID
    //
    // This is useful if your current User model does
    // not yet contain volunteerId / employeeId /
    // socialWorkerId fields.
    // --------------------------------------------------

    if (
        String(user._id) ===
        normalizedEnteredId
    ) {
        return true;
    }

    return false;
};


// ======================================================
// CREATE COUPON
// ======================================================

const createCoupon = async (req, res) => {

    try {

        const {
            code,
            discount,
            allowedRole,
            requiresId,
            idType,
            eligibleId,
            isActive,
            expiryDate
        } = req.body;


        // ==================================================
        // VALIDATE CODE
        // ==================================================

        const normalizedCode =
            normalizeCode(code);

        if (!normalizedCode) {

            return res.status(400).json({
                message: "Coupon code is required"
            });

        }


        // ==================================================
        // VALIDATE DISCOUNT
        // ==================================================

        const discountValue =
            Number(discount);

        if (
            Number.isNaN(discountValue) ||
            discountValue < 0 ||
            discountValue > 100
        ) {

            return res.status(400).json({
                message:
                    "Discount must be between 0 and 100"
            });

        }


        // ==================================================
        // VALIDATE ROLE
        // ==================================================

        const normalizedRole =
            normalizeRole(allowedRole);

        if (
            !allowedRoles.includes(
                normalizedRole
            )
        ) {

            return res.status(400).json({
                message:
                    "Invalid coupon role"
            });

        }


        // ==================================================
        // CHECK DUPLICATE CODE
        // ==================================================

        const existingCoupon =
            await Coupon.findOne({
                code: normalizedCode
            });

        if (existingCoupon) {

            return res.status(409).json({
                message:
                    "Coupon code already exists"
            });

        }


        // ==================================================
        // DETERMINE ID REQUIREMENT
        // ==================================================

        const idRequired =
            rolesRequiringId.includes(
                normalizedRole
            );


        let finalRequiresId =
            idRequired;


        let finalIdType =
            idRequired
                ? (
                    idType ||
                    getDefaultIdType(
                        normalizedRole
                    )
                )
                : null;


        // ==================================================
        // CLIENT / INTERN / HEALTH WORKER /
        // SAHASH EMPLOYEE DO NOT REQUIRE ID
        // ==================================================

        if (
            normalizedRole === "client" ||
            normalizedRole === "intern" ||
            normalizedRole === "health_worker" ||
            normalizedRole === "sahash_employee"
        ) {

            finalRequiresId = false;
            finalIdType = null;

        }


        // ==================================================
        // VALID ID TYPES
        // ==================================================

        const allowedIdTypes = [
            "volunteer_id",
            "employee_id",
            "social_worker_id"
        ];


        if (
            finalRequiresId &&
            !allowedIdTypes.includes(
                finalIdType
            )
        ) {

            return res.status(400).json({
                message:
                    "Valid ID type is required"
            });

        }


        // ==================================================
        // CREATE COUPON
        // ==================================================

        const coupon =
            await Coupon.create({

                code:
                    normalizedCode,

                discount:
                    discountValue,

                allowedRole:
                    normalizedRole,

                requiresId:
                    finalRequiresId,

                idType:
                    finalIdType,

                eligibleId:
                    finalRequiresId
                        ? normalizeId(
                            eligibleId
                        )
                        : "",

                isActive:
                    isActive !== undefined
                        ? Boolean(isActive)
                        : true,

                expiryDate:
                    expiryDate || null

            });


        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(201).json({

            message:
                "Coupon created successfully",

            coupon

        });

    }

    catch (error) {

        console.error(
            "Create Coupon Error:",
            error
        );

        return res.status(500).json({

            message:
                "Unable to create coupon",

            error:
                error.message

        });

    }

};


// ======================================================
// GET ALL COUPONS
// ======================================================

const getCoupons = async (req, res) => {

    try {

        const coupons =
            await Coupon.find({})
                .sort({
                    createdAt: -1
                });


        return res.status(200).json(
            coupons
        );

    }

    catch (error) {

        console.error(
            "Get Coupons Error:",
            error
        );

        return res.status(500).json({

            message:
                "Unable to fetch coupons",

            error:
                error.message

        });

    }

};


// ======================================================
// GET ACTIVE COUPONS
// ======================================================

const getActiveCoupons = async (req, res) => {

    try {

        const now = new Date();


        const coupons =
            await Coupon.find({

                isActive: true,

                $or: [

                    {
                        expiryDate: null
                    },

                    {
                        expiryDate: {
                            $gte: now
                        }
                    }

                ]

            })
            .sort({
                discount: -1
            });


        return res.status(200).json(
            coupons
        );

    }

    catch (error) {

        console.error(
            "Get Active Coupons Error:",
            error
        );

        return res.status(500).json({

            message:
                "Unable to fetch active coupons",

            error:
                error.message

        });

    }

};


// ======================================================
// VALIDATE COUPON
// ======================================================
//
// POST /api/coupons/validate
//
// Example:
//
// {
//     "code": "VOL15",
//     "role": "volunteer",
//     "id": "VOL123",
//     "userId": "USER_MONGODB_ID",
//     "amount": 2500
// }
//
// ======================================================

const validateCoupon = async (req, res) => {

    try {

        const {
            code,
            role,
            id,
            amount,
            userId
        } = req.body;


        // ==================================================
        // VALIDATE CODE
        // ==================================================

        const normalizedCode =
            normalizeCode(code);

        if (!normalizedCode) {

            return res.status(400).json({

                valid: false,

                message:
                    "Coupon code is required"

            });

        }


        // ==================================================
        // FIND COUPON
        // ==================================================

        const coupon =
            await Coupon.findOne({
                code: normalizedCode
            });


        if (!coupon) {

            return res.status(404).json({

                valid: false,

                message:
                    "Invalid coupon code"

            });

        }


        // ==================================================
        // CHECK ACTIVE
        // ==================================================

        if (!coupon.isActive) {

            return res.status(400).json({

                valid: false,

                message:
                    "This coupon is currently inactive"

            });

        }


        // ==================================================
        // CHECK EXPIRY
        // ==================================================

        if (
            coupon.expiryDate &&
            new Date(
                coupon.expiryDate
            ) < new Date()
        ) {

            return res.status(400).json({

                valid: false,

                message:
                    "This coupon has expired"

            });

        }


        // ==================================================
        // NORMALIZE USER ROLE
        // ==================================================

        const userRole =
            normalizeRole(role);


        // ==================================================
        // CHECK ROLE
        // ==================================================

        if (
            userRole !==
            normalizeRole(
                coupon.allowedRole
            )
        ) {

            return res.status(403).json({

                valid: false,

                message:
                    `This coupon is only available for ${String(
                        coupon.allowedRole
                    ).replace(
                        /_/g,
                        " "
                    )} users`

            });

        }


        // ==================================================
        // CHECK REQUIRED ID
        // ==================================================

        if (coupon.requiresId) {

            const userIdValue =
                userId ||
                req.user?.id ||
                req.user?._id;


            // ------------------------------------------------
            // ID NOT PROVIDED
            // ------------------------------------------------

            if (
                !id ||
                String(id).trim() === ""
            ) {

                return res.status(400).json({

                    valid: false,

                    requiresId: true,

                    idType:
                        coupon.idType,

                    message:
                        `Please enter your ${
                            coupon.idType
                                ? coupon.idType
                                    .replace(
                                        /_/g,
                                        " "
                                    )
                                : "ID"
                        }`

                });

            }


            // ------------------------------------------------
            // SPECIFIC ELIGIBLE ID
            // ------------------------------------------------

            if (
                coupon.eligibleId &&
                normalizeId(
                    coupon.eligibleId
                ) !== normalizeId(id)
            ) {

                return res.status(403).json({

                    valid: false,

                    message:
                        "The entered ID is not eligible for this coupon"

                });

            }


            // ------------------------------------------------
            // VERIFY ID BELONGS TO LOGGED-IN USER
            // ------------------------------------------------

            if (userIdValue) {

                const isValidUserId =
                    await verifyUserSpecialId(
                        id,
                        userRole,
                        userIdValue
                    );


                if (!isValidUserId) {

                    return res.status(403).json({

                        valid: false,

                        message:
                            `The entered ${coupon.idType
                                ? coupon.idType.replace(
                                    /_/g,
                                    " "
                                )
                                : "ID"
                            } does not belong to the logged-in ${String(
                                userRole
                            ).replace(
                                /_/g,
                                " "
                            )} account`

                    });

                }

            }

        }


        // ==================================================
        // VALIDATE AMOUNT
        // ==================================================

        const numericAmount =
            Number(amount);


        if (
            Number.isNaN(
                numericAmount
            ) ||
            numericAmount < 0
        ) {

            return res.status(400).json({

                valid: false,

                message:
                    "Invalid booking amount"

            });

        }


        // ==================================================
        // CALCULATE DISCOUNT
        // ==================================================

        const discountAmount =
            Number(
                (
                    numericAmount *
                    Number(coupon.discount || 0) /
                    100
                ).toFixed(2)
            );


        // ==================================================
        // FINAL AMOUNT
        // ==================================================

        const finalAmount =
            Number(
                (
                    numericAmount -
                    discountAmount
                ).toFixed(2)
            );


        // ==================================================
        // SUCCESS
        // ==================================================

        return res.status(200).json({

            valid: true,

            message:
                "Coupon applied successfully",

            coupon: {

                code:
                    coupon.code,

                discount:
                    coupon.discount,

                allowedRole:
                    coupon.allowedRole,

                requiresId:
                    coupon.requiresId,

                idType:
                    coupon.idType

            },

            originalAmount:
                numericAmount,

            discountAmount,

            finalAmount

        });

    }

    catch (error) {

        console.error(
            "Validate Coupon Error:",
            error
        );

        return res.status(500).json({

            valid: false,

            message:
                "Unable to validate coupon",

            error:
                error.message

        });

    }

};


// ======================================================
// GET COUPON BY ID
// ======================================================

const getCouponById = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({

                message:
                    "Invalid coupon ID"

            });

        }


        const coupon =
            await Coupon.findById(id);


        if (!coupon) {

            return res.status(404).json({

                message:
                    "Coupon not found"

            });

        }


        return res.status(200).json(
            coupon
        );

    }

    catch (error) {

        console.error(
            "Get Coupon Error:",
            error
        );

        return res.status(500).json({

            message:
                "Unable to fetch coupon",

            error:
                error.message

        });

    }

};


// ======================================================
// UPDATE COUPON
// ======================================================

const updateCoupon = async (req, res) => {

    try {

        const {
            code,
            discount,
            allowedRole,
            requiresId,
            idType,
            eligibleId,
            isActive,
            expiryDate
        } = req.body;


        const {
            id
        } = req.params;


        // ==================================================
        // VALIDATE ID
        // ==================================================

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({

                message:
                    "Invalid coupon ID"

            });

        }


        // ==================================================
        // FIND COUPON
        // ==================================================

        const coupon =
            await Coupon.findById(id);


        if (!coupon) {

            return res.status(404).json({

                message:
                    "Coupon not found"

            });

        }


        // ==================================================
        // UPDATE CODE
        // ==================================================

        if (code !== undefined) {

            const normalizedCode =
                normalizeCode(code);


            if (!normalizedCode) {

                return res.status(400).json({

                    message:
                        "Coupon code cannot be empty"

                });

            }


            const duplicate =
                await Coupon.findOne({

                    code:
                        normalizedCode,

                    _id: {
                        $ne: id
                    }

                });


            if (duplicate) {

                return res.status(409).json({

                    message:
                        "Coupon code already exists"

                });

            }


            coupon.code =
                normalizedCode;

        }


        // ==================================================
        // UPDATE DISCOUNT
        // ==================================================

        if (discount !== undefined) {

            const discountValue =
                Number(discount);


            if (
                Number.isNaN(
                    discountValue
                ) ||
                discountValue < 0 ||
                discountValue > 100
            ) {

                return res.status(400).json({

                    message:
                        "Discount must be between 0 and 100"

                });

            }


            coupon.discount =
                discountValue;

        }


        // ==================================================
        // UPDATE ROLE
        // ==================================================

        if (
            allowedRole !== undefined
        ) {

            const normalizedRole =
                normalizeRole(
                    allowedRole
                );


            if (
                !allowedRoles.includes(
                    normalizedRole
                )
            ) {

                return res.status(400).json({

                    message:
                        "Invalid coupon role"

                });

            }


            coupon.allowedRole =
                normalizedRole;


            // ------------------------------------------------
            // DETERMINE WHETHER ID IS REQUIRED
            // ------------------------------------------------

            const roleRequiresId =
                rolesRequiringId.includes(
                    normalizedRole
                );


            if (roleRequiresId) {

                coupon.requiresId =
                    true;

                coupon.idType =
                    idType ||
                    getDefaultIdType(
                        normalizedRole
                    );

            }

            else {

                coupon.requiresId =
                    false;

                coupon.idType =
                    null;

                coupon.eligibleId =
                    "";

            }

        }


        // ==================================================
        // UPDATE ID REQUIREMENT
        // ==================================================

        if (
            requiresId !== undefined &&
            rolesRequiringId.includes(
                normalizeRole(
                    coupon.allowedRole
                )
            )
        ) {

            coupon.requiresId = true;

        }


        // ==================================================
        // UPDATE ID TYPE
        // ==================================================

        if (
            idType !== undefined &&
            coupon.requiresId
        ) {

            const validIdType =
                [
                    "volunteer_id",
                    "employee_id",
                    "social_worker_id"
                ].includes(idType);


            if (!validIdType) {

                return res.status(400).json({

                    message:
                        "Invalid ID type"

                });

            }


            coupon.idType =
                idType;

        }


        // ==================================================
        // UPDATE ELIGIBLE ID
        // ==================================================

        if (
            eligibleId !== undefined
        ) {

            coupon.eligibleId =
                coupon.requiresId
                    ? normalizeId(
                        eligibleId
                    )
                    : "";

        }


        // ==================================================
        // UPDATE ACTIVE
        // ==================================================

        if (
            isActive !== undefined
        ) {

            coupon.isActive =
                Boolean(isActive);

        }


        // ==================================================
        // UPDATE EXPIRY
        // ==================================================

        if (
            expiryDate !== undefined
        ) {

            coupon.expiryDate =
                expiryDate || null;

        }


        // ==================================================
        // SAVE
        // ==================================================

        await coupon.save();


        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(200).json({

            message:
                "Coupon updated successfully",

            coupon

        });

    }

    catch (error) {

        console.error(
            "Update Coupon Error:",
            error
        );

        return res.status(500).json({

            message:
                "Unable to update coupon",

            error:
                error.message

        });

    }

};


// ======================================================
// DELETE COUPON
// ======================================================

const deleteCoupon = async (req, res) => {

    try {

        const {
            id
        } = req.params;


        // ==================================================
        // VALIDATE ID
        // ==================================================

        if (
            !mongoose.Types.ObjectId.isValid(id)
        ) {

            return res.status(400).json({

                message:
                    "Invalid coupon ID"

            });

        }


        // ==================================================
        // DELETE
        // ==================================================

        const coupon =
            await Coupon.findByIdAndDelete(id);


        if (!coupon) {

            return res.status(404).json({

                message:
                    "Coupon not found"

            });

        }


        // ==================================================
        // RESPONSE
        // ==================================================

        return res.status(200).json({

            message:
                "Coupon deleted successfully"

        });

    }

    catch (error) {

        console.error(
            "Delete Coupon Error:",
            error
        );

        return res.status(500).json({

            message:
                "Unable to delete coupon",

            error:
                error.message

        });

    }

};


// ======================================================
// EXPORT
// ======================================================

module.exports = {

    createCoupon,

    getCoupons,

    getActiveCoupons,

    validateCoupon,

    getCouponById,

    updateCoupon,

    deleteCoupon

};