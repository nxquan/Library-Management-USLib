const bookRouter = require('./book.route');
const readerRouter = require('./reader.route');
const regulationRouter = require('./regulation.route');
const genreRouter = require('./genre.route');
const recordRouter = require('./record.route');

function router(app) {
	app.use('/api/book', bookRouter);
	app.use('/api/reader', readerRouter);
	app.use('/api/regulation', regulationRouter);
	app.use('/api/genre', genreRouter);
	app.use('/api/record', recordRouter);
}

module.exports = router;
