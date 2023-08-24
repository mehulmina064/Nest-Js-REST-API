import { Injectable, HttpService, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { Observable, throwError,forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Item, User, ChangedItemsAndProfiles } from '../hackerNewsApi/hackerNewsApi.dto'; 

@Injectable()
export class HackerNewsAdapter {
  constructor(private readonly httpService: HttpService) {}

  private apiUrl = process.env.HACKER_API_BASE_URL;

  private handleHttpError(error: any) {
    if (error.response) {
      throw new InternalServerErrorException('Hacker News API responded with an error.');
    } else {
      throw new InternalServerErrorException('Failed to connect to Hacker News API.');
    }
  }

  getItem(itemId: number): Observable<Item> {
    const itemUrl = `${this.apiUrl}/item/${itemId}.json?print=pretty`;
    return this.httpService.get(itemUrl).pipe(
      map(response => response.data),
      catchError(error => {
        this.handleHttpError(error);
        return throwError(error);
      }),
    );
  }

  getUser(username: string): Observable<User> {
    const userUrl = `${this.apiUrl}/user/${username}.json?print=pretty`;
    return this.httpService.get(userUrl).pipe(
      map(response => response.data),
      catchError(error => {
        this.handleHttpError(error);
        return throwError(error);
      }),
    );
  }

  getMaxItemId(): Observable<number> {
    const maxItemIdUrl = `${this.apiUrl}/maxitem.json?print=pretty`;
    return this.httpService.get(maxItemIdUrl).pipe(
      map(response => response.data),
      catchError(error => {
        this.handleHttpError(error);
        return throwError(error);
      }),
    );
  }

  //need to check
  getItemsDirectApi(itemIds: number[]): Observable<Item[]> {
    const itemUrls = itemIds.map(itemId => `${this.apiUrl}/item/${itemId}.json`);
    return this.httpService.get(itemUrls.join(',')).pipe(
        map(response => response.data),
        catchError(error => {
          this.handleHttpError(error);
          return throwError(error);
        }),
      );
  }

  getItems(itemIds: number[]): Observable<Item[]> {
    const itemRequests: Observable<Item>[] = itemIds.map(itemId => this.getItem(itemId));
    return forkJoin(itemRequests);
  }



  getTopStories(): Observable<number[]> {
    const topStoriesUrl = `${this.apiUrl}/topstories.json?print=pretty`;
    return this.httpService.get(topStoriesUrl).pipe(
      map(response => response.data),
      catchError(error => {
        this.handleHttpError(error);
        return throwError(error);
      }),
    );
  }

  getNewStories(): Observable<number[]> {
    const newStoriesUrl = `${this.apiUrl}/newstories.json?print=pretty`;
    return this.httpService.get(newStoriesUrl).pipe(
      map(response => response.data),
      catchError(error => {
        this.handleHttpError(error);
        return throwError(error);
      }),
    );
  }

  getBestStories(): Observable<number[]> {
    const bestStoriesUrl = `${this.apiUrl}/beststories.json?print=pretty`;
    return this.httpService.get(bestStoriesUrl).pipe(
      map(response => response.data),
      catchError(error => {
        this.handleHttpError(error);
        return throwError(error);
      }),
    );
  }

  getAskStories(): Observable<number[]> {
    const askStoriesUrl = `${this.apiUrl}/askstories.json?print=pretty`;
    return this.httpService.get(askStoriesUrl).pipe(
      map(response => response.data),
      catchError(error => {
        this.handleHttpError(error);
        return throwError(error);
      }),
    );
  }

  getShowStories(): Observable<number[]> {
    const showStoriesUrl = `${this.apiUrl}/showstories.json?print=pretty`;
    return this.httpService.get(showStoriesUrl).pipe(
      map(response => response.data),
      catchError(error => {
        this.handleHttpError(error);
        return throwError(error);
      }),
    );
  }

  getJobStories(): Observable<number[]> {
    const jobStoriesUrl = `${this.apiUrl}/jobstories.json?print=pretty`;
    return this.httpService.get(jobStoriesUrl).pipe(
      map(response => response.data),
      catchError(error => {
        this.handleHttpError(error);
        return throwError(error);
      }),
    );
  }

  getChangedItemsAndProfiles(): Observable<ChangedItemsAndProfiles> {
    const updatesUrl = `${this.apiUrl}/updates.json?print=pretty`;
    return this.httpService.get(updatesUrl).pipe(
      map(response => response.data),
      catchError(error => {
        this.handleHttpError(error);
        return throwError(error);
      }),
    );
  }
}
