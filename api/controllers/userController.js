// import User Model
const  User = require("../models/User");

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
let  newUser = new User (req.body)
newUser.save()
.then(user => {
    res.status(201).json(user);
  })
  .catch(err => {
    res.status(500).send(err);
  })
};

// updateUser function - To update user status by id
exports.updateUser = (req, res) => {
User.findOneAndUpdate(
    {
         _id:req.params.id   // search query
    }, 
    {
      email: req.body.email   // field:values to update
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
exports.deleteUser = ( req, res) => {
  User.deleteOne({
     _id:req.params.id 
  })
  .then(response => {
    res.status(200).json({ message:"User successfully deleted"});
  })
  .catch(err => {
    return res.status(404).send(err);
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