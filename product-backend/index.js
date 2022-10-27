const express=require("express");
const multer=require("multer");
const mongoose=require("mongoose");
const cors=require('cors');
const app=express();
app.use(cors());
const port=process.env.PORT || 5000;
app.use(express.json());

app.use("/uploads",express.static("./uploads"));


mongoose.connect("mongodb://localhost/BranAnsh-products").then(()=>{
    console.log("connected to database");
}).catch((error)=>{
    console.log(error);
})

const productSchema= new mongoose.Schema({
    productImage:{type:String},
    name:{type:String },
    description:{type:String},
    price:{type:Number},
    amount:{type:Number}
})

const productModel=new mongoose.model("productModel", productSchema);
//storage
const Storage=multer.diskStorage({
    destination:"./uploads",
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})
//upload
const upload=multer({
    storage:Storage
})
app.post("/products" ,upload.single('productImage'), async(req, res) => {
	try {
		
			console.log(req.file)
			const data={
                productImage:  req.file.filename,
				name: req.body.name,
				description: req.body.description,
                price: req.body.price,
                amount:req.body.amount
			}
			const products = await productModel.create(data);
			res.json({
					status: "Success",
					products
			})

	}catch(e) {
			res.status(500).json({
					status: "failed",
					message: e.message
			})
	}

})
app.get("/products",async (req,res)=>{
    try{
        const products= await productModel.find();
     res.json({
        status:"success",
        products:products
         })
    }catch(e){
        res.json({
            status:"failed",
            message:e.message
        })
    }
})

app.listen(port,()=>{
    console.log("server is running at port "+port);
})
