const { Interaction, Book } = require('../model');

class InteractionController {
	// [POST] api/interaction
	async reserveBook(req, res) {
		let data = req.body;
		try {
			let book = await Book.findOne(data.book_id);
			if (book != null) {
				if (book.status == 'Con Hang') {
					let result = await Interaction.createReserve(data);

					if (result) {
						return res.json({
							msg: 'Đặt chỗ sách thành công',
							status: 201,
							result: true,
						});
					} else {
						return res.json({
							msg: 'Đặt chỗ sách thất bại',
							status: 201,
							result: false,
						});
					}
				} else
					return res.json({
						msg: 'Sách đã hết hàng',
						status: 201,
						result: false,
					});
			} else
				return res.json({
					msg: 'Mã sách không đúng',
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

	// [GET] api/interaction/:student_id
	async viewReserveBook(req, res) {
		let student_id = req.params.student_id;
		try {
			const result = await Interaction.findReserveBook(student_id);
			// Xử lý dữ liệu nhận được
			if (result.length > 0) {
				return res.json({
					reserveBook: result,
					result: true,
					status: 200,
				});
			} else
				return res.json({
					reserveBook: null,
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
