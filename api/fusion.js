const {
  failedResponse,
  apiClient,
  HTTP_STATUS_OK,
  successResponse
} = require('./axios');

const qs = require('qs');
const moment = require('moment');

const getFusionData = async () => {
  const query = qs.stringify(
    {
      populate: '*',
      filters: {
        end_date: {
          $gt: moment().toISOString()
        }
      }
    },
    {
      encodeValuesOnly: true // prettify URL
    }
  );
  try {
    const url = `/api/fusions?${query}`;
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

module.exports = { getFusionData };
