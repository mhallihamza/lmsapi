const Class = require('../models/Class');
const User = require('../models/User');
const Course = require('../models/Course');
// listAllClass function - To list all Users
exports.listAllClass = (req, res) => {
Class.find({}).populate("students","username image gender")
.then(user=>{
    res.status(200).json(user)
})
.catch(err=>{
    res.status(500).send(err);
})
};

exports.listClassbyteacher = (req, res) => {
  const instructorId = req.params.id;
Course.find({ instructor: instructorId })
  .populate({
    path: 'class',
    select: 'name students',
    populate: {
      path: 'students',
      select: 'username image gender'
    }
  })
  .then(courses => {
    const classes = courses.map(course => course.class);
    res.status(200).json(classes);
  })
  .catch(err => {
    res.status(500).send(err);
  });

  };

// createNewClass function - To create new User
exports.createNewClass = (req, res) => {
  let newClass = new Class(req.body);
  newClass.save()
      .then(cls => {
        res.status(201).json(cls);
      })
      .catch(err => {
        res.status(500).send(err);
      });
};

exports.listClassbystudent = (req, res) => {
  Class.find({students:req.params.id})
  .select("instructor")
  .then(user=>{
   const classIds = user.map(c => c._id);
      Course.find({ class: { $in: classIds }}).populate("instructor","username image gender email")
      .then(course=>{
        res.status(200).json(course);
      })
      .catch(err=>{
        res.status(500).send(err);
    })
  })
  .catch(err=>{
      res.status(500).send(err);
  })
  };