// Create Controller for Supply Chain Service

import { Controller, Delete, Get, Injectable, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ObjectID, Repository } from 'typeorm';
import { SupplyChain } from './supplychain.entity';
import { SupplyChainFeedItem } from './supply-chain-item.entity';
import { SupplyChainType } from './supplychain.entity';
import { SupplyChainService } from './supplychain.service';


@Controller('supplychain')
export class SupplyChainController {
    constructor(
        private readonly supplyChainService: SupplyChainService,
    ) { }

    @Get()
    async findAll(): Promise<SupplyChain[]> {
        return await this.supplyChainService.findAll();
    }

    @Get('/:id')
    async findOne(id: string): Promise<SupplyChain> {
        return await this.supplyChainService.findOne(id);
    }

    @Get('/filter')
    async filter(filter: any): Promise<SupplyChain[]> {
        return await this.supplyChainService.filter(filter);
    }

    @Post(':id')
    async update(id: string, supplyChain: any): Promise<SupplyChain> {
        return await this.supplyChainService.update(id, supplyChain);
    }

    @Delete(':id')
    async remove(id: ObjectID | undefined): Promise<SupplyChain> {
        return await this.supplyChainService.remove(id);
    }

    @Post('/save')
    async save(supplyChain: SupplyChain): Promise<SupplyChain> {
        // check if supplyChain already exists
        const foundSupplyChain = await this.supplyChainService.findOne({ supplyChainSerialNumber: supplyChain.supplyChainSerialNumber });
        if (foundSupplyChain) {
            return this.supplyChainService.save(supplyChain);
        } else {
            return this.supplyChainService.save(supplyChain);
        }
    }

    @Post('/create')
    async createSupplyChain(supplyChain: SupplyChain): Promise<SupplyChain> {
        return await this.supplyChainService.createSupplyChain(supplyChain);
    }

    @Post('/create-feed-item/:id')
    async createSupplyChainFeedItem(id:string,supplyChainFeedItem: SupplyChainFeedItem): Promise<SupplyChainFeedItem> {
        return await this.supplyChainService.createSupplyChainFeedItem(id,supplyChainFeedItem);
    }



}

