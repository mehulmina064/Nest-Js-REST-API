import { ItemService } from './item.service';
import { Item } from './item.entity';
export declare class ItemController {
    private readonly itemService;
    constructor(itemService: ItemService);
    getAllItems(req: any, query: any): Promise<Item[]>;
    getItem(id: number, req: any): Promise<Item>;
    addItem(item: Item, req: any): Promise<Item>;
    updateItem(id: number, item: Item): Promise<Item>;
    deleteItem(id: number): Promise<Item>;
}
