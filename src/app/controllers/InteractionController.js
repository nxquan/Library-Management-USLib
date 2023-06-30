const { Interaction } = require('../model');

class InteractionController {
	// [POST] api/interaction
	async requestReader(req, res) {
		let data = req.body;
		try {
			let result = await Interaction.createRequest(data);
			if (result) {
				return res.json({
					msg: 'Yêu cầu lập thẻ độc giả thành công.',
					status: 201,
					result: true,
				});
			} else {
				return res.json({
					msg: 'Yêu cầu lập thẻ độc giả thất bại, vui lòng thử lại',
					status: 201,
					result: false,
				});
			}
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
				status: 500,
				result: false,
			});
		}
	}

	// [GET] api/interaction/request
	async viewRequestCreate(req, res) {
		try {
			const result = await Interaction.findRequest();
			// Xử lý dữ liệu nhận được
			if (result.length > 0) {
				return res.json({
					request: result,
					result: true,
					status: 200,
				});
			} else
				return res.json({
					msg: 'Không có yêu cầu lập thẻ độc giả nào',
					result: false,
					status: 200,
				});
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
				status: 500,
				result: false,
			});
		}
	}

	async deleteRequest(req, res) {
		let id = req.params.student_id;
		try {
			const result = await Interaction.deleteRequest(id);
			// Xử lý dữ liệu nhận được
			if (result === true) {
				return res.json({
					msg: 'Xóa thành công',
					result: true,
					status: 200,
				});
			} else
				return res.json({
					msg: 'Xóa thất bại',
					result: false,
					status: 200,
				});
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
				status: 500,
				result: false,
			});
		}
	}

	// [GET] api/interaction/book/:student_id
	async viewHistory(req, res) {
		let student_id = req.params.student_id;
		try {
			const History = await Interaction.getHistory(student_id);

			if (History !== null) {
				return res.json({
					History: History,
					result: true,
					status: 200,
				});
			} else {
				return res.json({
					History: null,
					result: false,
					status: 200,
				});
			}
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
				status: 500,
				result: false,
			});
		}
	}

	// [PATCH] api/interaction/:student_id
	async renewalBorrowBook(req, res) {
		let student_id = req.params.student_id;
		let data = req.body;

		try {
			const result = await Interaction.renewalBorrowBook(student_id, data);
			if (result == true) {
				return res.json({
					msg: 'Xin gia hạn sách thành công!',
					status: 200,
					result: true,
				});
			} else if (!result) {
				return res.json({
					msg: 'Xin gia hạn sách thất bại!',
					status: 200,
					result: false,
				});
			} else {
				return res.json({
					msg: result,
					status: 200,
					result: false,
				});
			}
		} catch (er) {
			return res.json({
				msg: 'Xảy ra lỗi hệ thống. Vui lòng thử lại sau.',
				status: 500,
				result: false,
			});
		}
	}
}

module.exports = new InteractionController();
