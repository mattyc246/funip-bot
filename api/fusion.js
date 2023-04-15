import {
  Timestamp,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where
} from 'firebase/firestore';
import { failedResponse, successResponse } from './axios.js';
import { db } from '../services/firebase.js';

const getFusionData = async () => {
  const q = query(
    collection(db, 'fusions'),
    where('endDate', '>=', Timestamp.now()),
    orderBy('endDate'),
    limit(1)
  );

  try {
    const querySnapshot = await getDocs(q);
    const fusions = [];

    querySnapshot.forEach((doc) => {
      fusions.push(doc.data());
    });

    return successResponse({ fusions });
  } catch (error) {
    console.log(error);
    return failedResponse();
  }
};

export { getFusionData };
