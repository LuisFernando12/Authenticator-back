import { StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { StartedRedisContainer } from '@testcontainers/redis';

export class AppConfigEnvSetup {
  async setup(
    postgresService: StartedPostgreSqlContainer,
    redisContainer: StartedRedisContainer,
  ) {
    process.env.DB_USER = postgresService.getUsername();
    process.env.DB_PASSWORD = postgresService.getPassword();
    process.env.DB_NAME = postgresService.getDatabase();
    process.env.DB_HOST = postgresService.getHost();
    process.env.DB_PORT = postgresService.getMappedPort(5432).toString();
    process.env.REDIS_URI = `redis://${redisContainer.getHost()}:${redisContainer.getMappedPort(6379)}`;
    process.env.SECRET = 'test-secret';
    process.env.SERVICE_URL = 'http://localhost:3000';
    process.env.SMTP_PORT = '587';
    process.env.SERVER_SMTP = 'smtp.test.com';
    process.env.SERVER_SMTP_USER_NAME = 'test';
    process.env.SERVER_SMTP_PASSWORD = 'test';
    process.env.OAUTH_LOGIN_URL = 'http://localhost:3000/login';
    process.env.SERVICE_RESET_PASSWORD_URL = 'http://localhost:3000/reset';
    process.env.SERVICE_VERIFY_EMAIL_URL = 'http://localhost:3000/verify';
    process.env.REDIRECT_URI = 'http://localhost:3000/callback';
    process.env.CLIENT_SECRET_PEPPER = 'test-pepper';
  }
}
