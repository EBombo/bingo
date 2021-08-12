import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";
import configJson from "./config.json";
import get from "lodash/get";
import isEmpty from "lodash/isEmpty";

const version = "0.0.1";

let hostName;
let config;
let firestore;
let storage;
let auth;
let analytics;

try {
    hostName = process.env.NODE_ENV === "development"
        ? "localhost"
        : get(process, "env.GCLOUD_PROJECT", "");

    if (typeof window !== "undefined")
        hostName = window.location.hostname.replace("subdomain.", "");

    console.log("projectId", hostName);
} catch (error) {
    console.log("Error environment", error);
}

if ((hostName.includes("-dev") || hostName.includes("localhost"))) {
    config = configJson.development;
    console.log("dev");
} else {
    config = configJson.production;
    console.log("prod");
}

if (isEmpty(firebase.apps)) {
    try {
        console.log("initializeApp", isEmpty(firebase.apps));
        firebase.initializeApp(config.firebase);

        firestore = firebase.firestore();
        storage = firebase.storage();
        auth = firebase.auth();

        if (typeof window !== "undefined")
            analytics = firebase.analytics();

        firestore.settings({ignoreUndefinedProperties: true});
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
    firestore,
    analytics,
    firebase,
    hostName,
    version,
    storage,
    config,
    auth,
};
