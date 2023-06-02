const {firestore} = require('../../config/db');
const {collection} = require('firebase/firestore/lite');

class User {
	constructor(username, password) {
		this.username = username;
		this.password = password;
	}
}

const UserCollection = collection(firestore, `Users`);

module.exports = {User, UserCollection};
