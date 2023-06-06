const Regulation = require('../model/Regulation');

class RegulationController {
	async createRegulation(req, res) {
		const data = req.body;

		try {
			const existingRugulations = await Regulation.findWithCondition('name', data.name);

			if (existingRugulations.length == 0) {
				await Regulation.createOne(data);
				return res.json({
					msg: 'Tạo thành công',
					statusCode: 200,
					result: true,
				});
			} else {
				return res.json({
					msg: 'Quy định đã tồn tại',
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

	async deleteRegulation(req, res) {
		const id = req.params.id;

		try {
			await Regulation.deleteOne(id);
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
			const regulations = await Regulation.findAll();
			return res.json({
				data: {
					regulations,
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

	async updateRegulation(req, res) {
		const id = req.params.id;
		const newData = req.body;

		try {
			await Regulation.updateOne(id, newData);
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

module.exports = new RegulationController();
