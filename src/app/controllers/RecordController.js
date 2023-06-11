const { Record, User, Book, Regulation } = require('../model');

class RecordController {
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
	// [POST] /api/record
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
					const maxNumberOfBook = await Regulation.findWithCondition(
						'name',
						'max_amount_of_borrowed_book',
					);
					
					if (numberOfBook + data.book_ids.length <= maxNumberOfBook[0].current_value) {
						const bookIds = data.book_ids;

						const resultQuery = [];
						await Promise.all(
							Array.from(bookIds).map(async (bookId) => {
								const book = await Book.findOne(bookId);

								if (book.number <= 0) {
									resultQuery.push(book);
								}
							}),
						);

						if (resultQuery.length == 0) {
							await Record.createOne(data);
							return res.json({
								status: 200,
								result: true,
								msg: 'Tạo phiếu mượn thành công',
							});
						} else {
							return res.json({
								status: 400,
								result: false,
								msg: `Sách ${resultQuery[0].name} đã hết!`,
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

	// [POST] /api/record/return
	async returnBook(req, res) {
		const data = req.body;
		const studentId = data.student_id;
		const date = data.date;
		const bookIds = Array.from(data.book_ids);

		const record = await Record.findOne(['student_id', 'date'], [studentId, date]);
		const recordId = record.id;
		delete record.id;

		if (record && record.is_return == false) {
			for (let i = 0; i < record.book_ids.length; i++) {
				const item = record.book_ids[i];

				if (bookIds.includes(item.id)) {
					if (item.is_return == false) {
						const currentDate = new Date();
						item.is_return = true;
						item.return_date = `${
							currentDate.getDate() < 10
								? '0' + currentDate.getDate()
								: currentDate.getDate()
						}/${
							currentDate.getMonth() + 1 < 10
								? '0' + (currentDate.getMonth() + 1)
								: currentDate.getMonth() + 1
						}/${currentDate.getFullYear()}`;
					} else {
						res.json({
							msg: `Mã sách ${item.id} đã được trả! Vui lòng kiểm tra lại!`,
							status: 200,
							result: false,
						});
						return;
					}
				}
			}

			const isFull = Array.from(record.book_ids).every((item) => {
				return item.is_return;
			});

			if (isFull) {
				record.is_return = true;
			}

			await Record.updateOne(recordId, record);
			return res.json({
				msg: 'Trả sách thành công!',
				status: 200,
				result: true,
			});
		} else {
			return res.json({
				msg: 'Phiếu mượn không tồn tại hoặc nó đã được hoàn tất!',
				status: 200,
				result: false,
			});
		}
	}

	// [GET] /api/record
	async getAll(req, res) {
		const data = req.body;
		const studentId = data.student_id;
		const date = data.date;
		try {
			const records = await Record.findOne(['student_id', 'date'], [studentId, date]);
			if(records) {
				return res.json({
					data: {
						records
					},
					status: 200,
					result: true
				})
			}else{
				return res.json({
					msg: "Không tìm thấy phiếu mượn nào",
					status: 200,
					result: false
				})
			}
			
		}catch(er) {
			return res.json({
				msg: "Xảy ra lỗi hệ thống. Vui lòng thử lại sau",
				status: 500,
				result: false
			})
		}
	}


}

module.exports = new RecordController();
