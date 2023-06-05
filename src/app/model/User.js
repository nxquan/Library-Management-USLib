const { firestore } = require('../../config/db')
const { collection } = require('firebase/firestore/lite')

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

const UserCollection = collection(firestore, `Users`)
const USStudentCollection = collection(firestore, 'USStudents')

module.exports = { User, UserCollection, USStudentCollection }
