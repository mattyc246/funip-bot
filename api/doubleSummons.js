const {
  failedResponse,
  apiClient,
  HTTP_STATUS_OK,
  successResponse
} = require('./axios');

const qs = require('qs');
const moment = require('moment');

const get2xData = async () => {
  const query = qs.stringify(
    {
      filters: {
        end_date: {
          $gt: moment().toISOString()
        },
        active: {
          $eq: true
        }
      }
    },
    {
      encodeValuesOnly: true // prettify URL
    }
  );
  try {
    const url = `/api/two-times-events?${query}`;
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

module.exports = { get2xData };
