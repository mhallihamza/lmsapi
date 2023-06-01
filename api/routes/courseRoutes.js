const express = require('express');
const router = express.Router();
const Course = require('../controllers/courseController.js');
router.post("",Course.createNewCourse)
router.get("",Course.listAllCourse);
router.get("/class/:classId",Course.getCoursesByClassId);
router.get("/teacher/:id",Course.getCoursesByInstructorId);
router.delete("/:id",Course.deleteCourse)
router.put("/:id",Course.updateCourse);
module.exports = router;