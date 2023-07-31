import { MailOptions, sendMailWithTemplate } from './../mail/mail.service';
import { User } from './../users/user.entity';
import { template } from 'handlebars';
import { PRODO_ORG_ID } from './../common/constants';
import { StatusTemplate } from './document-status.entity';
import { Organization } from './../organization/organization.entity';
import { ClientData } from './../clientData/client-data.entity';
// Create Nest Js Service for Document Entity ./../document/document.entity.ts

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SupplyChain } from '../supplychain/supplychain.entity';
import { getRepository, ObjectID, Repository, TreeRepository,Not } from 'typeorm';
import { Document, DocumentMode, DocumentType } from './document.entity';
import { DocumentStatus } from './document-status.entity';
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';

@Injectable()
export class DocumentService {
    constructor(
        @InjectRepository(Document)
        private readonly documentRepository: Repository<Document>,
        @InjectRepository(SupplyChain)
        private readonly supplychainRepository: Repository<SupplyChain>,
        @InjectRepository(ClientData)
        private readonly clientDataRepository: Repository<ClientData>,
        @InjectRepository(StatusTemplate)
        private readonly statusTemplateRepository: Repository<StatusTemplate>,
        private readonly mailTriggerService: MailTriggerService
    ) { }

    async name(){
        let x = "DocumentService";
        return x;
    }


    async findAll(filter:{}): Promise<Document[]> {
        if (filter) {
            // let org_id=filter.where.organization_id;
            // const data1= await this.clientDataRepository.find({where: {organization_id:org_id}});
            // console.log("old data",data1);
            const data2 = await this.documentRepository.find(filter);
            // return (data1.concat(data2));
            return(data2);
        }
        // const data1= await this.clientDataRepository.find();
        const data2= await this.documentRepository.find();
        // return (data2.concat(data1));
        return(data2);

    }
     
    // async findAll(filter:{}): Promise<Document[]> {
    //     if (filter) {
    //         return await this.documentRepository.find(filter);
    //     }
    //     return await this.documentRepository.find();
    // }

    // async findAllOrder(filter: {}): Promise<ClientData[]> {
    //     if (filter) {
    //         if(filter.where.createdBy){
    //         let id=filter.where.createdBy;
    //         let data1= await this.clientDataRepository.find(filter);
    //         let data2 = await this.documentRepository.find({where: {createdBy:id ,type: "Order"}});
    //         let data3= await this.documentRepository.find({where: {createdBy:id ,type: "RFQ"}});
    //         data2=data2.concat(data3);
    //         // console.log("old data",data1);
    //         return (data1.concat(data2));
    //         }
    //         else{
    //         let data1= await this.clientDataRepository.find(filter);
    //         let org_id=filter.where.organization_id;
    //         let data2 = await this.documentRepository.find({where: {organization_id:org_id ,type: "Order"}});
    //         // console.log(data2);
    //         let data3= await this.documentRepository.find({where: {organization_id:org_id ,type: "RFQ"}});
    //         data2=data2.concat(data3);
    //         // console.log("old data",data1);
    //         return (data1.concat(data2));
    //         }
    //     }
    //     let data1= await this.clientDataRepository.find();
    //     let data2= await this.documentRepository.find({where: {type: "Order"}});
    //     let data3= await this.documentRepository.find({where: {type: "RFQ"}});
    //     let data4= await this.documentRepository.find({where: {type: "PO"}});
    //     data2=data2.concat(data4);

    //     data2=data2.concat(data3);
    //     return (data1.concat(data2));

    // }

    async findOne(id: string): Promise<Document> {
        return await this.documentRepository.findOne(id);
    }
    
    async filter(filter: any) {
        return await this.documentRepository.find(filter);
    }
    async update(id: ObjectID, document: any) {
        return await this.documentRepository.update(id, document)
    }

