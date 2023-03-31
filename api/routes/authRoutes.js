const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
router.get("/",(req,res)=>{
            res.send("Hello world in login")
})
router.post("/register",auth.register)
router.post("/login",auth.login)
module.exports = router