import {
  failedResponse,
  apiClient,
  HTTP_STATUS_OK,
  successResponse
} from './axios.js';

const uploadImage = async (data) => {
  if (!data) return failedResponse();
  try {
    const url = `/api/upload`;
    const response = await apiClient.post(url, data);

    if (response?.status === HTTP_STATUS_OK) {
      return successResponse({
        image: response?.data?.[0]
      });
    } else {
      return failedResponse();
    }
  } catch (error) {
    return failedResponse();
  }
};

const createTotwEntry = async (data) => {
  if (!data) return failedResponse();
  try {
    const url = `/api/totw-submissions`;
    const response = await apiClient.post(url, data);

    if (response?.status === HTTP_STATUS_OK) {
      return successResponse({
        data: response?.data
      });
    } else {
      return failedResponse();
    }
  } catch (error) {
    return failedResponse();
  }
};

export { createTotwEntry, uploadImage };