    async remove(id: ObjectID | undefined) {
        const document = this.documentRepository.delete(String(id));

    }
    async getDocumentTypes(){
        return Object.keys(DocumentType);
    }
    async getDocumentStatus(){
        return Object.keys(DocumentStatus);
    }
    async save(document: Document) {
        if (document.id) {
            return await this.documentRepository.update(document.id, document);
        }
        if (!document.id) {
            return await this.documentRepository.save(document);
        }
        return await this.documentRepository.save(document);
    }
    async importClientData() {

        const cds = await this.clientDataRepository.find({
            where: {
                organization_id: '627902e523d4fea60a7a2579'
            }
        }).then(result => {
            result.forEach(async cd => {
                
                // create new order
                async function createOrder(){
                    const order = new Document();
                order.org_to_id = '62454e0db08559a53237cde1';
                console.log(cd.organization_id);
                order.org_from_id = cd.organization_id;
                order.organization_id = cd.organization_id;
                order.number = new Date().getTime().toString();
                order.date = cd.po_date
                order.fulfillmentMonth = cd.fulfillment_month
                order.line_items = cd.line_items;
                order.category = cd.category_of_products
                order.documentMode = DocumentMode.Information;
                order.total_amount = cd.invoice_amount_inc_gst;
                order.type = DocumentType.Order;
                let current_status =  new DocumentStatus();
                current_status.status = cd.status;
                order.current_status = current_status;
                const savedOrder = await getRepository(Document).save(order);
                console.log('savedOrder', savedOrder.org_from_id, savedOrder.org_to_id);
                return savedOrder
                }
                
    
                // // create new invoice
                async function createInvoice(order: Document){
                const invoice = order
                delete invoice.id
                delete invoice._id
                invoice.type = DocumentType.Invoice;
                invoice.org_from_id = '62454e0db08559a53237cde1'
                invoice.org_to_id = order.organization_id
                invoice.due_date = cd.due_date_of_receivable_from_client;
                const savedInvoice = await getRepository(Document).save(invoice);
                console.log('savedInvoice', savedInvoice.org_from_id, savedInvoice.org_to_id);
                return savedInvoice
            }
    
                // // create new receipt
                async function createReceipt(invoice: Document){
                let receipt = invoice
                //delete id and _id
                delete receipt.id
                delete receipt._id
                receipt.type = DocumentType.Receipt;
                receipt.total_amount = cd.amount_received
                const savedReceipt = await getRepository(Document).save(receipt);
                console.log('savedReceipt', savedReceipt.org_from_id, savedReceipt.org_to_id);
                return savedReceipt }
                
                // create new purchase order
                async function createPurchaseOrder(order: Document){
                let po = order
                delete po.id
                delete po._id
                po.org_from_id = order.organization_id
                po.org_to_id = '62454e0db08559a53237cde1'
                po.number = cd.purchase_order
                po.type = DocumentType.PO;
                const savedPO = await getRepository(Document).save(po); 
                console.log('savedPO', savedPO.org_from_id, savedPO.org_to_id);
                return savedPO }
    
                // relate documents
                function relateDocuments(savedOrder: Document, savedPO: Document, savedReceipt: Document, savedInvoice: Document){
                savedOrder.related_documents = [ savedPO.id, savedPO.id, savedReceipt.id ]
                savedOrder =  getRepository(Document).save(savedOrder);
                savedPO.related_documents = [ savedOrder.id, savedInvoice.id, savedReceipt.id ]
                savedPO = getRepository(Document).save(savedPO);
                savedInvoice.related_documents = [ savedOrder.id, savedPO.id, savedReceipt.id ]
                savedInvoice =  getRepository(Document).save(savedInvoice);
                savedReceipt.related_documents = [ savedOrder.id, savedPO.id, savedInvoice.id ]
                savedReceipt =  getRepository(Document).save(savedReceipt);
                console.log(`${savedOrder} ${savedPO.id} ${savedInvoice.id} ${savedReceipt.id}`);
                return {savedOrder, savedPO, savedReceipt, savedInvoice}
                }
                
                // RUN ABOVE FUNCTIONS TO with .then(result
                createOrder().then(order => {
                    createInvoice(order).then(invoice => {
                        createReceipt(invoice).then(receipt => {
                            createPurchaseOrder(order).then(po => {
                                relateDocuments(order, po, receipt, invoice)
                            })
                        })
                    })
                })


   

                // create new order
                
    
    
    
            });
        })
        
        return {
            message: 'success'
        }
    }

    async cleanData(){
        const org_ids = ['622326fd89dffa1358e0353a','6221f7271fe327711fef3615','6223272889dffa1358e0353d']
        org_ids.forEach(async org_id => {
            const cds = await this.documentRepository.find({organization_id: org_id})
            await this.documentRepository.remove(cds);
            console.log(`${org_id} deleted`);
    })
    return {
        message: 'success'
    }}
    // Create Crud for Document Status Template

