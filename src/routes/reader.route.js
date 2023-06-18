const express = require('express');
const Router = express.Router();
const readerController = require('../app/controllers/ReaderController');
const authenticateToken = require('../middleware/authenticateToken')
const { validateCreateReader, validateUpdateReader} = require('../middleware/validateReader')

Router.post('/', authenticateToken, validateCreateReader, readerController.createReader);
Router.patch('/:id', authenticateToken, validateUpdateReader, readerController.updateReader);
Router.delete('/:id',authenticateToken, readerController.deleteReader);

Router.get('/:id', readerController.findOneReader)
Router.get('/', readerController.getAllReader)

module.exports = Router;
