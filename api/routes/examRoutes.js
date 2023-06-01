const express = require('express');
const router = express.Router();
const Exam = require('../controllers/examController.js');
router.get("",Exam.listAllExam)
router.post("",Exam.createNewExam)
router.get("/:id",Exam.getExamsByStudentId)
router.get("/teacher/:id",Exam.getExamsByTeacherId)
router.get("/class/:id/:classId",Exam.getExamsByclass)
router.get("/admin/:classId",Exam.getExamsByadmin)
router.delete("/:id",Exam.deleteExam)
router.put("/:id",Exam.updateExam);
module.exports = router