// item entity nestjs service using DTOs

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ItemDto } from './item.dto';
import { Item } from './item.entity';


@Injectable()
export class ItemService {
constructor(
    @InjectRepository(Item)
    private readonly itemRepository: Repository<Item>,
    ) {}

    async findAll(filter): Promise<Item[]> {
        if (filter) {
            return await this.itemRepository.find(filter);
        }
        return await this.itemRepository.find();
    }

    async findOne(id: number): Promise<Item> {

        return await this.itemRepository.findOne(id);
    }
    

    async create(itemDto: ItemDto): Promise<Item> {
        const item = new Item();
        item.name = itemDto.name;
        item.description = itemDto.description;
        item.price = itemDto.price;
        item.quantity = itemDto.quantity;
        item.image = itemDto.image;
        item.category = itemDto.category;
        return await this.itemRepository.save(item);
    }
    

    async update(id: number, itemDto: ItemDto): Promise<Item> {
        const item = await this.itemRepository.findOne(id);
        item.name = itemDto.name;
        item.description = itemDto.description;
        item.price = itemDto.price;
        item.quantity = itemDto.quantity;
        item.image = itemDto.image;
        item.category = itemDto.category;
        return await this.itemRepository.save(item);
    }

    async delete(id: number): Promise<Item> {
        const item = await this.itemRepository.findOne(id);
        return await this.itemRepository.remove(item);
    }
}

