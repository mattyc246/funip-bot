import {
  Timestamp,
  collection,
  doc,
  getDocs,
  query,
  setDoc
} from 'firebase/firestore';
import { failedResponse, successResponse } from './axios.js';
import { db } from '../services/firebase.js';

const createProfile = async (data) => {
  if (!data) return failedResponse();
  try {
    const docRef = doc(collection(db, 'optimizer-links'));

    await setDoc(docRef, {
      id: docRef.id,
      ...data,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    return successResponse({});
  } catch (error) {
    console.log(error);
    return failedResponse();
  }
};

const getProfiles = async () => {
  const q = query(collection(db, 'optimizer-links'));

  try {
    const querySnapshot = await getDocs(q);
    const links = [];

    querySnapshot.forEach((doc) => {
      links.push(doc.data());
    });

    return successResponse({ links });
  } catch (error) {
    console.log(error);
    return failedResponse();
  }
};

export { createProfile, getProfiles };
