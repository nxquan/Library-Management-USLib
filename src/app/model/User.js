const {firestore} = require('../../config/db');
const {collection, getDocs} = require('firebase/firestore/lite');

class User {
	constructor(username, password) {
		this.username = username;
		this.password = password;
	}
}
async function findOne(code) {
	const usersCollectionRef = collection(firestore, 'Users');

	// Lấy dữ liệu từ bộ sưu tập "users"
	const querySnapshot = await getDocs(usersCollectionRef);
	let rs = null;
	querySnapshot.forEach((doc) => {
		if (doc.data().test === code) rs = doc.data();
	});
	return rs;
}

const UserCollection = collection(firestore, `Users`);

module.exports = {User, UserCollection, findOne};
