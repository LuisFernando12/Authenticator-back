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
  }
}
