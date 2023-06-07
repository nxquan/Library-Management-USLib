const express = require('express');
const Router = express.Router();

const genreController = require('../app/controllers/GenreController');

Router.post('/', genreController.createGenre);
Router.delete('/:id', genreController.deleteGenre);

Router.get('/', genreController.getAll);
Router.patch('/:id', genreController.updateGenre);

module.exports = Router;
