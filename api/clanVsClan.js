import { db } from '../services/firebase.js';
import { failedResponse, successResponse } from './axios.js';
import {
  Timestamp,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where
} from 'firebase/firestore';

const getCvcData = async () => {
  const q = query(
    collection(db, 'clan-vs-clans'),
    where('endDate', '>=', Timestamp.now(), orderBy('createdAt'), limit(1))
  );

  try {
    const querySnapshot = await getDocs(q);
    const cvcs = [];

    querySnapshot.forEach((doc) => {
      cvcs.push(doc.data());
    });

    return successResponse({ cvcs });
  } catch (error) {
    console.log(error);
    return failedResponse();
  }
};

export { getCvcData };
