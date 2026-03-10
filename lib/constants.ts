export const API_BASE_URL = "https://api.nxcar.in";
export const BASE_URL = "https://api.nxcar.in";
export const AUTH_BASE_URL = "https://api.nxcar.in";
export const SITE_URL = process.env.REPLIT_DEV_DOMAIN
  ? `https://${process.env.REPLIT_DEV_DOMAIN}`
  : process.env.REPLIT_DEPLOYMENT_URL
    ? `https://${process.env.REPLIT_DEPLOYMENT_URL}`
    : "https://nxcar.in";

// export const SITE_URL = "https://nxcar.in";
