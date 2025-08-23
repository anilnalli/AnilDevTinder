const express=require("express");
const profileRouter=express.Router();
// import the auth middleware
const {UserAuth}=require("../middleware/auth");

profileRouter.get("/profile", UserAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Error Fetching profile: " + error.message);
  }
});

profileRouter.get("/connectionRequiest", UserAuth, async(req,res)=>{
  try{
    const user=req.user;
    res.status(200).send(user.firstName+ "  sent you  a connection Requiest");
  }
  catch(err){
    res.status(400).send("Error fetching connection request:" + err.message);
  }

})

module.exports=profileRouter;
