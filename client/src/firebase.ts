import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
  measurementId: import.meta.env.VITE_MEASUREMENT_ID,
};

export const appFire = initializeApp(firebaseConfig);
export const FIREBASE_DB = getFirestore(appFire);

export const COLLECTION__CONTRACTORS = collection(FIREBASE_DB, "contractors");
export const COLLECTION__SETTINGS_COMPANY = collection(FIREBASE_DB, "settingsCompany");
export const COLLECTION__SETTINGS_SITE = collection(FIREBASE_DB, "settingsSite");
export const COLLECTION__SETTINGS_INVOICE = collection(FIREBASE_DB, "settingsInvoice");
export const COLLECTION__SETTINGS_PAYMENT = collection(FIREBASE_DB, "settingsPayment");
export const COLLECTION__INVOICES = collection(FIREBASE_DB, "invoices");

