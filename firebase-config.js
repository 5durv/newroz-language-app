// إعدادات Firebase
const firebaseConfig = {
    apiKey: "AIzaSyCcCo2UClo2mFmbKARnEXyJr_owr60_2jk",
    authDomain: "newroz-f8117.firebaseapp.com",
    projectId: "newroz-f8117",
    storageBucket: "newroz-f8117.firebasestorage.app",
    messagingSenderId: "325281721491",
    appId: "1:325281721491:web:8a2dbc663c10533baef166"
};

// تهيئة Firebase
firebase.initializeApp(firebaseConfig);

// تصدير المتغيرات
window.auth = firebase.auth();
window.db = firebase.firestore();
