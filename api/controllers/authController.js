const User = require('../models/User')
const Class = require('../models/Class')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const jwt = require('jsonwebtoken')
let privateKey = fs.readFileSync('private.key')

exports.register = (req, res) => {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(req.body.password, salt)
  let userFields = {
    username: req.body.username,
    email: req.body.email,
    password: hash,
    role: req.body.role,
  };
  
  if (req.body.phone) {
    userFields.phone = req.body.phone;
  }
  
  if (req.body.parent) {
    userFields.parent = req.body.parent;
  }

  if (req.body.admissiondate) {
    userFields.admissiondate = req.body.admissiondate;
  }
  
  if (req.body.class) {
    userFields.class = req.body.class;
  }

  if (req.body.gender) {
    userFields.gender = req.body.gender;
  }

  if (req.body.joiningdate) {
    userFields.joiningdate = req.body.joiningdate;
  }

  let newUser = new User(userFields)
  newUser
    .save()
    .then((user) => {
      console.log(user);
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
      res.status(201).json(user)
    })
    .catch((err) => {
      res.status(500).send(err)
    })
}
exports.login = (req, res, next) => {
  User.findOne({
    email: req.body.email, // search query
  }).populate("class","name")
    .then((user) => {
      if (!user) {
        // handle user not found error
        return res.status(401).json({ message: 'user not found' })
      }
      bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
        if (err) {
          return next(err)
        }
        if (!isMatch) {
          // handle incorrect password error
          return res.status(401).json({ message: 'Invalid email or password' })
        }
        const token = jwt.sign(
          { id: user._id, role: user.role },
          privateKey
        )
        res
          .cookie('acces_token', token, {
            httpOnly: true,
          }).status(200).json(user);
      })
    })
    .catch((err) => {
      console.error(err)
    })
}
