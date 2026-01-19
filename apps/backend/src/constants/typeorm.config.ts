import { type TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';

export const DB_CONFIG: TypeOrmModuleOptions = {
  // TODO: add t3env
  type: 'postgres',
  host: process.env.POSTGRES_HOST ?? 'localhost',
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [__dirname + '/../**/*.entity.js'],
  migrations: [__dirname + '/../migrations/**/*.js'],
  autoLoadEntities: true,
  migrationsRun: true,
  retryDelay: 6000,
};
