import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

var firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "react-slack-clone-84310.firebaseapp.com",
  databaseURL: "https://react-slack-clone-84310.firebaseio.com",
  projectId: "react-slack-clone-84310",
  storageBucket: "react-slack-clone-84310.appspot.com",
  messagingSenderId: "819132574858",
  appId: "1:819132574858:web:c65313a2856cb715271173",
  measurementId: "G-407H9H8RJ1",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

export default firebase;
