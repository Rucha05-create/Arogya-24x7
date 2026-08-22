const express = require("express");

const router = express.Router();


// =====================================================
// CLIENT CONTROLLER
// =====================================================

const {
    registerClient,
    loginClient
} = require("../controllers/clientController");


// =====================================================
// CLIENT REGISTRATION
// =====================================================
//
// POST
// /api/client/register
//
// Creates a new client account.
//
// The clientController automatically saves:
// role: "client"
//

router.post(
    "/register",
    registerClient
);


// =====================================================
// CLIENT LOGIN
// =====================================================
//
// POST
// /api/client/login
//
// Logs in an existing client.
//
// The controller returns:
// - token
// - user
// - user.role
//

router.post(
    "/login",
    loginClient
);


// =====================================================
// EXPORT ROUTER
// =====================================================

module.exports = router;

