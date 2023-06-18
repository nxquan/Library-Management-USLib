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

const readerSchema = Joi.object({
	student_id: Joi.string().required(),
	fullName: Joi.string().max(50).required(),
	birthday: Joi.string().required(),
	address: Joi.string().required(),
	email: Joi.string().min(3).required().email(),
	dateCreated: Joi.string().required(),
	typeOfReader: Joi.string().required(),
});

const updateReaderSchema = Joi.object({
	fullName: Joi.string().max(50),
	birthday: Joi.string(),
	address: Joi.string(),
	email: Joi.string().min(3).email(),
	dateCreated: Joi.string(),
	typeOfReader: Joi.string(),
});

module.exports = { bookSchema, readerSchema, updateReaderSchema };
