const Attendance = require('../models/Attendance');

// Register attendance for a class on a specific date
exports.registerAttendance = (req, res) => {
    // Create new attendance record
    let attendance = new Attendance (req.body);
    // Save attendance record to database
 attendance.save()
 .then(user=>{
     res.status(200).json(user);
 })
 .catch(err=>{
  res.status(500).send(err);
})
};

// Update attendance for a class on a specific date
exports.updateAttendance = (req, res) => {
  Attendance.findOneAndUpdate(
    {date:req.body.date,class:req.body.class},
    {
      students: req.body.students,  // field:values to update
    },
    {
      new: true,                       // return updated doc
      runValidators: true              // validate before update
    })
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).send(err);
    })
}
exports.findAttendancebydateandclass = (req, res) => {
  Attendance.findOne({
    date:req.params.date,
    class:req.params.cls
  })
  .populate({
    path: 'students.user',
    select: 'username image'
  })
  .then(user=>{
      res.status(200).json(user);
  })
  .catch(err=>{
      res.status(500).send(err);
  })
  };
  exports.findAttendancebyIDuser = (req, res) => {
    const userId = req.params.id;
    Attendance.find({
      "students.user": userId,
    })
    .populate("students.user", "username") // populate user info
    .populate("class", "name")
    .select("date class students.status")
    .then(user=>{
        res.status(200).json(user);
    })
    .catch(err=>{
        res.status(500).send(err);
    })
    };
