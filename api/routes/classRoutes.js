const express = require('express');
const router = express.Router();
const Class = require('../controllers/classController.js');
router.get("",Class.listAllClass);
router.post("",Class.createNewClass);
router.get("/student/:id",Class.listClassbystudent);
router.get("/teacher/:id",Class.listClassbyteacher);
router.delete("/:id",Class.deleteClass)
module.exports = router