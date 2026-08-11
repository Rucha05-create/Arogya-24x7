const mongoose =
require("mongoose")

const testSchema =
new mongoose.Schema({

  name: String,

  price: Number,

  category: String
})

module.exports =
mongoose.model(
"Test",
testSchema
)