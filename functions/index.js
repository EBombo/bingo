const index = require("firebase-functions");
const api = require("./api");

const runtimeOptions = {
  timeoutSeconds: 60,
  memory: "256MB",
};

const apiRegion = "us-central1";

exports.api = index
    .runWith(runtimeOptions)
    .region(apiRegion)
    .https.onRequest(api.api);
