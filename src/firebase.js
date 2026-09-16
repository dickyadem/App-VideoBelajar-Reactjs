import { getAuth } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyDbm848-W8TITKICSP3EWz7kepXwn0uYjA',
  authDomain: 'videobelajar-d80db.firebaseapp.com',
  projectId: 'videobelajar-d80db',
  storageBucket: 'videobelajar-d80db.firebasestorage.app',
  messagingSenderId: '784690670202',
  appId: '1:784690670202:web:cc626b687c1a6edd9329c3',
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);