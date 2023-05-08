// import User Model
const  User = require("../models/User");
const  Class = require("../models/Class");
// DEFINE CONTROLLER FUNCTIONS

// listAllUser function - To list all Users
exports.listAllUsers = (req, res) => {
User.find({})
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
User.findOneAndUpdate(
    {
         _id:req.params.id   // search query
    }, 
    {
      email: req.body.email,
      image: req.body.image,  // field:values to update
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
// deleteUser function - To delete user by id
exports.deleteUser = (req, res) => {
  const id = req.params.id;
  // Find the user by id and remove them from the database
  User.findByIdAndRemove(id)
    .then(user => {
      if (!user) {
        return res.status(404).send('User not found.');
      }
      // If the user was a student, remove them from their class
      if (user.role === 'student' && user.class) {
        Class.findByIdAndUpdate(user.class, { $pull: { students: user._id } })
          .catch(err => {
            console.error(err);
          });
      }
      res.status(200).json(user);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

// findUser function - To delete user by id
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