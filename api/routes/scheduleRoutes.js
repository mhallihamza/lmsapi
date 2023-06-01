const express = require('express');
const router = express.Router();
const Schedule = require('../controllers/scheduleController.js');
router.post("",Schedule.createOrUpdateSchedule)
router.get("",Schedule.getAllSchedule)
router.get("/student/:id",Schedule.getScheduleByIdStudent)
module.exports = router