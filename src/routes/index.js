const readerRouter = require('./reader.route');

function router(app) {
	app.use('/api/reader', readerRouter);
}

module.exports = router;
