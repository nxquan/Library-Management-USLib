const { firestore } = require('../../config/db');
const {
	collection,
	getDoc,
	getDocs,
	setDoc,
	updateDoc,
	deleteDoc,
	doc,
	
} = require('firebase/firestore/lite');

class Reader {
	static readerRef = collection(firestore, 'readers');

	constructor(fullName, typeOfReader, birthday, address, email, dateCreated) {
		this.fullName = fullName;
		this.typeOfReader = typeOfReader;
		this.birthday = birthday;
		this.address = address;
		this.email = email;
		this.dateCreated = dateCreated;
	}

	static async createOne(data) {
		const id = data.student_id;
		delete data.student_id;
		const currentDate = new Date();

		const newDocument = {
			...data,
			createAt: `${
				currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()
			}/${
				currentDate.getMonth() + 1 < 10
					? '0' + (currentDate.getMonth() + 1)
					: currentDate.getMonth() + 1
			}/${currentDate.getFullYear()}`,
		};
		try {
			const newDocRef = doc(this.readerRef, id);
			await setDoc(newDocRef, newDocument);
			return true;
		} catch (er) {
			return false;
		}
	}

	static async updateOne(id, newData) {
		const currentDate = new Date();

		const newDocument = {
			...newData,
			updateAt: `${
				currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()
			}/${
				currentDate.getMonth() + 1 < 10
					? '0' + (currentDate.getMonth() + 1)
					: currentDate.getMonth() + 1
			}/${currentDate.getFullYear()}`,
		};
		try {
			const docRef = doc(this.readerRef, id);
			await updateDoc(docRef, newDocument);

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

	static async findSome(filter = {}) {
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

			if (readers.length > 0) return readers;
			return null;
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
				data.id = doc.id;
				readers.push(data);
			});

			return readers;
		} catch (er) {
			return null;
		}
	}
}

module.exports = Reader;
