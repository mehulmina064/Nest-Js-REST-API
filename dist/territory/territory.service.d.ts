import { User } from 'src/users/user.entity';
import { TreeRepository } from 'typeorm';
import { Territory } from './territory.entity';
export declare class TerritoryService {
    private readonly territoryRepository;
    constructor(territoryRepository: TreeRepository<Territory>);
    findAll(user: User): Promise<any>;
    findOne(id: string): Promise<Territory>;
    findByCode(code: string): Promise<Territory>;
    findByName(name: string): Promise<Territory>;
    findById(id: string): Promise<Territory>;
    findByParent(parent: string): Promise<Territory[]>;
    findByLevel(level: number): Promise<Territory[]>;
    save(territory: Territory): Promise<Territory>;
    delete(id: string): Promise<void>;
    update(id: string, territory: any): Promise<Territory>;
    getChildren(id: string): Promise<never[] | Territory>;
    findAncestors(id: string): Promise<never[] | Territory>;
    findParent(id: string): Promise<Territory[] | {
        "message": string;
    }>;
    getLevel(id: string): Promise<number>;
    getTerritoryTree(): Promise<Territory[]>;
    findRoots(): Promise<Territory[]>;
    findDescendants(id: string): Promise<Territory[]>;
    findAncestorsTree(id: string): Promise<Territory[]>;
    findDescendantsTree(id: string): Promise<Territory[]>;
    findSiblings(id: string): Promise<Territory[]>;
    uploadUnimoveHubs(file: any): Promise<{
        status: string;
        message: string;
    }>;
    deleteTerritories(): Promise<{
        status: string;
        message: string;
    }>;
}
