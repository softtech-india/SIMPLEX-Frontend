import notify from "devextreme/ui/notify";
import { apiCall } from "../../utils/apiClient";

export const fetchSizeList = async (
  userId: string | number | null,

) => {
  try {
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}size`,
      {
        userid: Number(userId) || 0,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data;
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};