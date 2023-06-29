const express = require('express')
const Router = express.Router()
const bookController = require('../app/controllers/BookController')

const multer = require('multer')

function imageFilter(req, file, cb) {
	if (
		file.mimetype === 'image/jpeg' ||
		file.mimetype === 'image/png' ||
		file.mimetype === 'image/jpg'
	) {
		cb(null, true)
	} else {
		cb(null, false)
		return cb(new Error('Only .png, .jpg and .jpeg format allowed!'))
	}
}
const upload = multer({ storage: multer.memoryStorage(), fileFilter: imageFilter })

Router.get('/search', bookController.search)

Router.patch('/:id', upload.array('photos', 12), bookController.updateBook)
Router.get('/:id', bookController.getOne)
Router.delete('/:id', bookController.deleteBook)

Router.post('/', upload.array('photos', 12), bookController.createBook)
Router.get('/', bookController.getAll)

module.exports = Router
