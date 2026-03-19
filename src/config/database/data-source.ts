import { config } from 'dotenv';
import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';
config();

export const AppDataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  username: process.env.USER_DB,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: ['src/entity/*.entity.{ts,js}'],
  migrations: ['src/config/database/migrations/*{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  migrationsRun: false,
};

export const AppDataSource = new DataSource(AppDataSourceOptions);
