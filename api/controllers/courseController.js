const Course = require('../models/Course');
const Class = require('../models/Class');
const Schedule = require('../models/Schedule');
const Exam = require('../models/Exam');
const Exercice = require('../models/Exercice');
const Note = require('../models/Note');
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
            res.status(201).json(courseDoc);
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

exports.deleteCourse = (req, res) => {
  const courseId = req.params.id;

  // Delete Course
  Course.findOneAndDelete({ _id: courseId })
    .then((course) => {
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }

      // Get the list of exams associated with the course
      Exam.find({ course: courseId })
        .then((exams) => {
          const examIds = exams.map((exam) => exam._id);

          // Delete associated notes
          Note.deleteMany({ exam: { $in: examIds } })
            .then(() => {
              // Delete associated exams
              Exam.deleteMany({ course: courseId })
                .then(() => {
                  // Delete associated exercises
                  Exercice.deleteMany({ course: courseId })
                    .then(() => {
                      // Delete associated schedules
                      Schedule.deleteMany({ course: courseId })
                        .then(() => {
                          // Delete course from the courses array in Class model
                          Class.updateMany(
                            { courses: courseId },
                            { $pull: { courses: courseId } }
                          )
                            .then(() => {
                              res.status(200).json({ message: 'Course and associated data deleted successfully' });
                            })
                            .catch((error) => {
                              res.status(500).json({ message: 'Error deleting course from Class model' });
                            });
                        })
                        .catch((error) => {
                          res.status(500).json({ message: 'Error deleting schedules' });
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
              res.status(500).json({ message: 'Error deleting notes' });
            });
        })
        .catch((error) => {
          res.status(500).json({ message: 'Error finding exams' });
        });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Error deleting course' });
    });
};

exports.updateCourse = (req, res) => {
  const courseId = req.params.id;
  const { title, description, instructor, startTime, endTime, classId } = req.body;

  Course.findOneAndUpdate(
    { _id: courseId }, // search query
    { title, description, instructor, class: classId, startTime, endTime }, // field:values to update
    { new: true, runValidators: true } // options
  )
    .then(updatedCourse => {
       Class.findOneAndUpdate(
        { courses: courseId },
        { $pull: { courses: courseId } },
        { new: true }
      ).exec()
        .then(() => {
           Class.findOneAndUpdate(
            { _id: classId },
            { $push: { courses: courseId } },
            { new: true }
          ).exec()
          .then(() => {
            res.status(200).json(updatedCourse);
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
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    });
};


