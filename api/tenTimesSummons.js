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
import { db } from '../services/firebase.js';

const get10xData = async () => {
  const q = query(
    collection(db, '10x-events'),
    where('endDate', '>=', Timestamp.now()),
    where('active', '==', true),
    orderBy('endDate'),
    limit(1)
  );

  try {
    const querySnapshot = await getDocs(q);
    const events = [];

    querySnapshot.forEach((doc) => {
      events.push(doc.data());
    });

    return successResponse({ events });
  } catch (error) {
    console.log(error);
    return failedResponse();
  }
};

export { get10xData };
