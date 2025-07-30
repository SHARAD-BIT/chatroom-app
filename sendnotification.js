const admin = require("firebase-admin");
const serviceAccount = require("./path/to/your-firebase-adminsdk.json"); // <- point to downloaded JSON

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const message = {
  token: "DEVICE_FCM_TOKEN", // Replace with actual device token
  notification: {
    title: "New Message",
    body: "You have a new message in ChatRoom!"
  }
};

admin.messaging().send(message)
  .then(response => {
    console.log("Successfully sent message:", response);
  })
  .catch(error => {
    console.error("Error sending message:", error);
  });