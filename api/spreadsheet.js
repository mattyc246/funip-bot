const {
  apiClient,
  failedResponse,
  HTTP_STATUS_OK,
  successResponse
} = require('./axios');

const getSpreadsheetUrl = async () => {
  try {
    const url = `/api/spreadsheet-url`;
    const response = await apiClient.get(url);

    if (response?.status === HTTP_STATUS_OK) {
      return successResponse({
        data: response?.data?.data?.attributes?.url
      });
    } else {
      return failedResponse();
    }
  } catch (error) {
    console.log('Error: ', error);
    return failedResponse();
  }
};

module.exports = { getSpreadsheetUrl };
