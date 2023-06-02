const firebase = require('firebase/app');
const config = require('../index');
const {getFirestore} = require('firebase/firestore/lite');

const app = firebase.initializeApp(config.firebaseConfig);
const firestore = getFirestore(app);

module.exports = {app, firestore};
