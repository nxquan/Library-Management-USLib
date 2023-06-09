const Record = require('../model/Record');
const User = require('../model/User');
const Book = require('../model/Book');

class RecordController {
	// [POST] /api/record
	static isValidDate(createdDate, borrowedDate, expire) {
		const daysOfMonth = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
		const tokens = createdDate.split('/');
		let day = Number.parseInt(tokens[0]);
		let month = Number.parseInt(tokens[1]) + expire;
		let year = Number.parseInt(tokens[2]);

		if (month > 12) {
			month -= 12;
			year++;
		}

		if (year % 400 == 0 || (year % 4 == 0 && year % 100 != 0)) {
			daysOfMonth[2] = 29;
		}
		if (day >= daysOfMonth[month]) {
			day = 1;
		}

		const date1 = new Date(borrowedDate).getTime();
		const date2 = new Date(year, month - 1, day).getTime();

		if (date1 <= date2) {
			return true;
		}
		return false;
	}

	async createRecord(req, res) {
		const data = req.body;
		const id = data.student_id;

		// Checking studentId và name
		const user = await User.findOne('id', id);

		if (user) {
			// Check if student id is suitable for name
			if (user.name.toLowerCase() == data.name.toLowerCase()) {
				// Check if the expiration of account
				if (RecordController.isValidDate(user.createdAt, data.date, 6)) {
					const numberOfBook = await Record.getNumberOfBook(id, data.date);

					if (numberOfBook + data.book_ids.length <= 5) {
						const bookIds = data.book_ids;

						let isAllValid = true;
						await Promise.all(
							Array.from(bookIds).map(async (bookId) => {
								const book = await Book.findOne(bookId);

								if (book.number <= 0) {
									isAllValid = false;
									return res.json({
										status: 400,
										result: false,
										msg: `Sách ${book.name} đã hết!`,
									});
								}
							}),
						);

						if (isAllValid) {
							await Record.createOne(data);
							return res.json({
								status: 200,
								result: true,
								msg: 'Tạo phiếu mượn thành công',
							});
						}
					} else {
						return res.json({
							status: 200,
							result: false,
							msg: 'Sinh viên đã mượn hơn 5 cuốn sách trong 4 ngày qua',
						});
					}
				} else {
					return res.json({
						status: 200,
						result: false,
						msg: 'Thẻ độc giả đã hết hạn',
					});
				}
			} else {
				return res.json({
					status: 200,
					result: false,
					msg: 'Tên sinh viên không đúng với mã số',
				});
			}
		} else {
			return res.json({
				status: 200,
				result: false,
				msg: 'Mã số không tồn tại',
			});
		}
	}
}

module.exports = new RecordController();