    async getDocumentStatusTemplate() {
        return await this.statusTemplateRepository.find();
    }
   async getDocumentStatusTemplateByType(type: string) {
        return await this.statusTemplateRepository.find({where: {type: type}});
    }
    async getDocumentStatusTemplateById(id: string) {
        return await this.statusTemplateRepository.findOne(id);
    }
    async saveDocumentStatusTemplate(statusTemplate: StatusTemplate) {
        return await this.statusTemplateRepository.save(statusTemplate);
    }
    async updateDocumentStatusTemplate(id: string, statusTemplate: StatusTemplate) {
        return await this.statusTemplateRepository.update(id, statusTemplate);
    }
    async removeDocumentStatusTemplate(id: string) {
        return await this.statusTemplateRepository.delete(id);
    }
    async getActionsFromCode(code: string) {
        // get all actions from code and return them as an array of actions from status template.statuses
        const statusTemplate = await this.statusTemplateRepository.findOne({ where: {
            statuses: {$elemMatch :  {code: code}}
        }});
        if(statusTemplate){
        return statusTemplate.statuses.filter(status => status.code === code)[0].actionAvailable;
        }
        return [];


    }
    async getStatusTemplateFromCode(code: string) {
        const statusTemplate = await this.statusTemplateRepository.findOne({ where: {
            statuses: {$elemMatch :  {code: code}}
        }});
        if(statusTemplate){
        return statusTemplate.statuses.filter(status => status.code === code)[0];
        }
        return [];


    }
    async updateDocumentStatus(id: string, status: DocumentStatus, user:User) { 
        console.log('updateDocumentStatus', id, status, user);
        const foundUser = await getRepository(User).findOne(user.id);  
        const document = await this.documentRepository.findOne(id);
        if(document){

            document.current_status = status;
            status.updatedAt = new Date();
            status.updatedBy = String(user.id);
            document.statusTracking.push(status);
            document.current_status = status;
            const savedDocument = await this.documentRepository.save(document);
            //send mail by mailTrigger service
            let mailOptions = {
                TriggerName: 'DocumentStatusUpdate',
                doc: document,
                templatevars: {
                     document: document,
                     status: status.status,
                     description: status.description,
                     user: foundUser,
                     datetime: new Date().toDateString(),
                 }
            }
            this.mailTriggerService.SendMail(mailOptions);

            // const clientMail: MailOptions = {
            //         from: '"Document Management" <noreply@prodo.in>',
            //         to: foundUser.email,
            //         subject: `${document.type} - ${document.number} has a new  update`,
            //         template: 'statusTemplate',
            //         templatevars: {
            //             document: document,
            //             status: status.status,
            //             user: foundUser,
            //             datetime: new Date().toDateString(),
            //         }
            //     };
            // const prodoMail: MailOptions = {
            //         from: '"Document Management" <noreply@prodo.in>',
            //         to: 'sales@prodo.in',
            //         subject: `${document.type} with serial number ${document.number} status updated`,
            //         template: 'statusTemplate',
            //         templatevars: {
            //             document: document,
            //             status: status.description,
            //             datetime: new Date().toDateString(),
            //             user: foundUser
            //         }
            //     };
            //     await sendMailWithTemplate(prodoMail);
            //     await sendMailWithTemplate(clientMail);
            return savedDocument;

        }

    }
     async findByOrgId(org_id: string) {
         console.log('findByOrgId', org_id);
         
        return await this.documentRepository.find({
            where: {
                $or: [
                    {
                        org_from_id: org_id
                    },
                    {
                        org_to_id: org_id
                    }
                ]
            }
        });
    }

    async getRootDocs(org_id: string) {
        return await this.documentRepository.find({ where: {
            organization_id: org_id,
            parent_id: null
        }});
    }
    async getChildDocs(parent_id: string) {
        return await this.documentRepository.find({ where: {
            parent_id: parent_id
        }});
    }
    async getDocsByType(type: string) {
        return await this.documentRepository.find({ where: {
            type: type
        }});
    }
 
    
   
    
    async getParent(id: string) {
        const doc = await this.documentRepository.findOne(id);
        if(doc){
        return await this.documentRepository.findOne(doc.predecessor);
        }
        return null;
    }
    async getChildren(id: string) {
        const doc = await this.documentRepository.findOne(id);
        if(doc){
        return await this.documentRepository.find({ where: {
            predecessor: id
        }});
        }
        return [];
    }
    async getSiblings(id: string) {
        const doc = await this.documentRepository.findOne(id);
        if(doc){
        return await this.documentRepository.find({ where: {
            predecessor: doc.predecessor
        }});
        }
        return [];
    }
    async getSiblingsTree(id: string) {
        const doc = await this.documentRepository.findOne(id);
        if(doc){
        return await this.documentRepository.find({ where: {
            predecessor: doc.predecessor
        }});
        }
        return [];
    }

    async getChildrenTree(id: string) {
        const children = await this.getChildren(id);
        const childrenTree = [];
        for(const child of children){
            childrenTree.push(child);
            const childChildren = await this.getChildren(child.id);
            if(childChildren.length > 0){
                childrenTree.push(...childChildren);
            }
        
        }
        return childrenTree;
    }
   
    async updateOrder(id: string, document: Document) {
        
        return await this.documentRepository.update(id, document);
    }
        
    // async delete_all_data(){
    //     const org_ids = [
    //         '629dda57b0b86e9d91f05943',//mehul
    //         '623b0c34b08559a53237cdc6',//mehul2
    //         '6236c389b08559a53237cdb0',//santosh1 ray 989..
    //         '627e5720f0c5bd37406762be',//santosh2
    //         '62510ae8abc6df862cdf0ae9',//santosh3
    //         '6255256493c78812d03d1046',//tushar1
    //         '6255256493c78812d03d1046',//tushar2
    //         '626f86568d35d6d94c24eece',//tushar3
    //         '6268d5d11e192b13a6dd09f2',//shailesh1
    //         '6278f6df23d4fea60a7a256d',//shreyans.jain1@prodo.in
            

    //     ]
    //     org_ids.forEach(async org_id => {
    //         const cds = await this.documentRepository.find({where: {organization_id: org_id}})
    //         console.log(cds);

    //         await this.documentRepository.remove(cds);
    //         console.log(`${org_id} delete all documents `);
    //     });
    // }
    async all_data(filter:{}){
            const cds = await this.documentRepository.find(filter);
            // console.log(filter);
            // console.log(cds.length);
            return cds;
    }
 
}