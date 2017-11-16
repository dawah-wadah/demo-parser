const firebase = require("firebase");

const initializeFB = () => {
  const firebaseConfig = {
    apiKey: "AIzaSyDRCpjpBXCtkTVM9pz5SDSICn8DMw0_lvY",
    authDomain: "cs-go-33263.firebaseapp.com",
    databaseURL: "https://cs-go-33263.firebaseio.com",
    projectId: "cs-go-33263",
    storageBucket: "",
    messagingSenderId: "284821237089"
  };

  firebase.initializeApp(firebaseConfig);
};

const firebaseConfig = {
  apiKey: "AIzaSyDRCpjpBXCtkTVM9pz5SDSICn8DMw0_lvY",
  authDomain: "cs-go-33263.firebaseapp.com",
  databaseURL: "https://cs-go-33263.firebaseio.com",
  projectId: "cs-go-33263",
  storageBucket: "",
  messagingSenderId: "284821237089"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

const fetchGrenades = (callback) => {
  let grenadesData;
  return db
    .ref("/grenades/de_dust2/High Explosive Grenade")
    .once("value", snapshot => {
      return snapshot.val()
    }).then(() => callback())
}
module.exports = initializeFB;
module.exports = fetchGrenades;
