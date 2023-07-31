import { ObjectID, Repository } from 'typeorm';
import { ClientData } from './client-data.entity';
export declare class ClientDataService {
    private readonly clientDataRepository;
    constructor(clientDataRepository: Repository<ClientData>);
    findAll(filter: {}): Promise<ClientData[]>;
    name(): Promise<string>;
    getLineItems(id: any): Promise<[]>;
    updateDataBase(): Promise<void>;
    findOne(id: string): Promise<ClientData>;
    filter(filter: any): Promise<ClientData[]>;
    update(id: string, clientData: any): Promise<import("typeorm").UpdateResult>;
    remove(id: ObjectID | undefined): Promise<void>;
    save(clientData: ClientData): Promise<import("typeorm").UpdateResult | ClientData>;
    attachFile(id: string, file: any, document_name: string): Promise<any>;
    removeFile(id: string, file_name: string): Promise<any>;
    getAttachedFiles(id: string): Promise<any>;
    findbypurchaseorder(purchase_order: string): Promise<any>;
    bulkUploadFromExcel(file: any): Promise<any[]>;
    addLineItems(po: any, lineItems: any): Promise<import("typeorm").UpdateResult | undefined>;
    updateData(po: any, data: any): Promise<void>;
}
