const firebaseConfig = {
    apiKey: "AIzaSyCBT-0tfysfr0BXYPaon19RD_UCyuaOU-g",
    authDomain: "zameenghar-f0db2.firebaseapp.com",
    projectId: "zameenghar-f0db2",
    storageBucket: "zameenghar-f0db2.firebasestorage.app",
    messagingSenderId: "714760558509",
    appId: "1:714760558509:web:6352cafa089f5f50153324"
  };
  
  firebase.initializeApp(firebaseConfig);
  
  const auth = firebase.auth();
  const db = firebase.firestore();
  const storage = firebase.storage();
  
  console.log("Firebase Connected ✅");