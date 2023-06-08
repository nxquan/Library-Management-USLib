const express = require('express')
const Router = express.Router()
const regulationController = require('../app/controllers/RegulationController')

const authenticateToken = require('../middleware/authenticateToken')

Router.post('/', authenticateToken, regulationController.createRegulation)
Router.delete('/:id', authenticateToken, regulationController.deleteRegulation)

Router.get('/', authenticateToken, regulationController.getAll)
Router.patch('/:id', authenticateToken, regulationController.updateRegulation)

module.exports = Router
