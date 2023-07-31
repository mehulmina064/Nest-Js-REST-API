import { ObjectID, Repository } from 'typeorm';
import { SupplyChainFeedItem } from './supply-chain-item.entity';
import { SupplyChain } from '../supplychain/supplychain.entity';
export declare class SupplyChainService {
    private readonly supplyChainFeedItemRepository;
    private readonly supplyChainRepository;
    constructor(supplyChainFeedItemRepository: Repository<SupplyChainFeedItem>, supplyChainRepository: Repository<SupplyChain>);
    findAll(): Promise<SupplyChain[]>;
    findOne(id: string): Promise<SupplyChain>;
    filter(filter: any): Promise<SupplyChain[]>;
    update(id: string, supplyChain: any): Promise<import("typeorm").UpdateResult>;
    remove(id: ObjectID | undefined): Promise<void>;
    save(supplyChain: SupplyChain): Promise<SupplyChain>;
    createSupplyChain(supplyChain: SupplyChain): Promise<SupplyChain>;
    createSupplyChainFeedItem(id: string, supplyChainFeedItem: SupplyChainFeedItem): Promise<SupplyChainFeedItem>;
    findSupplyChainFeedItem(id: string): Promise<SupplyChainFeedItem>;
    findSupplyChainFeedItems(filter: any): Promise<SupplyChainFeedItem[]>;
    findSupplyChainFeedItemsBySupplyChain(supplyChainId: string): Promise<SupplyChainFeedItem[]>;
}
