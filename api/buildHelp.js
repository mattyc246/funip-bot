import {
  Timestamp,
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  updateDoc,
  where
} from 'firebase/firestore';
import { failedResponse, successResponse } from './axios.js';
import { db } from '../services/firebase.js';

const getUserReminder = async (authorId) => {
  const q = query(
    collection(db, 'reminders'),
    where('authorId', '==', authorId)
  );

  try {
    const querySnapshot = await getDocs(q);
    const reminders = [];

    querySnapshot.forEach((doc) => {
      reminders.push(doc.data());
    });

    return successResponse({ reminder: reminders[0] });
  } catch (error) {
    console.log(error);
    return failedResponse();
  }
};

const createUserReminder = async (authorId) => {
  try {
    const docRef = doc(collection(db, 'reminders'));

    await setDoc(docRef, {
      id: docRef.id,
      authorId,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });

    return successResponse({});
  } catch (error) {
    console.log(error);
    return failedResponse();
  }
};

const updateUserReminder = async (authorId) => {
  const q = query(
    collection(db, 'reminders'),
    where('authorId', '==', authorId)
  );

  try {
    const querySnapshot = await getDocs(q);
    const reminders = [];

    querySnapshot.forEach((doc) => {
      reminders.push(doc.data());
    });

    await updateDoc(doc(db, 'reminders', reminders[0].id), {
      updatedAt: Timestamp.now()
    });

    return successResponse({});
  } catch (error) {
    console.log(error);
    return failedResponse();
  }
};

export { getUserReminder, createUserReminder, updateUserReminder };
