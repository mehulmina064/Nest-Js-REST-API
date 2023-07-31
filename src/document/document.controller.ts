import { Organization } from './../organization/organization.entity';
import { User } from '../users/user.entity';
import { PRODO_ORG_ID } from './../common/constants';
import { MailService, MailOptions } from './../mail/mail.service';
import { filterAllData, filterSingleObject } from '../common/utils';
import { Body, Controller, Param, Query, Request, UseGuards } from "@nestjs/common";
import { Get,Post,Patch,Delete } from "@nestjs/common";
import { ObjectID, getMongoRepository } from "typeorm";
import { DocumentService } from "./document.service";
import { Document,DocumentType } from "./document.entity";
import { SupplyChainService } from "../supplychain/supplychain.service";
import { JwtAuthGuard } from "../authentication/jwt-auth.guard";
import { DocumentStatus } from './document-status.entity';
import { Order } from 'dist/orders/order.entity';
import { UserRole } from './../users/roles.constants';
import { CategoryService } from './../categories/category.service';
import { async } from 'rxjs/internal/scheduler/async';
import { ClientDataService } from './../clientData/client-data.service';
import { MailTriggerService } from './../mailTrigger/mailTrigger.service';

import e = require('express');
// import { Item } from 'dist/item/item.entity';
@Controller('documents')
export class DocumentController {
    constructor(private readonly documentService: DocumentService, private readonly supplychainService:SupplyChainService, private readonly mailService : MailService, private readonly categoryService : CategoryService,private readonly clientDataService : ClientDataService,
    private readonly mailTriggerService: MailTriggerService,
        ) { }
    
    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Request() req, @Query() query) {
        // console.log('find all called',req.user);
        return await filterAllData(this.documentService, req.user);
    }
    // @Get("orders-dashboard-data")
    // @UseGuards(JwtAuthGuard)
    // async findAllOrder(@Request() req, @Query() query) {
    //     // console.log('find all called',req.user);
    //     let org_id=req.user.organization_id;
    //     let user_id=req.user.id;
    //     if(req.user.roles){if(req.user.roles.includes(UserRole.PRODO)){
    //         return await this.documentService.findAllOrder();
    //     }
    //     if(req.user.roles.includes(UserRole.ADMIN)){
    //         return await this.documentService.findAllOrder({where: {organization_id: org_id}});

    //     }}       
    //     return await this.documentService.findAllOrder({where: {createdBy:user_id}});
    //     // return await this.documentService.findAllOrder({where: {organization_id: org_id}});

    // }
    @Get('gettype')
    @UseGuards(JwtAuthGuard)
    async getDocumentType(@Request() req) {
        return await this.documentService.getDocumentType();
    }

    @Patch('update-status/:id/')
    @UseGuards(JwtAuthGuard)
    async updateDocumentStatus(@Body() documentStatus: DocumentStatus, @Request() req,@Param('id') id:string) {
        return await this.documentService.updateDocumentStatus(id,documentStatus, req.user);
    }
    //ooooorrder
    
    @Patch('update-order/:id/')
    @UseGuards(JwtAuthGuard)
    async updateOrder(@Request() req, @Param('id') id: string, @Body() document: any) {
        return await this.documentService.updateOrder(id, document);
    }

    
    @Get('filter')
    @UseGuards(JwtAuthGuard)
    async filter(@Query() query) {
        return await this.documentService.filter(query);
    }
    @Get('chartdata/:type')
    @UseGuards(JwtAuthGuard)
    async getChartData(@Param('type') type: string, @Request() req) {
        return await this.documentService.getChartData(type, req.user.organization_id);
    } 

    @Get('documentbyid/:id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string,@Request() req) {
        const obj= await this.documentService.findOne(id);
        if(obj){
            return filterSingleObject(obj, req.user);
        }
    }
    @Get('get-doc-by-org/:id')
    @UseGuards(JwtAuthGuard)
    async findByOrgId(@Param('id') id: string) {
        if (id === undefined || id === null || id === '') {
            return {
                message: 'Organization id is required'
            }
        }
        return await this.documentService.findByOrgId(id);
    }
    @UseGuards(JwtAuthGuard)
    @Post()
    async save(@Body() document: Document, @Query() query, @Request() req) {
        document.createdBy = req.user.id;
        const user = await getMongoRepository(User).findOne(req.user.id);
        const org = await getMongoRepository(Organization).findOne(req.user.organization_id);
        let saveDocument = await this.documentService.save(document);
        let clientMailSubject = 'New Document Attached';
        let prodoMailSubject = 'New Document Attached';
        let clientContext = 'New Document Attached';
        let prodoContext = 'New Document Attached';
        let prodoMail = 'operations@prodo.in';
        let template = 'document';
        let TriggerName = '';
        let doc;
        if (document.type === DocumentType.RFQ) {
            // clientMailSubject = `Your RFQ ${document.number} has been created`;
            // prodoMailSubject = `New RFQ ${document.number} has been created`;
            // prodoMail = 'sales@prodo.in';
            clientContext = `Your RFQ ${document.number} has been created, Please check the details.`;
            prodoContext = `New RFQ ${document.number} Created by ${user.firstName} from ${org.name}`;
            // template = 'rfq';
            TriggerName='docRfq';
            doc = user;
        }
        if (document.type === DocumentType.PO) {
            // clientMailSubject = `Your PO ${document.number} has been created`;
            // prodoMailSubject = `New PO ${document.number} has been created`;
            clientContext = `Your PO ${document.number} has been created`;
            prodoContext = `New PO ${document.number} Created`;
            TriggerName='docPo';
            doc = user;
        }
        if (document.type === DocumentType.Order) {
            // clientMailSubject = `Your Order ${document.number} has been created`;
            // prodoMailSubject = `New Order ${document.number} has been created`;
            // prodoMail = 'sales@prodo.in';
            clientContext = `${user.firstName} Thank you for your order ${document.number}. Your procurement journey with Prodo has start-end And we're just as excited as you are.`
            prodoContext = `${user.firstName} from ${org.name} has placed an order ${document.number}.`
            // template = 'newOrder';
            TriggerName='docOrder';
            doc = user;
        }
        if (document.type === DocumentType.Invoice) {
            // clientMailSubject = `Your Invoice ${document.number} has been created`;
            // prodoMailSubject = `New Invoice ${document.number} has been created`;
            // prodoMail = 'sales@prodo.in';
            clientContext = `Your Invoice ${document.number} has been created, Please check the details.`;
            prodoContext = `New Invoice ${document.number} Created by ${user.firstName} from ${org.name}`;
            
            TriggerName='docInvoice';
            doc = user;
        }
        // let mailOptionsClient : MailOptions= 
        // {
        //     from: '"Prodo" <noreply@prodo.in>',
        //     to: user.email,
        //     subject: clientMailSubject,
        //     context: clientContext,
        //     template: template,
        //     templatevars: {
        //         user: user,
        //         doc: saveDocument,
        //         org: org,
        //         context: clientContext
        //     }
        // }
        // let mailOptionsProdo : MailOptions= {
        //     from: '"Prodo" <noreply@prodo.in>',
        //     to: prodoMail,
        //     subject: prodoMailSubject,
        //     template: template,
        //     templatevars: {
        //         user: user,
        //         doc: saveDocument,
        //         org: org,
        //         context: prodoContext
        //     }
        // }
        
        let mailOptions = {
            TriggerName: TriggerName,
            doc: doc,
            templatevars:{
                user: user,
                doc: saveDocument,
                org: org,
                clientContext: clientContext,
                prodoContext: prodoContext
            },
        }
        this.mailTriggerService.SendMail(mailOptions);
        // this.mailService.sendMailWithTemplate(mailOptionsClient);
        // this.mailService.sendMailWithTemplate(mailOptionsProdo);

        return saveDocument;
    }
    @Post('save-rfq')
    async saveRfq(@Body() document: Document) {
        const saveRfq = await this.documentService.save(document)
        let mailOptions = {
            TriggerName: 'newRfq',
            doc: document.additionalData[0].formData,
            templatevars: {
                doc: document,
                formData: document.additionalData[0].formData,
                context: 'RFQ Created'
            },
        }
        this.mailTriggerService.SendMail(mailOptions);
        // if(document.additionalData[0].formData){
        // let mailOptions = [{
        //     from: '"PRODO" < noreply@prodo.in >',
        //     to: ['sales@prodo.in', 'sameen@prodo.in'],
        //     subject: 'New RFQ Created',
        //     template: 'publicRfq',
        //     templatevars: {
        //         doc: document,
        //         formData: document.additionalData[0].formData,
        //         context: 'New RFQ Created'
        //     },
            
        // },
        // {
        //     from: '"PRODO" <noreply@prodo.in>',
        //     to: document.additionalData[0].formData.email,
        //     subject: 'Your RFQ has been created',
        //     template: 'publicRfq',
        //     templatevars: {
        //         doc: document,
        //         formData: document.additionalData[0].formData,
        //         context: 'Your RFQ has been created'
        //     }
            
        // }]
        //  mailOptions.forEach(async (mailOption) => {
        //      this.mailService.sendMailWithTemplate(mailOption);
        // }); }
        return saveRfq;

    }

    @Patch('update/:id')
    @UseGuards(JwtAuthGuard)
    async update(@Param('id') id: string, @Body() document: any,@Request() req) {
        console.log('req', req);
        document.updatedBy = req.user.id;
        return await this.documentService.update(id, document);
    }

    @Delete('delete/:id')
    async delete(@Param('id') id: ObjectID | undefined) {
        return await this.documentService.remove(id);
        
    }
    @Get('import-client-data')
    async importClientData(@Request() req) {
        return await this.documentService.importClientData();
    }

    @Get('status-template')
    async getStatusTemplate(@Request() req) {
        return await this.documentService.getDocumentStatusTemplate()
    }

    @Get('document-type-template/:type')
    async getDocumentTypeTemplate(@Request() req, @Param('type') type: string) {
        return await this.documentService.getDocumentStatusTemplateByType(type);
    }
    
    @Get('get-actions-from-code/:code')
    async getActionsFromCode(@Request() req, @Param('code') code: string) {
        return await this.documentService.getActionsFromCode(code);
    }

    @Get('get-status-template-from-code/:code')
    async getStatusTemplateFromCode(@Request() req, @Param('code') code: string) {
        return await this.documentService.getStatusTemplateFromCode(code);
    }

    @Post('save-status-template/')
    async saveDocumentStatusTemplate(@Request() req, @Body() document: any) {
        return await this.documentService.saveDocumentStatusTemplate(document);
    }

    @Patch('update-status-template/:id')
    async updateDocumentStatusTemplate(@Request() req, @Param('id') id: string, @Body() document: any) {
        return await this.documentService.updateDocumentStatusTemplate(id, document);
    }

    @Delete('delete-status-template/:id')
    async deleteDocumentStatusTemplate(@Request() req, @Param('id') id: string) {
        return await this.documentService.deleteDocumentStatusTemplate(id);
    }

    @Get('importdata')
    async importCdmData(@Request() req) {
        return await this.documentService.importClientData();
    }

    @Get('clean-data')
    async cleanData(@Request() req) {
        return await this.documentService.cleanData();
    }


    // @Get('-dashboard-data')
    // @UseGuards(JwtAuthGuard)
    // async getDashboardData(@Request() req) {
    //     let items =  await this.findAllOrder(req);
    //     let data = {
    //         orders : {
    //             total : 0,
    //             completed : 0,
    //             inProgress : 0,
    //             submitted:0,
    //             cancelled : 0
    //         },
    //         rfq : {
    //             approved : 0,
    //             rejected : 0,
    //             inProgress : 0,
    //             total_submitted:0,
    //         },
    //         payments : {
    //             total : 0,
    //             paid : 0,
    //             due : 0,

    //         },
    //         pieChart : [],
    //         barChart : []


    //     }
    //     let current_date = new Date();
    //     // console.log("current date",current_date.toLocaleString('default', { month: 'short', year: 'numeric' }));
    //     for(let i = 0; i < 12; i++){
    //         let date = new Date(current_date.getFullYear(), current_date.getMonth() - i, 1);
    //         let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    //         data.barChart.push({name : month, value : Number(0)});
    //     }
    //     if(items){
    //         items.forEach(async (item) => {
    //             if(item.po_date){
    //                 data.orders.total++;
    //                 data.payments.paid += Number(item.amount_received) || 0;
    //                 data.payments.total += Number(item.invoice_amount_ex_gst) || 0;
                    
    //                 let due_amount = Number(item.invoice_amount_ex_gst) || 0 - Number(item.amount_received) || 0;
    //                 data.payments.due += due_amount;
    //                 if(item.status === 'Delivered'){
    //                     data.orders.completed++;
    //                 }
    //                 else {
    //                     data.orders.inProgress++;
    //                 }

    //                 let found = data.pieChart.find(element => element.name === item.category_of_products);
    //                 if(found){
    //                     found.value += Number(item.invoice_amount_ex_gst) || 0;
    //                 }
    //                 else if(item.category_of_products && item.invoice_amount_ex_gst && item.invoice_amount_ex_gst > 0){
    //                     data.pieChart.push({name : item.category_of_products, value : Number(item.invoice_amount_ex_gst)});
    //                 }

    //                 let date = new Date(item.po_date);
    //                 let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });

    //                 let foundBar = data.barChart.find(element => element.name === month);
    //                 if(foundBar){
    //                     foundBar.value += Number(item.invoice_amount_ex_gst) || 0;
    //                 }
    //                 else if(month && item.invoice_amount_ex_gst && item.invoice_amount_ex_gst > 0){
    //                     data.barChart.push({name : month, value : Number(item.invoice_amount_ex_gst)});
    //                 }
    //             }
    //             else if(item.date){
    //                 if(item.current_status){
    //                     if(item.current_status.status==="RFQ Rejected. Sorry for the inconvenience. Refer mail"){
    //                         data.orders.cancelled++;
    //                         data.rfq.rejected++;
    //                     }
    //                     else if(item.type==="RFQ"&&(!(item.current_status.status==="test"))){
    //                         data.rfq.total_submitted++;
    //                         data.rfq.inProgress++;
    //                         if(item.current_status.status==="RFQ Approved")
    //                         data.rfq.approved++;
    //                     //     let a;
    //                     //        let k=async() =>{ for(a of item.line_items){
    //                     //             if(a.categoryId){
    //                     //                 console.log(a.categoryId);
    //                     //                 console.log(a.price);
    //                     //                 let product= await this.categoryService.categoryName(a.categoryId);
    //                     //                 console.log("loop k andr",product);
    
    //                     //                 let found = data.pieChart.find(element => element.name === product);
    //                     //                 if(found){
    //                     //                     found.value += Number(a.price) || 0;
    //                     //                 }
    //                     //                 else if(a.price > 0) {
    //                     //                     data.pieChart.push({name : product, value : Number(a.price)});
    //                     //                 }
    //                     //              }
    //                     //             }
    //                     //          }
    //                     // k();    

    //                     }
    //                     if((item.current_status.status==="RFQ Submitted"||item.current_status.status==="Submitted")&&item.type==="Order"){
    //                     data.orders.inProgress++;
    //                     // let a;
    //                     // let k=async() =>{ for(a of item.line_items){
    //                     //      if(a.categoryId){
    //                     //          console.log(a.categoryId);
    //                     //          console.log(a.price);
    //                     //          let product= await this.categoryService.categoryName(a.categoryId);
    //                     //          console.log("loop k andr",product);

    //                     //          let found = data.pieChart.find(element => element.name === product);
    //                     //          if(found){
    //                     //              found.value += Number(a.price) || 0;
    //                     //          }
    //                     //          else if(a.price > 0) {
    //                     //              data.pieChart.push({name : product, value : Number(a.price)});
    //                     //          }
    //                     //       }
    //                     //      }
    //                     //   }
    //                     // k();

    //                     }

    //                     if(!(item.current_status.status==="Submitted"||item.current_status.status==="RFQ Submitted"||item.current_status.status==="RFQ Rejected"||item.current_status.status==="test"||item.current_status.status==="RFQ Rejected. Sorry for the inconvenience. Refer mail"))
    //                     {   
    //                         console.log(item.current_status.status,item.total_amount);
    //                         console.log("----------------------");
    //                         // for (var j = 0; j < item.line_items.length; j++){
    //                         //     let a=item.line_items[j];
    //                         // let a;
    //                     //    let k=async() =>{ for(a of item.line_items){
    //                     //         if(a.categoryId){
    //                     //             console.log(a.categoryId);
    //                     //             console.log(a.price);
    //                     //             let product= await this.categoryService.categoryName(a.categoryId);
    //                     //             console.log("loop k andr",product);

    //                     //             let found = data.pieChart.find(element => element.name === product);
    //                     //             if(found){
    //                     //                 found.value += Number(a.price) || 0;
    //                     //             }
    //                     //             else if(a.price > 0) {
    //                     //                 data.pieChart.push({name : product, value : Number(a.price)});
    //                     //             }
    //                     //          }
    //                     //         }
    //                     //      }
    //                     //      await k();
    //                     //         console.log("loop k bhar");

    //                         data.payments.paid += Number(item.total_amount) || 0;
    //                         data.payments.total += Number(item.total_amount) || 0;
    //                         if(item.current_status.status === "Delivered"){
    //                             data.orders.completed++;
    //                         }
    //                         else {
    //                             data.orders.inProgress++;
    //                         }
    //                         let found = data.pieChart.find(element => element.name === item.category);
    //                         if(found){
    //                             found.value += Number(item.total_amount) || 0;
    //                         }
    //                         else if(item.category && item.total_amount && item.total_amount > 0) {
                                
    //                             data.pieChart.push({name : item.category, value : Number(item.total_amount)});
    //                         }
    //                         let date = new Date(item.date);
    //                         let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    //                         let foundBar = data.barChart.find(element => element.name === month);
    //                         if(foundBar){
    //                             foundBar.value += Number(item.total_amount) || 0;
    //                         }
    //                         else if(month && item.total_amount && item.total_amount > 0){
    //                                 data.barChart.push({name : month, value : Number(item.total_amount)});
    //                         }
    //                     }
    //                     else if(item.type==="Order"){
    //                         data.orders.total++;
    //                     }
    //                }
    //             }
    //         });
    //         data.orders.submitted=items.length;
    // }
    // data.barChart=data.barChart.reverse();
    // data.orders.total = data.orders.inProgress+data.orders.completed+data.orders.cancelled;
    //     return data;
    // }


    @Get('doc-clean')
    async docClean()
    {
        const docs = await getMongoRepository(Document).find();
        for(let doc of docs)
        {
            if(doc.id === null || doc.id === undefined || doc.id === '')
            {
                await this.documentService.delete(doc.id);
            }
    }
    return {message : 'done'};
}
    @Get('update-docs')
    async updateDocs()
    {
        const docs = await getMongoRepository(Document).find();
        for(let doc of docs)
        {
            if (doc.type === DocumentType.Order || doc.type === DocumentType.PO || doc.type === DocumentType.RFQ ) {
                doc.org_to_id =  PRODO_ORG_ID
                await this.documentService.update(String(doc.id), doc);
            }
            if (doc.type === DocumentType.Receipt || doc.type === DocumentType.Invoice) {
                doc.org_from_id =  PRODO_ORG_ID
                await this.documentService.update(String(doc.id), doc);
            }
        }
        return {message : 'done'};
    }

   

    @Get('predecessor/:id')
    async getDescendants(@Param('id') id: string) {
        return await this.documentService.getParent(id);
    }

    @Get('successors/:id')
    async getDescendantsTree(@Param('id') id: string) {
        return await this.documentService.getChildren(id);
    }

    @Get('siblings/:id')
    async getAncestors(@Param('id') id: string) {
        return await this.documentService.getSiblings(id);
    }

    @Get('get-children-tree/:id')
    async getAncestorsTree(@Param('id') id: string) {
        return await this.documentService.getChilderenTree(id);
    }

    @Get('get-parent-tree/:id')
    async getParentTree(@Param('id') id: string) {
        return await this.documentService.getParentTree(id);
    }

    async updatepieChart(data: any,data2: any) {
        let pieChart = data;
        // console.log('pieChart',pieChart);
        let pieChart2 = data2;
        //itrerate through the pie chart and update the values
        for(let i=0;i<pieChart.length;i++)
        {
            let product = pieChart[i].name;
            pieChart[i].name = await this.categoryService.categoryName(product);
        }
        for(let i=0;i<pieChart2.length;i++)
        {
            let found = pieChart.find(element => element.name === pieChart2[i].name);
            if(found){
                found.value += Number(pieChart2[i].value) || 0; 
            }
            else {
                pieChart.push({name : pieChart2[i].name, value : Number(pieChart2[i].value)});
            }
        }
   
        return pieChart;
    }


    @Get('dashboard-data')
    @UseGuards(JwtAuthGuard)
    async all_data(@Request() req) {
        let data = {
            orders : {
                total : 0,
                completed : 0,
                inProgress : 0,
                submitted:0,
                cancelled : 0
            },
            rfq : {
                approved : 0,
                rejected : 0,
                inProgress : 0,
                total_submitted:0,
            },
            payments : {
                total : 0,
                paid : 0,
                due : 0,

            },
            pieChart : [],
            barChart : []
        }

        let pieChart2 : [{name : string, value : number}] = [];
        let current_date = new Date();
        for(let i = 0; i < 12; i++){
            let date = new Date(current_date.getFullYear(), current_date.getMonth() - i, 1);
            let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
            data.barChart.push({name : month, value : Number(0)});
        } 
        let org_id=req.user.organization_id;
        let user_id=req.user.id;
        //PRODO
            if(req.user.roles.includes(UserRole.PRODO)){
            let orders= await this.documentService.all_data({where: {type:"Order"}});
            let clientData=await this.clientDataService.findAll();
            let po=await this.documentService.all_data({where: {type:"PO"}});
            let rfq=await this.documentService.all_data({where: {type:"RFQ"}});

            if(orders){
                orders.forEach(async (C) => {
                    data.orders.total++;
                    data.orders.submitted++;
                    data.payments.paid += Number(C.total_amount) || 0;
                    data.payments.total += Number(C.total_amount) || 0;
                    if(C.status){
                        if(C.status === 'Delivered'){
                            data.orders.completed++;
                        }
                        else {
                            data.orders.inProgress++;
                        }
                    }else {

                        if(C.current_status){
                            if(C.current_status.status === 'Delivered'){
                                data.orders.completed++;
                            }
                            else {
                                // console.log("hello",C.current_status.status);
                                data.orders.inProgress++;
                            }
                        
                        }
                        

                    }
                    if(C.category){
                        if(C.total_amount > 0) {
                            let found = pieChart2.find(element => element.name === C.category);
                            if(found){
                                found.value += Number(C.total_amount) || 0;
                            }
                            else {
                                pieChart2.push({name : C.category, value : Number(C.total_amount)});
                            }
                        }
                    }
                    else {
                        // console.log("start",C);
                        let a;
                        for(a of C.line_items){
                             if(a.categoryId){
                                //  console.log("product-------",a);
                                    let found = data.pieChart.find(element => element.name === a.categoryId);
                                    if(found){
                                            found.value += Number(a.price) || 0;
                                        }
                                        else if(a.price > 0) {
                                            data.pieChart.push({name : a.categoryId, value : Number(a.price*a.moq)});
                                        }
                                }
                            }
                    }
                   
                    
                    let date = new Date(C.date);
                    let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                    let foundBar = data.barChart.find(element => element.name === month);
                    if(foundBar){
                        foundBar.value += Number(C.total_amount) || 0;
                    }
                    else if(month &&C.total_amount > 0){
                        data.barChart.push({C : month, value : Number(C.total_amount)});
                    }
                });
            }
            if(clientData){
                clientData.forEach(async (C) => {
                    data.orders.total++;
                    data.payments.paid += Number(C.amount_received) || 0;
                    data.payments.total += Number(C.invoice_amount_ex_gst) || 0;
                    
                    let due_amount = Number(C.invoice_amount_ex_gst) || 0 - Number(C.amount_received) || 0;
                    data.payments.due += due_amount;
                    if(C.status === 'Delivered'){
                        data.orders.completed++;
                    }
                    else {
                        data.orders.inProgress++;
                    }
    
                    let found = pieChart2.find(element => element.name === C.category_of_products);
                    if(found){
                        found.value += Number(C.invoice_amount_ex_gst) || 0;
                    }
                    else if(C.category_of_products &&C.invoice_amount_ex_gst > 0){
                        pieChart2.push({name : C.category_of_products, value : Number(C.invoice_amount_ex_gst)});
                    }
    
                    let date = new Date(C.po_date);
                    let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    
                    let foundBar = data.barChart.find(element => element.name === month);
                    if(foundBar){
                        foundBar.value += Number(C.invoice_amount_ex_gst) || 0;
                    }
                    else if(month &&C.invoice_amount_ex_gst > 0){
                        data.barChart.push({C : month, value : Number(C.invoice_amount_ex_gst)});
                    }
    
                });
            }
            if(po){
                po.forEach(async (C) => {
                        data.orders.total++;
                        data.orders.submitted++;
                        data.payments.paid += Number(C.total_amount) || 0;
                        data.payments.total += Number(C.total_amount) || 0;
                        if(C.status){
                            if(C.status === 'Delivered'){
                                data.orders.completed++;
                            }
                            else {
                                data.orders.inProgress++;
                            }
                        }else {
                            if(C.current_status){
                                if(C.current_status.status === 'Delivered'){
                                    data.orders.completed++;
                                }
                                else {
                                    // console.log("hello",C.current_status.status);
                                    data.orders.inProgress++;
                                }
                            
                            }
                            
    
                        }
                        if(C.category){
                            if(C.total_amount > 0) {
                                let found = pieChart2.find(element => element.name === C.category);
                                if(found){
                                    found.value += Number(C.total_amount) || 0;
                                }
                                else {
                                    pieChart2.push({name : C.category, value : Number(C.total_amount)});
                                }
                            }
                        }
                        else {
                            // console.log("start",C);
                            let a;
                            for(a of C.line_items){
                                 if(a.categoryId){
                                    //  console.log("product-------",a);
                                        let found = data.pieChart.find(element => element.name === a.categoryId);
                                        if(found){
                                                found.value += Number(a.price) || 0;
                                            }
                                            else if(a.price > 0) {
                                                data.pieChart.push({name : a.categoryId, value : Number(a.price*a.moq)});
                                            }
                                    }
                                }
                        }
                       
                        
                        let date = new Date(C.date);
                        let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                        let foundBar = data.barChart.find(element => element.name === month);
                        if(foundBar){
                            foundBar.value += Number(C.total_amount) || 0;
                        }
                        else if(month &&C.total_amount > 0){
                            data.barChart.push({C : month, value : Number(C.total_amount)});
                        }
                    });
            }
            if(rfq){
                rfq.forEach(async (C) => {
                  data.rfq.total_submitted++;
                    if(C.current_status){
                        if((C.current_status.status === 'RFQ Approved')){
                            data.payments.paid += Number(C.total_amount) || 0;
                            data.payments.total += Number(C.total_amount) || 0;
                            data.rfq.approved++;
                            let a;
                            for(a of C.line_items){
                                    // console.log("product-------",a.price,a.moq);
                                if(a.categoryId){
                                        let found = data.pieChart.find(element => element.name === a.categoryId);
                                        if(found){
                                                found.value += Number(a.price) || 0;
                                            }
                                            else if(a.price > 0) {
                                                data.pieChart.push({name : a.categoryId, value : Number(a.price*a.moq)});
                                            }
                                    }
                                }
                            let date = new Date(C.date);
                            let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                            let foundBar = data.barChart.find(element => element.name === month);
                            if(foundBar){
                                foundBar.value += Number(C.total_amount) || 0;
                            }
                            else if(month &&C.total_amount > 0){
                                data.barChart.push({C : month, value : Number(C.total_amount)});
                            }
                        }
                        else if(C.current_status.status === 'RFQ Rejected. Sorry for the inconvenience. Refer mail'){
                            data.rfq.rejected++;
                        }
                        else {
                            data.rfq.inProgress++;
                        }
                    }
                    // else console("rfq not have status",c.id)
                });
            }
        }
            //ADMIN
        else if(req.user.roles.includes(UserRole.ADMIN)){
            let orders= await this.documentService.all_data({where: {type:"Order",organization_id: org_id}});
            let clientData=await this.clientDataService.findAll({where: {organization_id: org_id}});
            let po=await this.documentService.all_data({where: {type:"PO",organization_id: org_id}});
            let rfq=await this.documentService.all_data({where: {type:"RFQ",organization_id: org_id}});
            
            if(orders){
                orders.forEach(async (C) => {
                    data.orders.total++;
                    data.orders.submitted++;
                    data.payments.paid += Number(C.total_amount) || 0;
                    data.payments.total += Number(C.total_amount) || 0;
                    if(C.status){
                        if(C.status === 'Delivered'){
                            data.orders.completed++;
                        }
                        else {
                            data.orders.inProgress++;
                        }
                    }else {
                        if(C.current_status){
                            if(C.current_status.status === 'Delivered'){
                                data.orders.completed++;
                            }
                            else {
                                // console.log("hello",C.current_status.status);
                                data.orders.inProgress++;
                            }
                        
                        }
                        

                    }
                    if(C.category){
                        if(C.total_amount > 0) {
                            let found = pieChart2.find(element => element.name === C.category);
                            if(found){
                                found.value += Number(C.total_amount) || 0;
                            }
                            else {
                                pieChart2.push({name : C.category, value : Number(C.total_amount)});
                            }
                        }
                    }
                    else {
                        // console.log("start",C);
                        let a;
                        for(a of C.line_items){
                             if(a.categoryId){
                                //  console.log("product-------",a);
                                    let found = data.pieChart.find(element => element.name === a.categoryId);
                                    if(found){
                                            found.value += Number(a.price) || 0;
                                        }
                                        else if(a.price > 0) {
                                            data.pieChart.push({name : a.categoryId, value : Number(a.price*a.moq)});
                                        }
                                }
                            }
                    }
                   
                    
                    let date = new Date(C.date);
                    let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                    let foundBar = data.barChart.find(element => element.name === month);
                    if(foundBar){
                        foundBar.value += Number(C.total_amount) || 0;
                    }
                    else if(month &&C.total_amount > 0){
                        data.barChart.push({C : month, value : Number(C.total_amount)});
                    }
                });
            }
            if(clientData){
                clientData.forEach(async (C) => {
                    data.orders.total++;
                    data.payments.paid += Number(C.amount_received) || 0;
                    data.payments.total += Number(C.invoice_amount_ex_gst) || 0;
                    
                    let due_amount = Number(C.invoice_amount_ex_gst) || 0 - Number(C.amount_received) || 0;
                    data.payments.due += due_amount;
                    if(C.status === 'Delivered'){
                        data.orders.completed++;
                    }
                    else {
                        data.orders.inProgress++;
                    }
    
                    let found = pieChart2.find(element => element.name === C.category_of_products);
                    if(found){
                        found.value += Number(C.invoice_amount_ex_gst) || 0;
                    }
                    else if(C.category_of_products &&C.invoice_amount_ex_gst > 0){
                        pieChart2.push({name : C.category_of_products, value : Number(C.invoice_amount_ex_gst)});
                    }
    
                    let date = new Date(C.po_date);
                    let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    
                    let foundBar = data.barChart.find(element => element.name === month);
                    if(foundBar){
                        foundBar.value += Number(C.invoice_amount_ex_gst) || 0;
                    }
                    else if(month &&C.invoice_amount_ex_gst > 0){
                        data.barChart.push({C : month, value : Number(C.invoice_amount_ex_gst)});
                    }
    
                });
            }
            if(po){
                po.forEach(async (C) => {
                        data.orders.total++;
                        data.orders.submitted++;
                        data.payments.paid += Number(C.total_amount) || 0;
                        data.payments.total += Number(C.total_amount) || 0;
                        if(C.status){
                            if(C.status === 'Delivered'){
                                data.orders.completed++;
                            }
                            else {
                                data.orders.inProgress++;
                            }
                        }else {
                            if(C.current_status){
                                if(C.current_status.status === 'Delivered'){
                                    data.orders.completed++;
                                }
                                else {
                                    // console.log("hello",C.current_status.status);
                                    data.orders.inProgress++;
                                }
                            
                            }
                            
    
                        }
                        if(C.category){
                            if(C.total_amount > 0) {
                                let found = pieChart2.find(element => element.name === C.category);
                                if(found){
                                    found.value += Number(C.total_amount) || 0;
                                }
                                else {
                                    pieChart2.push({name : C.category, value : Number(C.total_amount)});
                                }
                            }
                        }
                        else {
                            // console.log("start",C);
                            let a;
                            for(a of C.line_items){
                                 if(a.categoryId){
                                    //  console.log("product-------",a);
                                        let found = data.pieChart.find(element => element.name === a.categoryId);
                                        if(found){
                                                found.value += Number(a.price) || 0;
                                            }
                                            else if(a.price > 0) {
                                                data.pieChart.push({name : a.categoryId, value : Number(a.price*a.moq)});
                                            }
                                    }
                                }
                        }
                       
                        
                        let date = new Date(C.date);
                        let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                        let foundBar = data.barChart.find(element => element.name === month);
                        if(foundBar){
                            foundBar.value += Number(C.total_amount) || 0;
                        }
                        else if(month &&C.total_amount > 0){
                            data.barChart.push({C : month, value : Number(C.total_amount)});
                        }
                    });
            }
            if(rfq){
                rfq.forEach(async (C) => {
                  data.rfq.total_submitted++;
                    if(C.current_status){
                        if((C.current_status.status === 'RFQ Approved')){
                            data.payments.paid += Number(C.total_amount) || 0;
                            data.payments.total += Number(C.total_amount) || 0;
                            data.rfq.approved++;
                            let a;
                            for(a of C.line_items){
                                    // console.log("product-------",a.price,a.moq);
                                if(a.categoryId){
                                        let found = data.pieChart.find(element => element.name === a.categoryId);
                                        if(found){
                                                found.value += Number(a.price) || 0;
                                            }
                                            else if(a.price > 0) {
                                                data.pieChart.push({name : a.categoryId, value : Number(a.price*a.moq)});
                                            }
                                    }
                                }
                            let date = new Date(C.date);
                            let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                            let foundBar = data.barChart.find(element => element.name === month);
                            if(foundBar){
                                foundBar.value += Number(C.total_amount) || 0;
                            }
                            else if(month &&C.total_amount > 0){
                                data.barChart.push({C : month, value : Number(C.total_amount)});
                            }
                        }
                        else if(C.current_status.status === 'RFQ Rejected. Sorry for the inconvenience. Refer mail'){
                            data.rfq.rejected++;
                        }
                        else {
                            data.rfq.inProgress++;
                        }
                    }
                    // else console("rfq not have status",c.id)
                });
            }
        }
        else {
            let orders= await this.documentService.all_data({where: {type:"Order",createdBy:user_id}});
            let clientData=await this.clientDataService.findAll({where: {createdBy:user_id}});
            let po=await this.documentService.all_data({where: {type:"PO",createdBy:user_id}});
            let rfq=await this.documentService.all_data({where: {type:"RFQ",createdBy:user_id}});
            
            if(orders){
                orders.forEach(async (C) => {
                    data.orders.total++;
                    data.orders.submitted++;
                    data.payments.paid += Number(C.total_amount) || 0;
                    data.payments.total += Number(C.total_amount) || 0;
                    if(C.status){
                        if(C.status === 'Delivered'){
                            data.orders.completed++;
                        }
                        else {
                            data.orders.inProgress++;
                        }
                    }else {
                        if(C.current_status){
                            if(C.current_status.status === 'Delivered'){
                                data.orders.completed++;
                            }
                            else {
                                // console.log("hello",C.current_status.status);
                                data.orders.inProgress++;
                            }
                        
                        }
                        

                    }
                    if(C.category){
                        if(C.total_amount > 0) {
                            let found = pieChart2.find(element => element.name === C.category);
                            if(found){
                                found.value += Number(C.total_amount) || 0;
                            }
                            else {
                                pieChart2.push({name : C.category, value : Number(C.total_amount)});
                            }
                        }
                    }
                    else {
                        // console.log("start",C);
                        let a;
                        for(a of C.line_items){
                             if(a.categoryId){
                                //  console.log("product-------",a);
                                    let found = data.pieChart.find(element => element.name === a.categoryId);
                                    if(found){
                                            found.value += Number(a.price) || 0;
                                        }
                                        else if(a.price > 0) {
                                            data.pieChart.push({name : a.categoryId, value : Number(a.price*a.moq)});
                                        }
                                }
                            }
                    }
                   
                    
                    let date = new Date(C.date);
                    let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                    let foundBar = data.barChart.find(element => element.name === month);
                    if(foundBar){
                        foundBar.value += Number(C.total_amount) || 0;
                    }
                    else if(month &&C.total_amount > 0){
                        data.barChart.push({C : month, value : Number(C.total_amount)});
                    }
                });
            }
            if(clientData){
                clientData.forEach(async (C) => {
                    data.orders.total++;
                    data.payments.paid += Number(C.amount_received) || 0;
                    data.payments.total += Number(C.invoice_amount_ex_gst) || 0;
                    
                    let due_amount = Number(C.invoice_amount_ex_gst) || 0 - Number(C.amount_received) || 0;
                    data.payments.due += due_amount;
                    if(C.status === 'Delivered'){
                        data.orders.completed++;
                    }
                    else {
                        data.orders.inProgress++;
                    }
    
                    let found = pieChart2.find(element => element.name === C.category_of_products);
                    if(found){
                        found.value += Number(C.invoice_amount_ex_gst) || 0;
                    }
                    else if(C.category_of_products &&C.invoice_amount_ex_gst > 0){
                        pieChart2.push({name : C.category_of_products, value : Number(C.invoice_amount_ex_gst)});
                    }
    
                    let date = new Date(C.po_date);
                    let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    
                    let foundBar = data.barChart.find(element => element.name === month);
                    if(foundBar){
                        foundBar.value += Number(C.invoice_amount_ex_gst) || 0;
                    }
                    else if(month &&C.invoice_amount_ex_gst > 0){
                        data.barChart.push({C : month, value : Number(C.invoice_amount_ex_gst)});
                    }
    
                });
            }
            if(po){
                po.forEach(async (C) => {
                        data.orders.total++;
                        data.orders.submitted++;
                        data.payments.paid += Number(C.total_amount) || 0;
                        data.payments.total += Number(C.total_amount) || 0;
                        if(C.status){
                            if(C.status === 'Delivered'){
                                data.orders.completed++;
                            }
                            else {
                                data.orders.inProgress++;
                            }
                        }else {
                            if(C.current_status){
                                if(C.current_status.status === 'Delivered'){
                                    data.orders.completed++;
                                }
                                else {
                                    // console.log("hello",C.current_status.status);
                                    data.orders.inProgress++;
                                }
                            
                            }
                            
    
                        }
                        if(C.category){
                            if(C.total_amount > 0) {
                                let found = pieChart2.find(element => element.name === C.category);
                                if(found){
                                    found.value += Number(C.total_amount) || 0;
                                }
                                else {
                                    pieChart2.push({name : C.category, value : Number(C.total_amount)});
                                }
                            }
                        }
                        else {
                            // console.log("start",C);
                            let a;
                            for(a of C.line_items){
                                 if(a.categoryId){
                                    //  console.log("product-------",a);
                                        let found = data.pieChart.find(element => element.name === a.categoryId);
                                        if(found){
                                                found.value += Number(a.price) || 0;
                                            }
                                            else if(a.price > 0) {
                                                data.pieChart.push({name : a.categoryId, value : Number(a.price*a.moq)});
                                            }
                                    }
                                }
                        }
                        let date = new Date(C.date);
                        let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                        let foundBar = data.barChart.find(element => element.name === month);
                        if(foundBar){
                            foundBar.value += Number(C.total_amount) || 0;
                        }
                        else if(month &&C.total_amount > 0){
                            data.barChart.push({C : month, value : Number(C.total_amount)});
                        }
                    });
            }
            if(rfq){
                rfq.forEach(async (C) => {
                  data.rfq.total_submitted++;
                    if(C.current_status){
                        if((C.current_status.status === 'RFQ Approved')){
                            data.payments.paid += Number(C.total_amount) || 0;
                            data.payments.total += Number(C.total_amount) || 0;
                            data.rfq.approved++;
                            let a;
                            for(a of C.line_items){
                                    // console.log("product-------",a.price,a.moq);
                                if(a.categoryId){
                                        let found = data.pieChart.find(element => element.name === a.categoryId);
                                        if(found){
                                                found.value += Number(a.price) || 0;
                                            }
                                            else if(a.price > 0) {
                                                data.pieChart.push({name : a.categoryId, value : Number(a.price*a.moq)});
                                            }
                                    }
                                }
                            let date = new Date(C.date);
                            let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                            let foundBar = data.barChart.find(element => element.name === month);
                            if(foundBar){
                                foundBar.value += Number(C.total_amount) || 0;
                            }
                            else if(month &&C.total_amount > 0){
                                data.barChart.push({C : month, value : Number(C.total_amount)});
                            }
                        }
                        else if(C.current_status.status === 'RFQ Rejected. Sorry for the inconvenience. Refer mail'){
                            data.rfq.rejected++;
                        }
                        else {
                            data.rfq.inProgress++;
                        }
                    }
                });
            }
        }   
        data.pieChart= await this.updatepieChart(data.pieChart,pieChart2);
        data.barChart=data.barChart.reverse();
        return data;
    }


}

