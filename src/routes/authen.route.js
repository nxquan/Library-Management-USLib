const express = require('express')
const Router = express.Router()
const authenController = require('../app/controllers/AuthenController')

const authenticateToken = require('../middleware/authenticateToken')

Router.post('/register', authenController.register)
Router.post('/login', authenController.login)
Router.post('/logout', authenticateToken, authenController.logOut)
Router.post('/refresh-token', authenticateToken, authenController.refreshToken)
Router.patch('/change-password', authenticateToken, authenController.changePassword)

module.exports = Router
