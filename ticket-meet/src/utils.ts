import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCUwf6uWki4BwSqRALgQsSEDtisUaxyL-E",
    authDomain: "mmci-8b042.firebaseapp.com",
    projectId: "mmci-8b042",
    storageBucket: "mmci-8b042.firebasestorage.app",
    messagingSenderId: "824822454208",
    appId: "1:824822454208:web:774b01e8d5fd0a721d5a25",
    measurementId: "G-N8MDG5ZHYX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };