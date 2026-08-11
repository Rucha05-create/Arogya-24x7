const bcrypt = require("bcryptjs");

// Paste the FULL password hash from MongoDB here
const hash = "PASTE_THE_FULL_HASH_HERE";

bcrypt.compare("admin123", hash).then(result => {
  console.log("Password matches:", result);
});