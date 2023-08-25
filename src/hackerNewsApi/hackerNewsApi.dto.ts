
export enum itemType {
  story='story',
  comment = 'comment',
  poll = 'poll',
  job = 'job',
  pollopt = 'pollopt',
}
// *for our use*
export class Story {
  id: number = 0;
  deleted?: boolean;
  createdBy: UserData = new UserData(""); //by
  time: Date = new Date(); //Unix Time
  text?: string;
  dead?: boolean;
  type: string =''; 
  pollId?: number;  //poll
  // poll?: Poll;  //poll
  commentsIds?: number[];  //kids
  // lastThreeSubmittedComments?: Comment[] = [];
  url?: string;
  votes?: number; //score
  title?: string;

  relatedPolloptIds?: number[];  //parts
  // relatedPollopts?: Pollopt[] = [];

  totalComments?: number;  //descendants

  
  constructor(itemData: Item, user?: User) {
    if(itemData.deleted=true){
      this.id = itemData.id;
      this.deleted=true;
      this.time=new Date(itemData.time * 1000);
      this.type=itemData.type;
    }
    else{
      this.id = itemData.id;
      this.createdBy = user ? new UserData(user) : new UserData(itemData.by);
      this.time = new Date(itemData.time * 1000);
      this.type = itemData.type;
      this.votes = itemData.score;
      this.title = itemData.title;
      this.url = itemData.url;
      this.commentsIds = itemData.kids;
      this.relatedPolloptIds = itemData.parts;
      this.totalComments = itemData.descendants;
      this.pollId = itemData.poll;
      this.dead=itemData.dead;
      this.deleted=itemData.deleted;
    }
  
  }
  
}

export class Comment {
  id: number = 0;
  deleted?: boolean;
  createdBy: UserData = new UserData("");
  time: Date = new Date; //Unix Time
  text?: string;
  dead?: boolean;
  type: string =''; 
  totalComments?: number;  //kids size
  commentsIds?: number[];  //kids
  parentId?: number; //parent
  //for future data
  // parentType?: itemType;
  // parentData?: any; 
  // for now only Story or comment
  // parentStory?: Story; 
  // parentComment?: Comment;  
  // parentPoll?: Poll;  
  constructor(itemData: Item, user?: User) {
    console.log("construct",itemData);
    this.id = itemData.id;
    if(itemData.deleted=true){
      this.id = itemData.id;
      this.deleted=true;
      this.parentId=itemData.parent;
      this.time=new Date(itemData.time * 1000);
      this.type=itemData.type;
    }else{
      this.createdBy = user ? new UserData(user) : new UserData(itemData.by);
      this.time = new Date(itemData.time * 1000);
      this.type = itemData.type;
      this.dead=itemData.dead;
      this.text=itemData.text;
      this.deleted=itemData.deleted;
      this.commentsIds = itemData.kids;
      this.totalComments = itemData.kids?itemData.kids.length:0;
      this.parentId=itemData.parent;
    }
 
  }
}


export class UserData{
  userName: string = ''; //id 
  createdAt: Date = new Date();//Unix Time
  karma: number = 0;
  about?: string;
  allSubmittedIds?: number[] = []; //submitted
  submittedCommentsId?: number[] = [];
  lastThreeSubmittedComments?: Comment[] = [];
  submittedStoriesId?: number[] = [];
  lastThreeSubmittedStories?: Story[] = [];
  submittedPollIds?: number[];  //parts
  submittedPolls?: Poll[] = [];

  constructor(userName: string);
  constructor(user: User);
  constructor(input: string | User) {
    if (typeof input === 'string') {
      this.userName = input;
    } else {
      this.userName = input.id;
      this.createdAt = new Date(input.created * 1000);
      this.karma = input.karma;
      this.about=input.about;
      this.allSubmittedIds=input.submitted;
    }
  }

}


export class Poll {
  id: number = 0;
  deleted?: boolean;
  createdBy: UserData = new UserData(""); //by
  time: Date = new Date(); //Unix Time
  text?: string;
  dead?: boolean;
  type: string =''; 
  commentsIds?: number[];  //kids
  // lastThreeSubmittedComments?: Comment[] = [];
  votes?: number; //score
  title?: string;
  relatedPolloptIds?: number[];  //parts
  // relatedPollopts?: Pollopt[] = [];
  totalComments?: number;  //descendants
}

//not in use for now
export class Pollopt {
  id: number = 0;
  deleted?: boolean;
  createdBy: UserData = new UserData(""); //by
  time: Date = new Date();
  text?: string;
  dead?: boolean;
  type: string ='';

  commentsIds?: number[];  //kids
  lastThreeSubmittedComments?: Comment[] = [];

  url?: string;
  votes?: number; //score
  title?: string;

  relatedPollsId?: number[];  //parts
  lastThreeRelatedPolls?: Comment[] = [];

  totalComments?: number;  //descendants
}



//*for hacker api uppercase////////////////////////////////*
export class Item {
  id: number = 0;
  deleted?: boolean;
  type: string ='';
  by: string = '';
  time: number = 0;
  text?: string;
  dead?: boolean;
  parent?: number;
  poll?: number;
  kids?: number[];
  url?: string;
  score?: number;
  title?: string;
  parts?: number[];
  descendants?: number;
}

export class User {
  id: string = '';
  created: number = 0;
  karma: number = 0;
  about?: string;
  submitted?: number[] = [];
}


export class ChangedItemsAndProfiles {
  items: number[] = [];
  profiles: string[] = [];
}
