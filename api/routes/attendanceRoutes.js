const express = require('express');
const router = express.Router();
const Attendance = require('../controllers/attendanceController.js');
router.post("/",Attendance.registerAttendance)
router.get("/:date/:cls",Attendance.findAttendancebydateandclass)
router.put("/",Attendance.updateAttendance)
router.get("/:id",Attendance.findAttendancebyIDuser)
module.exports = router