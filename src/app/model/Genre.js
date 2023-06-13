const { firestore } = require('../../config/db');
const {
	addDoc,
	getDoc,
	collection,
	doc,
	deleteDoc,
	getDocs,
	query,
	where,
	updateDoc,
	and,
} = require('firebase/firestore/lite');

class Genre {
	static genreRef = collection(firestore, 'genres');

	constructor(id, name, abbreviation) {
		this.id = id || ' ';
		this.abbreviation = abbreviation;
		this.name = name;
	}

	static async createOne(data) {
		try {
			await addDoc(this.genreRef, data);
			return true;
		} catch (er) {
			return false;
		}
	}

	static async findOne(id) {
		try {
			const docRef = doc(this.genreRef, id);
			const docSnap = await getDoc(docRef);

			return docSnap.data();
		} catch (er) {
			return null;
		}
	}

	static async findWithCondition(fields, values) {
		try {
			const type = typeof fields;
			let conditions = null;

			if (type === 'string') {
				conditions = [where(fields, '==', values)];
			} else if (Array.isArray(fields)) {
				conditions = fields.map((field, index) => {
					return where(field, '==', values[index]);
				});
			}

			const queryResult = query(this.genreRef, ...conditions);
			const querySnapshots = await getDocs(queryResult);

			const genres = [];
			querySnapshots.forEach((doc) => {
				const data = doc.data();
				data.id = doc.id;

				genres.push(data);
			});

			return genres;
		} catch (er) {
			return null;
		}
	}

	static async deleteOne(id) {
		try {
			const docRef = doc(this.genreRef, id);
			await deleteDoc(docRef);
			return true;
		} catch (er) {
			return false;
		}
	}

	static async updateOne(id, newData) {
		try {
			const docRef = doc(this.genreRef, id);
			await updateDoc(docRef, newData);
			return true;
		} catch (er) {
			return false;
		}
	}

	static async findAll() {
		try {
			const snapDocs = await getDocs(this.genreRef);
			const genres = [];
			snapDocs.forEach((doc) => {
				const data = doc.data();
				data.id = doc.id;

				genres.push(data);
			});
			return genres;
		} catch (er) {
			return null;
		}
	}
}

module.exports = Genre;
