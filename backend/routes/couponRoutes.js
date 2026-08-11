const express =
require(
"express"
)

const router =
express.Router()

const Coupon =
require(
"../models/Coupon"
)

router.get(
"/",
async(
req,
res
)=>{

try{

const data =
await Coupon.find()

res.json(
data
)

}

catch(error){

res
.status(500)
.json({
message:
error.message
})

}

}
)

module.exports =
router