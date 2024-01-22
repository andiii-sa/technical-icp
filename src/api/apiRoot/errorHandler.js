export default function errorHandler(error) {
  if (error) {
    if (error.response) {
      if (error.response.status === 401) {
        console.log("error", error);
        setTimeout(() => {
          window.location.replace("/");
        }, 2000);
        return;
      }

      return Promise.reject(error);
    }
  }
}
