import { Timestamp, collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase.js';
import { failedResponse, successResponse } from './axios.js';

const createTotwEntry = async (data) => {
  if (!data) return failedResponse();
  try {
    const docRef = doc(collection(db, 'team-of-the-week'));

    await setDoc(docRef, {
      id: docRef.id,
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    return successResponse();
  } catch (error) {
    console.log(error);
    return failedResponse();
  }
};

export { createTotwEntry };
