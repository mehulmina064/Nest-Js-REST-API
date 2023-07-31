import { MailService } from './../mail/mail.service';
import { ObjectID } from "typeorm";
import { DocumentService } from "./document.service";
import { Document } from "./document.entity";
import { SupplyChainService } from "../supplychain/supplychain.service";
import { DocumentStatus } from './document-status.entity';
import { CategoryService } from './../categories/category.service';
import { ClientDataService } from './../clientData/client-data.service';
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';
export declare class DocumentController {
    private readonly documentService;
    private readonly supplychainService;
    private readonly mailService;
    private readonly categoryService;
    private readonly clientDataService;
    private readonly mailTriggerService;
    constructor(documentService: DocumentService, supplychainService: SupplyChainService, mailService: MailService, categoryService: CategoryService, clientDataService: ClientDataService, mailTriggerService: MailTriggerService);
    findAll(req: any, query: any): Promise<any>;
    getDocumentType(req: any): Promise<any>;
    updateDocumentStatus(documentStatus: DocumentStatus, req: any, id: string): Promise<any>;
    updateOrder(req: any, id: string, document: any): Promise<import("typeorm").UpdateResult>;
    filter(query: any): Promise<Document[]>;
    getChartData(type: string, req: any): Promise<any>;
    findOne(id: string, req: any): Promise<any>;
    findByOrgId(id: string): Promise<any>;
    save(document: Document, query: any, req: any): Promise<Document | import("typeorm").UpdateResult>;
    saveRfq(document: Document): Promise<Document | import("typeorm").UpdateResult>;
    update(id: string, document: any, req: any): Promise<any>;
    delete(id: ObjectID | undefined): Promise<void>;
    importClientData(req: any): Promise<{
        message: string;
    }>;
    getStatusTemplate(req: any): Promise<import("./document-status.entity").StatusTemplate[]>;
    getDocumentTypeTemplate(req: any, type: string): Promise<import("./document-status.entity").StatusTemplate[]>;
    getActionsFromCode(req: any, code: string): Promise<{
        from: [];
        to: [];
    } | never[]>;
    getStatusTemplateFromCode(req: any, code: string): Promise<DocumentStatus | never[]>;
    saveDocumentStatusTemplate(req: any, document: any): Promise<import("./document-status.entity").StatusTemplate>;
    updateDocumentStatusTemplate(req: any, id: string, document: any): Promise<import("typeorm").UpdateResult>;
    deleteDocumentStatusTemplate(req: any, id: string): Promise<any>;
    importCdmData(req: any): Promise<{
        message: string;
    }>;
    cleanData(req: any): Promise<{
        message: string;
    }>;
    docClean(): Promise<{
        message: string;
    }>;
    updateDocs(): Promise<{
        message: string;
    }>;
    getDescendants(id: string): Promise<Document | null>;
    getDescendantsTree(id: string): Promise<Document[]>;
    getAncestors(id: string): Promise<Document[]>;
    getAncestorsTree(id: string): Promise<any>;
    getParentTree(id: string): Promise<any>;
    updatepieChart(data: any, data2: any): Promise<any>;
    all_data(req: any): Promise<{
        orders: {
            total: number;
            completed: number;
            inProgress: number;
            submitted: number;
            cancelled: number;
        };
        rfq: {
            approved: number;
            rejected: number;
            inProgress: number;
            total_submitted: number;
        };
        payments: {
            total: number;
            paid: number;
            due: number;
        };
        pieChart: never[];
        barChart: never[];
    }>;
}
