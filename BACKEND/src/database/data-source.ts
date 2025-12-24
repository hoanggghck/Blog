// src/database/data-source.ts
import 'reflect-metadata';
import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';

const options: DataSourceOptions & SeederOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,

  synchronize: false,

  entities: ['dist/**/*.entity.js'],
  seeds: ['dist/database/seeds/**/*.js'],
};

const dataSource = new DataSource(options);

export default dataSource;
export { dataSource };
