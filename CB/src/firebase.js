// firebase.js

import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBattd8_1Aq0tD-TfsKYCnjA3VvqVVdP2w",
  authDomain: "evcheck-628d7.firebaseapp.com",
  projectId: "evcheck-628d7",
  storageBucket: "evcheck-628d7.appspot.com",
  messagingSenderId: "4643735454",
  appId: "1:4643735454:web:ce643a280d71c34a6b788f",
  // databaseURL: "https://evcheck-628d7-default-rtdb.asia-southeast1.firebasedatabase.app"
  databaseURL: "https://ev-buddy-wa-default-rtdb.firebaseio.com/"

};


const app = firebase.initializeApp(firebaseConfig);
const database = app.database();
const firestore = app.firestore();

export { app, database, firestore };
