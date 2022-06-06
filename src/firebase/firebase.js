import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAbkwn07MHvt9w1rnsQ41dO6Xm919pNwZM',
  authDomain: 'start-react-e00f1.firebaseapp.com',
  projectId: 'start-react-e00f1',
  storageBucket: 'start-react-e00f1.appspot.com',
  messagingSenderId: '567950133721',
  appId: '1:567950133721:web:504734ab1a2237ee60b1c8',
  measurementId: 'G-BLH7G0CB2Z',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

initializeApp(firebaseConfig);

export const auth = getAuth();
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;
