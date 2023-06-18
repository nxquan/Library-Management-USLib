const { readerSchema, updateReaderSchema } = require('../config/validate');

function validateCreateReader(req, res, next) {
	const data = req.body;

	if (!data) return res.sendStatus(400);

	const { value, error } = readerSchema.validate(data);
	if (error) {
		return res.json({ error: error.details[0].message });
	}
	next();
}

function validateUpdateReader(req, res, next) {
	const data = req.body;

	if (!data) return res.sendStatus(400);

	const { value, error } = updateReaderSchema.validate(data);
	if (error) {
		return res.json({ error: error.details[0].message });
	}
	next();
}

module.exports = { validateCreateReader, validateUpdateReader };
