const router = require("express").Router();

const {getTrack,uploadTrack,getAll}=require('../controllers/tracks.controller');
router.get("/tracks/:trackId", getTrack)
router.post("/tracks",uploadTrack)
router.get("/all",getAll)

module.exports=router;