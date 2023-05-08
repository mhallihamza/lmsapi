// import User Model
const Schedule = require('../models/Schedule');
const Class = require('../models/Class')

// DEFINE CONTROLLER FUNCTIONS

// createNewUser function - To create new User
exports.createNewSchedule = (req, res) => {
    let newSchedule = new Schedule(req.body);
    newSchedule.save()
      .then(schedule => {
        res.status(201).json(schedule);
      })
      .catch(err => {
        res.status(500).send(err);
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
