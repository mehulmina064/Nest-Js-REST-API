import { MiddlewareConsumer, Module, NestModule,HttpModule ,CacheModule} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HackerApiController } from './hackerNewsApi.controller';
import { UserModule } from '../users/user.module';

//external imports
import { HackerNewsAdapter } from '../external/HackerNewsAdapter';


@Module({
  imports: [UserModule,HttpModule,
  CacheModule.register({ ttl: 900 }), //15 minutes
  ],
  controllers: [HackerApiController],
  providers: [HackerNewsAdapter],
  exports: [HackerNewsAdapter],
})
export class HackerNewsApiModule {}

