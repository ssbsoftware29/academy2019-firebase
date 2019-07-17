const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const firestore = admin.firestore()

const settings = {
  timestampsInSnapshots: true
}

firestore.settings(settings)


// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
 exports.helloWorld = functions.https.onRequest((request, response) => {
  response.send("Hello, who are you?");
 });

 exports.sayHelloWorld = functions.https.onRequest(async (req, res) => {
  res.status(200).send(`Hello world :D, my name is ${req.query.name}`)
 });

 //FUnção post
 exports.print_output = functions.https.onRequest(async (req, res) => {
   //var id = req.body.id
   //var title = req.body.title
   //var author = req.body.author

   //req.body.id
   //req.body.message
   //req.body.title

   const { message, id, title } = req.body

   res.status(200).send(`Message received! || Id: ${id} || Title: ${title} || Author: ${author}`)
 });

 //Função trigger

 exports.create_trigger = functions.auth.user().onCreate((user) => {
  const { uid, email, displayName } = user

  return firestore.doc(`users/${uid}`).set({ uid, email, displayName })
 });
