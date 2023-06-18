const { Genre } = require('../model');

class GenreController {
	// [POST] /api/genre
	async createGenre(req, res) {
		const data = req.body;

		try {
			const existingRugulations = await Genre.findWithCondition(
				['abbreviation', 'name'],
				[data.abbreviation, data.name],
			);

			if (existingRugulations.length == 0) {
				await Genre.createOne(data);
				return res.json({
					msg: 'Tạo thành công',
					status: 201,
					result: true,
				});
			} else {
				return res.json({
					msg: 'Loại sách đã tồn tại',
					status: 200,
					result: true,
				});
			}
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống! Vui lòng thử lại sau.',
				status: 500,
				result: false,
			});
		}
	}

	// [DELETE] /api/genre/:id
	async deleteGenre(req, res) {
		const id = req.params.id;

		try {
			const result = await Genre.deleteOne(id);
			if (result) {
				return res.json({
					msg: 'Xóa thành công',
					status: 204,
					result: true,
				});
			} else {
				return res.json({
					msg: 'Không tìm thấy loại sách để xóa',
					status: 204,
					result: false,
				});
			}
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống! Vui lòng thử lại sau.',
				status: 500,
				result: false,
			});
		}
	}

	// [GET] /api/genre
	async getAll(req, res) {
		try {
			const genres = await Genre.findAll();
			return res.json({
				data: {
					genres,
				},
				status: 200,
				result: true,
			});
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống! Vui lòng thử lại sau.',
				status: 500,
				result: false,
			});
		}
	}

	// [PATCH] /api/genre/:id
	async updateGenre(req, res) {
		const id = req.params.id;
		const newData = req.body;

		try {
			await Genre.updateOne(id, newData);
			return res.json({
				msg: 'Cập nhật thành công.',
				status: 201,
				result: true,
			});
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống! Vui lòng thử lại sau.',
				status: 500,
				result: true,
			});
		}
	}
}

module.exports = new GenreController();
