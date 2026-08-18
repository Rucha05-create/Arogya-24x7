const mongoose = require("mongoose");
const Coupon = require("../models/Coupon");

// ======================================================
// HELPER: NORMALIZE ROLE
// ======================================================

const normalizeRole = (role) => {

    if (!role) {
        return "";
    }

    return String(role)
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, "_");
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
// CREATE COUPON
// ======================================================
//
// POST /api/coupons
//
// Example:
//
// {
//     "code": "VOL20",
//     "discount": 20,
//     "allowedRole": "volunteer",
//     "requiresId": true,
//     "idType": "volunteer_id",
//     "eligibleId": "",
//     "isActive": true
// }
//
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

        const normalizedCode = normalizeCode(code);

        if (!normalizedCode) {

            return res.status(400).json({

                message: "Coupon code is required"

            });

        }


        // ==================================================
        // VALIDATE DISCOUNT
        // ==================================================

        const discountValue = Number(discount);

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

        const allowedRoles = [
            "client",
            "volunteer",
            "employee",
            "social_worker"
        ];

        if (!allowedRoles.includes(normalizedRole)) {

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

        let finalRequiresId =
            Boolean(requiresId);

        let finalIdType =
            idType || null;


        // Client does not need ID

        if (normalizedRole === "client") {

            finalRequiresId = false;
            finalIdType = null;

        }


        // Other roles require ID

        if (
            normalizedRole === "volunteer" ||
            normalizedRole === "employee" ||
            normalizedRole === "social_worker"
        ) {

            finalRequiresId = true;


            if (!finalIdType) {

                if (
                    normalizedRole ===
                    "volunteer"
                ) {

                    finalIdType =
                        "volunteer_id";

                }

                else if (
                    normalizedRole ===
                    "employee"
                ) {

                    finalIdType =
                        "employee_id";

                }

                else if (
                    normalizedRole ===
                    "social_worker"
                ) {

                    finalIdType =
                        "social_worker_id";

                }

            }

        }


        // ==================================================
        // VALIDATE ID TYPE
        // ==================================================

        const allowedIdTypes = [
            "volunteer_id",
            "employee_id",
            "social_worker_id"
        ];

        if (
            finalRequiresId &&
            !allowedIdTypes.includes(finalIdType)
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
                    normalizeId(eligibleId),

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

        res.status(201).json({

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


        res.status(500).json({

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
//
// GET /api/coupons
//
// ======================================================

const getCoupons = async (req, res) => {

    try {

        const coupons =
            await Coupon.find({})
                .sort({
                    createdAt: -1
                });


        res.status(200).json(

            coupons

        );

    }

    catch (error) {

        console.error(
            "Get Coupons Error:",
            error
        );


        res.status(500).json({

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
//
// GET /api/coupons/active
//
// Used by BookTest.js to show available coupons.
//
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


        res.status(200).json(

            coupons

        );

    }

    catch (error) {

        console.error(
            "Get Active Coupons Error:",
            error
        );


        res.status(500).json({

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
//     "code": "VOL20",
//     "role": "volunteer",
//     "id": "VOL123",
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
            amount
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

                code:
                    normalizedCode

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
            new Date(coupon.expiryDate) < new Date()
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
            userRole !== coupon.allowedRole
        ) {

            return res.status(403).json({

                valid: false,

                message:
                    `This coupon is only available for ${coupon.allowedRole.replace(
                        "_",
                        " "
                    )} users`

            });

        }


        // ==================================================
        // CHECK REQUIRED ID
        // ==================================================

        if (coupon.requiresId) {

            const userId =
                normalizeId(id);


            if (!userId) {

                return res.status(400).json({

                    valid: false,

                    requiresId: true,

                    idType:
                        coupon.idType,

                    message:
                        `Please enter your ${
                            coupon.idType
                                ? coupon.idType
                                    .replace("_", " ")
                                    .replace("_", " ")
                                : "ID"
                        }`

                });

            }


            // ==================================================
            // CHECK SPECIFIC ELIGIBLE ID
            // ==================================================

            if (
                coupon.eligibleId &&
                normalizeId(
                    coupon.eligibleId
                ) !== userId
            ) {

                return res.status(403).json({

                    valid: false,

                    message:
                        "The entered ID is not eligible for this coupon"

                });

            }

        }


        // ==================================================
        // CALCULATE DISCOUNT
        // ==================================================

        const numericAmount =
            Number(amount);


        if (
            Number.isNaN(numericAmount) ||
            numericAmount < 0
        ) {

            return res.status(400).json({

                valid: false,

                message:
                    "Invalid booking amount"

            });

        }


        const discountAmount =
            Number(
                (
                    numericAmount *
                    coupon.discount /
                    100
                ).toFixed(2)
            );


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

        res.status(200).json({

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


        res.status(500).json({

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
//
// GET /api/coupons/:id
//
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


        res.status(200).json(

            coupon

        );

    }

    catch (error) {

        console.error(
            "Get Coupon Error:",
            error
        );


        res.status(500).json({

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
//
// PUT /api/coupons/:id
//
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
                Number.isNaN(discountValue) ||
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

        if (allowedRole !== undefined) {

            const normalizedRole =
                normalizeRole(
                    allowedRole
                );


            const allowedRoles = [
                "client",
                "volunteer",
                "employee",
                "social_worker"
            ];


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


            // Client doesn't need ID

            if (
                normalizedRole ===
                "client"
            ) {

                coupon.requiresId =
                    false;

                coupon.idType =
                    null;

            }

            else {

                coupon.requiresId =
                    true;


                if (
                    normalizedRole ===
                    "volunteer"
                ) {

                    coupon.idType =
                        "volunteer_id";

                }

                else if (
                    normalizedRole ===
                    "employee"
                ) {

                    coupon.idType =
                        "employee_id";

                }

                else if (
                    normalizedRole ===
                    "social_worker"
                ) {

                    coupon.idType =
                        "social_worker_id";

                }

            }

        }


        // ==================================================
        // UPDATE ID REQUIREMENT
        // ==================================================

        if (
            requiresId !== undefined &&
            coupon.allowedRole !==
            "client"
        ) {

            coupon.requiresId =
                Boolean(requiresId);

        }


        // ==================================================
        // UPDATE ID TYPE
        // ==================================================

        if (idType !== undefined) {

            coupon.idType =
                idType || null;

        }


        // ==================================================
        // UPDATE ELIGIBLE ID
        // ==================================================

        if (eligibleId !== undefined) {

            coupon.eligibleId =
                normalizeId(
                    eligibleId
                );

        }


        // ==================================================
        // UPDATE ACTIVE
        // ==================================================

        if (isActive !== undefined) {

            coupon.isActive =
                Boolean(isActive);

        }


        // ==================================================
        // UPDATE EXPIRY
        // ==================================================

        if (expiryDate !== undefined) {

            coupon.expiryDate =
                expiryDate || null;

        }


        // ==================================================
        // SAVE
        // ==================================================

        await coupon.save();


        res.status(200).json({

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


        res.status(500).json({

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
//
// DELETE /api/coupons/:id
//
// ======================================================

const deleteCoupon = async (req, res) => {

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
            await Coupon.findByIdAndDelete(id);


        if (!coupon) {

            return res.status(404).json({

                message:
                    "Coupon not found"

            });

        }


        res.status(200).json({

            message:
                "Coupon deleted successfully"

        });

    }

    catch (error) {

        console.error(
            "Delete Coupon Error:",
            error
        );


        res.status(500).json({

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