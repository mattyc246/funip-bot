import { query, collection, getDocs } from 'firebase/firestore';
import { db } from '../services/firebase.js';
import { failedResponse, successResponse } from './axios.js';

const fetchClans = async () => {
  const q = query(collection(db, 'clans'));

  try {
    const querySnapshot = await getDocs(q);
    const clans = [];

    querySnapshot.forEach((doc) => {
      clans.push(doc.data());
    });

    return successResponse({ clans });
  } catch (error) {
    console.log(error);
    return failedResponse();
  }
};

export { fetchClans };
