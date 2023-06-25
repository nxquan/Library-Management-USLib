const { firestore } = require('../../config/db');
const {
	collection,
	getDocs,
	query,
	where,
	updateDoc,
	setDoc,
	getDoc,
	doc,
} = require('firebase/firestore/lite');

class User {
	static userRef = collection(firestore, `users`);
	static userUSRef = collection(firestore, 'us_students');

	constructor(id, password, ref, createdAt) {
		this.id = id;
		this.password = password;
		this.ref = ref;
		this.createdAt = createdAt;
	}

	//CRUD
	static async findUSOne(field, value) {
		try{
			const queryResultUS = query(this.userUSRef, where(field, '==', value));
			const querySnapshotUS = await getDocs(queryResultUS);

			if (!querySnapshotUS.empty) {
				return querySnapshotUS.docs.at(0).data();
			} else {
				return null;
			}
		catch(){
			return null;
		}
	}

	static async findOne(field, value) {
		const queryResult = query(this.userRef, where(field, '==', value));
		const querySnapshot = await getDocs(queryResult);

		if (!querySnapshot.empty) {
			return querySnapshot.docs.at(0).data();
		} else {
			return null;
		}
	}

	static async findById(value) {
		try {
			const docRef = doc(this.userRef, value);
			const docSnap = await getDoc(docRef);
			return docSnap.data();
		} catch (err) {
			return null;
		}
	}

	static async createOne(data) {
		const id = data.id;
		const currentDate = new Date();

		const newDocument = {
			...data,
			create_at: `${
				currentDate.getDate() < 10 ? '0' + currentDate.getDate() : currentDate.getDate()
			}/${
				currentDate.getMonth() + 1 < 10
					? '0' + (currentDate.getMonth() + 1)
					: currentDate.getMonth() + 1
			}/${currentDate.getFullYear()}`,
		};

		try {
			const newDocRef = doc(this.userRef, id);

			const result = await setDoc(newDocRef, newDocument);
			
			return true;
		} catch (er) {
			return false;
		}
	}

	static async updateOne(id, newData) {
		try {
			const queryResult = query(this.userRef, where('id', '==', id));
			const querySnapshot = await getDocs(queryResult);

			querySnapshot.forEach((doc) => {
				updateDoc(doc.ref, newData);
			});
			return true;
		} catch (er) {
			return false;
		}
	}
}

module.exports = User;
