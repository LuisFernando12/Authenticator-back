import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';
import { RedisContainer, StartedRedisContainer } from '@testcontainers/redis';
import { hashSync } from 'bcrypt';
import Redis from 'ioredis';
import { Pool } from 'pg';
import { DataSource } from 'typeorm';
import { ClientEntity } from '../../../src/entity/client.entity';
import { UserEntity } from '../../../src/entity/user.entity';

export class DatabaseSetup {
  private _postgresService: StartedPostgreSqlContainer;
  private _redisContainer: StartedRedisContainer;
  private _redisService: Redis;
  constructor() {}
  async setup() {
    this._postgresService = await new PostgreSqlContainer(
      'bitnami/postgresql:latest',
    )
      .withExposedPorts(5432)
      .withDatabase('authenticator-e2e')
      .withUsername('postgres')
      .withPassword('postgres-e2e')
      .start();
    this._redisContainer = await new RedisContainer('redis:latest')
      .withExposedPorts(6379)
      .start();
    this._redisService = new Redis(
      `redis://${this._redisContainer.getHost()}:${this._redisContainer.getMappedPort(6379)}`,
    );
    process.env.DB_HOST = this._postgresService.getHost();
    process.env.DB_PORT = this._postgresService.getPort().toString();
    process.env.DB_USER = this._postgresService.getUsername();
    process.env.DB_PASSWORD = this._postgresService.getPassword();
    process.env.DB_NAME = this._postgresService.getDatabase();
    await this.awaitDatabaseUp(
      this._postgresService.getMappedPort(5432),
      this._postgresService.getHost(),
      this._postgresService.getUsername(),
      this._postgresService.getPassword(),
      this._postgresService.getDatabase(),
    );
  }
  private async awaitDatabaseUp(
    port: number,
    host: string,
    username: string,
    password: string,
    database: string,
    maxRetries: number = 30,
    retryInterval: number = 1000,
  ): Promise<void> {
    const pool = new Pool({
      port,
      host,
      user: username,
      password,
      database,
    });
    let lastError: Error | null = null;
    for (let i = 0; i < maxRetries; i++) {
      try {
        await pool.query('SELECT 1');
        await pool.end();
        console.log('database is up');
        return;
      } catch (error) {
        lastError = error as Error;
        console.log(`Attempt ${i + 1}/${maxRetries} - awaiting database...`);
        await new Promise((resolve) => setTimeout(resolve, retryInterval));
      }
    }
    throw new Error(
      `database is not up after ${maxRetries} attempts with message error: ${lastError?.message}`,
    );
  }

  async teardown(): Promise<void> {
    await this._redisService.quit();
    await this._redisContainer.stop();
    await this._postgresService.stop();
  }
  async seed(dataSource: DataSource) {
    const clientRepository = dataSource.getRepository(ClientEntity);
    const userRepository = dataSource.getRepository(UserEntity);
    const user = await userRepository.save({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '$2b$10$tMCrkaXc/YfzVeamnTq/w.XHRoh7MNf.yHRj2XxrfX20Zdl7C5V4S',
      isVerified: true,
    });
    const client = await clientRepository.save({
      name: 'Fintech-Test',
      clientId: 'test-client-id',
      clientSecret: hashSync(
        'test-client-secret' + process.env.CLIENT_SECRET_PEPPER,
        10,
      ),
      isConfidential: true,
      redirectUris: ['http://localhost:4000/callback'],
      grantTypes: ['authorization_code', 'refresh_token', 'client_credentials'],
      scopes: ['email', 'phone', 'address'],
      isActive: true,
    });
    if (!client && !user) {
      console.log('Error to populate DB');
    }
    console.log('DB populated');
  }

  get postgresService(): StartedPostgreSqlContainer {
    return this._postgresService;
  }
  get redisService(): Redis {
    return this._redisService;
  }
  get redisContainer(): StartedRedisContainer {
    return this._redisContainer;
  }
}
