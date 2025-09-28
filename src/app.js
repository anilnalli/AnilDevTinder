// import express from "express"
const express = require("express");
// get the database coonection from the config folder
const { connectDB } = require("./config/database");
// create an express app
const app = express();
// import cookie parser to parse the cookies from the request
const cookieParser = require("cookie-parser");
// import the auth router
const authRouter=require("./routers/auth");
//import the prifle router
const profileROuter=require('./routers/profile');
const connectionRequestRouter=require("./routers/connectionRequest");
const usersConnectionsRouter=require('./routers/users');
const cors=require('cors');
const env=require('dotenv').config();
const cron=require("./utils/cornJob");

// connect to the database and start the server
connectDB()
  .then(() => {
    console.log("DB Connection succssfully established..");
    // start the server after  the database connection is established
    app.listen(process.env.PORT, () => {
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
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true
}))
app.use("/",authRouter);
app.use("/",profileROuter);
app.use("/",connectionRequestRouter);
app.use("/",usersConnectionsRouter);



