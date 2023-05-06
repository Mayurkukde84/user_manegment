const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require('bcryptjs')
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
    select:false
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
      message:'Password are not the same'
    },
  },
  roles:{
    enum:['admin','user'],
    default:'admin'
  }
});

userSchema.pre('save', async function(next){
  //only run this functionif passport was actually modified
  if(!this.isModified('password')) return next()
  //hash  the password with cost 12
  this.password = await bcrypt.hash(this.password,12);
  //Delete passwordConfirm field
  this.passwordConfirm = undefined
  next()
})

userSchema.methods.correctPassword = async function(candidatePassword,userPassword){
  return bcrypt.compare(candidatePassword,userPassword)
}
module.exports = mongoose.model("User", userSchema);
