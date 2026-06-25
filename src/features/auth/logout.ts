import { storageService } from "@/common/utility/storageService";

export const LOGOUT_EVENT_KEY = "application-event";

export const PINNED_MENUS_KEY = "pinned-menus";
export const SIDEBAR_COLLAPSED_KEY = "sidebar-collapsed";

export const clearAuthData = () => {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("lastPath");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
};

export const clearAppStorage = () => {
  const pinnedMenus = storageService.getItem(PINNED_MENUS_KEY);
  const sidebarState = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);

  clearAuthData();

  if (pinnedMenus !== null) {
    storageService.setItem(PINNED_MENUS_KEY, pinnedMenus);
  }

  if (sidebarState !== null) {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, sidebarState);
  }
};

export const logoutUser = (router: any) => {
  clearAppStorage();

  // trigger cross-tab logout
  localStorage.setItem(LOGOUT_EVENT_KEY, String(Date.now()));

  router.replace("/");
};