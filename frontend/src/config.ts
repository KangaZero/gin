// Environment-specific configuration
type Environment = "development" | "production" | "maintenance";

// Get environment from .env or default to development
const getEnvironment = (): Environment => {
  const env = process.env.NEXT_PUBLIC_ENVIRONMENT;

  if (env === "production" || env === "maintenance") {
    return env;
  }

  return "development";
};

// Base URL configuration for different environments
const BASE_URLS = {
  development: "http://localhost:2308",
  production: "https://api.example.com", // Replace with your production URL
  maintenance: "https://maintenance.example.com", // URL for maintenance mode
};

// Current environment
export const environment = getEnvironment();

// Base URL for API requests
export const baseURL = BASE_URLS[environment];

// Config object for easy imports
export const config = {
  baseURL,
  environment,
  apiPath: "/api",
  isProduction: environment === "production",
  isMaintenance: environment === "maintenance",
  isDevelopment: environment === "development",
};

export default config;
