
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