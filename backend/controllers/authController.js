const User =
require("../models/User")

const bcrypt =
require("bcryptjs")

const jwt =
require("jsonwebtoken")


// REGISTER

const registerUser =
async (
req,
res
) => {

try {

const {

name,

age,

gender,

phone,

email,

password,

role

}

=

req.body


const userExists =

await User.findOne({

email

})


if (
userExists
) {

return res
.status(400)
.json({

message:
"User already exists"

})

}


const hashedPassword =

await bcrypt.hash(

password,

10

)


const user =

await User.create({

name,

age,

gender,

phone,

email,

password:
hashedPassword,

role

})


res
.status(201)
.json({

message:
"Registration Successful",

user

})

}

catch (
error
) {

res
.status(500)
.json({

message:
error.message

})

}

}


// LOGIN

const loginUser =
async (
req,
res
) => {

try {

const {

email,

password

}

=

req.body


const user =

await User.findOne({

email

})


if (

user

&&

await bcrypt.compare(

password,

user.password

)

) {

const token =

jwt.sign(

{

id:
user._id

},

process.env.JWT_SECRET,

{

expiresIn:
"30d"

}

)


res.json({

token,

user: {

id:
user._id,

name:
user.name,

age:
user.age,

gender:
user.gender,

phone:
user.phone,

email:
user.email,

role:
user.role

}

})

}

else {

res
.status(401)
.json({

message:
"Invalid Credentials"

})

}

}

catch (
error
) {

res
.status(500)
.json({

message:
error.message

})

}

}


module.exports = {

registerUser,

loginUser

}