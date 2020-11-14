// const admin = require("firebase-admin")
// const serviceAccount = require("../firebase_permissions.json")

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://exchct-1d9d7.firebaseio.com"
// })


/**
 * Users will create a single profile and many jobs
 * Have a collection for jobs 
 * Each job will have an object of username, and email - immutable
 */