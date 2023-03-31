'use strict'

const {verifyToken,verifyUser,verifyAdmin} = require('../../utils/verifyToken')

// create App function
module.exports = function (app) {
  var userList = require('../controllers/userController')

  // userList Routes

  // get and post request for /users endpoints
  app.route('/users').get(verifyAdmin,userList.listAllUsers).post(verifyAdmin,userList.createNewUser)

  // put and delete request for /users endpoints
  app
    .route('/user/:id')
    .put(verifyUser,userList.updateUser)
    .delete(verifyUser,userList.deleteUser)
    .get(verifyUser,userList.findUser)
  //
  app
      .route('/checkauthentication')
      .get(verifyToken, (req, res, next) => {
          res.send('hello user, you are authenticated')
        })
  //
  app
     .route('/checkuser/:id')
     .get(verifyUser, (req, res, next) => {
        res.send('hello user, you are authenticated and you can delete your account')
       })
}
