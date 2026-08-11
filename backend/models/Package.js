const mongoose =
require(
"mongoose"
)

const packageSchema =

new mongoose.Schema({

name:{
type:String,
required:true
},

tests:[
String
],

price:{
type:Number,
required:true
},

description:{
type:String
}

})

module.exports =

mongoose.model(
"Package",

packageSchema
)