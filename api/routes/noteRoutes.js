const express = require('express');
const router = express.Router();
const Note = require('../controllers/noteController.js');
router.get("/",(req,res)=>{
            res.send("Hello world in Noye list")
})
router.get("/admin/:class/:exam",Note.getNotes)
router.post("",Note.createNote)
router.get("/:studentId",Note.getNotesByStudent)
router.get("/teacher/:id/:class/:exam",Note.getNotesByInstructor)
router.put("",Note.updateNote)
module.exports = router