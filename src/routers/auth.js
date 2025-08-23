const express=require("express");
const authRouter=express.Router();
// import the user model from the models folder
const User =require("../models/user");
// import bcrypt for password hashing
const bycrpt=require("bcrypt");
// import validator package from npm
const validator=require("validator");
// import the validation function from the utils folder
const {fieldValidations}=require("../utils/validation");

authRouter.post("/signup", async (req, res) => {
  try {
    // validate the request body
    fieldValidations(req.body);
    const { firstName, lastName, email, password } = req.body;
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: await bycrpt.hash(password, 10),
    });
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(400).send("Error saving user: " + error.message);
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!validator.isEmail(email)) {
      throw new Error("Invalid email format");
    }
    if (!user) {
      return res.status(404).send("User not found");
    }
    // compare the passeword with the hased password
    const isMatch = await user.isPassWordMathch(password);
    if (!isMatch) {
      return res.status(400).send("Invalid User");
    }
    // create a jwt token
    const jwttoken = await user.getJWTToken()
    // set the token in the cookie
    res.cookie("token", jwttoken,{expires:new Date(Date.now()+3600000)});
    res.status(200).send("Login successful");
  } catch (error) {
    res.status(400).send("Error saving user: " + error.message);
  }
});

module.exports=authRouter