const express =require("express");

const app=express();

app.get('/userabc',(req,res)=>{
  res.send({name:"anil",age:25})
});

app.post("/user",(req,res)=>{
  res.send("data posted")

});

app.delete("/user",(req,res)=>{
  res.send("data Deleted")
});



app.listen(3000,()=>{
    console.log("server stated successfully on port number 3000 ...")
});


