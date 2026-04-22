// utils/apiConfig.js

let apiBaseUrl = null;

// Load API base URL (can fetch from static config or API endpoint)
export async function getApiBaseUrl() {
  if (apiBaseUrl) return apiBaseUrl;

  // Option 1: From a config file hosted on your server
  const res = await fetch("/config.json");
  const config = await res.json();
  apiBaseUrl = config.API_BASE_URL;

  return apiBaseUrl;
}
