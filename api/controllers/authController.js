const User = require('../models/User')
const bcrypt = require('bcryptjs')
const fs = require('fs')
const jwt = require('jsonwebtoken')
let privateKey = fs.readFileSync('private.key')

exports.register = (req, res) => {
  const salt = bcrypt.genSaltSync(10)
  const hash = bcrypt.hashSync(req.body.password, salt)
  let newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hash,
  })
  newUser
    .save()
    .then((user) => {
      res.status(201).json(user)
    })
    .catch((err) => {
      res.status(500).send(err)
    })
}
exports.login = (req, res, next) => {
  User.findOne({
    email: req.body.email, // search query
  })
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
          { id: user._id, isAdmin: user.isAdmin },
          privateKey
        )
        res
          .cookie('acces_token', token, {
            httpOnly: true,
          })
          .status(200)
          .json(user)
      })
    })
    .catch((err) => {
      console.error(err)
    })
}
