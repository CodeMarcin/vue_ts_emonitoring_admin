import { computed } from "vue";
import { initializeApp } from "firebase/app";
import { getFirestore, collection } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAY7OAcoACBOYD7ZPPwk5Wd1JL18pvr2U0",
  authDomain: "e-monitoring-24.firebaseapp.com",
  projectId: "e-monitoring-24",
  storageBucket: "e-monitoring-24.appspot.com",
  messagingSenderId: "815864395949",
  appId: "1:815864395949:web:8ceb6a7c506e70be95ae24",
  measurementId: "G-E4PR0XQGRD",
};

export const appFire = initializeApp(firebaseConfig);
const db = getFirestore(appFire);

export const COLLECTION__CONTRACTORS = collection(db, "contractors");
export const COLLECTION__SETTINGS_COMPANY = collection(db, "settingsCompany");
export const COLLECTION__SETTINGS_SITE = collection(db, "settingsSite");
export const COLLECTION__SETTINGS_INVOICE = collection(db, "settingsInvoice");
export const COLLECTION__SETTINGS_PAYMENT = collection(db, "settingsPayment");
export const COLLECTION__INVOICES = collection(db, "invoices");
// export const COLLECTION__CONTRACTORS = (document?: string) => {
//   return document ? collection(db, "contractors", document) : collection(db, "contractors");

// };
