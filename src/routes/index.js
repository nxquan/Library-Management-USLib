const bookRouter = require('./book.route');
const regulationRouter = require('./regulation.route');

function router(app) {
	app.use('/api/book', bookRouter);
	app.use('/api/reader', readerRouter);
	app.use('/api/regulation', regulationRouter);
	app.use('/api/genre', genreRouter);
}

module.exports = router;
