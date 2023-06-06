const bookRouter = require('./book.route');
const regulationRouter = require('./regulation.route');

function router(app) {
	app.use('/api/book', bookRouter);
	app.use('/api/regulation', regulationRouter);
}

module.exports = router;
