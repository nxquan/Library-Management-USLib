const express = require('express');
const Router = express.Router();

const recordController = require('../app/controllers/RecordController');

Router.post('/', recordController.createRecord);
Router.post('/return', recordController.returnBook);
Router.get('/', recordController.getAll);

module.exports = Router;
