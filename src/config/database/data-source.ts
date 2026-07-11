import { config } from 'dotenv';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
config();

export const AppDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? Number.parseInt(process.env.DB_PORT) : 5432,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/*/infrastructure/persistence/entity/*.entity.{ts,js}'],
  migrations: ['src/config/database/migrations/*{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
};

export const AppDataSource = new DataSource(AppDataSourceOptions);
