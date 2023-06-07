const express = require('express');
const Router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const readerController = require('../app/controllers/ReaderController');

Router.post('/', readerController.createReader);
Router.patch('/:id', readerController.updateReader);
Router.delete('/:id', readerController.deleteReader);

Router.get('/:id', readerController.findOneReader);
Router.get('/', readerController.getAllReader);

module.exports = Router;
