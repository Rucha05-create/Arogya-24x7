const mongoose =
require("mongoose")

const vendorSchema =
new mongoose.Schema({

labName:{
type:String
},

ownerName:{
type:String
},

city:{
type:String
},

state:{
type:String
},

email:{
type:String
},

phone:{
type:String
},

testsAvailable:
[String],

mouSigned:{
type:Boolean,

default:false
}

})

module.exports=
mongoose.model(
"Vendor",
vendorSchema
)