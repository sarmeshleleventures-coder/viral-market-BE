import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  // Access token: short-lived
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || process.env.JWT_EXPIRES_IN || "15m",
  // Refresh token: long-lived, separate secret
  refreshSecret:
    process.env.JWT_REFRESH_SECRET ||
    (process.env.JWT_SECRET || "dev-secret-change-me") + "-refresh",
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
};
