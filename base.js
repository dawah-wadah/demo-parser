const firebase = require("firebase");

// const initializeFB = () => {
//   const firebaseConfig = {
//     apiKey: "AIzaSyDRCpjpBXCtkTVM9pz5SDSICn8DMw0_lvY",
//     authDomain: "cs-go-33263.firebaseapp.com",
//     databaseURL: "https://cs-go-33263.firebaseio.com",
//     projectId: "cs-go-33263",
//     storageBucket: "",
//     messagingSenderId: "284821237089"
//   };
//
//   firebase.initializeApp(firebaseConfig);
// };

const firebaseConfig = {
  apiKey: "AIzaSyDRCpjpBXCtkTVM9pz5SDSICn8DMw0_lvY",
  authDomain: "cs-go-33263.firebaseapp.com",
  databaseURL: "https://cs-go-33263.firebaseio.com",
  projectId: "cs-go-33263",
  storageBucket: "",
  messagingSenderId: "284821237089"
};

firebase.initializeApp(firebaseConfig);

let db = firebase.database();

const fetchGrenades = () => {
  return db
    .ref("/hlebopek/de_dust2/Terrorist/deaths")
    .once('value')
    .then(snapshot => snapshot.val());

}
// module.exports = initializeFB;
module.exports = fetchGrenades;
