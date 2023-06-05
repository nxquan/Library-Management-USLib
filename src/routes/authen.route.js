const express = require('express')
const Router = express.Router()
const authenticateToken = require('../middleware/authenticateToken')

const authenController = require('../app/controllers/AuthenController')

Router.post('/register', authenController.register)
Router.post('/login', authenController.login)
Router.post('/logout', authenController.logOut)
Router.post('/refresh-token', authenticateToken, authenController.refreshToken)
Router.patch('/change-password', authenController.changePassword)

module.exports = Router
