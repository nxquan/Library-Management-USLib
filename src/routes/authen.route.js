const express = require('express')
const Router = express.Router()
const authenticateToken = require('../middleware/authenticateToken')

const authenController = require('../app/controllers/AuthenController')

Router.post('/register', authenController.register)
Router.post('/logout', authenticateToken, authenController.logOut)

module.exports = Router
