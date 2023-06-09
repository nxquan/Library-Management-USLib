const express = require('express');
const Router = express.Router();

const recordController = require('../app/controllers/RecordController');

Router.post('/', recordController.createRecord);

module.exports = Router;
