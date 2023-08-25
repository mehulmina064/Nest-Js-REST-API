import { Controller, Get, Param, ParseIntPipe,CacheInterceptor, UseInterceptors,CacheTTL,CacheKey,CACHE_MANAGER,Inject, InternalServerErrorException } from '@nestjs/common';
import { HackerNewsAdapter } from '../external/HackerNewsAdapter';
import { Observable, forkJoin, from, of } from 'rxjs';
import { Item, User, ChangedItemsAndProfiles, Story, Comment } from './hackerNewsApi.dto';
import { IsNotEmpty, IsString } from 'class-validator';
import { catchError, map, switchMap } from 'rxjs/operators';

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


  @Get('top-stories-with-user-data')
  @CacheKey('top-stories-with-user-data') 
  @CacheTTL(900) 
  async getTopStoriesDataWithUserData(): Promise<Story[]> {
    try {
      return this.hackerNewsAdapter.getTopStories().pipe(
        switchMap(ids => {
          const storyObservables: Observable<Story>[] = ids.map(id =>
            from(this.hackerNewsAdapter.getItem(id)).pipe(
              switchMap(item => 
                from(this.hackerNewsAdapter.getUser(item.by)).pipe(
                  map(user => new Story(item, user))
                )
              )
            )
          );
          return forkJoin(storyObservables);
        })
      ).toPromise();
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }


    @Get('top-stories-data')
    @CacheKey('top-stories-data') 
    @CacheTTL(900) 
    async getTopStoriesData(): Promise<Story[]> {
      try {
        return this.hackerNewsAdapter.getTopStories().pipe(
          switchMap(ids => {
            const storyObservables: Observable<Story>[] = ids.map(id =>
              from(this.hackerNewsAdapter.getItem(id)).pipe(
                map(item => new Story(item))
              )
            );
            return forkJoin(storyObservables);
          })
        ).toPromise();
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException(error);
      }
    }

    @Get('past-stories-with-user-data')
    @CacheKey('top-stories-data-user-data')
    @CacheTTL(900)
    async getPastStoriesDataWithUserData(): Promise<Observable<number[]>> { 
      const key = 'top-stories-data-user-data';
      let result= this.cacheManager.get(key, { ttl: 900, max: 100 }); // Return cached data
      return result.length?result:this.getTopStoriesDataWithUserData()
    }


    @Get('past-stories-data')
    @CacheKey('top-stories-data')
    @CacheTTL(900)
    async getPastStoriesData(): Promise<Observable<number[]>> { 
      const key = 'top-stories-data';
      let result= this.cacheManager.get(key, { ttl: 900, max: 100 }); // Return cached data
      return result.length?result:this.getTopStoriesData()
    }

  

    @Get('comments-data/:id')
    async getCommentsData(@Param('id', ParseIntPipe) id: number): Promise<Comment[]> {
    try {
      const item = await this.hackerNewsAdapter.getItem(id).toPromise();
      if (item.kids && item.kids.length > 0) {
        const commentObservables: Observable<Comment>[] = item.kids.map(kidId =>
          from(this.hackerNewsAdapter.getItem(kidId)).pipe(
            catchError(() => of(null)), // Ignore errors if comment item not found
            map(commentItem => new Comment(commentItem))
          )
        );

        return forkJoin(commentObservables).toPromise();
      } else {
        return [];
      }
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException(error);
    }
  }


    @Get('comments-with-user-data/:id')
    async getCommentsDataWithUserData(@Param('id', ParseIntPipe) id: number): Promise<Comment[]> {
      try {
        const item = await this.hackerNewsAdapter.getItem(id).toPromise();
        if (item.kids && item.kids.length > 0) {
          const commentObservables: Observable<Comment>[] = item.kids.map(kidId =>
            from(this.hackerNewsAdapter.getItem(kidId)).pipe(
              switchMap(commentItem =>
                from(this.hackerNewsAdapter.getUser(commentItem.by)).pipe(
                  catchError(() => of(null)), // Ignore errors if user not found
                  map(user => new Comment(commentItem, user))
                )
              )
            )
          );
  
          return forkJoin(commentObservables).toPromise();
        } else {
          return [];
        }
      } catch (error) {
        console.error(error);
        throw new InternalServerErrorException(error);
      }
    }
    








  @Get('item/:id')
  getItem(@Param() params: GetItemParams): Observable<Item> {
    const itemId = parseInt(params.id || '0', 10);
    return this.hackerNewsAdapter.getItem(itemId);
  }


  @Get('max-item-id')
  getMaxItemId(): Observable<number> {
    return this.hackerNewsAdapter.getMaxItemId();
  }


  // @UseInterceptors(CacheInterceptor)
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

  @Get('user/:username')
  getUser(@Param() params: GetUserParams): Observable<User> {
    return this.hackerNewsAdapter.getUser(params.username || '');
  }

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
}
