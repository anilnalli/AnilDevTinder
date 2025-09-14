const express = require("express");
const authRouter = express.Router();
// import the user model from the models folder
const User = require("../models/user");
// import bcrypt for password hashing
const bcrypt = require("bcrypt");
// import validator package from npm
const validator = require("validator");
// import the validation function from the utils folder
const { fieldValidations} = require("../utils/validation");

authRouter.post("/user/signup", async (req, res) => {
  try {
    // validate the request body
    fieldValidations(req.body);
    const { firstName, lastName, email, age, gender, password,imageUrl } = req.body;
    const user = new User({
      firstName: firstName,
      lastName: lastName,
      email: email,
      imageUrl:imageUrl,
      password: await bcrypt.hash(password, 10),
      gender: gender,
      age: age,
    });
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(400).send("Error saving user: " + error.message);
  }
});

authRouter.post("/user/login", async (req, res) => {
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
    const jwttoken = await user.getJWTToken();
    // set the token in the cookie
    res.cookie("token", jwttoken, { expires: new Date(Date.now() + 3600000) });
    res.status(200).json({user});
  } catch (error) {
    res.status(400).send("Error saving user: " + error.message);
  }
});
authRouter.get("/user/logout", async (req, res) => {
  res.cookie("token", null, { expires: new Date(Date.now()) });
  res.status(200).send("logout successfully");
});

authRouter.patch("/user/forgotpassword", async (req, res) => {
  try {
    const { email,oldPassword, newPassword } = req.body;
    let user = await User.findOne({ email: email });
    if (!user) {
       res.status(400).send("User Not Found")
    } 
    const isExistingUser = await bcrypt.compare(oldPassword, user.password);
    if(!isExistingUser){
     res.status(400).send("oldPassword not matched....")
    }
    user.password = await bycrpt.hash(newPassword, 10);
    await user.save();
    res.status(200).send("password Changed SuccesFully");
  } catch (error) {
    res.status(500).send("Update Failed");
  }
});

module.exports = authRouter;
