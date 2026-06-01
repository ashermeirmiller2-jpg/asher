const rawBaseUrl = process.env.REACT_APP_BACKEND_URL || "";
const normalizedBaseUrl = rawBaseUrl.replace(/\/$/, "");

export const API = `${normalizedBaseUrl}/api`;
