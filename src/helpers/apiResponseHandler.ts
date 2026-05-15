import { toast } from "sonner";

export interface BaseApiResponse {
  success?: boolean;
  message?: string;
}

export const handleApiResponse = <T extends BaseApiResponse>(
  response: T | null | undefined
): boolean => {

  if (!response) {
    toast.error("No response from server");
    return false;
  }

  if (!response.success) {
    toast.error(response.message || "Something went wrong");
    return false;
  }

  return true;
};