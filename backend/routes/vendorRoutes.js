const express =
require(
"express"
)

const router =
express.Router()

const Vendor =
require(
"../models/Vendor"
)

router.get(
"/",
async(
req,
res
)=>{

const data=
await Vendor.find()

res.json(
data
)

}
)

module.exports=
router