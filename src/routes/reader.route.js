const express = require('express')
const Router = express.Router()
const authenticateToken = require('../middleware/authenticateToken')
const readerController = require('../app/controllers/ReaderController')

Router.post('/', authenticateToken, readerController.createReader)
Router.patch('/:id', authenticateToken, readerController.updateReader)
Router.delete('/:id', authenticateToken, readerController.deleteReader)

Router.get('/:id', readerController.findOneReader)
Router.get('/', readerController.getAllReader)

module.exports = Router
