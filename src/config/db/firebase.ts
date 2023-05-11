import { initializeApp } from "firebase/app";
import { getFirestore, CollectionReference, collection, DocumentData } from "firebase/firestore";
import { Todo } from "../../core/store/todoSlice";

const API_KEY = import.meta.env.VITE_API_KEY;
const AUTH_DOMAIN = import.meta.env.VITE_AUTH_DOMAIN;
const PROJECT_ID = import.meta.env.VITE_PROJECT_ID;
const STORAGE_BUCKET = import.meta.env.VITE_STORAGE_BUCKET;
const MESSAGING_SENDER_ID = import.meta.env.VITE_MESSAGING_SENDER_ID;
const APP_ID = import.meta.env.VITE_APP_ID;
const MEASURMENT_ID = import.meta.env.VITE_MEASURMENT_ID;

const firebaseConfig = {
  apiKey: API_KEY,
  authDomain: AUTH_DOMAIN,
  projectId: PROJECT_ID,
  storageBucket: STORAGE_BUCKET,
  messagingSenderId: MESSAGING_SENDER_ID,
  appId: APP_ID,
  measurementId: MEASURMENT_ID,
};

export const app = initializeApp(firebaseConfig);
export const firestore = getFirestore();

const createCollection = <T = DocumentData>(collectionName: string) => {
  return collection(firestore, collectionName) as CollectionReference<T>;
};
export const todos = createCollection<Todo>("todos");
export const db = getFirestore(app);
