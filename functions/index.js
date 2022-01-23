const functions = require("firebase-functions");
const application = require("firebase/app");
const authentication = require("firebase/auth")
const db = require("firebase/firestore");
// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBSPi7HshSXctzH0uVIFQULM7jjXBzUrzM",
  authDomain: "cloud-function-demo-c8898.firebaseapp.com",
  projectId: "cloud-function-demo-c8898",
  storageBucket: "cloud-function-demo-c8898.appspot.com",
  messagingSenderId: "49981668436",
  appId: "1:49981668436:web:e4fef1195433c3297301c1"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
const app = application.initializeApp(firebaseConfig)
const database = db.getFirestore(app)
const auth = authentication.getAuth()




// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send(`Hello from Firebase! - Your request is ${request.method} - ${request.body}`);
});

exports.authUser = functions.https.onRequest((req, res) => {
      authentication.signInWithEmailAndPassword(auth, req.body.email, req.body.password)
        .then((credentials) => console.log(credentials))
        .catch((err) => console.log(err));
})


exports.addUser = functions.https.onRequest(async (request, response) => {
  console.log(request.body)
  if (request.method == 'GET') {
    const resData = []
    const querySnapshot = await db.getDocs(db.collection(database, 'users'))
    querySnapshot.forEach((doc) => {
      resData.push({ ...doc.data(), id: doc.id })
    })
    response.send(resData)
  }
  else if(request.method == 'POST'){
    const querySnapshot = await db.addDoc(db.collection(database, 'users'), request.body)
    console.log(querySnapshot.id)
    response.send(`Data Posted successful!`)
  }
  else if(request.method == 'PUT'){
    await db.updateDoc(db.doc(database, 'users', `${request.url.split('/')[1]}`), request.body)
  }
  else{
      await db.deleteDoc(db.doc(database, 'users', `${request.url.split('/')[1]}`))
      response.send("Data Deleted Successfully!")
  }

})



