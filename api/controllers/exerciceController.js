// import User Model
const Exercice = require('../models/Exercice');
const Class = require('../models/Class');
const User = require('../models/User');
const Course = require('../models/Course');
// DEFINE CONTROLLER FUNCTIONS

// listAllUser function - To list all Users
exports.getExerciceByStudentId  = (req, res) => {
  Class.find({students:req.params.id})
  .then(user=>{
      const coursIds = user.flatMap(cls=>cls._id)
      console.log(coursIds);
      Course.find({class:{ $in: coursIds}})
      .then(course=>{
        const exercicesIds = course.flatMap(cls=>cls._id)
        Exercice.find({course:{ $in: exercicesIds}}).populate({
          path: 'course',
          select: 'instructor',
          populate: {
            path: 'instructor',
            select: 'username'
          }
        })
        .then(exercice => {
          res.status(201).json(exercice);
        })
        .catch(err => {
          res.status(500).send(err);
        })
      })
      .catch(err=>{
        res.status(500).send(err);
    })
  })
  .catch(err=>{
      res.status(500).send(err);
  })
  };

// createNewUser function - To create new User
exports.createNewexercice = (req, res) => {
    let  newExercice = new Exercice (req.body)
    newExercice.save()
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).send(err);
    })
  };

exports.getExerciceByTeacherId  = (req, res) => {
  Course.find({instructor:req.params.id})
  .then(user=>{
    console.log(user)
      const exerciceIds = user.flatMap(cls=>cls._id)
      Exercice.find({course:{ $in: exerciceIds}}).populate('course','title').exec()
      .then(exercice=>{
        res.status(200).json(exercice)
      })
      .catch(err=>{
        res.status(500).send(err);
    })
  })
  .catch(err=>{
      res.status(500).send(err);
  })
  };

  exports.listAllExercice = (req, res) => {
    Exercice.find({}).populate('course','title').exec()
    .then(user=>{
        res.status(200).json(user);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
    };

    exports.deleteExercice = (req, res) => {
      const id = req.params.id;
      Exercice.findOneAndDelete({ _id: id })
        .then((exercice) => {
          if (!exercice) {
            return res.status(404).json({ message: 'Exercice not found' });
          }
    
          res.status(200).json({ message: 'Exercice deleted successfully' });
        })
        .catch((error) => {
          res.status(500).json({ message: 'Error deleting exercice' });
        });
    };