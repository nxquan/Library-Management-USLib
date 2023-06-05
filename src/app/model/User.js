const { firestore } = require('../../config/db')
const { collection, getDocs } = require('firebase/firestore/lite')

class User {
	constructor(id, name, password, type, typeOfReader, birthday, address, email) {
		this.id = id
		this.name = name
		this.password = password
		this.type = type
		this.typeOfReader = typeOfReader
		this.birthday = birthday
		this.address = address
		this.email = email
	}
}

async function findOne(code) {
	const usersCollectionRef = collection(firestore, 'Users')

	// Lấy dữ liệu từ bộ sưu tập "users"
	const querySnapshot = await getDocs(usersCollectionRef)
	let rs = null
	querySnapshot.forEach((doc) => {
		if (doc.data().test === code) rs = doc.data()
	})
	return rs
}

const UserCollection = collection(firestore, `Users`)
const USStudentCollection = collection(firestore, 'USStudents')

module.exports = { User, UserCollection, findOne, USStudentCollection }
