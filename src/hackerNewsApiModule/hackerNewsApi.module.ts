import { Module, HttpModule, CacheModule } from '@nestjs/common';
import { HackerApiController } from './hackerNewsApi.controller';
import { HackerNewsAdapter } from '../external/HackerNewsAdapter';

@Module({
  imports: [
    HttpModule,
    CacheModule.register({ ttl: 900 }), // 15 minutes
  ],
  controllers: [HackerApiController],
  providers: [HackerNewsAdapter],
  exports: [HackerNewsAdapter],
})
export class HackerNewsApiModule {}
