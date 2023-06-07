const bookRouter = require('./book.route');
const regulationRouter = require('./regulation.route');
const readerRouter = require('./reader.route');

function router(app) {
	app.use('/api/book', bookRouter);
	app.use('/api/reader', readerRouter);
	app.use('/api/regulation', regulationRouter);
}

module.exports = router;
