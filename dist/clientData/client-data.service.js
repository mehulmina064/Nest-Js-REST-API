"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const client_data_dto_1 = require("./client-data.dto");
const xlsx = require("xlsx");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const client_data_entity_1 = require("./client-data.entity");
const client_data_entity_2 = require("./client-data.entity");
let ClientDataService = class ClientDataService {
    constructor(clientDataRepository) {
        this.clientDataRepository = clientDataRepository;
    }
    findAll(filter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (filter) {
                return yield this.clientDataRepository.find(filter);
            }
            return yield this.clientDataRepository.find();
        });
    }
    name() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let x = "ClientDataService";
            return x;
        });
    }
    getLineItems(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let clientData = yield this.clientDataRepository.findOne(id);
            return clientData.line_items;
        });
    }
    updateDataBase() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const clientData = yield this.clientDataRepository.find();
            console.log(clientData);
            clientData.forEach((client) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                if (client.client_name === '' || client.client_name === null || client.client_name === undefined) {
                    yield this.clientDataRepository.remove(client);
                }
            }));
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.clientDataRepository.findOne(id);
        });
    }
    filter(filter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.clientDataRepository.find(filter);
        });
    }
    update(id, clientData) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.clientDataRepository.update(id, clientData);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const clientData = this.clientDataRepository.findOne(id).then(result => {
                this.clientDataRepository.delete(result);
            });
        });
    }
    save(clientData) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let clientDataExists = yield this.clientDataRepository.findOne({ where: { purchase_order: clientData.purchase_order } });
            const foundClientData = yield this.clientDataRepository.findOne({ id: clientData.id });
            if (foundClientData || clientDataExists) {
                return this.clientDataRepository.update(clientData.id, clientData);
            }
            else {
                return this.clientDataRepository.save(clientData);
            }
        });
    }
    attachFile(id, file, document_name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const clientData = yield this.clientDataRepository.findOne(id);
            if (clientData) {
                let attachment = new client_data_entity_2.AttachedFile();
                attachment.file_name = file.originalname;
                attachment.file_path = file.path;
                attachment.file_type = file.mimetype;
                attachment.document_name = document_name;
                clientData.attached_files = [...[attachment], ...clientData.attached_files];
                yield this.clientDataRepository.save(clientData);
                let attachments = clientData.attached_files;
                return attachments;
            }
            return {
                "message": 'No Client Data Found',
            };
        });
    }
    removeFile(id, file_name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const clientData = yield this.clientDataRepository.findOne(id);
            if (clientData) {
                let attachments = clientData.attached_files;
                let index = attachments.findIndex(attachment => attachment.file_name === file_name);
                attachments.splice(index, 1);
                clientData.attached_files = attachments;
                yield this.clientDataRepository.save(clientData);
                return attachments;
            }
            return {
                "message": 'No Client Data Found',
            };
        });
    }
    getAttachedFiles(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const clientData = yield this.clientDataRepository.findOne(id);
            if (clientData) {
                return clientData.attached_files;
            }
            return {
                "message": 'No Client Data Found',
            };
        });
    }
    findbypurchaseorder(purchase_order) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.clientDataRepository.find({ purchase_order: purchase_order });
        });
    }
    bulkUploadFromExcel(file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log('file', file);
            let filePath = file.path;
            let fileName = file.originalname;
            let fileExt = fileName.split('.').pop();
            let fileNameWithoutExt = fileName.split('.').shift();
            let jsonData = [];
            let BASE_URL = 'http://localhost:3000/';
            console.log('fileExt', fileExt);
            console.log('fileNameWithoutExt', fileNameWithoutExt);
            console.log('filePath', filePath);
            console.log('fileName', fileName);
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
            let csv = xlsx.readFile(filePath);
            let sheet_name_list = csv.SheetNames;
            let sheet_name = sheet_name_list[0];
            let json_data = xlsx.utils.sheet_to_json(csv.Sheets[sheet_name]);
            json_data.forEach(element => {
                console.log('element', element);
                let clientData = new client_data_entity_1.ClientData();
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
                    let po_amount = element['PO Amount'];
                    console.log('po_amount', po_amount);
                    clientData.po_amount = convertStringToAmount(po_amount);
                }
                let invoice_amount_ex_gst = element['Invoice Amount (Ex GST)'] ? element['Invoice Amount (Ex GST)'] : 0;
                console.log('invoice_amount_ex_gst', invoice_amount_ex_gst);
                clientData.invoice_amount_ex_gst = Number(invoice_amount_ex_gst);
                if (element['Invoice Amount (INC GST)']) {
                    let invoice_amount_inc_gst = element['Invoice Amount (INC GST)'];
                    clientData.invoice_amount_inc_gst = invoice_amount_inc_gst ? convertStringToAmount(invoice_amount_inc_gst) : 0;
                }
                if (element['COGS']) {
                    let cogs = element['COGS'];
                    clientData.cogs = convertStringToAmount(cogs);
                }
                if (element['Gross Profit']) {
                    let gross_profit = element['Gross Profit'];
                    clientData.gross_profit = convertStringToAmount(gross_profit);
                }
                console.log('clientData', clientData);
                function ExcelDateToJSDate(serial) {
                    var utc_days = Math.floor(serial - 25569);
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
                function convertStringToAmount(str) {
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
            });
            let items = [];
            jsonData.forEach(element => {
                let lineItem = new client_data_dto_1.LineItem();
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
                lineItem.image = element.image;
                let item = new client_data_entity_1.ClientData();
                let itemExist = items.find(item => item.purchase_order === element.purchase_order);
                if (itemExist && itemExist.line_items) {
                    itemExist.line_items = [...itemExist.line_items, lineItem];
                }
                else {
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
                    item.line_items = [lineItem];
                    item.organization_id = "627902e523d4fea60a7a2579";
                    items.push(item);
                    console.log('item', item.invoice_amount_ex_gst);
                }
            });
            return yield this.clientDataRepository.save(items);
        });
    }
    addLineItems(po, lineItems) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let clientData = yield this.clientDataRepository.findOne({ where: { purchase_order: po } });
            if (clientData) {
                clientData.line_items = lineItems;
                return yield this.clientDataRepository.update(clientData.id, clientData);
            }
        });
    }
    updateData(po, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let clientDatas = yield this.clientDataRepository.find({ where: { purchase_order: po } });
            if (clientDatas) {
                clientDatas.forEach((clientData) => tslib_1.__awaiter(this, void 0, void 0, function* () {
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
                    return yield this.clientDataRepository.save(clientData);
                }));
                ;
            }
            else {
            }
        });
    }
};
ClientDataService = tslib_1.__decorate([
    tslib_1.__param(0, typeorm_1.InjectRepository(client_data_entity_1.ClientData)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], ClientDataService);
exports.ClientDataService = ClientDataService;
//# sourceMappingURL=client-data.service.js.map