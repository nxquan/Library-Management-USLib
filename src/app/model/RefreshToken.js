const {firestore} = require('../../config/db');
const {collection, addDoc, getDocs} = require('firebase/firestore/lite');
class RefreshToken {
	async create(refreshToken) {
		addDoc(collection(firestore, 'refreshTokens'), {token: refreshToken})
			.then((docRef) => {
				console.log('Refresh token created with ID:', docRef.id);
				// Do something with the created token
			})
			.catch((error) => {
				console.error('Error creating refresh token:', error);
			});
	}

	async findOne(token) {
		const usersCollectionRef = collection(firestore, 'refreshTokens');

		// Lấy dữ liệu từ bộ sưu tập "users"
		const querySnapshot = await getDocs(usersCollectionRef);
		let rs = null;
		querySnapshot.forEach((doc) => {
			if (doc.data().token.token === token.token) rs = doc.data();
		});
		return rs;
	}
}

module.exports = new RefreshToken();
