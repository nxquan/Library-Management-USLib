const { firestore } = require('../../config/db');
const { collection, getDoc, getDocs, addDoc, updateDoc, deleteDoc, doc } = require('firebase/firestore/lite');

class Reader {
	static readerRef = collection(firestore, 'readers');

	constructor(id, fullName, typeOfReader, birthday, address, email, dateCreatedCard) {
		this.id = id;
		this.fullName = fullName;
		this.typeOfReader = typeOfReader;
		this.birthday = birthday;
		this.address = address;
		this.email = email;
		this.dateCreatedCard = dateCreatedCard;
	}

	static async createOne(data) {
		try {
			await addDoc(this.readerRef, data);
			return true;
		} catch (er) {
			return false;
		}
	}

	static async updateOne(id, newData) {
		try {
			const docRef = doc(this.readerRef, id);
			await updateDoc(docRef, newData);

			return true;
		} catch (er) {
			return false;
		}
	}

	static async deleteOne(id) {
		try {
			const docRef = doc(this.readerRef, id);
			await deleteDoc(docRef);

			return true;
		} catch (er) {
			return false;
		}
	}

	static async findOne(id) {
		try {
			const docRef = doc(this.readerRef, id);
			const snapDoc = await getDoc(docRef);

			return snapDoc.data();
		} catch (er) {
			return false;
		}
	}

	static async findSome(filtẻ = {}) {
		try {
			const snapDocs = await getDocs(this.readerRef);
			const readers = [];

			snapDocs.forEach((doc) => {
				const data = doc.data();
				let isValid = true;

				Object.keys(filter).forEach((key) => {
					const type = typeof filter[key];
					if (isValid == false) return;

					if (type === 'string') {
						isValid = data[key].toLowerCase().includes(filter[key].toLowerCase());
					} else if (type === 'number') {
						isValid = data[key] == filter[key];
					}
				});

				if (isValid) {
					data.id = doc.id;
					readers.push(data);
				}
			});

			return readers;
		} catch (er) {
			return null;
		}
	}

	static async getAll() {
		try {
			const snapDocs = await getDocs(this.readerRef);
			let readers = [];

			snapDocs.forEach((doc) => {
				let data = doc.data();
				let reader = new Reader(
					data.id,
					data.fullName,
					data.typeOfReader,
					data.birthday,
					data.address,
					data.email,
					data.dateCreatedCard,
				);
				readers.push(reader);
			});

			return readers;
		} catch (er) {
			return null;
		}
	}
}

module.exports = Reader;
