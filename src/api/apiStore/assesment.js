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
