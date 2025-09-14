const mongoose=require("mongoose");

const connectionRequestSchema= new mongoose.Schema({
    fromUserId:{
        type:String,
        ref:"User",
        required:true,
    },
    toUserId:{
        type:String,
          ref:"User",
        required:true
    },
    status:{
        type:String,
        requried:true,
        enum:{
            values:["ignore","interested","accepted","rejected"],
            message:"{VALUE} is incorrect status type"
        }

    }

},
{timestamps:true}
)

connectionRequestSchema.pre("save",function(next){
    const connection=this;
    if(connection.fromUserId===connection.toUserId){
        throw new Error("Connection not sent to the same user");
    }
    next();
})

module.exports=new mongoose.model("ConnectionRequest",connectionRequestSchema)