import { Controller, Get, Param, ParseIntPipe,CacheInterceptor, UseInterceptors,CacheTTL,CacheKey,CACHE_MANAGER,Inject } from '@nestjs/common';
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

@Controller('hacker-api/')
@UseInterceptors(CacheInterceptor)
export class HackerApiController {
  constructor(private readonly hackerNewsAdapter: HackerNewsAdapter,
     @Inject(CACHE_MANAGER) private readonly cacheManager ) {}



  @Get('item/:id')
  getItem(@Param() params: GetItemParams): Observable<Item> {
    const itemId = parseInt(params.id || '0', 10);
    return this.hackerNewsAdapter.getItem(itemId);
  }

  @Get('user/:username')
  getUser(@Param() params: GetUserParams): Observable<User> {
    return this.hackerNewsAdapter.getUser(params.username || '');
  }

  @Get('max-item-id')
  getMaxItemId(): Observable<number> {
    return this.hackerNewsAdapter.getMaxItemId();
  }


  @Get('top-stories')
  @CacheKey('top-stories') 
  @CacheTTL(900) 
  getTopStories(): Observable<number[]> {
    return this.hackerNewsAdapter.getTopStories();
  }

  @Get('past-stories')
  @CacheKey('top-stories')
  @CacheTTL(900)
  async getPastStories(): Promise<Observable<number[]>> {
    const key = 'top-stories';
    return this.cacheManager.get(key, { ttl: 900, max: 100 }); // Return cached data
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

  

  @Get('new-stories')
  getNewStories(): Observable<number[]> {
    return this.hackerNewsAdapter.getNewStories();
  }

  @Get('best-stories')
  getBestStories(): Observable<number[]> {
    return this.hackerNewsAdapter.getBestStories();
  }

  @Get('ask-stories')
  getAskStories(): Observable<number[]> {
    return this.hackerNewsAdapter.getAskStories();
  }

  @Get('show-stories')
  getShowStories(): Observable<number[]> {
    return this.hackerNewsAdapter.getShowStories();
  }

  @Get('job-stories')
  getJobStories(): Observable<number[]> {
    return this.hackerNewsAdapter.getJobStories();
  }

  @Get('changed-items-and-profiles')
  getChangedItemsAndProfiles(): Observable<ChangedItemsAndProfiles> {
    return this.hackerNewsAdapter.getChangedItemsAndProfiles();
  }
}
