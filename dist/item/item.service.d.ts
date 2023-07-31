import { Repository } from 'typeorm';
import { ItemDto } from './item.dto';
import { Item } from './item.entity';
export declare class ItemService {
    private readonly itemRepository;
    constructor(itemRepository: Repository<Item>);
    findAll(filter: any): Promise<Item[]>;
    findOne(id: number): Promise<Item>;
    create(itemDto: ItemDto): Promise<Item>;
    update(id: number, itemDto: ItemDto): Promise<Item>;
    delete(id: number): Promise<Item>;
}
