import { User } from './../users/user.entity';
import { StatusTemplate } from './document-status.entity';
import { ClientData } from './../clientData/client-data.entity';
import { SupplyChain } from '../supplychain/supplychain.entity';
import { ObjectID, Repository } from 'typeorm';
import { Document } from './document.entity';
import { DocumentStatus } from './document-status.entity';
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';
export declare class DocumentService {
    private readonly documentRepository;
    private readonly supplychainRepository;
    private readonly clientDataRepository;
    private readonly statusTemplateRepository;
    private readonly mailTriggerService;
    constructor(documentRepository: Repository<Document>, supplychainRepository: Repository<SupplyChain>, clientDataRepository: Repository<ClientData>, statusTemplateRepository: Repository<StatusTemplate>, mailTriggerService: MailTriggerService);
    name(): Promise<string>;
    findAll(filter: {}): Promise<Document[]>;
    findOne(id: string): Promise<Document>;
    filter(filter: any): Promise<Document[]>;
    update(id: ObjectID, document: any): Promise<import("typeorm").UpdateResult>;
    remove(id: ObjectID | undefined): Promise<void>;
    getDocumentTypes(): Promise<string[]>;
    getDocumentStatus(): Promise<string[]>;
    save(document: Document): Promise<import("typeorm").UpdateResult | Document>;
    importClientData(): Promise<{
        message: string;
    }>;
    cleanData(): Promise<{
        message: string;
    }>;
    getDocumentStatusTemplate(): Promise<StatusTemplate[]>;
    getDocumentStatusTemplateByType(type: string): Promise<StatusTemplate[]>;
    getDocumentStatusTemplateById(id: string): Promise<any>;
    saveDocumentStatusTemplate(statusTemplate: StatusTemplate): Promise<StatusTemplate>;
    updateDocumentStatusTemplate(id: string, statusTemplate: StatusTemplate): Promise<import("typeorm").UpdateResult>;
    removeDocumentStatusTemplate(id: string): Promise<import("typeorm").DeleteResult>;
    getActionsFromCode(code: string): Promise<never[] | {
        from: [];
        to: [];
    }>;
    getStatusTemplateFromCode(code: string): Promise<never[] | DocumentStatus>;
    updateDocumentStatus(id: string, status: DocumentStatus, user: User): Promise<any>;
    findByOrgId(org_id: string): Promise<any>;
    getRootDocs(org_id: string): Promise<any>;
    getChildDocs(parent_id: string): Promise<any>;
    getDocsByType(type: string): Promise<Document[]>;
    getParent(id: string): Promise<Document | null>;
    getChildren(id: string): Promise<Document[]>;
    getSiblings(id: string): Promise<Document[]>;
    getSiblingsTree(id: string): Promise<Document[]>;
    getChildrenTree(id: string): Promise<any[]>;
    updateOrder(id: string, document: Document): Promise<import("typeorm").UpdateResult>;
    all_data(filter: {}): Promise<Document[]>;
}
