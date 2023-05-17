// import User Model
const Exam = require('../models/Exam');
const Class = require('../models/Class')
const Course = require('../models/Course');
const Note = require('../models/Note');
// DEFINE CONTROLLER FUNCTIONS

// listAllUser function - To list all Users
exports.getExamsByStudentId  = (req, res) => {
Class.find({students:req.params.id})
.then(user=>{
    const coursIds = user.flatMap(cls=>cls._id)
    console.log(coursIds);
    Course.find({class:{ $in: coursIds}})
    .then(course=>{
      const examsIds = course.flatMap(cls=>cls._id)
      Exam.find({course:{ $in: examsIds}})
      .then(exam => {
        res.status(201).json(exam);
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
exports.createNewExam = (req, res) => {
    let  newExam = new Exam (req.body);
    newExam.save()
.then(user1 => {
  res.status(201).json(user1);
})
.catch(err => {
  res.status(500).send(err);
})
};

exports.getExamsByTeacherId  = (req, res) => {
  Course.find({instructor:req.params.id})
  .then(user=>{
      const examIds = user.flatMap(course=>course._id)
      Exam.find({course:{ $in: examIds}})
      .then(exam=>{
        res.status(200).json(exam)
      })
      .catch(err=>{
        res.status(500).send(err);
    })
  })
  .catch(err=>{
      res.status(500).send(err);
  })
  };

  exports.getExamsByclass = (req, res) => {
    // Find all the courses taught by the instructor
    Course.find({instructor: req.params.id, class  : req.params.classId})
      .then(courses => {
        // Extract the ids of the courses
        const courseIds = courses.map(course => course._id);
        // Find all the exams with the course ids
        Exam.find({course: {$in: courseIds}})
          .then(exams => {
            res.status(200).json(exams);
          })
          .catch(err => {
            res.status(500).send(err);
          });
      })
      .catch(err => {
        res.status(500).send(err);
      });
  };
  

exports.listAllExam = (req, res) => {
      Exam.find({})
      .then(user=>{
        console.log(user);
          res.status(200).json(user);
      })
      .catch(err=>{
          res.status(500).send(err);
      })
      };

exports.getExamsByadmin = (req, res) => {
        // Find all the courses taught by the instructor
        Course.find({class  : req.params.classId})
          .then(courses => {
            // Extract the ids of the courses
            const courseIds = courses.map(course => course._id);
            // Find all the exams with the course ids
            Exam.find({course: {$in: courseIds}})
              .then(exams => {
                res.status(200).json(exams);
              })
              .catch(err => {
                res.status(500).send(err);
              });
          })
          .catch(err => {
            res.status(500).send(err);
          });
      };

exports.deleteExam = (req, res) => {
        const id = req.params.id;
        Exam.findOneAndDelete({ _id: id })
          .then((exam) => {
            if (!exam) {
              return res.status(404).json({ message: 'Exam not found' });
            }
            Note.deleteMany({ exam: exam._id })
            .then((note) => {
               !note ? console.log("Note not found") : console.log("Note deleted successfully")
            })
            .catch((error) => {
              res.status(500).json({ message: 'Error deleting note' });
            });
            res.status(200).json({ message: 'Exam deleted successfully' });
          })
          .catch((error) => {
            res.status(500).json({ message: 'Error deleting exam' });
          });
      };