import { Territory } from './territory.entity';
import { TerritoryService } from './territory.service';
export declare class TerritoryController {
    private readonly territoryService;
    constructor(territoryService: TerritoryService);
    findAll(req: any): Promise<any>;
    filter(query: any): Promise<any>;
    findOne(id: string, req: any): Promise<Territory>;
    findOneByName(name: string, req: any): Promise<any>;
    save(territory: any, req: any): Promise<Territory>;
    update(territory: any, req: any): Promise<Territory>;
    delete(id: string, req: any): Promise<void>;
    findTree(organizationId: string, req: any): Promise<Territory[]>;
    findByParent(id: string, req: any): Promise<Territory[]>;
    findByName(name: string, req: any): Promise<Territory>;
    findByCode(code: string, req: any): Promise<Territory>;
    findByAncestors(id: string, req: any): Promise<never[] | Territory>;
    findByDescendants(id: string, req: any): Promise<never[] | Territory>;
    uploadUnimoveHubs(req: any, file: any): Promise<{
        status: string;
        message: string;
    }>;
    deleteUnimoveHubs(): Promise<{
        status: string;
        message: string;
    }>;
}
