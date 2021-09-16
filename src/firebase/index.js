import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/analytics";
import "firebase/storage";
import "firebase/database";
import "firebase/auth";
import configJson from "./config.json";
import isEmpty from "lodash/isEmpty";

const version = "0.0.1";

let hostName;
let config;

let firestore;
let storage;
let auth;
let analytics;
let database;

let analyticsEvents;
let firestoreEvents;
let storageEvents;
let authEvents;

const hostName = window?.location?.hostname;

if (
  hostName.includes("-dev") ||
  hostName.includes("localhost") ||
  hostName.includes("run.app")
) {
  config = configJson.development;

  console.log("dev", version);
} else {
  config = configJson.production;

  console.log("prod", version);
}

if (isEmpty(firebase.apps)) {
  try {
    console.log("initializeApp", isEmpty(firebase.apps));
    firebase.initializeApp(config.firebase);

    firestore = firebase.firestore();
    database = firebase.database();
    storage = firebase.storage();
    auth = firebase.auth();

    if (typeof window !== "undefined") analytics = firebase.analytics();

    firestore.settings({ ignoreUndefinedProperties: true });
  } catch (error) {
    console.error("error initializeApp", error);
  }
  // Allow connection with events firebase
  try {
    firebase.initializeApp(config.firebaseEvents, "events");
    firestoreEvents = firebase.app("events").firestore();
    storageEvents = firebase.app("events").storage();
    authEvents = firebase.app("events").auth();

    if (typeof window !== "undefined") {
      analyticsEvents = firebase.app("events").analytics();
    }

    firestoreEvents.settings({ ignoreUndefinedProperties: true });
  } catch (error) {
    console.error("error initializeApp", error);
  }
}

if (hostName === "localhost") {
  config.serverUrl = config.serverUrlLocal;
  //firestore.useEmulator("localhost", 8080);
  //auth.useEmulator("http://localhost:9099/");
}

export {
  analyticsEvents,
  firestoreEvents,
  storageEvents,
  authEvents,
  firestore,
  analytics,
  database,
  firebase,
  hostName,
  version,
  storage,
  config,
  auth,
};
