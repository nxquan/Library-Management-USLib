const express = require('express');
const Router = express.Router();

const authenController = require('../app/controllers/AuthenController');

Router.post('/register', authenController.register);

module.exports = Router;
