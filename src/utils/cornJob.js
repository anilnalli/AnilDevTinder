const corn =require("node-cron");
const{subDays, startOfDay, endOfDay }=require("date-fns");
const connectionRequestModel=require("../models/connectionRequest");
const{run} =require("../utils/sendEmails")
corn.schedule("40 22 * * * ",async()=>{

    const yesturday=subDays(new Date(),0);
    const yesturdayStart=startOfDay(yesturday);
    const esturdayEnd=endOfDay(yesturday);
    console.log("yesttt===>",{yesturdayStart,esturdayEnd})
    const pendingRequests=await connectionRequestModel.find({
        status:"interested",
        createdAt:{
            $gte:yesturdayStart,
            $lt:esturdayEnd
        }

    }).populate("fromUserId toUserId")
    
    const listOfEmails=[...new Set(pendingRequests.map((req)=>req.toUserId.email))]
       console.log("listOfEmails==>",{listOfEmails,pendingRequests})
    for(const email of listOfEmails){
        try{
            const res=await run("new Freind Request From"+email,"You Got New Friend Requests Please login into your devtinder account and accept or reject the request you got...")
            console.log("ressss==>",{res})
        }catch(err){
            console.log("error",err)
        }

    }
})