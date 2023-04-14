import {
  failedResponse,
  apiClient,
  HTTP_STATUS_OK,
  successResponse
} from './axios.js';

const createProfile = async (data) => {
  if (!data) return failedResponse();
  try {
    const url = `/api/profiles`;
    const response = await apiClient.post(url, data);

    if (response?.status === HTTP_STATUS_OK) {
      return successResponse();
    } else {
      return failedResponse();
    }
  } catch (error) {
    return failedResponse({
      error: error.response.data.error.name
    });
  }
};

const getProfiles = async () => {
  try {
    const url = `/api/profiles`;
    const response = await apiClient.get(url);

    if (response?.status === HTTP_STATUS_OK) {
      return successResponse({
        profiles: response?.data?.data
      });
    } else {
      return failedResponse();
    }
  } catch (error) {
    return failedResponse();
  }
};

export { createProfile, getProfiles };
