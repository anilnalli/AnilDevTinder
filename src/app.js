const express = require("express");
const {AuthAdmin,UserAuth}= require("./middleware/auth")
const app = express();


app.use("/admin/getallusers",AuthAdmin, (req, res, next) => {
  res.send("your are getting all users");
});

app.use("/admin/login", (req, res, next) => {
  res.send("your logged in");
});

app.use("/users/allusers",UserAuth,(req,res)=>{
  res.send("you get all users data")

});
app.use("/users/login",(req,res)=>{
  res.send("you are logged in")

})

app.listen(3000, () => {
  console.log("server stated successfully on port number 3000 ...");
});
