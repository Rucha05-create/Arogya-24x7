const express = require("express");

const router = express.Router();

const {

    addTest,

    getTests,

    updateTest,

    deleteTest

} = require("../controllers/testController");


router.post("/",addTest);

router.get("/",getTests);

router.put("/:id",updateTest);

router.delete("/:id",deleteTest);


module.exports=router;