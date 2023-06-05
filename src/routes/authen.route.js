const express = require('express');
const Router = express.Router();

const authenController = require('../app/controllers/AuthenController');

Router.post('/register', authenController.register);
Router.post('/login', authenController.login);
Router.post('/refresh-token', authenController.refreshToken);

module.exports = Router;
