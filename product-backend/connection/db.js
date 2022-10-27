const mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/Bramansh-product").then(()=>{
    console.log("connected to database");
}).catch((error)=>{
    console.log(error);
})