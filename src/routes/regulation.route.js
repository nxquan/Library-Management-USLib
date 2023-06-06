const express = require('express');
const Router = express.Router();

const regulationController = require('../app/controllers/RegulationController');

Router.post('/', regulationController.createRegulation);
Router.delete('/:id', regulationController.deleteRegulation);

Router.get('/', regulationController.getAll);
Router.patch('/:id', regulationController.updateRegulation);

module.exports = Router;
