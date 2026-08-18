const express = require("express");

const router = express.Router();

const {
    getCoupons,
    getActiveCoupons,
    validateCoupon,
    createCoupon,
    getCouponById,
    updateCoupon,
    deleteCoupon
} = require("../controllers/couponController");


// ======================================================
// GET ALL COUPONS
// GET /api/coupons
// ======================================================

router.get(
    "/",
    getCoupons
);


// ======================================================
// GET ACTIVE COUPONS
// GET /api/coupons/active
// ======================================================

router.get(
    "/active",
    getActiveCoupons
);


// ======================================================
// VALIDATE COUPON
// POST /api/coupons/validate
// ======================================================

router.post(
    "/validate",
    validateCoupon
);


// ======================================================
// CREATE COUPON
// POST /api/coupons
// ======================================================

router.post(
    "/",
    createCoupon
);


// ======================================================
// GET COUPON BY ID
// GET /api/coupons/:id
// ======================================================

router.get(
    "/:id",
    getCouponById
);


// ======================================================
// UPDATE COUPON
// PUT /api/coupons/:id
// ======================================================

router.put(
    "/:id",
    updateCoupon
);


// ======================================================
// DELETE COUPON
// DELETE /api/coupons/:id
// ======================================================

router.delete(
    "/:id",
    deleteCoupon
);


module.exports = router;