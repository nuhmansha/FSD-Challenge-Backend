const mongoose = require("mongoose");
// const { type } = require("os");
const userSchema = new mongoose.Schema({
  firstName: { type: String, require: true },
  lastName: { type: String, require: true },
  email: { type: String, required: true },
  password: {type: String,required: true },
});
const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
