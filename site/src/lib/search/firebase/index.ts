import {
    SECRET_FIREBASE_API_KEY,
    SECRET_FIREBASE_AUTH_DOMAIN,
    SECRET_FIREBASE_PROJECT_ID,
    SECRET_FIREBASE_STORAGE_BUCKET,
    SECRET_FIREBASE_MESSAGING_SENDER_ID,
    SECRET_FIREBASE_APP_ID,
    SECRET_FIREBASE_MEASUREMENT_ID
} from '$env/static/private';

import { deleteApp, getApp, getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const config = {
    apiKey: SECRET_FIREBASE_API_KEY,
    authDomain: SECRET_FIREBASE_AUTH_DOMAIN,
    projectId: SECRET_FIREBASE_PROJECT_ID,
    storageBucket: SECRET_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: SECRET_FIREBASE_MESSAGING_SENDER_ID,
    appId: SECRET_FIREBASE_APP_ID,
    measurementId: SECRET_FIREBASE_MEASUREMENT_ID
};

let firebaseApp;

if (!getApps().length) {
    firebaseApp = initializeApp(config);
} else {
    firebaseApp = getApp();
    deleteApp(firebaseApp);
    firebaseApp = initializeApp(config);
}

export const db = getFirestore(firebaseApp);

export const COLL_SEMESTER = 'semester';
export const COLL_MODULES = 'modules';
export const COLL_STAFF = 'staff';
export const COLL_VENUES = 'venues';
export const SUB_COLL_SEMESTERS = 'semesters';

export { semesterIdToSemYear, getSemesterTitle } from './helper';
export { getModuleDoc } from './module';
export { getSemesters } from './semester';
export { getVenueLessons } from './venue';
