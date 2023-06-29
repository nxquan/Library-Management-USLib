const { bookSchema } = require('../config/validate');

const Genre = require('../app/model/Genre');

function validateBook(req, res, next) {
	const data = req.body;

	if (!data) return res.sendStatus(400);

	const { value, error } = bookSchema.validate(data);
	
	if (error) {
		return res.json({ error: error.details[0].message });
	}

	Genre.findWithCondition('name', data.genre).then((queryGenres) => {
		if (queryGenres.length == 0) {
			return res.json({
				msg: 'Loại sách không tồn tại',
				status: 200,
				result: false,
			});
		} else {
			next();
		}
	});
}

module.exports = validateBook;
