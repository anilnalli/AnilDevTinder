const express = require("express");
const{connectDB}=require('./config/database');
const app = express();
const User = require("./models/user");
const{AuthAdmin,userAuth}=require("./middleware/auth");

connectDB().then(()=>{
  console.log("DB Connection succssfully established..");
  app.listen(3000,()=>{
    console.log("server stated successfully on port number 3000 ...");
  });
}).catch((err)=>{
  console.error("connection not established !!!");
});
app.use(express.json());
app.use("/signup",async(req,res)=>{
  const user = new User(req.body);
  try {
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(400).send("Error saving user: " + error.message);
    }
});

app.use("/admin/user",AuthAdmin,async(req,res)=>{
  const user=new User({
    firstName: "Admin",
    lastName: "Userone",
    email: "admin@gmail.com"
  });
  try{
    const savedUser=await user.save();
    res.status(201).send(savedUser);
  }catch(error){
    res.status(400).send("Error saving user: " + error.message);
  }

})


