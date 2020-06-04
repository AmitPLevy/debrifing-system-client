import axios from "axios";

const baseUrl = "https://drone-guard-debriefing-server.herokuapp.com";

const getToken = () => {
  return (
    localStorage.getItem("token") && localStorage.getItem("token").slice(1, -1)
  );
};

const buildHeaders = () => {
  return {
    headers: {
      "x-auth-token": getToken(),
      Authorization: `Bearer ${
        localStorage.getItem("token") &&
        localStorage.getItem("token").slice(1, -1)
      }`,
      appType: "dashboard",
    },
  };
};

export const _get = async (endPoint) => {
  const options = buildHeaders();
  return axios.get(`${baseUrl}${endPoint}`, options);
};

export const _post = async (endPoint, data) => {
  const options = buildHeaders();
  return axios.post(`${baseUrl}${endPoint}`, data, options);
};

export const _delete = (endPoint) => {
  const options = buildHeaders();
  return axios.delete(`${baseUrl}${endPoint}`, options);
};
