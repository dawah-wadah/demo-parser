import * as firebase from "firebase";
import * as deaths from './data.json';

export const initializeFB = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyDRCpjpBXCtkTVM9pz5SDSICn8DMw0_lvY",
    authDomain: "cs-go-33263.firebaseapp.com",
    databaseURL: "https://cs-go-33263.firebaseio.com",
    projectId: "cs-go-33263",
    storageBucket: "",
    messagingSenderId: "284821237089"
  };

  firebase.initializeApp(firebaseConfig);
}
