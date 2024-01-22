import axios from "axios";

import errorHandler from "./errorHandler";

const apiRoot = axios.create({
  baseURL: `https://elc-onlinetest.incenplus.com/api/`,
});

apiRoot.interceptors.response.use((response) => response, errorHandler);

export default apiRoot;
