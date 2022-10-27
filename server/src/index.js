const express= require('express');
const cors=require('cors');
var morgan = require('morgan');
const tracksRoute=require("./routes/music");
const app = express();
const port=process.env.PORT||8080;

//connection
require("./dbconnection/db");

//middle ware

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

app.use(tracksRoute)






app.listen(port,()=>{
    console.log("listening to server "+port);
})