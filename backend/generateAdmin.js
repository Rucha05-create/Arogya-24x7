const bcrypt = require("bcryptjs");

async function generate() {

  const password = "Admin@123";

  const hash = await bcrypt.hash(password, 10);

  console.log(hash);

}

generate();