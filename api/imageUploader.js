import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadString
} from 'firebase/storage';
import { failedResponse, successResponse } from './axios.js';
import { storage } from '../services/firebase.js';

export const uploadImageFile = async (dataUrl, filename) => {
  if (!dataUrl || !filename) return failedResponse();
  try {
    const storageRef = ref(storage, `funip-images/${filename}`);

    // 'file' comes from the Blob or File API
    await uploadString(storageRef, dataUrl, 'data_url');

    const url = await getDownloadURL(storageRef);

    return successResponse({
      data: url
    });
  } catch (error) {
    console.log(error);
    return failedResponse();
  }
};
