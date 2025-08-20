const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user");
const { AuthAdmin, UserAuth } = require("./middleware/auth");
const { fieldValidations } = require("./utils/validation");
const validator=require("validator");
const bycrpt = require("bcrypt");
const jwtToken=require("jsonwebtoken");
const cookieParser=require("cookie-parser");
connectDB()
  .then(() => {
    console.log("DB Connection succssfully established..");
    app.listen(3000, () => {
      console.log("server stated successfully on port number 3000 ...");
    });
  })
  .catch((err) => {
    console.error("connection not established !!!");
  });

app.use(express.json());
app.use(cookieParser());

app.post("/signup", async (req, res) => {
  try {
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
    const isMatch = await bycrpt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send("Invalid User");
    }
    const jwttoken=await jwtToken.sign({id:user._id},"DevTinder@Anil@14569");
    res.cookie("token",jwttoken);
    res.status(200).send("Login successful");
  } catch (error) {
    res.status(400).send("Error saving user: " + error.message);
  }
});
app.get("/profile",async(req,res)=>{
  try{
    const token =req.cookies.token;
    if(!token){
     return res.status(401).send("Unauthorized: No token provided");
    }
    const decoded=jwtToken.verify(token,"DevTinder@Anil@14569");
    const user=await User.findById(decoded.id);
    if(!user){
      return res.status(404).send("User not found");
    }
    res.status(200).send(user);
    

  }
  catch(error){
    res.status(500).send("Error Fetching profile: "+ error.message);

  }
})

app.get("/user", UserAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send("Error Fetching users: " + error.message);
  }
});
app.delete("/user", AuthAdmin, async (req, res) => {
  try {
    const userId = req.body.userId;
    const deletedUser = await User.findOneAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    } else {
      res.status(200).send("User deleted successfully");
    }
  } catch (error) {
    res.status(500).send("Error Fetching users: " + error.message);
  }
});
app.patch("/user", AuthAdmin, async (req, res) => {
  const userdId = req.body.userId;
  const updateDataa = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userdId, updateDataa);
    if (!updatedUser) {
      return res.status(404).send("User not found");
    } else {
      return res.status(200).send("User updated successfully");
    }
  } catch (error) {
    res.status(500).send("Error Fetching users: " + error.message);
  }
});
