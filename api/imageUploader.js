import cloudinary from 'cloudinary';
import { failedResponse, successResponse } from './axios.js';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export const uploadImageFile = async (dataUrl, filename) => {
  if (!dataUrl || !filename) return failedResponse();
  try {
    const response = await cloudinary.v2.uploader.upload(dataUrl, {
      public_id: filename.split('.')[0]
    });

    const url = response.secure_url;

    return successResponse({
      data: url
    });
  } catch (error) {
    console.log(error);
    return failedResponse();
  }
};
