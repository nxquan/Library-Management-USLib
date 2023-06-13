const { firestore } = require('../../config/db');
const { collection, getDocs, addDoc, query, where, updateDoc } = require('firebase/firestore/lite');

class User {
	static userRef = collection(firestore, `users`);
	static userUSRef = collection(firestore, 'us_students');

	constructor(id, name, password, type, typeOfReader, birthday, address, email, createdAt) {
		this.id = id;
		this.name = name;
		this.password = password;
		this.type = type;
		this.typeOfReader = typeOfReader;
		this.birthday = birthday;
		this.address = address;
		this.email = email;
		this.createdAt = createdAt;
	}

	//CRUD
	static async findUSOne(field, value) {
		const queryResultUS = query(this.userUSRef, where(field, '==', value));
		const querySnapshotUS = await getDocs(queryResultUS);

		if (!querySnapshotUS.empty) {
			return querySnapshotUS.docs.at(0).data();
		} else {
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

	static async createOne(data) {
		try {
			await addDoc(this.userRef, data);

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
