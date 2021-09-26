import { isProductionEnvironment, Environment } from '../common';

export const config = () => ({
  app: {
    name: process.env.APP_NAME,
    url: process.env.APP_URL,
    port: Number(process.env.APP_PORT) || 8080,
    environment: isProductionEnvironment()
      ? Environment.Production
      : Environment.Development
  },
  database: {
    type: process.env.DB_DRIVER,
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD
  },
  auth: {
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_TTL
    }
  }
});

export type Config = ReturnType<typeof config>;
