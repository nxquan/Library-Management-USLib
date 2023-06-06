const bookRouter = require('./book.route')

function router(app) {
	app.use('/api/book', bookRouter)
}

module.exports = router
