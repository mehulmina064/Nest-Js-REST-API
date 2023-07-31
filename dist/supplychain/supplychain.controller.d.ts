import { ObjectID } from 'typeorm';
import { SupplyChain } from './supplychain.entity';
import { SupplyChainFeedItem } from './supply-chain-item.entity';
import { SupplyChainService } from './supplychain.service';
export declare class SupplyChainController {
    private readonly supplyChainService;
    constructor(supplyChainService: SupplyChainService);
    findAll(): Promise<SupplyChain[]>;
    findOne(id: string): Promise<SupplyChain>;
    filter(filter: any): Promise<SupplyChain[]>;
    update(id: string, supplyChain: any): Promise<SupplyChain>;
    remove(id: ObjectID | undefined): Promise<SupplyChain>;
    save(supplyChain: SupplyChain): Promise<SupplyChain>;
    createSupplyChain(supplyChain: SupplyChain): Promise<SupplyChain>;
    createSupplyChainFeedItem(id: string, supplyChainFeedItem: SupplyChainFeedItem): Promise<SupplyChainFeedItem>;
}
