import apiRoot from "../apiRoot";

export const ApiCreateStudent = async (data) => {
  try {
    const res = await apiRoot.post(`student/create`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch ({ response: error }) {
    return error;
  }
};

export const ApiGetListQuestion = async (params) => {
  try {
    const res = await apiRoot.get(`question/list`, {
      params: params,
    });
    return res;
  } catch ({ response: error }) {
    return error;
  }
};

export const ApiSaveAnswers = async (data) => {
  try {
    const res = await apiRoot.post(`studentanswer/create`, data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res;
  } catch ({ response: error }) {
    return error;
  }
};
