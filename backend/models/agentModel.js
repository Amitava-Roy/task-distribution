const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const agentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      min: 3,
      max: 50,
      trim: true,
      required: [true, "Agent name is required."],
      validate: {
        validator: function (value) {
          return /^[a-zA-Z0-9 ]+$/.test(value);
        },
        message: "Agent name can only be alpha numeric.",
      },
    },
    email: {
      type: String,
      required: [true, "User must have an email."],
      unique: [true, "Email already exists."],
      validate: {
        validator: validator.isEmail,
        message: "Email is not valid.",
      },
      lowercase: true,
    },
    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required."],
      // validate: {
      //   validator: function (value) {
      //     return /^\+\d{10,15}$/.test(value);
      //   },
      //   message: "Mobile number must be in E.164 format with country code.",
      // },
      // unique: [true, "Mobile number already exists."],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      minLength: [6, "Password must be at least 6 characters."],
      maxLength: [100, "Password cannot exceed 100 characters."],
    },
  },
  { timestamps: true }
);

agentSchema.methods.isPasswordMatching = async function (password, hash) {
  return await bcrypt.compare(password, hash);
};

agentSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 10);

  next();
});

module.exports = mongoose.model("Agent", agentSchema);
