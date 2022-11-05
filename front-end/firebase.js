import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyB4r7xrjYQ3UqvjV8-Gt2vEeBmHDUwQDfc",
    authDomain: "easymed-ba8ad.firebaseapp.com",
    projectId: "easymed-ba8ad",
    storageBucket: "easymed-ba8ad.appspot.com",
    messagingSenderId: "1028289053908",
    appId: "1:1028289053908:web:91b073ae2467d3436d6741"
  };

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}

const app = initializeApp(firebaseConfig);
const firebase_app = firebase
export {app, firebase_app}