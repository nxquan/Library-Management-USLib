const Regulation = require('../model/Regulation');

class RegulationController {

	// [POST] api/regulation
	async createRegulation(req, res) {
		const data = req.body;

		try {
			const existingRugulations = await Regulation.findWithCondition('name', data.name);

			if (existingRugulations.length == 0) {
				await Regulation.createOne(data);
				return res.json({
					msg: 'Tạo thành công',
					status: 201,
					result: true,
				});
			} else {
				return res.json({
					msg: 'Quy định đã tồn tại',
					status: 201,
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

	// [DELETE] api/regulation/:id
	async deleteRegulation(req, res) {
		const id = req.params.id;

		try {
			const result = await Regulation.deleteOne(id);
			if (result) {
				return res.json({
					msg: 'Xóa thành công',
					status: 204,
					result: true,
				});
			} else {
				return res.json({
					msg: 'Không tìm lấy quy định để xóa',
					status: 204,
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

	// [GET] api/regulation
	async getAll(req, res) {
		try {
			const regulations = await Regulation.findAll();
			return res.json({
				data: {
					regulations,
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

	// [PATCH] api/regulation/:id
	async updateRegulation(req, res) {
		const id = req.params.id;
		const newData = req.body;

		try {
			await Regulation.updateOne(id, newData);
			return res.json({
				msg: 'Cập nhật thành công.',
				status: 201,
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
}

module.exports = new RegulationController();
