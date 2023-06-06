const Reader = require('../model/Reader');

class ReaderController {
	// [POST] /api/reader
	async createReader(req, res) {
		const data = req.body;
		try {
			const createReader = await Reader.createOne(data);
			if (createReader)
				return res.json({
					msg: 'Lập thẻ độc giả thành công!',
					status: 201,
					result: true,
				});
			else
				return res.json({
					msg: 'Lập thẻ độc giả thất bại! Vui lòng thử lại.',
					status: 201,
					result: false,
				});
		} catch (er) {
			console.log(er);
		}
	}

	// [PATCH] /api/reader/:id
	async updateReader(req, res) {
		const id = req.params.id;
		const newData = req.body;

		try {
			const updateReader = await Reader.updateOne(id, newData);
			if (updateReader)
				return res.json({
					msg: 'Cập nhật thẻ độc giả thành công!',
					status: 204,
					result: true,
				});
			else
				return res.json({
					msg: 'Cập nhật thẻ độc giả thất bại! Vui lòng thử lại.',
					status: 204,
					result: false,
				});
		} catch (er) {
			console.log(er);
		}
	}

	// [DELETE] /api/reader/:id
	async deleteReader(req, res) {
		const id = req.params.id;
		try {
			const deleteReader = await Reader.deleteOne(id);

			if (deleteReader)
				return res.json({
					msg: 'Xoá thẻ độc giả thành công!',
					status: 200,
					result: true,
				});
			else
				return res.json({
					msg: 'Xoá thẻ độc giả thất bại! Vui lòng thử lại.',
					status: 200,
					result: false,
				});
		} catch (er) {
			console.log(er);
		}
	}

	async findOneReader(req, res) {
		const id = req.params.id;

		try {
			const reader = await Reader.findOne(id);
			console.log(reader);
			if (reader != false)
				return res.json({
					reader,
				});
			else
				return res.json({
					msg: 'Không tìm thấy độc giả này!',
					status: 200,
					result: false,
				});
		} catch (er) {
			console.log(er);
		}
	}
}

module.exports = new ReaderController();
