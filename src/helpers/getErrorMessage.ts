export const getErrorMessage = (error: any): string => {
  // server response
  if (error?.response?.data) {
    const data = error.response.data;

    if (typeof data === "string") return data;

    if (data.message) return data.message;

    if (data.error) return data.error;
  }

  // normal JS error
  if (error instanceof Error) {
    return error.message;
  }

  // string error
  if (typeof error === "string") {
    return error;
  }

  return "Something went wrong";
};