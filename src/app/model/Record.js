const {
	collection,
	addDoc,
	query,
	where,
	getDocs,
	doc,
	updateDoc,
} = require('firebase/firestore/lite');
const { firestore } = require('../../config/db');
const Book = require('../model/Book');

class Record {
	static recordRef = collection(firestore, 'records');

	constructor(studentId, name, borrowedDate, books) {
		this.studentId = studentId;
		this.name = name;
		this.borrowedDate = borrowedDate;
		this.books = books;
	}

	static async createOne(data) {
		try {
			const bookIds = Array.from(data.book_ids);
			delete data.book_ids;

			// Decrease all books
			Promise.all(
				bookIds.map(async (bookId) => {
					const doc = await Book.findOne(bookId);
					let number = doc.number - 1;
					await Book.updateOne(bookId, { number: number });
				}),
			);

			const newBookids = bookIds.map((id) => {
				return {
					id,
					is_return: false,
					return_date: null,
				};
			});

			const document = {
				...data,
				book_ids: newBookids,
				is_return: false,
			};

			await addDoc(this.recordRef, document);
			return true;
		} catch (er) {
			return false;
		}
	}

	static getPreviousDay(date = new Date()) {
		const previous = new Date(date.getTime());
		previous.setDate(date.getDate() - 1);

		return `${previous.getDay()}/${previous.getMonth() + 1}/${previous.getFullYear()}`;
	}

	static async getNumberOfBook(id, date) {
		const days = [];
		days.push(date);

		for (let i = 0; i < 3; i++) {
			days.push(this.getPreviousDay(new Date(days[days.length - 1])));
		}

		try {
			const queryResult = query(
				this.recordRef,
				where('id', '==', id),
				where(date, 'in', days),
			);
			const querySnapshots = await getDocs(queryResult);

			let numberOfBook = 0;
			querySnapshots.forEach((doc) => {
				const data = doc.data();
				numberOfBook += data.books.length;
			});

			return numberOfBook;
		} catch (er) {
			return false;
		}
	}

	static async findOne(fields, values) {
		try {
			const conditions = Array.from(fields).map((field, index) => {
				return where(field, '==', values[index]);
			});

			const queryResult = query(this.recordRef, ...conditions);
			const querySnapshots = await getDocs(queryResult);

			return { ...querySnapshots.docs.at(0).data(), id: querySnapshots.docs.at(0).id };
		} catch (er) {
			console.log(er);
			return null;
		}
	}

	static async updateOne(id, newData) {
		try {
			const docRef = doc(this.recordRef, id);
			await updateDoc(docRef, newData);
			return true;
		} catch (er) {
			return false;
		}
	}
}

module.exports = Record;
