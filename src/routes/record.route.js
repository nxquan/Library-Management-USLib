const express = require('express');
const Router = express.Router();

const recordController = require('../app/controllers/RecordController');

Router.post('/', recordController.createRecord);
Router.post('/return', recordController.returnBook);
Router.get('/:student_id', recordController.getSome);

module.exports = Router;
