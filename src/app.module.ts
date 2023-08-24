import { Module,CacheModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule } from '@nestjs/config';
import { HackerNewsApiModule } from './hackerNewsApi/hackerNewsApi.module';

@Module({
  imports: [
    CacheModule.register({
      store: 'memory',
      max: 100,
      ttl: 900,
    }),
    ConfigModule.forRoot({
      isGlobal: true, // no need to import into other modules
    }),
    MulterModule.register({
      dest: './files',
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      url: process.env.MONGO_DB_OLD,
      // url: process.env.MONGO_DB_TEST,
      database: process.env.MONGO_DB_NAME_MAIN,
      entities: [join(__dirname, '**/**.entity{.ts,.js}')],
      synchronize: false,
      useNewUrlParser: true,
      ssl: true,
    }),
    HackerNewsApiModule,
  ],
})
export class AppModule {}
