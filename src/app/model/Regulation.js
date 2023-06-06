const {firestore} = require('../../config/db');
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
} = require('firebase/firestore/lite');

class Regulation {
	static regulatonRef = collection(firestore, 'regulations');

	constructor(id, name, defaultValue, currentValue) {
		this.id = id || ' ';
		this.name = name;
		this.defaultValue = defaultValue;
		this.currentValue = currentValue;
	}

	static async createOne(data) {
		try {
			await addDoc(this.regulatonRef, data);
			return true;
		} catch (er) {
			return false;
		}
	}

	static async findOne(id) {
		try {
			const docRef = doc(this.regulatonRef, id);
			const docSnap = await getDoc(docRef);

			return docSnap.data();
		} catch (er) {
			return null;
		}
	}

	static async findWithCondition(field, value) {
		try {
			const queryResult = query(this.regulatonRef, where(field, '==', value));
			const querySnapshots = await getDocs(queryResult);

			const regulations = [];
			querySnapshots.forEach((doc) => {
				const data = doc.data();
				data.id = doc.id;

				regulations.push(data);
			});

			return regulations;
		} catch (er) {
			return null;
		}
	}

	static async deleteOne(id) {
		try {
			const docRef = doc(this.regulatonRef, id);
			await deleteDoc(docRef);
			return true;
		} catch (er) {
			return false;
		}
	}

	static async updateOne(id, newData) {
		try {
			const docRef = doc(this.regulatonRef, id);
			await updateDoc(docRef, newData);
			return true;
		} catch (er) {
			return false;
		}
	}

	static async findAll() {
		try {
			const snapDocs = await getDocs(this.regulatonRef);
			const regulations = [];
			snapDocs.forEach((doc) => {
				const data = doc.data();
				data.id = doc.id;

				regulations.push(data);
			});
			return regulations;
		} catch (er) {
			return null;
		}
	}
}

module.exports = Regulation;
