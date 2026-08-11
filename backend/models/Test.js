const mongoose = require("mongoose");

const testSchema = new mongoose.Schema({

    testName:{
        type:String,
        required:true
    },

    price:{
        type:Number,
        required:true
    },

    description:{
        type:String,
        required:true
    }

},{
    timestamps:true
});

module.exports = mongoose.model("Test",testSchema);