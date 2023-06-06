const { bookSchema } = require('../config/validate')

function validateBook(req, res, next) {
	const data = req.body

	if (!data) return res.sendStatus(400)

	const { value, error } = bookSchema.validate(data)
	if (error) {
		return res.json({ error: error.details[0].message })
	}

	next()
}

module.exports = validateBook
