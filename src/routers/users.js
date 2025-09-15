const express = require("express");

const UserRouter = express.Router();
const { UserAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/connectionRequest");
const connectionRequest = require("../models/connectionRequest");
const { findById } = require("../models/user");
const user = require("../models/user");

UserRouter.get("/users/connections/recieved", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", ["firstName", "lastName"]);
    if (!connectionRequest) {
      return res.status(400).json({ message: "failed to get the data..." });
    }
    res
      .status(200)
      .json({ message: "data fetched Successfully", data: connectionRequest });
  } catch (error) {
    return res.status(500).send("ERROR :" + error.message);
  }
});

UserRouter.get("/users/connections", UserAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("toUserId", "firstName lastName")
      .populate("fromUserId", "firstName lastName");
    if (!connectionRequest) {
      res.status(404).json({ message: "No connections are found..." });
    }
    const data = connectionRequest.map((i) => {
      if (i?.fromUserId._id.toString() === loggedInUser?._id.toString()) {
        return i.toUserId;
      }
      return i.fromUserId;
    });
    res.status(200).json({
      data,
    });
  } catch (error) {}
});

UserRouter.get("/feed", UserAuth, async (req, res) => {
  try {
    const page=parseInt(req.query.page)||1;
    let limit=parseInt(req.query.limit)||10;
    limit=limit>50?50:limit
    const skip=(page-1)*limit
    const loggedInUser = req.user;
    const connectionRequest = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");
    const hindeUserFromFeed=new Set();
    connectionRequest.forEach((req)=>{
      hindeUserFromFeed.add(req.fromUserId.toString());
       hindeUserFromFeed.add(req.toUserId.toString());
    })
    const users=await user.find({
     $and:[{ _id:{$nin:Array.from(hindeUserFromFeed)}},{_id:{$ne:loggedInUser._id}}]
    }).select("firstName lastName imageUrl gender age").skip(skip).limit(limit)
    res.json(users);
  } catch (err) {
    res.status(400).json({message:err.message})
  }
});

module.exports = UserRouter;
