const { firestore, realTimeDatabase } = require('../../config/db');

const {
	collection,
	addDoc,
	doc,
	getDoc,
	updateDoc,
	deleteDoc,
	getDocs,
} = require('firebase/firestore/lite');
const Book = require('./Book');
const Record = require('./Record');
const Regulation = require('./Regulation');

class Interaction {
	static reserveRef = collection(firestore, 'reserve_books');

	static async createReserve(data) {
		try {
			// realtime database
			const db = realTimeDatabase.getDatabase();

			const ref = realTimeDatabase.ref(db, 'reserveBook');
			const newRecordRef = realTimeDatabase.push(ref);

			// Ghi dữ liệu vào key mới
			realTimeDatabase.set(newRecordRef, {
				student_id: data.student_id,
				name: data.name,
				book_id: data.book_id,
				receive_date: data.receive_date,
			});

			// firestore
			// await addDoc(this.reserveRef, data);
			// await Book.updateOne(data.book_id, { status: 'Đã được đặt trước' });
			return true;
		} catch (er) {
			return false;
		}
	}

	static async findReserveBook(student_id) {
		return new Promise((resolve, reject) => {
			const db = realTimeDatabase.getDatabase();
			const reserveBookRef = realTimeDatabase.ref(db, 'reserveBook');

			realTimeDatabase.onValue(
				reserveBookRef,
				(snapshot) => {
					const data = snapshot.val();
					const reserveBook = [];

					if (data) {
						// Lặp qua từng key trong dữ liệu
						Object.keys(data).forEach((key) => {
							const item = data[key];
							if (item.student_id === student_id) {
								reserveBook.push(item);
							}
						});
					}

					// Resolve với kết quả dữ liệu
					resolve(reserveBook);
				},
				(error) => {
					// Reject nếu có lỗi xảy ra
					reject(error);
				},
			);
		});
	}

	static async getHistory(student_id) {
		try {
			const Records = await Record.getAll();
			const History = [];

			for (const record of Records) {
				if (record.student_id === student_id) {
					for (const book_id of record.book_ids) {
						let data = {};
						data.borrow_date = record.date;
						data.book_id = book_id.id;
						data.return_date = book_id.return_date;
						data.is_return = book_id.is_return;
						History.push(data);
					}
				}
			}
			await Promise.all(
				History.map(async (item) => {
					let book = await Book.findOne(item.book_id);
					item.book = book;
				}),
			);

			if (History.length > 0) return History;
			return null;
		} catch (er) {
			return null;
		}
	}

	static async renewalBorrowBook(student_id, data) {
		let book_id = data.book_id;
		let date = data.date;
		let day = data.day;
		const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
		const regulationBorrow = await Regulation.findWithCondition('name', 'max_days_to_borrow');

		try {
			let result = null;
			const borrowed = await Record.findOne(['student_id', 'date'], [student_id, date]);
			let book_ids = borrowed.book_ids;
			book_ids.forEach((book) => {
				if (book.id === book_id) {
					const partsReturn = book.return_date.split('/');
					const existingDate = new Date(
						`${partsReturn[2]}-${partsReturn[1]}-${partsReturn[0]}`,
					);

					const newDate = new Date(existingDate.getTime() + day * 24 * 60 * 60 * 1000);
					const formattedDate = newDate.toLocaleDateString('en-GB', options);

					//kiểm tra quy định
					const partsBorrowed = date.split('/');
					const borrowedDate = new Date(
						`${partsBorrowed[2]}-${partsBorrowed[1]}-${partsBorrowed[0]}`,
					);
					const timediff = Math.abs(newDate.getTime() - borrowedDate.getTime());
					const diffDays = Math.ceil(timediff / (1000 * 60 * 60 * 24));
					if (regulationBorrow[0].current_value < diffDays) {
						result = `Số ngày mượn tối đa không được quá  ${regulationBorrow[0].current_value} ngày`;
					}
					book.return_date = formattedDate;
					book.is_return = false;
				}
			});
			if (result != null) {
				return result;
			}
			await Record.updateOne(borrowed.id, { book_ids: book_ids });
			return true;
		} catch (er) {
			return false;
		}
	}
}

module.exports = Interaction;
