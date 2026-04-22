import notify from "devextreme/ui/notify";
import { apiCall } from "../../../utils/apiClient";

export const fetchUsersList = async () => {
  try {
    debugger
    const response: any = await apiCall.get(
      `${process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT}user`,
      {
        userid: 1,
      }
    );

    if (response?.error) {
      notify(response.error, "error", 3000);
      return [];
    }

    return response.data.map((item: any) => ({
      id: item.id,
      name: item.name,
    }));
  } catch (e: any) {
    console.error(e);
    notify(String(e), "error", 3000);
    return [];
  }
};