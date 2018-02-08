const firebase = require("firebase");

const initializeFB = () => {
  let config = {
    apiKey: "AIzaSyDRCpjpBXCtkTVM9pz5SDSICn8DMw0_lvY",
    authDomain: "cs-go-33263.firebaseapp.com",
    databaseURL: "https://cs-go-33263.firebaseio.com",
    projectId: "cs-go-33263",
    storageBucket: "cs-go-33263.appspot.com",
    messagingSenderId: "284821237089"
  };

  firebase.initializeApp(config);
};

module.exports = initializeFB;
