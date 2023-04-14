import axios from 'axios';

const HTTP_STATUS_OK = 200;

const failedResponse = (data) => {
  return {
    isSuccess: false,
    ...data
  };
};

const successResponse = (data) => {
  return {
    isSuccess: true,
    ...data
  };
};

const apiClient = axios.create({
  baseURL: process.env.STRAPI_API_SERVER_URL,
  timeout: 5000,
  headers: {
    Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`
  }
});

export { HTTP_STATUS_OK, apiClient, failedResponse, successResponse };
