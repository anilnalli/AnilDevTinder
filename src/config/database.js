const mongoose=require("mongoose");
const connectDB= async()=>{
 await mongoose.connect("mongodb+srv://nallianilkumar179:zGWilaXe4X0LuIw0@anildev.z3fhjum.mongodb.net/devTinder");

}
module.exports={connectDB}