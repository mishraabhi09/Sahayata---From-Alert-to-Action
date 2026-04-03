type EnvConfig = {
  PORT: number;
  DATABASE_URL: string;
  auth: {
    SALT_ROUNDS: number;
    TOKEN_SECRET: string;
    ACCESS_TOKEN_AGE: number;
    REFRESH_TOKEN_AGE: number;
    OTP_AGE: number;
    OTP_SECRET: string;
  };
  smtp: {
    SMTP_AUTH_USER: string;
    SMTP_AUTH_PASS: string;
  };
};

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key] || defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required env variable: ${key}`);
  }
  return value;
}

const env: EnvConfig = {
  PORT: Number(getEnvVar("PORT", "3000")),
  DATABASE_URL: getEnvVar("DATABASE_URL", "mongodb+srv://abhimish1611_db_user:DYfqFzPgH0ENZx7m@cluster1.djdyetq.mongodb.net/?appName=Cluster1"),
  auth: {
    SALT_ROUNDS: Number(getEnvVar("SALT_ROUNDS", "10")),
    TOKEN_SECRET: getEnvVar("TOKEN_SECRET", "your-jwt-secret-key"),
    ACCESS_TOKEN_AGE: Number(getEnvVar("ACCESS_TOKEN_AGE", "60000")),
    REFRESH_TOKEN_AGE: Number(getEnvVar("REFRESH_TOKEN_AGE", "86400000")),
    OTP_AGE: Number(getEnvVar("OTP_AGE", "300000")),
    OTP_SECRET: getEnvVar("OTP_SECRET", "your-otp-secret"),
  },
  smtp: {
    SMTP_AUTH_USER: getEnvVar("SMTP_AUTH_USER", ""),
    SMTP_AUTH_PASS: getEnvVar("SMTP_AUTH_PASS", ""),
  },
};

export { env };

