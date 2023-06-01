// import User Model
const Schedule = require('../models/Schedule');
const Class = require('../models/Class')

// DEFINE CONTROLLER FUNCTIONS

// createNewUser function - To create new User
exports.createOrUpdateSchedule = (req, res) => {
  const { class: classId, course: courseId, weekday, startTime, endTime, subject, room } = req.body;

  Schedule.findOneAndUpdate(
    { class: classId, course: courseId, weekday, startTime, endTime }, // search query
    {subject, room }, // field:values to update
    { upsert: true, new: true, runValidators: true } // options (upsert will create a new schedule if not found)
  )
    .then(schedule => {
      res.status(200).json(schedule);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    });
};


  exports.getAllSchedule  = (req, res) => {
    Schedule.find({}).populate({
      path: 'course',
      select: 'title instructor',
      populate: { path: 'instructor', select: 'username' }
    })
    .then(schedule=>{
      res.status(200).json(schedule) 
    })
    .catch(err=>{
      res.status(500).send(err);
  })
};

exports.getScheduleByIdStudent  = (req, res) => {
  Class.findOne({students:req.params.id})
  .then(cls=>{
    console.log(cls);
    Schedule.find({class:cls._id}).populate({
      path: 'course',
      select: 'title instructor',
      populate: { path: 'instructor', select: 'username' }
    })
    .then(schedule=>{
      console.log(schedule);
      res.status(200).json(schedule) 
    })
    .catch(err=>{
      res.status(500).send(err);
  })
  })
  .catch(err=>{
    res.status(500).send(err);
})
};
//{class:req.params.id}
