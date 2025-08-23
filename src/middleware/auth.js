const jwtToken = require("jsonwebtoken");
const User=require("../models/user")
const UserAuth = async (req, res, next) => {
  try {
    // take the token from the cookie
    const token = req.cookies.token;
    // if token is not present the trow error
    if (!token) {
      res.status(400).send("Token is not present");
    }
    //verify the token
    const decodedObj = await jwtToken.verify(token, "DevTinder@Anil@14569");
    //get the user from te decoded token and find the user in the database
    const userId = decodedObj.id;
    const user = await User.findById(userId);
    // if user is not found thorw error
    if (!user) {
      throw new Error("User not found");
    }
    // attach the user to the request object
    req.user = user;
    // call the next middleware
    next();
  } catch (err) {
    console.log("errr", err);
    const errr = new Error("you are not able to get the user data");
    res.send(errr);
  }
};
module.exports = {
  UserAuth,
};
