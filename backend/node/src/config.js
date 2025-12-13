import dotenv from 'dotenv';

dotenv.config();

const required = (key, defaultValue) => {
  const value = process.env[key] ?? defaultValue;
  if (value === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const config = {
  env: process.env.NODE_ENV ?? 'development',
  port: Number(process.env.PORT ?? 4000),
  jwtSecret: required('JWT_SECRET', 'development-secret'),
  auth: {
    adminEmail: required('ADMIN_EMAIL', 'rajib@puii.local'),
    adminPassword: required('ADMIN_PASSWORD', 'raj12345'),
    tokenTtlSeconds: Number(process.env.JWT_TTL_SECONDS ?? 3600),
    // Enable a development bypass to simplify local testing when auth is not critical.
    // Auth is enforced only when explicitly enabled.
    skipAuth:
      process.env.ENABLE_AUTH === 'true'
        ? false
        : process.env.SKIP_AUTH !== 'false' && process.env.NODE_ENV !== 'production',
  },
  mysql: {
    host: required('MYSQL_HOST', 'localhost'),
    port: Number(process.env.MYSQL_PORT ?? 3306),
    user: required('MYSQL_USER', 'root'),
    password: required('MYSQL_PASSWORD', 'raj12345'),
    database: required('MYSQL_DATABASE', 'puii'),
    connectionLimit: Number(process.env.MYSQL_POOL_SIZE ?? 10),
  },
  mlService: {
    baseUrl: required('ML_SERVICE_URL', 'http://localhost:6000'),
    apiKey: process.env.ML_SERVICE_API_KEY ?? '',
    timeoutMs: Number(process.env.ML_SERVICE_TIMEOUT_MS ?? 6000),
  },
  ws: {
    enable: process.env.ENABLE_WS !== 'false',
  },
};
