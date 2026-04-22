import axios from "axios";
import { apiCall } from "@/utils/apiClient";

const BASE_URL = process.env.NEXT_PUBLIC_PROJECT_API_ENDPOINT;

export async function login(username: string, password: string) {
  try {
    const response = await axios.get(`${BASE_URL}login`, {
      params: { username, password },
    });

    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.message || "Login failed. Try again later."
    );
  }
}

export async function getUser(token: string) {
  return apiCall.get("Users", undefined, {
    Authorization: `Bearer ${token}`,
  });
}

export async function SaveUsers(data: any, accessToken: string) {
  return apiCall.post("Users", data, undefined, {
    Authorization: `Bearer ${accessToken}`,
  });
}

export async function GetRoles(accessToken: string) {
  return apiCall.get("user", undefined, {
    Authorization: `Bearer ${accessToken}`,
  });
}

export async function SaveRoles(data: any, accessToken: string) {
  return apiCall.post("Roles", data, undefined, {
    Authorization: `Bearer ${accessToken}`,
  });
}

export async function GetMenus(accessToken: string) {
  return apiCall.get("Menus", undefined, {
    Authorization: `Bearer ${accessToken}`,
  });
}

export async function GetRoleMenuPriviledges(
  roleId: string,
  accessToken: string
) {
  return apiCall.get(`userpreviledge/${roleId}`, undefined, {
    Authorization: `Bearer ${accessToken}`,
  });
}

export async function SaveRoleMenuPriviledges(
  data: any,
  accessToken: string
) {
  return apiCall.post(
    "RoleMenuPriviledges/SaveRoleMenuPriviledges",
    data,
    undefined,
    {
      Authorization: `Bearer ${accessToken}`,
    }
  );
}

export async function GetAccessToken(data: any, accessToken: string) {
  return apiCall.post("security/createToken", data, undefined, {
    Authorization: `Bearer ${accessToken}`,
  });
}