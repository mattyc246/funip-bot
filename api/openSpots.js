import {
  failedResponse,
  apiClient,
  HTTP_STATUS_OK,
  successResponse
} from './axios.js';

const getClanData = async () => {
  try {
    const url = '/api/clans';
    const response = await apiClient(url);

    if (response?.status === HTTP_STATUS_OK) {
      return successResponse({
        data: response?.data?.data
      });
    } else {
      return failedResponse();
    }
  } catch (error) {
    console.log('Error: ', error);
    return failedResponse();
  }
};

export { getClanData };
