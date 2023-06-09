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
			return res.json({
				msg: 'Xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
				status: 500,
				result: false,
			});
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
					status: 201,
					result: true,
				});
			else
				return res.json({
					msg: 'Cập nhật thẻ độc giả thất bại! Vui lòng thử lại.',
					status: 201,
					result: false,
				});
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
				status: 500,
				result: false,
			});
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
					status: 204,
					result: true,
				});
			else
				return res.json({
					msg: 'Xoá thẻ độc giả thất bại! Vui lòng thử lại.',
					status: 204,
					result: false,
				});
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
				status: 500,
				result: false,
			});
		}
	}

	// [GET] api/reader/:id
	async findOneReader(req, res) {
		const id = req.params.id;

		try {
			const reader = await Reader.findOne(id);

			if (reader !== undefined)
				return res.json({
					reader,
					status: 200,
					result: true,
				});
			else
				return res.json({
					msg: 'Không tìm thấy độc giả này!',
					status: 200,
					result: false,
				});
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
				status: 500,
				result: false,
			});
		}
	}

	// [GET] api/reader
	async getAllReader(req, res) {
		try {
			const result = await Reader.getAll();
			if (result !== null) {
				return res.json({
					readers: result,
					status: 200,
					result: true,
				});
			} else
				return res.json({
					msg: 'Có lỗi xảy ra, vui lòng thử lại!',
					status: 200,
					result: false,
				});
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
				status: 500,
				result: false,
			});
		}
	}

	// [GET] api/reader/search
	async search(req, res) {
		const filter = req.query;

		try {
			const result = await Reader.findOne(filter);
			if (result !== null) {
				return res.json({
					readers: result,
					status: 200,
					result: true,
				});
			} else
				return res.json({
					msg: 'Có lỗi xảy ra, vui lòng thử lại!',
					status: 200,
					result: false,
				});
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
				status: 500,
				result: false,
			});
		}
	}
}

module.exports = new ReaderController();
