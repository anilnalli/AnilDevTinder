// import express from "express"
const express = require("express");
// get the database coonection from the config folder
const { connectDB } = require("./config/database");
// create an express app
const app = express();
// import the user model from the models folder
const User = require("./models/user");
// import the auth middleware
const { UserAuth } = require("./middleware/auth");
// import the validation function from the utils folder
const { fieldValidations } = require("./utils/validation");
// import validator package from npm
const validator = require("validator");
// import bcrypt for password hashing
const bycrpt = require("bcrypt");
// import jwt frm the npm jsonwebtoken
const jwtToken = require("jsonwebtoken");
// import cookie parser to parse the cookies from the request
const cookieParser = require("cookie-parser");
// connect to the database and start the server
connectDB()
  .then(() => {
    console.log("DB Connection succssfully established..");
    // start the server after  the database connection is established
    app.listen(3000, () => {
      console.log("server stated successfully on port number 3000 ...");
    });
  })
  .catch((err) => {
    console.error("connection not established !!!");
  });
// middleware to parse the json data from the request body
app.use(express.json());
// middleware to parse the cookies from the request
app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", UserAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Error Fetching profile: " + error.message);
  }
});

app.get("/connectionRequiest", UserAuth, async(req,res)=>{
  try{
    const user=req.user;
    res.status(200).send(user.firstName+ "  sent you  a connection Requiest");
  }
  catch(err){
    res.status(400).send("Error fetching connection request:" + err.message);
  }

})
