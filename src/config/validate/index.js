const Joi = require('joi');

const bookSchema = Joi.object({
	id: Joi.string().default(''),
	name: Joi.string().min(3).max(50).required(),
	photos: Joi.array,
	genre: Joi.string().required(),
	author: Joi.string().required(),
	published_year: Joi.number().required(),
	publisher: Joi.string().required(),
	imported_date: Joi.string().required(),
	status: Joi.string().required(),
});

module.exports = { bookSchema };
