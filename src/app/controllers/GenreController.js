const Genre = require('../model/Genre');

class GenreController {
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
					statusCode: 200,
					result: true,
				});
			} else {
				return res.json({
					msg: 'Loại sách đã tồn tại',
					statusCode: 200,
					result: true,
				});
			}
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống! Vui lòng thử lại sau.',
				statusCode: 200,
				result: true,
			});
		}
	}

	async deleteGenre(req, res) {
		const id = req.params.id;

		try {
			await Genre.deleteOne(id);
			return res.json({
				msg: 'Xóa thành công',
				statusCode: 200,
				result: true,
			});
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống! Vui lòng thử lại sau.',
				statusCode: 200,
				result: true,
			});
		}
	}

	async getAll(req, res) {
		try {
			const genres = await Genre.findAll();
			return res.json({
				data: {
					genres,
				},
				statusCode: 200,
				result: true,
			});
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống! Vui lòng thử lại sau.',
				statusCode: 200,
				result: true,
			});
		}
	}

	async updateGenre(req, res) {
		const id = req.params.id;
		const newData = req.body;

		try {
			await Genre.updateOne(id, newData);
			return res.json({
				msg: 'Cập nhật thành công.',
				statusCode: 200,
				result: true,
			});
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống! Vui lòng thử lại sau.',
				statusCode: 200,
				result: true,
			});
		}
	}
}

module.exports = new GenreController();
