import { LineItem } from './client-data.dto';
// Client Data Service for Client Data Entity ./../clientData/client-data.service.ts
import * as xlsx from 'xlsx';
import { Injectable,Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Index, ObjectID, Repository } from 'typeorm';
import { ClientData } from './client-data.entity';
import { realpathSync } from 'fs';
import { AttachedFile } from './client-data.entity';
export class ClientDataService {
    constructor(
        @InjectRepository(ClientData)
        private readonly clientDataRepository: Repository<ClientData>,
    ) { }

    async findAll(filter:{}): Promise<ClientData[]> {
        if (filter) {
            return await this.clientDataRepository.find(filter);
        }
        return await this.clientDataRepository.find();
    }
    async name(){
        let x = "ClientDataService";
        return x;
    }

    async getLineItems(id) {
        let clientData = await this.clientDataRepository.findOne(id);
        
            return clientData.line_items;
      
    }

    async updateDataBase(){
        const clientData = await this.clientDataRepository.find();

       console.log(clientData);
            clientData.forEach(async (client) => {
                if (client.client_name === '' || client.client_name === null || client.client_name === undefined) {
                    await this.clientDataRepository.remove(client);
                }
            });
        }
    async findOne(id: string): Promise<ClientData> {
        return await this.clientDataRepository.findOne(id);
    }

    async filter(filter: any) {
        return await this.clientDataRepository.find(filter);
    }

    async update(id: string, clientData: any) {
        return await this.clientDataRepository.update(id, clientData);
    }

    async remove(id: ObjectID | undefined) {
        const clientData = this.clientDataRepository.findOne(id).then(result => {
            this.clientDataRepository.delete(result);
        });
    }

    async save(clientData: ClientData) {
        // check if clientData already exists
        // check if id or purchase_order exists
        // if id or purchase order exists, update
        // if id or purchase order does not exist, create
        let clientDataExists = await this.clientDataRepository.findOne({where: {purchase_order: clientData.purchase_order}});
        const foundClientData = await this.clientDataRepository.findOne({ id: clientData.id });
        if (foundClientData || clientDataExists) {
            return this.clientDataRepository.update(clientData.id,clientData);
        } else {
            return this.clientDataRepository.save(clientData);
        }
    }
    async attachFile(id: string, file: any,document_name:string) {
        const clientData = await this.clientDataRepository.findOne(id);
        if (clientData) {
            let attachment = new AttachedFile();
            attachment.file_name = file.originalname;
            attachment.file_path = file.path;
            attachment.file_type = file.mimetype;
            attachment.document_name = document_name;
            clientData.attached_files=[...[attachment], ...clientData.attached_files];
            await this.clientDataRepository.save(clientData);
            let attachments = clientData.attached_files;

            return attachments;
        }
        return {
            "message": 'No Client Data Found',
        };
    }
    async removeFile(id: string, file_name: string) {
        const clientData = await this.clientDataRepository.findOne(id);
        if (clientData) {
            let attachments = clientData.attached_files;
            let index = attachments.findIndex(attachment => attachment.file_name === file_name);
            attachments.splice(index, 1);
            clientData.attached_files = attachments;
            await this.clientDataRepository.save(clientData);
            return attachments;
        }
        return {
            "message": 'No Client Data Found',
        };
    }
    async getAttachedFiles(id: string) {
        const clientData = await this.clientDataRepository.findOne(id);
        if (clientData) {
            return clientData.attached_files;
        }
        return {
            "message": 'No Client Data Found',
        };
    }
    async findbypurchaseorder(purchase_order: string) {
        return await this.clientDataRepository.find({ purchase_order: purchase_order });
    }


