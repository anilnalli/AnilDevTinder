const express =require("express");

const app=express();

app.use("/anil",(req,res)=>{
  res.send("hello wolrd"); 
})
app.use((req,res)=>{
    res.send("hello wolrd this is the express js code");
})

app.listen(3000,()=>{
    console.log("server stated successfully on port number 3000 ...")
});


