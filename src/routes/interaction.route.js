const express = require('express');
const Router = express.Router();
const InteractionController = require('../app/controllers/InteractionController');

Router.post('/', InteractionController.reserveBook);
Router.get('/:student_id', InteractionController.viewReserveBook);
Router.get('/book/:student_id', InteractionController.viewHistory);
Router.patch('/:student_id', InteractionController.renewalBorrowBook);

module.exports = Router;
