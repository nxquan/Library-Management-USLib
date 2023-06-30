const express = require('express');
const Router = express.Router();
const InteractionController = require('../app/controllers/InteractionController');

Router.post('/', InteractionController.requestReader);
Router.get('/request', InteractionController.viewRequestCreate);
Router.get('/book/:student_id', InteractionController.viewHistory);
Router.patch('/:student_id', InteractionController.renewalBorrowBook);
Router.delete('/:student_id', InteractionController.deleteRequest);

module.exports = Router;
