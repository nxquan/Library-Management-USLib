const { firestore } = require('../../config/db');
const { collection, addDoc, doc, getDoc, updateDoc, deleteDoc, getDocs } = require('firebase/firestore/lite');
const Book = require('./Book');

class ReserveBook {
	static reserveRef = collection(firestore, 'reserve_books');

	static async createReserve(data) {
		try {
			await addDoc(this.reserveRef, data);
			Book.updateOne(data.idBook, { status: 'Đã được đặt trước' });
			return true;
		} catch (er) {
			return false;
		}
	}
}

module.exports = new ReserveBook();
