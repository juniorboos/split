import { Configuration } from './interfaces/configuration.interface';

export const DEFAULT_SERVER_PORT = 3200;

export const configuration = (): Configuration => {
  const NODE_ENV = process.env.NODE_ENV;
  const defaultConfiguration = {
    server: {
      port:
        parseInt(process.env.BACKEND_PORT as string, 10) || DEFAULT_SERVER_PORT,
    },
    database: {
      uri:
        NODE_ENV === 'dev'
          ? `mongodb://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}?authSource=admin&replicaSet=${process.env.DB_REPLICA_SET}&readPreference=primary&directConnection=true`
          : `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    },
    jwt: {
      accessToken: {
        secret: process.env.JWT_ACCESS_TOKEN_SECRET as string,
        expirationTime: parseInt(
          process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME as string,
          10,
        ),
      },
      refreshToken: {
        secret: process.env.JWT_REFRESH_TOKEN_SECRET as string,
        expirationTime: parseInt(
          process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME as string,
          10,
        ),
      },
    },
    azure: {
      clientId: process.env.AZURE_CLIENT_ID as string,
      clientSecret: process.env.AZURE_CLIENT_SECRET as string,
      tenantId: process.env.AZURE_TENANT_ID as string,
      enabled: process.env.AZURE_ENABLE === 'true',
    },
  };

  return defaultConfiguration;
};