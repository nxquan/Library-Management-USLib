const express = require('express')
const Router = express.Router()
const genreController = require('../app/controllers/GenreController')

const authenticateToken = require('../middleware/authenticateToken')

Router.post('/', authenticateToken, genreController.createGenre)
Router.delete('/:id', authenticateToken, genreController.deleteGenre)

Router.get('/', authenticateToken, genreController.getAll)
Router.patch('/:id', authenticateToken, genreController.updateGenre)

module.exports = Router
