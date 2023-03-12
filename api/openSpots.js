const {
  failedResponse,
  apiClient,
  HTTP_STATUS_OK,
  successResponse
} = require('./axios');

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

module.exports = { getClanData };
