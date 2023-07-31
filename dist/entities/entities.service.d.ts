import { ObjectID, Repository } from 'typeorm';
import { Entitie } from './entity.entity';
export declare class entitiesService {
    private readonly entityRepository;
    constructor(entityRepository: Repository<Entitie>);
    save(orgId: any, companyId: any, entityData: any): Promise<Entitie>;
    create(orgId: string, companyId: string, zipCode: string): Promise<Entitie>;
    findAll(): Promise<Entitie[]>;
    findOne(id: any): Promise<any>;
    update(id: number, data: any): string;
    remove(id: number): string;
    findEntities(ids: any): Promise<Entitie[]>;
    addStatus(): Promise<{
        id: ObjectID | undefined;
        update: any;
    }[]>;
    mapEntity(salesOrder: any): Promise<false | Entitie>;
    zohoCustomerEntity(entity: Entitie): Promise<Entitie>;
}
