const firebase = require('firebase/app');
const config = require('../index');
const { getFirestore } = require('firebase/firestore/lite');

const app = firebase.initializeApp(config.firebaseConfig);
const firestore = getFirestore(app);

const realTimeDatabase = require('firebase/database');

module.exports = { app, firestore, realTimeDatabase };
