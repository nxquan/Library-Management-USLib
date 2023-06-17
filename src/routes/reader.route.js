const express = require('express');
const Router = express.Router();
const readerController = require('../app/controllers/ReaderController');

Router.post('/', readerController.createReader);
Router.patch('/:id', readerController.updateReader);
Router.delete('/:id', readerController.deleteReader);

Router.get('/:id', readerController.findOneReader);
Router.get('/', readerController.getAllReader);

Router.get('/search', readerController.search);

module.exports = Router;
