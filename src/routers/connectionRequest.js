const express = require("express");
const connectionRequestRouter = express.Router();
const { UserAuth } = require("../middleware/auth");
const User = require("../models/user");
const ConnectionRequest = require("../models/connectionRequest");
const authRouter = require("./auth");
const{run}=require("../utils/sendEmails")
connectionRequestRouter.post(
  "/connectionRequest/send/:status/:toUserId",
  UserAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user?._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignore", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send(`${status} not allowed as status`);
      }
      const toUser = User.findById(toUserId);
      if (!toUser) {
        return res.status(400).send("User not found");
      }
      const existingConnection = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });
      if (existingConnection) {
        return res
          .status(400)
          .send({ message: "connection Request Already existed..." });
      }
      const connection = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });
      await connection.save();
      const emailRes=await run("connection Request","You Got New Connection Request...");
       console.log("emailRes==>",{emailRes})
      return res.status(200).send(" connection request send successfully");
    } catch (error) {
      return res.status(500).send("ERROR: "+error.message);
    }
  }
);

connectionRequestRouter.post("/connectionRequest/review/:status/:requestId",UserAuth,async(req,res)=>{
   try{
    const loggedInUser=req.user ;
    const{status,requestId}=req.params;
    const allowedStatus=["accepted","rejected"]
    if(!allowedStatus.includes(status)){
        return res.status(404).json({message:"LoggedIn User is not found..."})
    }

    const connectionRequest= await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:loggedInUser._id,
        status:"interested"
    });
    if(!connectionRequest){
        return res.status(404).json({message:"connection Not Found..."});
    }
    
    connectionRequest.status=status;
     await connectionRequest.save();
     console.log("connectionRequest==>",{connectionRequest})
     res.status(200).json({message:"connection Request "+status})
   }
   catch(error){
    res.status(500).send("ERROR :"+error.message)
   }
});

module.exports = connectionRequestRouter;
