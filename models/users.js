const mongoose = require("mongoose");
const UserScheme = new mongoose.Schema({
  username: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
});
const User = mongoose.model("User", UserScheme);
module.exports = User;
