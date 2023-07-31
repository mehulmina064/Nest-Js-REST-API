// Create Service for supplychain.entity.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { OrganizationModel } from '../common/org-model.entity';
import { ObjectID, Repository } from 'typeorm';
import { SupplyChainFeedItem } from './supply-chain-item.entity';
import { SupplyChainType } from './supplychain.entity';
import { SupplyChain } from '../supplychain/supplychain.entity';


@Injectable()
export class SupplyChainService {
    constructor(
        @InjectRepository(SupplyChainFeedItem)
        private readonly supplyChainFeedItemRepository: Repository<SupplyChainFeedItem>,
        @InjectRepository(SupplyChain)
        private readonly supplyChainRepository: Repository<SupplyChain>,
    ) { }

    async findAll(): Promise<SupplyChain[]> {
        return await this.supplyChainRepository.find();
    }

    async findOne(id: string): Promise<SupplyChain> {
        return await this.supplyChainRepository.findOne(id);
    }

    async filter(filter: any) {
        return await this.supplyChainRepository.find(filter);
    }
    async update(id: string, supplyChain: any) {
        return await this.supplyChainRepository.update(id, supplyChain);
    }

    async remove(id: ObjectID | undefined) {
        const supplyChain = this.supplyChainRepository.findOne(id).then(result => {
            this.supplyChainRepository.delete(result);
        });
    }

    async save(supplyChain: SupplyChain) {
        // check if supplyChain already exists
        const foundSupplyChain = await this.supplyChainRepository.findOne({ supplyChainSerialNumber: supplyChain.supplyChainSerialNumber });
        if (foundSupplyChain) {
            return this.supplyChainRepository.save(supplyChain);
        } else {
            return this.supplyChainRepository.save(supplyChain);
        }
    }

    async createSupplyChain(supplyChain: SupplyChain): Promise<SupplyChain> {
        return await this.supplyChainRepository.save(supplyChain);
    }

    async createSupplyChainFeedItem(id:string,supplyChainFeedItem: SupplyChainFeedItem): Promise<SupplyChainFeedItem> {
        let supplychain = await this.supplyChainRepository.findOne(id);
        supplychain.supplyChainFeedItems = [...supplychain.supplyChainFeedItems, supplyChainFeedItem];
        return supplychain.save();
    }

    async findSupplyChainFeedItem(id: string): Promise<SupplyChainFeedItem> {
        return await this.supplyChainFeedItemRepository.findOne(id);
    }

    async findSupplyChainFeedItems(filter: any): Promise<SupplyChainFeedItem[]> {
        return await this.supplyChainFeedItemRepository.find(filter);
    }

    async findSupplyChainFeedItemsBySupplyChain(supplyChainId: string): Promise<SupplyChainFeedItem[]> {
        return await this.supplyChainFeedItemRepository.find({ id: supplyChainId });
    }

    

}


