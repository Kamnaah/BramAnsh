const multer=require("multer");
const {getConnection}=require("../dbconnection/db");
const {GridFSBucket, ObjectId}=require('mongodb');
const {Readable}=require('stream');
const express=require("express");
const app=express();
app.use(express.json());


const getAll=(req,res)=>{
    const db=getConnection();
    db.collection("tracks.files").find({}).toArray(function(err, result) {
      if (err) throw err;
      console.log(result);
      res.status(200).json({
        result:result
      })
    });
}

const getTrack=(req,res)=>{
    let trackId;
    try{
        trackId= new ObjectId(req.params.trackId);
    }catch(e){
        res.status(404).json({
        message:e.message
    })
    }
    res.set("content-type","audio/mp3")
    res.set("accept-ranges","bytes")
    const db=getConnection();
    const bucket=new GridFSBucket(db,{
        bucketName:"tracks"
    })
    let downloadStream=bucket.openDownloadStream(trackId);
    downloadStream.on('data',chunk=>{
        res.write(chunk);
    })
    downloadStream.on('error',()=>{
        res.sendStatus(404);
    })
    downloadStream.on('end',()=>{
        res.end();
    })
}
const uploadTrack=(req,res)=>{
    const storage=multer.memoryStorage();
    const uploads=multer({
        storage:storage,
        limits:{
            fields:1,
            fieldSize:600000,
            files:1
        }

    })
    uploads.single("track")(req,res,(err)=>{
        if(err){
            console.log(err);
            return res.status(400).json({
                message:err.message
            })
        }
        else if(!req.body.name){
            return res.status(404).json({
                message:"No track name"
            })
        }


        let trackName=req.body.name;

        const readableTrackStream=new Readable();//stream
        readableTrackStream.push(req.file.buffer);
        readableTrackStream.push(null);
        const db=getConnection();
        const bucket=new GridFSBucket(db,{
            bucketName:"tracks"
        })
        let uploadsStream=bucket.openUploadStream(trackName)
        const id=uploadsStream.id;
        readableTrackStream.pipe(uploadsStream)

        uploadsStream.on('error',()=>{
            return res.status(400).json({
                message:"error uploading your file"
            })
        })
        uploadsStream.on("finish",()=>{
            return res.status(200).json({
                message:"successfully uploaded file",
                id
            })
        })
    });
}

module.exports={
    getTrack,
    uploadTrack,
    getAll
}