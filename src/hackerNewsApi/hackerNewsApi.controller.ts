import { Controller, Get, Param, ParseIntPipe, ValidationPipe, Inject,CACHE_MANAGER,CacheInterceptor, UseInterceptors } from '@nestjs/common';
import { HackerNewsAdapter } from '../external/HackerNewsAdapter';
import { Observable } from 'rxjs';
import { Item, User, ChangedItemsAndProfiles } from './hackerNewsApi.dto';
import { IsNotEmpty, IsString } from 'class-validator';

class GetItemParams {
  @IsNotEmpty()
  @IsString()
  id?: string;
}

class GetUserParams {
  @IsNotEmpty()
  @IsString()
  username?: string;
}

@Controller('hacker-api')
export class HackerApiController {
  constructor(private readonly hackerNewsAdapter: HackerNewsAdapter,
    @Inject(CACHE_MANAGER) private readonly cacheManager: any,) {}


  async getCachedOrFreshData(key: string, fetchDataFn: () => Observable<any>): Promise<Observable<any>> {
    const cachedData = await this.cacheManager.get(key);
    if (cachedData) {
      return cachedData;
    } else {
      const freshData = await fetchDataFn().toPromise();
      await this.cacheManager.set(key, freshData, { ttl: 600 }); // 10 minutes
      return freshData;
    }
  }

  @UseInterceptors(CacheInterceptor)
  @Get('item/:id')
  getItem(@Param() params: GetItemParams): Observable<Item> {
    const itemId = parseInt(params.id || '0', 10);
    return this.hackerNewsAdapter.getItem(itemId);
  }

  @UseInterceptors(CacheInterceptor)
  @Get('user/:username')
  getUser(@Param() params: GetUserParams): Observable<User> {
    return this.hackerNewsAdapter.getUser(params.username || '');
  }

  @UseInterceptors(CacheInterceptor)
  @Get('max-item-id')
  getMaxItemId(): Observable<number> {
    return this.hackerNewsAdapter.getMaxItemId();
  }


  @Get('top-stories')
  async getTopStories(): Promise<Observable<number[]>> {
    const key = 'top-stories';
    return this.getCachedOrFreshData(key, () => this.hackerNewsAdapter.getTopStories());
  }

  @Get('past-stories')
  async getPastStories(): Promise<Observable<any>> {
    const key = 'top-stories'; // Use the same cache key as top-stories
    return this.cacheManager.get(key); // Return cached data
  }

  // @Get('comments/:id')
  // async getComments(@Param('id') id: number): Promise<Observable<any[]>> {
  //   const item = await this.hackerNewsAdapter.getItem(id).toPromise();
  //   if (item.kids && item.kids.length > 0) {
  //     const comments = await this.hackerNewsAdapter.getItems(item.kids.slice(0, 10)).toPromise();
  //     return comments;
  //   } else {
  //     return [];
  //   }
  // }

  @UseInterceptors(CacheInterceptor)
  @Get('comments/:id')
  async getComments(@Param('id', ParseIntPipe) id: number): Promise<Item[]> {
    const item = await this.hackerNewsAdapter.getItem(id).toPromise();
    if (item.kids && item.kids.length > 0) {
      const comments = await this.hackerNewsAdapter.getItems(item.kids.slice(0, 10)).toPromise();
      return comments;
    } else {
      return [];
    }
  }

  

  @UseInterceptors(CacheInterceptor)
  @Get('new-stories')
  getNewStories(): Observable<number[]> {
    return this.hackerNewsAdapter.getNewStories();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('best-stories')
  getBestStories(): Observable<number[]> {
    return this.hackerNewsAdapter.getBestStories();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('ask-stories')
  getAskStories(): Observable<number[]> {
    return this.hackerNewsAdapter.getAskStories();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('show-stories')
  getShowStories(): Observable<number[]> {
    return this.hackerNewsAdapter.getShowStories();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('job-stories')
  getJobStories(): Observable<number[]> {
    return this.hackerNewsAdapter.getJobStories();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('changed-items-and-profiles')
  getChangedItemsAndProfiles(): Observable<ChangedItemsAndProfiles> {
    return this.hackerNewsAdapter.getChangedItemsAndProfiles();
  }
}
