"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const zohoSalesOrder_entity_1 = require("./zohoSalesOrder.entity");
const user_service_1 = require("./../users/user.service");
const token_entity_1 = require("./../sms/token.entity");
const product_service_1 = require("./../product/product.service");
const common_2 = require("@nestjs/common");
const entities_service_1 = require("./../entities/entities.service");
const organization_service_1 = require("./../organization/organization.service");
const company_service_1 = require("./../company/company.service");
const invoicePod_service_1 = require("./../invoice-pod/invoicePod.service");
const node_fetch_1 = require("node-fetch");
let zohoSalesOrderService = class zohoSalesOrderService {
    constructor(zohoSalesOrderRepository, zohoTokenRepository, userService, productService, entitiesService, organizationService, companyService, invoicePodService) {
        this.zohoSalesOrderRepository = zohoSalesOrderRepository;
        this.zohoTokenRepository = zohoTokenRepository;
        this.userService = userService;
        this.productService = productService;
        this.entitiesService = entitiesService;
        this.organizationService = organizationService;
        this.companyService = companyService;
        this.invoicePodService = invoicePodService;
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
    InventorySalesOrderByID(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let salesOrder;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders/${id}?organization_id=60015092519`, {
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
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders/${id}?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
            }
            salesOrder = kill.salesorder;
            if (salesOrder == undefined) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.UNAUTHORIZED,
                    error: 'Token Expire at inventory sales order ',
                    message: "Zoho token issue contact admin Or check your id again ",
                }, common_2.HttpStatus.UNAUTHORIZED);
            }
            let lineItems = salesOrder.line_items;
            let k1 = salesOrder.packages;
            let packages = {};
            for (let i = 0; i < lineItems.length; i++) {
                lineItems[i].package_id = [];
            }
            lineItems = yield this.itemStatus(lineItems, salesOrder);
            if (k1.length > 0) {
                for (let j = 0; j < k1.length; j++) {
                    let data = yield this.packageDetails(k1[j].package_id);
                    packages[k1[j].package_id] = data;
                    for (let k = 0; k < lineItems.length; k++) {
                        let p_id = yield this.itemDetails(lineItems[k], data);
                        if (p_id == "NA") {
                        }
                        else {
                            lineItems[k].package_id.push(p_id);
                        }
                    }
                }
            }
            salesOrder.package_list = packages;
            lineItems = yield this.setItemPrice(lineItems, salesOrder.date);
            lineItems = yield this.calShipment(lineItems, packages);
            salesOrder.line_items = lineItems;
            return salesOrder;
        });
    }
    updateLineItemCal(element, packages) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (element.quantity == element.quantity_returned) {
                element.shipment_status = [{ status: "Returned", date: new Date(), quantity: element.quantity, package_id: "" }];
                return element;
            }
            if (element.package_id.length > 0) {
                element.shipment_status = [{ status: "In Production", date: new Date(), quantity: element.quantity, package_id: "" }];
                for (let j = 0; j < element.package_id.length; j++) {
                    let package_id1 = element.package_id[j];
                    let pkg = packages[package_id1];
                    for (let k = 0; k < pkg.line_items.length; k++) {
                        if (pkg.line_items[k].item_id == element.item_id) {
                            if (pkg.status == "delivered") {
                                element.shipment_status.push({ status: "Delivered", date: pkg.shipment_delivered_date, quantity: pkg.line_items[k].quantity, package_id: pkg.package_id });
                                element.shipment_status[0].quantity = element.shipment_status[0].quantity - pkg.line_items[k].quantity;
                            }
                            else if (pkg.status == "not_shipped") {
                                element.shipment_status.push({ status: "In Production", date: pkg.date, quantity: pkg.line_items[k].quantity, package_id: pkg.package_id });
                                element.shipment_status[0].quantity = element.shipment_status[0].quantity - pkg.line_items[k].quantity;
                            }
                            else if (pkg.status == "shipped") {
                                element.shipment_status.push({ status: "Shipped", date: pkg.shipping_date, quantity: pkg.line_items[k].quantity, package_id: pkg.package_id });
                                element.shipment_status[0].quantity = element.shipment_status[0].quantity - pkg.line_items[k].quantity;
                            }
                            else {
                                element.shipment_status.push({ status: "Quality Check", date: pkg.shipping_date, quantity: pkg.line_items[k].quantity, package_id: pkg.package_id });
                                element.shipment_status[0].quantity = element.shipment_status[0].quantity - pkg.line_items[k].quantity;
                            }
                        }
                    }
                }
            }
            else {
                element.shipment_status = [{ status: "In Production", date: new Date(), quantity: element.quantity, package_id: "" }];
            }
            return element;
        });
    }
    calShipment(lineItems, packages) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const promises = lineItems.map(a => this.updateLineItemCal(a, packages));
            return yield Promise.all(promises);
            for (let i = 0; i < lineItems.length; i++) {
                if (lineItems[i].package_id.length > 0) {
                    lineItems[i].shipment_status = [{ status: "In Production", date: new Date(), quantity: lineItems[i].quantity, package_id: "" }];
                    for (let j = 0; j < lineItems[i].package_id.length; j++) {
                        let package_id1 = lineItems[i].package_id[j];
                        let pkg = packages[package_id1];
                        for (let k = 0; k < pkg.line_items.length; k++) {
                            if (pkg.line_items[k].item_id == lineItems[i].item_id) {
                                if (pkg.status == "delivered") {
                                    lineItems[i].shipment_status.push({ status: "Delivered", date: pkg.shipment_delivered_date, quantity: pkg.line_items[k].quantity, package_id: pkg.package_id });
                                    lineItems[i].shipment_status[0].quantity = lineItems[i].shipment_status[0].quantity - pkg.line_items[k].quantity;
                                }
                                else if (pkg.status == "not_shipped") {
                                    lineItems[i].shipment_status.push({ status: "In Production", date: pkg.date, quantity: pkg.line_items[k].quantity, package_id: pkg.package_id });
                                    lineItems[i].shipment_status[0].quantity = lineItems[i].shipment_status[0].quantity - pkg.line_items[k].quantity;
                                }
                                else if (pkg.status == "shipped") {
                                    lineItems[i].shipment_status.push({ status: "Shipped", date: pkg.shipping_date, quantity: pkg.line_items[k].quantity, package_id: pkg.package_id });
                                    lineItems[i].shipment_status[0].quantity = lineItems[i].shipment_status[0].quantity - pkg.line_items[k].quantity;
                                }
                                else {
                                    lineItems[i].shipment_status.push({ status: "Quality Check", date: pkg.shipping_date, quantity: pkg.line_items[k].quantity, package_id: pkg.package_id });
                                    lineItems[i].shipment_status[0].quantity = lineItems[i].shipment_status[0].quantity - pkg.line_items[k].quantity;
                                }
                            }
                        }
                    }
                }
                else {
                    lineItems[i].shipment_status = [{ status: "In Production", date: new Date(), quantity: lineItems[i].quantity, package_id: "" }];
                }
            }
            return lineItems;
        });
    }
    updateLineItemPrice(item1, date) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let sku = item1.sku;
            if (sku.startsWith('.')) {
                sku = sku.substring(1);
            }
            let item = yield this.productService.getProductBySku(sku);
            if (item) {
                let item_date = item.date;
                let item_date_arr = item_date.split("-");
                let item_date_year = item_date_arr[0];
                let item_date_month = item_date_arr[1];
                let item_date_day = item_date_arr[2];
                let item_date_date = new Date(item_date_year, item_date_month, item_date_day);
                let date_arr = date.split("-");
                let date_year = date_arr[0];
                let date_month = date_arr[1];
                let date_day = date_arr[2];
                let date_date = new Date(date_year, date_month, date_day);
                if (item_date_date > date_date) {
                    item1.prodo_price = item.price;
                    item1.prodo_images = item.productImages;
                }
                else {
                    item.price = yield this.productService.currentPriceUpdate(item, date, item1.rate);
                    item1.prodo_pricee = item.price;
                    item1.prodo_images = item.productImages;
                }
            }
            else {
                item1.prodo_pricee = item1.rate;
                item1.prodo_images = [];
            }
            return item1;
        });
    }
    setItemPrice(lineItems, date) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const promises = lineItems.map(a => this.updateLineItemPrice(a, date));
            return yield Promise.all(promises);
            for (let i = 0; i < lineItems.length; i++) {
                let sku = lineItems[i].sku;
                if (sku.startsWith('.')) {
                    sku = sku.substring(1);
                }
                let item = yield this.productService.getProductBySku(sku);
                if (item) {
                    let item_date = item.date;
                    let item_date_arr = item_date.split("-");
                    let item_date_year = item_date_arr[0];
                    let item_date_month = item_date_arr[1];
                    let item_date_day = item_date_arr[2];
                    let item_date_date = new Date(item_date_year, item_date_month, item_date_day);
                    let date_arr = date.split("-");
                    let date_year = date_arr[0];
                    let date_month = date_arr[1];
                    let date_day = date_arr[2];
                    let date_date = new Date(date_year, date_month, date_day);
                    if (item_date_date > date_date) {
                        lineItems[i].prodo_price = item.price;
                        lineItems[i].prodo_images = item.productImages;
                    }
                    else {
                        item.price = yield this.productService.currentPriceUpdate(item, date, lineItems[i].rate);
                        lineItems[i].prodo_pricee = item.price;
                        lineItems[i].prodo_images = item.productImages;
                    }
                }
                else {
                    lineItems[i].prodo_pricee = lineItems[i].rate;
                    lineItems[i].prodo_images = [];
                }
            }
            return lineItems;
        });
    }
    itemDetails(lineItem, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let itemDetails = "NA";
            let item_id = lineItem.item_id;
            let line_items = data.line_items;
            for (let i = 0; i < line_items.length; i++) {
                if (line_items[i].item_id == item_id) {
                    itemDetails = data.package_id;
                }
            }
            return itemDetails;
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
    mapData(salesOrder, customer) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let mapData = {
                salesOrder: {},
                organization: {},
                company: {},
                entity: {},
                status: false
            };
            mapData.organization = yield this.organizationService.mapOrganization(customer);
            mapData.company = yield this.companyService.mapCompany(salesOrder, customer);
            mapData.salesOrder = yield this.salesOrderFormatData(salesOrder);
            mapData.entity = yield this.entitiesService.mapEntity(salesOrder);
            if (mapData.organization && mapData.company && mapData.salesOrder && mapData.entity) {
                mapData.status = true;
                return mapData;
            }
            else {
                return mapData;
            }
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
    saveFromZohoId(id, page) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let so = yield this.InventorySalesOrderByID(id);
            if (page) {
                so.basicDetails = yield this.basicOrderDetails(id, page);
            }
            else {
                so.basicDetails = yield this.basicOrderDetails(id);
            }
            let customer = yield this.customerDetails(so.customer_id);
            let mapData = yield this.mapData(so, customer);
            if (!mapData.status) {
                return { error: "error", mapData: mapData };
            }
            let adminUser = yield this.userService.findByEmail(mapData.salesOrder.clientPersonOfContacts[0]);
            if (!adminUser) {
                adminUser = yield this.userService.makeDummyUser(mapData.salesOrder.clientPersonOfContacts[0]);
            }
            mapData.organization.account_id = String(adminUser.accountId);
            let organization = yield this.organizationService.zohoCustomerOrganization(mapData.organization);
            mapData.company.organization_id = String(organization.id);
            let company = yield this.companyService.zohoCustomerCompany(mapData.company);
            mapData.entity.companyId = String(company.id);
            let entity = yield this.entitiesService.zohoCustomerEntity(mapData.entity);
            mapData.salesOrder.organization_id = String(organization.id);
            mapData.salesOrder.companyId = String(company.id);
            mapData.salesOrder.entityId = String(entity.id);
            let salesOrder = yield this.saveZohoSalesOrder(mapData.salesOrder);
            let users = yield this.userService.zohoPocUsers(mapData.salesOrder.clientPersonOfContacts);
            users = yield this.userService.zohoUsersUpdate(users, salesOrder.organization_id, salesOrder.companyId, salesOrder.entityId);
            if (!company.entityIds.includes(mapData.salesOrder.entityId)) {
                company.entityIds.push(mapData.salesOrder.entityId);
                company = yield this.companyService.zohoCustomerCompany(company);
            }
            let orgUpdate = false;
            if (!organization.entityIds.includes(mapData.salesOrder.entityId)) {
                organization.entityIds.push(mapData.salesOrder.entityId);
                orgUpdate = true;
            }
            if (!organization.companyIds.includes(mapData.salesOrder.companyId)) {
                organization.companyIds.push(mapData.salesOrder.companyId);
                orgUpdate = true;
            }
            if (orgUpdate) {
                organization = yield this.organizationService.zohoCustomerOrganization(organization);
            }
            return { salesOrderId: salesOrder.id, organizationId: organization.id, companyId: company.id, entityid: entity.id, users: users.map(({ id, email }) => ({ [id]: email })) };
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
    calDashboardData(data, salesOrders) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            data = yield this.dataUpdate(data, salesOrders);
            data = yield this.userService.updatepieChart(data);
            return data;
        });
    }
    dataUpdate(data, orders) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let current_date = new Date();
            for (let i = 0; i < 8; i++) {
                let date = new Date(current_date.getFullYear(), current_date.getMonth() - i, 1);
                let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                data.barChart.push({ name: month, value: Number(0) });
            }
            var bar = yield new Promise((resolve, reject) => {
                orders.forEach((C, i, array) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    data.orders.total++;
                    data.orders.submitted++;
                    if (C.paidStatus == "unpaid") {
                        data.payments.due += Number(C.total);
                    }
                    else if (!C.paidStatus) {
                        if (C.orderStatus == "approved") {
                            data.payments.paid += Number(C.total) || 0;
                        }
                        else {
                            data.payments.due += Number(C.total);
                        }
                    }
                    else {
                        data.payments.paid += Number(C.total) || 0;
                    }
                    data.payments.total += Number(C.total) || 0;
                    if (C.status === 'fulfilled') {
                        data.orders.completed++;
                    }
                    else {
                        data.orders.inProgress++;
                    }
                    let a;
                    for (a of C.line_items) {
                        if (a.sku.startsWith('.')) {
                            a.sku = a.sku.substring(1);
                        }
                        let product = yield this.productService.getProductBySku(a.sku);
                        if (product) {
                            let found = data.pieChart.find(element => element.name == product.categoryId.toString());
                            if (found) {
                                found.value += Number(a.item_total) || 0;
                            }
                            else {
                                data.pieChart.push({ name: product.categoryId, value: Number(a.quantity) });
                            }
                        }
                        else {
                            let found = data.pieChart.find(element => element['name'] == "Others".toString());
                            if (found) {
                                found.value += Number(a.item_total) || 0;
                            }
                            else {
                                data.pieChart.push({ name: 'Others', value: Number(a.item_total) });
                            }
                        }
                    }
                    let date = new Date(C.date);
                    let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                    let foundBar = data.barChart.find(element => element.name === month);
                    if (foundBar) {
                        foundBar.value += Number(C.total) || 0;
                    }
                    else {
                        data.barChart.push({ C: month, value: Number(C.total) });
                    }
                    if (orders.length - 1 === i) {
                        resolve(data);
                    }
                }));
            });
            return bar;
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
    invoiceAllDetails(id, po) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let salesorder = yield this.zohoSalesOrderRepository.findOne({ where: { salesorderId: id } });
            if (salesorder) {
                let soInvoices = yield this.allOrderInvoices(salesorder.salesorderNumber);
                let token = yield this.zohoBookToken();
                for (let invoice of soInvoices) {
                    invoice.invoice_pods = yield this.invoicePodService.getInvoicePods(invoice.invoice_id);
                    invoice.line_items = yield this.invoicePodService.findInvoiceDetails(token, invoice.invoice_id);
                    invoice.clientPoReferenceNumber = salesorder.referenceNumber;
                    invoice.line_items = invoice.line_items.line_items;
                }
                soInvoices = yield soInvoices.map(({ invoice_id, invoice_number, clientPoReferenceNumber, invoice_pods, shipping_address, total, date, due_date, line_items }) => ({ ['invoice_id']: invoice_id, ['invoice_number']: invoice_number, ['clientPoReferenceNumber']: clientPoReferenceNumber, ['invoice_pods']: invoice_pods, ['shipping_address']: shipping_address, ['total']: total, ['date']: date, ['due_date']: due_date, ['line_items']: line_items }));
                if (po) {
                    return soInvoices;
                }
                else {
                    return soInvoices;
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'SalesOrder not found',
                    message: "invalid id",
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    allShipments(salesOrder) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
    notYetShipped(r) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = r.data;
            const promises = data.map(a => this.allShipments(a));
            let result = yield Promise.all(promises);
            return { data: result, count: result.length };
        });
    }
};
zohoSalesOrderService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(zohoSalesOrder_entity_1.zohoSalesOrder)),
    tslib_1.__param(1, typeorm_1.InjectRepository(token_entity_1.zohoToken)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        user_service_1.UserService,
        product_service_1.ProductService,
        entities_service_1.entitiesService,
        organization_service_1.OrganizationService,
        company_service_1.companyService,
        invoicePod_service_1.invoicePodService])
], zohoSalesOrderService);
exports.zohoSalesOrderService = zohoSalesOrderService;
//# sourceMappingURL=zohoSalesOrder.service.js.map