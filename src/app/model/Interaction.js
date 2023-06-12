const { firestore } = require('../../config/db');
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
			await addDoc(this.reserveRef, data);
			await Book.updateOne(data.book_id, { status: 'Đã được đặt trước' });
			return true;
		} catch (er) {
			return false;
		}
	}

	static async getHistory(student_id) {
		try {
			const Records = await Record.getAll();
			const History = [];

			for (const record of Records) {
				for (const book_id of record.book_ids) {
					let data = {};
					data.borrow_date = record.date;
					data.book_id = book_id.id;
					data.return_date = book_id.return_date;
					data.is_return = book_id.is_return;
					History.push(data);
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
					const existingDate = new Date(book.return_date);

					const newDate = new Date(existingDate.getTime() + day * 24 * 60 * 60 * 1000);
					const formattedDate = newDate.toLocaleDateString('en-GB', options);

					//kiểm tra quy định
					const timediff = Math.abs(newDate.getTime() - existingDate.getTime());
					const diffDays = Math.ceil(timediff / (1000 * 60 * 60 * 24));
					if (regulationBorrow[0].current_value < diffDays) {
						result = `Số ngày mượn tối đa không được quá + ${regulationBorrow[0].current_value}`;
					}
					book.return_date = formattedDate;
				}
			});
			if (result != null) {
				return result;
			}
			await Record.updateOne(result.id, { book_ids: book_ids });
			return true;
		} catch (er) {
			return false;
		}
	}
}

module.exports = Interaction;
