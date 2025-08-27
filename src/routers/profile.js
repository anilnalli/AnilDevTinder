const express=require("express");
const profileRouter=express.Router();
// import the auth middleware
const {UserAuth}=require("../middleware/auth");
const{isValidateProfileData} =require("../utils/validation")

profileRouter.get("/profile/view", UserAuth, async (req, res) => {
  try {
    const user = req.user;
    res.status(200).send(user);
  } catch (error) {
    res.status(500).send("Error Fetching profile: " + error.message);
  }
});


profileRouter.patch("/profile/edit",UserAuth,async(req,res)=>{
  try{
    if(!isValidateProfileData(req)){
      res.status(400).send("fields are not valid to update")
    }     
    const profileOldData=req.user;
    Object.keys(req.body).forEach((field)=>(profileOldData[field]=req.body[field]));
    console.log("profileOldData",profileOldData)
    await profileOldData.save();
    res.status(200).send(`${profileOldData?.firstName} your profile updated succesfully`)

  }
  catch(error){
    res.status(500).send("failed to update the profile")
  }
 })

module.exports=profileRouter;