    async bulkUploadFromExcel(file: any) {
        console.log('file', file);
        let filePath = file.path;
        let fileName = file.originalname;
        let fileExt = fileName.split('.').pop();
        let fileNameWithoutExt = fileName.split('.').shift();
        let jsonData: ClientData[] = [];
        let BASE_URL = 'http://localhost:3000/';
        console.log('fileExt', fileExt);
        console.log('fileNameWithoutExt', fileNameWithoutExt);
        console.log('filePath', filePath);
        console.log('fileName', fileName);
    
//Client Name	Particulars	Purchase Order	PO Date	Category of Products	PO Month	PO Amount	Fulfillment Month	Invoice Amount (ex GST)	COGS	Gross Profit	Status
        // Map these columns to the entity properties
        let map = {
            'Client Name': 'client_name',
            'Particulars': 'particulars',
            'Purchase Order': 'purchase_order',
            'PO Date': 'po_date',
            'PO Month': 'po_month',
            'PO Amount': 'po_amount',
            'Fulfillment Month': 'fulfillment_month',
            'Invoice Amount (ex GST)': 'invoice_amount_ex_gst',
            'COGS': 'cogs',
            'Gross Profit': 'gross_profit',
            'Status': 'status',
            'Invoice Amount (INC GST)': 'invoice_amount_inc_gst',
            'Due date of receivable from Client': 'due_date_of_receivable_from_client',
            'Amount Received': 'amount_received',




            // Item	Comments	HSN	GST	Quantity	Rate	Rate (inc Tax)	Measuring Unit	Amount	Tracking
            'Item': 'item',
            'Comments': 'comments',
            'HSN': 'hsn',
            'GST': 'gst',
            'Quantity': 'quantity',
            'Rate': 'rate',
            'Rate (inc Tax)': 'rate_inc_tax',
            'Measuring Unit': 'measuring_unit',
            'Amount': 'amount',
            'Tracking': 'tracking',
            'Image': 'image',
            'Category of Products': 'category_of_products',

        };
        // Read the CSV file
        let csv = xlsx.readFile(filePath);
        // Get the sheet name
        let sheet_name_list = csv.SheetNames;
        let sheet_name = sheet_name_list[0];
        // Get the data from the sheet
        let json_data = xlsx.utils.sheet_to_json(csv.Sheets[sheet_name]);   
        // console.log('json_data', json_data);
        
        json_data.forEach(element => {
            console.log('element', element);
            let clientData = new ClientData();
            Object.keys(map).forEach(key => {
                clientData[map[key]] = element[key];
            });

            if (element['PO Date']) {
                clientData.po_date = ExcelDateToJSDate(element['PO Date']);
                
            }
            if (element['Due date of receivable from Client']) {
                clientData.due_date_of_receivable_from_client = ExcelDateToJSDate(element['Due date of receivable from Client']);
            }
            if (element['PO Amount'] && element['PO Amount'] != '') {
                // â\x82¹4,05,29,849.00 converts to 40529849
                let po_amount = element['PO Amount']
                console.log('po_amount', po_amount);
                clientData.po_amount = convertStringToAmount(po_amount);
            }
            
                let invoice_amount_ex_gst = element['Invoice Amount (Ex GST)'] ? element['Invoice Amount (Ex GST)'] : 0;
                console.log('invoice_amount_ex_gst', invoice_amount_ex_gst);
                clientData.invoice_amount_ex_gst = Number(invoice_amount_ex_gst) 
            
            if (element['Invoice Amount (INC GST)']) {
                
                let invoice_amount_inc_gst = element['Invoice Amount (INC GST)']
                clientData.invoice_amount_inc_gst = invoice_amount_inc_gst ? convertStringToAmount(invoice_amount_inc_gst) : 0;
            }
            if (element['COGS']) {
                let cogs = element['COGS']
                clientData.cogs = convertStringToAmount(cogs);
            }
            if (element['Gross Profit']) {
                let gross_profit = element['Gross Profit']
                clientData.gross_profit = convertStringToAmount(gross_profit);
            }

            console.log('clientData', clientData);

        // console.log('xlData', xlData);
       //Map Columns
       function ExcelDateToJSDate(serial) {
        var utc_days  = Math.floor(serial - 25569);
        var utc_value = utc_days * 86400;                                        
        var date_info = new Date(utc_value * 1000);
     
        var fractional_day = serial - Math.floor(serial) + 0.0000001;
     
        var total_seconds = Math.floor(86400 * fractional_day);
     
        var seconds = total_seconds % 60;
     
        total_seconds -= seconds;
     
        var hours = Math.floor(total_seconds / (60 * 60));
        var minutes = Math.floor(total_seconds / 60) % 60;
     
        return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
     }
     
            function convertStringToAmount(str: number | undefined) {
                // â\x82¹4,05,29,849.00 converts to 40529849
                let amount = str;
                if (amount) {
                    let stramount = amount.toString();
                    stramount = stramount.replace(/,/g, '');
                    stramount = stramount.replace(/\s/g, '');
                    stramount = stramount.replace(/â\x82¹/g, '');
                    stramount = stramount.replace(/₹/g, '');

                    return parseInt(stramount);
                                    }
                return 0;

                    
            }
            jsonData.push(clientData);
            // console.log('jsonData', jsonData);



        });
        let items = []
         jsonData.forEach( element => {
            // Push Item	Comments	HSN	GST	Quantity	Rate	Rate (inc Tax)	Measuring Unit	Amount	Tracking to line items for same purchase order
            let lineItem = new LineItem();
            lineItem.item = element.item;
            lineItem.comments = element.comments;
            lineItem.hsn = element.hsn;
            lineItem.gst = element.gst;
            lineItem.quantity = element.quantity;
            lineItem.rate = element.rate;
            lineItem.rate_inc_tax = element.rate_inc_tax;
            lineItem.measuring_unit = element.measuring_unit;
            lineItem.amount = element.amount;
            lineItem.tracking = element.tracking;
            lineItem.image=element.image;   
            let item = new ClientData();
            // check if two items has same purchase order
            let itemExist = items.find(item => item.purchase_order === element.purchase_order);
            if (itemExist && itemExist.line_items) {
                itemExist.line_items= [...itemExist.line_items, lineItem];
            } else {
                
                item.purchase_order = element.purchase_order;
                item.po_date = element.po_date;
                item.po_month = element.po_month;
                item.category_of_products = element.category_of_products;
                item.client_name = element.client_name;
                item.po_amount = element.po_amount;
                item.invoice_amount_ex_gst = element.invoice_amount_ex_gst;
                item.cogs = element.cogs;
                item.gross_profit = element.gross_profit;
                item.particulars = element.particulars;
                item.fulfillment_month = element.fulfillment_month;
                item.invoice_amount_inc_gst = element.invoice_amount_inc_gst;
                item.status = element.status;
                item.amount_received = element.amount_received;
                item.due_date_of_receivable_from_client = element.due_date_of_receivable_from_client;
                item.line_items = [ lineItem ];
                item.organization_id = "627902e523d4fea60a7a2579";
                items.push(item);
                console.log('item', item.invoice_amount_ex_gst);
            }

            
        });
        // console.log('items', items);
        return await this.clientDataRepository.save(items);
        //  items.forEach(element => {
        //      console.log('element', element.po_amount);
        //     return this.updateData(element.purchase_order, element); });
    } 
    async addLineItems(po, lineItems) {
        let clientData = await this.clientDataRepository.findOne({where: {purchase_order: po}});
        if (clientData){clientData.line_items = lineItems;
        return await this.clientDataRepository.update(clientData.id,clientData) ;}
    }
    async updateData(po, data) {
        let clientDatas = await this.clientDataRepository.find({where: {purchase_order: po}});
        if (clientDatas){
            clientDatas.forEach(async clientData => {
                clientData.line_items = data.line_items;
                clientData.po_amount = data.po_amount;
                clientData.invoice_amount_ex_gst = data.invoice_amount_ex_gst;
                clientData.cogs = data.cogs;
                clientData.gross_profit = data.gross_profit;
                clientData.particulars = data.particulars;
                clientData.fulfillment_month = data.fulfillment_month;
                clientData.invoice_amount_ex_gst = data.invoice_amount_ex_gst;
                clientData.status = data.status;
                clientData.po_date = data.po_date;
                clientData.po_month = data.po_month;
                clientData.category_of_products = data.category_of_products;
                clientData.invoice_amount_inc_gst = data.invoice_amount_inc_gst;
                clientData.due_date_of_receivable_from_client = data.due_date_of_receivable_from_client;
                clientData.amount_received = data.amount_received;
                clientData.client_name = data.client_name;
                clientData.organization_id = "627902e523d4fea60a7a2579"; 
                console.log('clientData', clientData.po_amount);
            return await this.clientDataRepository.save(clientData) 

            });
           ;}
        else {
            // data.organization_id = "6221f7271fe327711fef3615"
            // return await this.clientDataRepository.save(data);
        }
    }
    
    
    

} 