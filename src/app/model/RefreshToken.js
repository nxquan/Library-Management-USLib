const { firestore } = require('../../config/db')
const {
	collection,
	addDoc,
	doc,
	getDocs,
	deleteDoc,
	query,
	where,
} = require('firebase/firestore/lite')

class RefreshToken {
	static refreshTokenRef = collection(firestore, 'refresh_tokens')

	static async create(refreshToken) {
		await addDoc(this.refreshTokenRef, refreshToken)
	}

	static async findOne(token) {
		// Lấy dữ liệu từ bộ sưu tập "users"
		const querySnapshot = await getDocs(this.refreshTokenRef)
		let rs = null
		querySnapshot.forEach((doc) => {
			if (doc.data().token === token) rs = doc.data()
		})
		return rs
	}

	static async deleteOne(field, value) {
		try {
			const resultQuery = query(this.refreshTokenRef, where(field, '==', value))
			const querySnapshot = await getDocs(resultQuery)

			querySnapshot.forEach((doc) => {
				deleteDoc(doc.ref)
			})

			return true
		} catch (er) {
			return false
		}
	}
}

module.exports = RefreshToken
