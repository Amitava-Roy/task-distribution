const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    min: 3,
    max: 50,
    trim: true,
    validate: {
      validator: function (value) {
        return /^[a-zA-Z0-9 ]+$/.test(value);
      },
      message: "User name can only be alpha numeric.",
    },
  },
  email: {
    type: String,
    required: [true, "User must have an email."],
    unique: [true, "Email already exits."],
    validate: {
      validator: validator.isEmail,
      message: "Email is not valid.",
    },
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "User  need to have a password."],
    min: [8, "min 8 charcter long passowrd needed."],
    select: false,
  },

  confirmPasword: {
    type: String,
    min: 8,
    validate: {
      validator: function (val) {
        return this.password == val;
      },
      message: "Password does not match.",
    },
    min: 8,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
});

userSchema.methods.isPasswordMatching = async function (password, hash) {
  return await bcrypt.compare(password, hash);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  this.confirmPasword = undefined;
  next();
});

module.exports = mongoose.model("User", userSchema);
