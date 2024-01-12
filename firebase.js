import Firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/database";
import "firebase/compat/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBv26enrFXhEoKjVPQCSy6aUp7aXG4oh0g",
    authDomain: "aefb-8f62f.firebaseapp.com",
    databaseURL: "https://aefb-8f62f-default-rtdb.firebaseio.com",
    projectId: "aefb-8f62f",
    storageBucket: "aefb-8f62f.appspot.com",
    messagingSenderId: "1030022035632",
    appId: "1:1030022035632:web:38499b47ae7aaf51c06375"
};

Firebase.initializeApp(firebaseConfig);

export default Firebase;
