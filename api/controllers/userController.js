// import User Model
const  User = require("../models/User");
const  Class = require("../models/Class");
const  Attendance = require("../models/Attendance");
const  Note = require("../models/Note");
const  Payment = require("../models/Payment");
const  Course = require("../models/Course");
const  Schedule = require("../models/Schedule");
const  Exercice = require("../models/Exercice");
const  Exam = require("../models/Exam");
const  Notification = require("../models/Notification");
const  bcrypt = require('bcrypt');
// DEFINE CONTROLLER FUNCTIONS

// listAllUser function - To list all Users
exports.listAllUsers = (req, res) => {
User.find({}).populate("class","name")
.then(user=>{
    res.status(200).json(user);
})
.catch(err=>{
    res.status(500).send(err);
})
};

// createNewUser function - To create new User
exports.createNewUser = (req, res) => {
  let newUser = new User(req.body);
  newUser.save()
    .then(user => {
      // If the new user is a student, add them to a class
      if (user.role === 'student' && req.body.class) {
        Class.findById(req.body.class)
          .then(cls => {
            cls.students.push(user._id);
            cls.save();
          })
          .catch(err => {
            console.error(err);
          });
      }
      res.status(201).json(user);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

// updateUser function - To update user status by id
exports.updateUser = (req, res) => {
  const updateFields = req.body;

  if (req.body.email) {
    updateFields.email = req.body.email;
  }

  if (req.body.image) {
    updateFields.image = req.body.image;
  }

  if (req.body.username) {
    updateFields.username = req.body.username;
  }

  if (req.body.password) {
    // Check if the password field contains a hashed password
    if (req.body.password.startsWith('$2')) {
      updateFields.password = req.body.password; // Use the provided hashed password as is
    } else {
      // Generate a new salt
      const salt = bcrypt.genSaltSync(10);
      // Hash the new password with the generated salt
      const encryptedPassword = bcrypt.hashSync(req.body.password, salt);
      updateFields.password = encryptedPassword;
    }
  }

  User.findOneAndUpdate(
    { _id: req.params.id }, // search query
    updateFields, // field:values to update
    { new: true, runValidators: true } // options
  )
    .then(user => {
      // Handle class update
      if (req.body.class) {
        const { class: newClassId } = req.body;
        const { _id: userId } = user;

        Class.findOneAndUpdate(
          { students: userId },
          { $pull: { students: userId } }
        )
          .then(() => {
            Class.findByIdAndUpdate(
              newClassId,
              { $push: { students: userId } },
              { new: true }
            )
              .then(() => {
                res.status(200).json(user);
              })
              .catch(err => {
                console.error(err);
                res.status(500).json({ message: 'Server error' });
              });
          })
          .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
          });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    });
};

// deleteUser function - To delete user by id
exports.deleteUser = (req, res) => {
  const id = req.params.id;

  User.findByIdAndRemove(id)
    .then(user => {
      if (!user) {
        return res.status(404).send('User not found.');
      }

      if (user.role === 'student' && user.class) {
        // Delete student-related data
        Class.findByIdAndUpdate(user.class, { $pull: { students: user._id } })
          .then(() => {
            const noteFilter = { student: user._id };
            Note.deleteMany(noteFilter)
              .then(() => {
                const paymentFilter = { student: user._id };
                Payment.deleteMany(paymentFilter)
                  .then(() => {
                    const notificationFilter = { receiver: user._id };
                    Notification.deleteMany(notificationFilter)
                      .then(() => {
                        const attendanceFilter = { 'students.user': user._id };
                        Attendance.updateMany(attendanceFilter, { $pull: { students: { user: user._id } } })
                          .then(() => {
                            res.status(200).json(user);
                          })
                          .catch(err => {
                            res.status(500).send(err);
                          });
                      })
                      .catch(err => {
                        res.status(500).send(err);
                      });
                  })
                  .catch(err => {
                    res.status(500).send(err);
                  });
              })
              .catch(err => {
                res.status(500).send(err);
              });
          })
          .catch(err => {
            console.error(err);
            res.status(500).send(err);
          });
      } else if (user.role === 'instructor') {
        // Delete instructor-related data
        Course.find({ instructor: user._id })
          .then(courses => {
            const courseIds = courses.map(course => course._id);
            
            Course.deleteMany({ instructor: user._id })
              .then(() => {
                Class.updateMany({ courses: { $in: courseIds } }, { $pull: { courses: { $in: courseIds } } })
                  .then(() => {
                    Exam.deleteMany({ course: { $in: courseIds } })
                      .then(() => {
                        Exercice.deleteMany({ course: { $in: courseIds } })
                          .then(() => {
                            // Delete related notes
                            const noteFilter = { instructor: user._id };
                            Note.deleteMany(noteFilter)
                              .then(() => {
                                // Delete related notifications
                                const notificationFilter = { sender: user._id };
                                Notification.deleteMany(notificationFilter)
                                  .then(() => {
                                    // Delete related schedule
                                    Schedule.deleteMany({ course: { $in: courseIds } })
                                      .then(() => {
                                        res.status(200).json(user);
                                      })
                                      .catch(err => {
                                        res.status(500).send(err);
                                      });
                                  })
                                  .catch(err => {
                                    res.status(500).send(err);
                                  });
                              })
                              .catch(err => {
                                res.status(500).send(err);
                              });
                          })
                          .catch(err => {
                            res.status(500).send(err);
                          });
                      })
                      .catch(err => {
                        res.status(500).send(err);
                      });
                  })
                  .catch(err => {
                    res.status(500).send(err);
                  });
              })
              .catch(err => {
                console.error(err);
                res.status(500).send(err);
              });
          })
          .catch(err => {
            console.error(err);
            res.status(500).send(err);
          });
      } else {
        res.status(200).json(user);
      }
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

// findUser function
exports.findUser = (req, res) => {
  User.findOne({
    _id:req.params.id
  })
  .then(user=>{
      res.status(200).json(user);
  })
  .catch(err=>{
      res.status(500).send(err);
  })
  };