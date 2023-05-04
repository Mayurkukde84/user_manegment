const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please tell us your name"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowecase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  photo: String,
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: 8,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Please confirm you password"],
    validate: {
      //this works on only save and create
      //for this reason whenever we want to update user we want to use save and create method.
        //for this reason we don't used findOneByUpdate or findByIdAndUpdate like query
      validator: function (el) {
        return el === this.password;
      },
    },
  },
});

module.exports = mongoose.model("User", userSchema);
