import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'u0_a271',
  database: 'bazarak',
  autoLoadEntities: true,
  synchronize: true,
};
