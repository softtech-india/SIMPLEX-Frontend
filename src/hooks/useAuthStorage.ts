import { useState } from "react";
import { storageService } from "@/common/utility/storageService";

export const useAppStorage = () => {
  const [storage, setStorage] = useState(() => ({
    userId: storageService.getItem("userId") || "",
    companyId: storageService.getItem("companyId") || "",
    accessToken: storageService.getItem("accessToken") || "",
    stateId: storageService.getItem("stateId") || "",
  }));

  const refreshStorage = () => {
    setStorage({
      userId: storageService.getItem("userId") || "",
      companyId: storageService.getItem("companyId") || "",
      accessToken: storageService.getItem("accessToken") || "",
      stateId: storageService.getItem("stateId") || "",
    });
  };

  return { ...storage, refreshStorage };
};