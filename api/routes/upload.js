const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,"../images"))
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  });
const upload = multer({ storage });

router.post('/upload',upload.single("image"),(req,res)=>{
    res.status(200).json({message:"image uploaded"})
})
module.exports = router