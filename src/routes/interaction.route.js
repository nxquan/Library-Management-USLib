const express = require('express');
const Router = express.Router();
const InteractionController = require('../app/controllers/InteractionController');
const authenticateToken = require('../middleware/authenticateToken');

Router.post('/', authenticateToken, InteractionController.reserveBook);
Router.get('/:student_id', authenticateToken, InteractionController.viewReserveBook);
Router.get('/book/:student_id', authenticateToken, InteractionController.viewHistory);
Router.patch('/:student_id', authenticateToken, InteractionController.renewalBorrowBook);

module.exports = Router;
