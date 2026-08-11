const Test = require("../models/test");


// ======================
// Add Test
// ======================

const addTest = async(req,res)=>{

    try{

        const test = await Test.create(req.body);

        res.status(201).json(test);

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// ======================
// Get Tests
// ======================

const getTests = async(req,res)=>{

    try{

        const tests = await Test.find();

        res.json(tests);

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};


// ======================
// Update Test
// ======================

const updateTest = async(req,res)=>{

    try{

        const updated = await Test.findByIdAndUpdate(

            req.params.id,

            req.body,

            {new:true}

        );

        res.json(updated);

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};



// ======================
// Delete Test
// ======================

const deleteTest = async(req,res)=>{

    try{

        await Test.findByIdAndDelete(req.params.id);

        res.json({

            message:"Test Deleted"

        });

    }

    catch(error){

        res.status(500).json({
            message:error.message
        });

    }

};


module.exports={

    addTest,

    getTests,

    updateTest,

    deleteTest

};