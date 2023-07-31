"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const zohoSalesOrder_entity_1 = require("../../../zohoSalesOrder/zohoSalesOrder.entity");
const token_entity_1 = require("../../../sms/token.entity");
const common_2 = require("@nestjs/common");
const node_fetch_1 = require("node-fetch");
let internalSalesOrderService = class internalSalesOrderService {
    constructor(zohoSalesOrderRepository, zohoTokenRepository) {
        this.zohoSalesOrderRepository = zohoSalesOrderRepository;
        this.zohoTokenRepository = zohoTokenRepository;
    }
    findAll(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (query) {
                let data = yield this.zohoSalesOrderRepository.findAndCount(query);
                return { data: data[0], count: data[1] };
            }
            else {
                let data = yield this.zohoSalesOrderRepository.findAndCount();
                return { data: data[0], count: data[1] };
            }
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const so = yield this.zohoSalesOrderRepository.findOne({ where: { salesorderId: String(id) } });
            return so;
        });
    }
    ByReferenceNumber(rf) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const so = yield this.zohoSalesOrderRepository.findOne({ where: { salesorderNumber: String(rf) } });
            return so;
        });
    }
    check(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let check = yield this.zohoSalesOrderRepository.findOne({ where: { salesorderId: String(id) } }).then((res1) => {
                return res1;
            }).catch((err) => {
                return false;
            });
            return check;
        });
    }
    zohoBookToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zohoToken = yield this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65');
            if (!zohoToken) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'Token not found',
                    message: "Unverified",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            let token = zohoToken.token;
            let kill;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == 'You are not authorized to perform this operation' || kill.code == 57 || kill.code == 6041) {
                token = yield this.newZohoBookToken();
                return token;
            }
            return token;
        });
    }
    newZohoBookToken() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zohoToken = yield this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65');
            let zoho = yield node_fetch_1.default('https://accounts.zoho.in/oauth/v2/token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    'refresh_token': '1000.da351bf4fa3f3e12efbc8d857136bdd4.935cf4a8f14bf3cafa77756340386482',
                    'client_id': '1000.',
                    'client_secret': 'a106415659f7c06d2406f446068c1739e81174c2b7',
                    'grant_type': 'refresh_token'
                })
            });
            zoho = yield zoho.text();
            zoho = JSON.parse(zoho);
            let token = "Zoho-oauthtoken ";
            token = token + zoho.access_token;
            zohoToken.token = token;
            yield this.zohoTokenRepository.update(zohoToken.id, zohoToken);
            return token;
        });
    }
    packageDetails(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/packages/${id}?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630." || kill.code == 57) {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/packages/${id}?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
            }
            if (kill.package == undefined) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.UNAUTHORIZED,
                    error: 'Token Expire at package details',
                    message: "Zoho token issue contact admin",
                }, common_2.HttpStatus.UNAUTHORIZED);
            }
            return kill.package;
        });
    }
    itemStatus(lineItems, salesOrder) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (salesOrder.status == "draft") {
                for (let i = 0; i < lineItems.length; i++) {
                    lineItems[i].status = "Order Received";
                }
            }
            else if (salesOrder.status == "partially_shipped") {
                if (salesOrder.current_sub_status == "closed") {
                    for (let i = 0; i < lineItems.length; i++) {
                        lineItems[i].status = "Delivered";
                    }
                }
                else {
                    for (let i = 0; i < lineItems.length; i++) {
                        lineItems[i].status = yield this.calculateStatus(lineItems[i]);
                    }
                }
            }
            else if (salesOrder.status == "fulfilled") {
                for (let i = 0; i < lineItems.length; i++) {
                    lineItems[i].status = "Delivered";
                }
            }
            else if (salesOrder.status == "confirmed") {
                if (salesOrder.current_sub_status == "closed") {
                    for (let i = 0; i < lineItems.length; i++) {
                        lineItems[i].status = "Delivered";
                    }
                }
                else {
                    for (let i = 0; i < lineItems.length; i++) {
                        lineItems[i].status = "Order Accepted";
                    }
                }
            }
            else if (salesOrder.status == "shipped") {
                for (let i = 0; i < lineItems.length; i++) {
                    lineItems[i].status = "In Transit";
                }
            }
            else {
                for (let i = 0; i < lineItems.length; i++) {
                    lineItems[i].status = "NA";
                }
            }
            return lineItems;
        });
    }
    calculateStatus(lineItem) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let invoiced = lineItem.quantity_invoiced;
            let shipped = lineItem.quantity_shipped;
            let packed = lineItem.quantity_packed;
            let backordered = lineItem.quantity_backordered;
            let dropshipped = lineItem.quantity_dropshipped;
            let cancelled = lineItem.quantity_cancelled;
            let quantity = lineItem.quantity;
            if (packed == quantity) {
                if (shipped == quantity) {
                    if (invoiced == quantity) {
                        return "Delivered";
                    }
                    else {
                        return "In Transit[Fully Shipped]";
                    }
                }
                return " In Transit[Fully packed]";
            }
            else if (packed > 0) {
                if (shipped < packed) {
                    if (shipped > 0) {
                        return "In Transit[Partially Shipped]";
                    }
                    else {
                        return "In Transit[Partially Packed]";
                    }
                }
                return "In Transit[Partially Packed]";
            }
            else {
                return "Quality Check";
            }
        });
    }
    salesOrderFormatData(salesOrder) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let order = new zohoSalesOrder_entity_1.zohoSalesOrder();
            order.organization_id = "";
            order.entityId = "";
            order.companyId = "";
            order.description = "";
            order.createdAt = new Date();
            order.updatedAt = new Date();
            order.customerId = salesOrder.customer_id;
            order.customerName = salesOrder.customer_name;
            order.createdBy = "ZOHO-SYNC";
            order.salesorderId = salesOrder.salesorder_id;
            order.salesorderNumber = salesOrder.salesorder_number;
            order.referenceNumber = salesOrder.reference_number;
            order.date = salesOrder.date;
            order.status = salesOrder.status;
            order.subStatuses = salesOrder.sub_statuses;
            order.currentSubStatus = salesOrder.current_sub_status;
            order.companyName = salesOrder.customer_name;
            order.shipmentDate = salesOrder.shipment_date;
            order.shipmentDays = salesOrder.basicDetails.shipment_days;
            order.dueByDays = salesOrder.basicDetails.due_by_days;
            order.dueInDays = salesOrder.basicDetails.due_in_days;
            order.source = salesOrder.source;
            order.total = salesOrder.total;
            order.quantity = salesOrder.total_quantity;
            order.quantityInvoiced = salesOrder.basicDetails.quantity_invoiced;
            order.quantityPacked = salesOrder.basicDetails.quantity_packed;
            order.quantityShipped = salesOrder.basicDetails.quantity_shipped;
            order.orderStatus = salesOrder.order_status;
            order.invoicedStatus = salesOrder.invoiced_status;
            order.paidStatus = salesOrder.paid_status;
            order.shippedStatus = salesOrder.shipped_status;
            order.salesChannel = salesOrder.sales_channel;
            order.salespersonName = salesOrder.salesperson_name;
            order.branchId = salesOrder.branch_id;
            order.hasAttachment = salesOrder.basicDetails.has_attachment;
            order.clientPoAttachment = [];
            for (let a of salesOrder.documents) {
                order.clientPoAttachment.push({ id: a.document_id, name: a.file_name, type: a.file_type, size: a.file_size_formatted, source: a.source });
            }
            order.clientPersonOfContacts = [];
            let cf_1_email = salesOrder.basicDetails.cf_client_poc_1_email ? (salesOrder.basicDetails.cf_client_poc_1_email == "" ? false : salesOrder.basicDetails.cf_client_poc_1_email) : false;
            let cf_2_email = salesOrder.basicDetails.cf_client_poc_2_email ? (salesOrder.basicDetails.cf_client_poc_2_email == "" ? false : salesOrder.basicDetails.cf_client_poc_2_email) : false;
            let cf_3_email = salesOrder.basicDetails.cf_client_poc_3_email ? (salesOrder.basicDetails.cf_client_poc_3_email == "" ? false : salesOrder.basicDetails.cf_client_poc_3_email) : false;
            let cf_4_email = salesOrder.basicDetails.cf_client_poc_4_email ? (salesOrder.basicDetails.cf_client_poc_4_email == "" ? false : salesOrder.basicDetails.cf_client_poc_4_email) : false;
            if (cf_1_email) {
                order.clientPersonOfContacts.push(cf_1_email);
            }
            if (cf_2_email) {
                order.clientPersonOfContacts.push(cf_2_email);
            }
            if (cf_3_email) {
                order.clientPersonOfContacts.push(cf_3_email);
            }
            if (cf_4_email) {
                order.clientPersonOfContacts.push(cf_4_email);
            }
            order.balance = salesOrder.balance;
            yield delete (salesOrder.basicDetails);
            order.orderDetails = salesOrder;
            return order;
        });
    }
    customerDetails(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/contacts/${id}?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630." || kill.code == 57) {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/contacts/${id}?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
            }
            let contact = kill.contact;
            if (contact) {
                return contact;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.UNAUTHORIZED,
                    error: 'Token Expire at inventory sales order',
                    message: "Zoho token issue contact admin",
                }, common_2.HttpStatus.UNAUTHORIZED);
            }
        });
    }
    basicOrderDetails(id, page) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!page) {
                console.log("page pram not  found");
                let token = yield this.zohoBookToken();
                let kill;
                for (page = 1; page > 0; page++) {
                    console.log("searching in page-", page);
                    let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519&page=${page}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${token}`,
                        }
                    })
                        .then(res => res.json())
                        .then(data => kill = data);
                    if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630." || kill.code == 57) {
                        token = yield this.zohoBookToken();
                        let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519&page=${page}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `${token}`,
                            }
                        })
                            .then(res => res.json())
                            .then(data => kill = data);
                    }
                    let salesOrder = kill.salesorders;
                    if (salesOrder == undefined) {
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.NOT_FOUND,
                            error: 'No data found in zoho',
                            Response: kill,
                            message: "Not Found Data",
                        }, common_2.HttpStatus.NOT_FOUND);
                    }
                    if (!(salesOrder.length > 0)) {
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.NOT_FOUND,
                            error: 'No data found in zoho with this id',
                            message: "Not Found Data",
                        }, common_2.HttpStatus.NOT_FOUND);
                    }
                    let find = yield salesOrder.find(i => i.salesorder_id == id);
                    if (find) {
                        return find;
                    }
                }
            }
            else {
                let token = yield this.zohoBookToken();
                let kill;
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519&page=${page}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
                if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630." || kill.code == 57) {
                    token = yield this.zohoBookToken();
                    let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `${token}`,
                        }
                    })
                        .then(res => res.json())
                        .then(data => kill = data);
                }
                let salesOrder = kill.salesorders;
                if (salesOrder == undefined) {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.NOT_FOUND,
                        error: 'No data found in zoho',
                        Response: kill,
                        message: "Not Found Data",
                    }, common_2.HttpStatus.NOT_FOUND);
                }
                return yield salesOrder.find(i => i.salesorder_id == id);
            }
        });
    }
    zohoAllSo(page) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!page) {
                page = 1;
            }
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519&page=${page}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015092519." || kill.code == 57) {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders?organization_id=60015092519&page=${page}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
            }
            let salesOrder = kill.salesorders;
            if (salesOrder == undefined) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'No data found in zoho',
                    Response: kill,
                    message: "Not Found Data",
                }, common_2.HttpStatus.NOT_FOUND);
            }
            return { count: salesOrder.length, data: salesOrder };
        });
    }
    saveZohoSalesOrder(salesOrder) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let find = yield this.zohoSalesOrderRepository.findOne({ where: { salesorderId: salesOrder.salesorderId } });
            if (find) {
                console.log("updating old  so");
                salesOrder.createdAt = find.createdAt ? find.createdAt : (salesOrder.createdAt ? salesOrder.createdAt : new Date());
                salesOrder.id = find.id;
                salesOrder.line_items = salesOrder.orderDetails.line_items;
                yield this.zohoSalesOrderRepository.save(salesOrder);
                return salesOrder;
            }
            else {
                console.log("saving new so");
                salesOrder.line_items = salesOrder.orderDetails.line_items;
                return yield this.zohoSalesOrderRepository.save(salesOrder);
            }
        });
    }
    getAttachment(orderId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders/${orderId}/attachment?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                    'Accept': 'application/pdf'
                }
            })
                .then(data => kill = data.body);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630." || kill.code == 57) {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders/${orderId}/attachment?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                        'Accept': 'application/pdf'
                    }
                })
                    .then(data => kill = data.body);
            }
            if (kill.code == 5) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'TOKEN issue',
                    message: "Attachment not found",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            return kill;
        });
    }
    OrderSummary(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders/${id}?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                    'Accept': 'application/pdf'
                }
            })
                .then(data => kill = data.body);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630." || kill.code == 57) {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders/${id}?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                        'Accept': 'application/pdf'
                    }
                })
                    .then(data => kill = data.body);
            }
            if (kill.code == 5) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'TOKEN issue',
                    message: "summery not found",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            return kill;
        });
    }
    salesOrderPackages(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/packages/print?organization_id=60015092519&package_ids=${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                    'Accept': 'application/pdf'
                }
            })
                .then(data => kill = data.body);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630." || kill.code == 57) {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/packages/print?organization_id=60015092519&package_ids=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                        'Accept': 'application/pdf'
                    }
                })
                    .then(data => kill = data.body);
            }
            if (kill.code == 5) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'TOKEN issue',
                    message: "Packages not found",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            return kill;
        });
    }
    salesOrderBill(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/bills/${id}?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                    'Accept': 'application/pdf'
                }
            })
                .then(data => kill = data.body);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630." || kill.code == 57) {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/bills/${id}?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                        'Accept': 'application/pdf'
                    }
                })
                    .then(data => kill = data.body);
            }
            if (kill.code == 5) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'TOKEN issue',
                    message: "Bill not found",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            return kill;
        });
    }
    salesOrderInvoice(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/invoices/${id}?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                    'Accept': 'application/pdf'
                }
            })
                .then(data => kill = data.body);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630." || kill.code == 57) {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/invoices/${id}?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                        'Accept': 'application/pdf'
                    }
                })
                    .then(data => kill = data.body);
            }
            if (kill.code == 5) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'TOKEN issue',
                    message: "Invoice not found",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            return kill;
        });
    }
    allOrderInvoices(salesOrderRefNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/invoices?organization_id=60015092519&reference_number=${salesOrderRefNumber}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630." || kill.code == 57) {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/invoices?organization_id=60015092519&reference_number=${salesOrderRefNumber}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
            }
            let invoices = kill.invoices;
            if (invoices == undefined) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'No data found in zoho',
                    Response: kill,
                    message: "Not Found Data",
                }, common_2.HttpStatus.NOT_FOUND);
            }
            return invoices;
        });
    }
    allPurchaseOrders(salesOrderRefNumber) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/purchaseorders?organization_id=60015092519&reference_number=${salesOrderRefNumber}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                }
            })
                .then(res => res.json())
                .then(data => kill = data);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630." || kill.code == 57) {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://books.zoho.in/api/v3/purchaseorders?organization_id=60015092519&reference_number=${salesOrderRefNumber}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
            }
            let purchaseOrders = kill.purchaseorders;
            if (purchaseOrders == undefined) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'No data found in zoho',
                    Response: kill,
                    message: "Not Found Data",
                }, common_2.HttpStatus.NOT_FOUND);
            }
            return purchaseOrders;
        });
    }
};
internalSalesOrderService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(zohoSalesOrder_entity_1.zohoSalesOrder)),
    tslib_1.__param(1, typeorm_1.InjectRepository(token_entity_1.zohoToken)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], internalSalesOrderService);
exports.internalSalesOrderService = internalSalesOrderService;
//# sourceMappingURL=salesOrder.service.js.map