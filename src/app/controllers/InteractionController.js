const { Interaction, Book } = require('../model');

class InteractionController {
	// [POST] api/interaction
	async reserveBook(req, res) {
		let data = req.body;
		try {
			let book = await Book.findOne(data.book_id);
			if (book != null) {
				if (book.satus == 'Con hang') {
					let result = await Interaction.createReserve(data);

					if (result) {
						res.json({
							msg: 'Đặt chỗ sách thành công',
							status: 201,
							result: true,
						});
					} else {
						res.json({
							msg: 'Đặt chỗ sách thất bại',
							status: 201,
							result: false,
						});
					}
				} else
					res.json({
						msg: 'Sách đã hết hàng',
						status: 201,
						result: false,
					});
			} else
				res.json({
					msg: 'Mã sách không đúng',
					status: 201,
					result: false,
				});
		} catch (er) {
			console.log(er);
		}
	}

	// [GET] api/interaction/:id
	async viewHistory(req, res) {
		let student_id = req.params.id;
		try {
			const History = await Interaction.getHistory(student_id);

			if (History !== null) {
				res.json({
					History: History,
					result: true,
					status: 200,
				});
			} else {
				res.json({
					History: null,
					result: false,
					status: 200,
				});
			}
		} catch (er) {
			console.log(er);
		}
	}

	// [PATCH] api/interaction/:student_id
	async renewalBorrowBook(req, res) {
		let student_id = req.params.student_id;
		let data = req.body;

		try {
			const result = await Interaction.renewalBorrowBook(student_id, data);
			console.log(result);
			if (result == true) {
				res.json({
					msg: 'Xin gia hạn sách thành công!',
					status: 200,
					result: true,
				});
			} else if (!result) {
				res.json({
					msg: 'Xin gia hạn sách thất bại!',
					status: 200,
					result: false,
				});
			} else {
				res.json({
					msg: result,
					status: 200,
					result: false,
				});
			}
		} catch (er) {
			console.log(er);
		}
	}
}

module.exports = new InteractionController();
