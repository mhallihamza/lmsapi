const Class = require('../models/Class');
const Course = require('../models/Course');
const Attendance = require('../models/Attendance');
const Payment = require('../models/Payment');
const Schedule = require('../models/Schedule');
const Exam = require('../models/Exam');
const User = require('../models/User');
const Exercice = require('../models/Exercice');
const Note = require('../models/Note');
const Notification = require('../models/Notification');
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

  exports.deleteClass = (req, res) => {
    const classId = req.params.id;
  
    // Delete Class
    Class.findOneAndDelete({ _id: classId })
      .then((deletedClass) => {
        if (!deletedClass) {
          return res.status(404).json({ message: 'Class not found' });
        }
  
        // Delete associated courses
        Course.deleteMany({ class: classId })
          .then(() => {
            // Delete associated exams
            Exam.deleteMany({ course: { $in: deletedClass.courses } })
              .then(() => {
                // Delete associated exercises
                Exercice.deleteMany({ course: { $in: deletedClass.courses } })
                  .then(() => {
                    // Find the users in the class
                    User.find({ class: classId }, '_id')
                      .then((users) => {
                        const userIds = users.map((user) => user._id);
  
                        // Delete associated attendance
                        Attendance.deleteMany({ class: classId })
                          .then(() => {
                            // Delete associated schedules
                            Schedule.deleteMany({ class: classId })
                              .then(() => {
                                // Delete associated payments
                                Payment.deleteMany({ student: { $in: userIds } })
                                  .then(() => {
                                    // Delete associated notes
                                    Note.deleteMany({ class: classId })
                                      .then(() => {
                                        // Delete associated notifications
                                        Notification.deleteMany({ receiver: { $in: userIds } })
                                          .then(() => {
                                            // Delete associated users
                                            User.deleteMany({ class: classId })
                                              .then(() => {
                                                res.status(200).json({ message: 'Class and associated data deleted successfully' });
                                              })
                                              .catch((error) => {
                                                res.status(500).json({ message: 'Error deleting users' });
                                              });
                                          })
                                          .catch((error) => {
                                            res.status(500).json({ message: 'Error deleting notifications' });
                                          });
                                      })
                                      .catch((error) => {
                                        res.status(500).json({ message: 'Error deleting notes' });
                                      });
                                  })
                                  .catch((error) => {
                                    res.status(500).json({ message: 'Error deleting payments' });
                                  });
                              })
                              .catch((error) => {
                                res.status(500).json({ message: 'Error deleting schedules' });
                              });
                          })
                          .catch((error) => {
                            res.status(500).json({ message: 'Error deleting attendance' });
                          });
                      })
                      .catch((error) => {
                        res.status(500).json({ message: 'Error finding users' });
                      });
                  })
                  .catch((error) => {
                    res.status(500).json({ message: 'Error deleting exercises' });
                  });
              })
              .catch((error) => {
                res.status(500).json({ message: 'Error deleting exams' });
              });
          })
          .catch((error) => {
            res.status(500).json({ message: 'Error deleting courses' });
          });
      })
      .catch((error) => {
        res.status(500).json({ message: 'Error deleting class' });
      });
  };
  
exports.updateClass = (req, res) => {
  Class.findOneAndUpdate(
    {
      _id: req.params.id // search query
    },
    req.body, // field:values to update
    {
      new: true, // return updated doc
      runValidators: true // validate before update
    }
  )
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}
  