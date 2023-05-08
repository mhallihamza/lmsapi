const Course = require('../models/Course');
const Class = require('../models/Class');

exports.listAllCourse = (req, res) => {
  Course.find({})
  .populate('instructor','username')
  .populate({
    path: 'class',
    select: 'name'
  })
  .then(user=>{
      res.status(200).json(user)
  })
  .catch(err=>{
      res.status(500).send(err);
  })
  };

exports.createNewCourse = (req, res) => {
  const classId =  req.body.class;
  const { title, description, instructor,startTime, endTime } = req.body;

  // Create a new Course document
  const course = new Course({ title, description, instructor, class: classId, startTime, endTime });
  course.save()
    .then(courseDoc => {
      // Add the course id to the corresponding Class document
      if (req.body.class) {
        Class.findOne({_id:req.body.class})
          .then(cls => {
            cls.courses.push(courseDoc._id);
            cls.save();
          })
          .catch(err => {
            console.error(err);
          });
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    });
};

exports.getCoursesByClassId = (req, res) => {
  const classId = req.params.classId;

  Course.find({ class: classId })
    .populate('instructor', 'username') // populate instructor field with username only
    .exec()
    .then(courses => {
      res.status(200).json(courses);
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    });
};

exports.getCoursesByInstructorId = (req, res) => {
  Course.find({ instructor: req.params.id })
    .populate('instructor', 'username')
    .populate('class', 'name')
    .then(courses => {
      res.status(200).json(courses);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};
