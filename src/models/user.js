const mongoose = require("mongoose");
const validator = require("validator");
const jwtToken = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Schema } = mongoose;
const userSchema = new Schema(
  {
    firstName: {
      type: String,
      require: true,
      minLength: 1,
      maxLenth: 20,
    },
    lastName: {
      type: String,
      minLength: 1,
      maxLenth: 10,
    },
    email: {
      type: String,
      unique: true,
      lowercase: true,
      require: true,
      trim: true,
      validate(values) {
        if (!validator.isEmail(values)) {
          throw new Error("Invalid Email ");
        }
      },
    },
    imageUrl: {
      type: String,
    },
    password: {
      type: String,
      require: true,
    },
    age: {
      type: Number,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

userSchema.methods.getJWTToken = async function () {
  const user = this;
  const token = await jwtToken.sign({ id: user._id }, "DevTinder@Anil@14569", {
    expiresIn: "1h",
  });
  return token;
};

userSchema.methods.isPassWordMathch = async function (passwordFromRequest) {
  const user = this;
  const passwordHash = user.password;
  const isPasswordMatch = await bcrypt.compare(
    passwordFromRequest,
    passwordHash
  );
  return isPasswordMatch;
};

module.exports = mongoose.model("User", userSchema);
