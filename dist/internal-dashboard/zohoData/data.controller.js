"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const internal_jwt_auth_guard_1 = require("../../authentication/internal-jwt-auth.guard");
const common_2 = require("@nestjs/common");
const prodoRoles_constants_1 = require("../zohoEmployee/prodoRoles.constants");
const prodoRoles_service_1 = require("../prodoRoles/prodoRoles.service");
const userRoles_service_1 = require("../prodoRoles/userRoles.service");
const zohoEmployee_service_1 = require("../zohoEmployee/zohoEmployee.service");
const typeorm_1 = require("typeorm");
const product_entity_1 = require("./../../product/product.entity");
const salesOrder_service_1 = require("./services/salesOrder.service");
const bill_service_1 = require("./services/bill.service");
const invoice_service_1 = require("./services/invoice.service");
const purchaseOrder_service_1 = require("./services/purchaseOrder.service");
const product_service_1 = require("./services/product.service");
const batchItem_service_1 = require("../batchItems/batchItem.service");
const fs = require('fs');
const http = require("https");
let zohoDataController = class zohoDataController {
    constructor(prodoRolesService, zohoEmployeeService, userRolesService, internalSalesOrderService, internalBillService, internalInvoiceService, internalPurchaseOrderService, internalProductService, batchItemService) {
        this.prodoRolesService = prodoRolesService;
        this.zohoEmployeeService = zohoEmployeeService;
        this.userRolesService = userRolesService;
        this.internalSalesOrderService = internalSalesOrderService;
        this.internalBillService = internalBillService;
        this.internalInvoiceService = internalInvoiceService;
        this.internalPurchaseOrderService = internalPurchaseOrderService;
        this.internalProductService = internalProductService;
        this.batchItemService = batchItemService;
    }
    findAllInvoice(req, search = "", status = "", limit = 500, page = 1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            limit = limit > 500 ? 500 : limit;
            let start = (page - 1) * limit;
            let end = page * limit;
            let user = req.user;
            const attrFilter = [];
            if (status) {
                attrFilter.push({
                    "status": status
                });
            }
            let query;
            if (attrFilter.length > 0) {
                query = {
                    where: {
                        $or: [
                            { invoice_id: { $regex: search, $options: 'i' } },
                            { invoice_number: { $regex: search, $options: 'i' } },
                            { customer_name: { $regex: search, $options: 'i' } },
                            { place_of_supply: { $regex: search, $options: 'i' } },
                            { date: { $regex: search, $options: 'i' } },
                            { total: { $regex: search, $options: 'i' } },
                            { status: { $regex: search, $options: 'i' } },
                            { gst_no: { $regex: search, $options: 'i' } },
                            { salesperson_name: { $regex: search, $options: 'i' } },
                            { submitted_by: { $regex: search, $options: 'i' } },
                            { customer_id: { $regex: search, $options: 'i' } },
                        ],
                        $and: [
                            ...attrFilter
                        ]
                    }
                };
            }
            else {
                query = {
                    where: {
                        $or: [
                            { invoice_id: { $regex: search, $options: 'i' } },
                            { invoice_number: { $regex: search, $options: 'i' } },
                            { customer_name: { $regex: search, $options: 'i' } },
                            { place_of_supply: { $regex: search, $options: 'i' } },
                            { date: { $regex: search, $options: 'i' } },
                            { total: { $regex: search, $options: 'i' } },
                            { status: { $regex: search, $options: 'i' } },
                            { gst_no: { $regex: search, $options: 'i' } },
                            { salesperson_name: { $regex: search, $options: 'i' } },
                            { submitted_by: { $regex: search, $options: 'i' } },
                            { customer_id: { $regex: search, $options: 'i' } },
                        ]
                    }
                };
            }
            let result;
            if (user.roles) {
                if (user.roles.includes(prodoRoles_constants_1.UserRole.PRODO_ADMIN)) {
                    let query1 = {
                        where: {
                            $or: [
                                { invoice_id: { $regex: search, $options: 'i' } },
                                { invoice_number: { $regex: search, $options: 'i' } },
                                { customer_name: { $regex: search, $options: 'i' } },
                                { place_of_supply: { $regex: search, $options: 'i' } },
                                { date: { $regex: search, $options: 'i' } },
                                { total: { $regex: search, $options: 'i' } },
                                { status: { $regex: search, $options: 'i' } },
                                { gst_no: { $regex: search, $options: 'i' } },
                                { salesperson_name: { $regex: search, $options: 'i' } },
                                { submitted_by: { $regex: search, $options: 'i' } },
                                { customer_id: { $regex: search, $options: 'i' } },
                            ]
                        }
                    };
                    let attrFilter1 = [];
                    if (status) {
                        attrFilter1.push({
                            "status": status
                        });
                        let query1 = {
                            where: {
                                $or: [
                                    { invoice_id: { $regex: search, $options: 'i' } },
                                    { invoice_number: { $regex: search, $options: 'i' } },
                                    { customer_name: { $regex: search, $options: 'i' } },
                                    { place_of_supply: { $regex: search, $options: 'i' } },
                                    { date: { $regex: search, $options: 'i' } },
                                    { total: { $regex: search, $options: 'i' } },
                                    { status: { $regex: search, $options: 'i' } },
                                    { gst_no: { $regex: search, $options: 'i' } },
                                    { salesperson_name: { $regex: search, $options: 'i' } },
                                    { submitted_by: { $regex: search, $options: 'i' } },
                                    { customer_id: { $regex: search, $options: 'i' } },
                                ],
                                $and: [
                                    ...attrFilter1
                                ]
                            }
                        };
                        result = yield this.internalInvoiceService.findAll(query1);
                    }
                    else {
                        result = yield this.internalInvoiceService.findAll(query1);
                    }
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Invoices", count: result.count, limit: limit, page: page, data: result.data };
                }
                else {
                    result = yield this.internalInvoiceService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Invoices", count: result.count, limit: limit, page: page, data: result.data };
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid User",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    zohoAllInvoice() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let page = 1;
            let result = [];
            for (let page = 1; page > 0; page++) {
                let data = yield this.internalInvoiceService.zohoAll(page);
                if (data.count) {
                    result = result.concat(data.data);
                }
                else {
                    break;
                }
            }
            return { statusCode: 200, message: "All invoices From zoho", count: result.length, data: result };
        });
    }
    zohoOneInvoice(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.internalInvoiceService.InventoryByID(id);
            return { statusCode: 200, message: "Order Details from zoho mapped", data: data };
        });
    }
    getAttachmentInvoice(invoiceId, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw new common_2.HttpException({
                status: common_2.HttpStatus.NOT_IMPLEMENTED,
                error: 'NOT_IMPLEMENTED',
                message: "NOT_IMPLEMENTED",
            }, common_2.HttpStatus.NOT_IMPLEMENTED);
            var attachment = yield this.internalInvoiceService.getAttachment(invoiceId);
            if (attachment) {
                attachment.pipe(res);
                return res;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'Attachment not found',
                    message: "Attachment not found",
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    SummaryInvoice(invoiceId, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var Summary = yield this.internalInvoiceService.Summary(invoiceId);
            if (Summary) {
                Summary.pipe(res);
                return res;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'Summary not found',
                    message: "Summary not found",
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    findAllBill(req, search = "", status = "", limit = 500, page = 1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            limit = limit > 500 ? 500 : limit;
            let start = (page - 1) * limit;
            let end = page * limit;
            let user = req.user;
            const attrFilter = [];
            if (status) {
                attrFilter.push({
                    "status": status
                });
            }
            let query;
            if (attrFilter.length > 0) {
                query = {
                    where: {
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } },
                            { customerName: { $regex: search, $options: 'i' } },
                            { purchaseorder_number: { $regex: search, $options: 'i' } },
                            { date: { $regex: search, $options: 'i' } },
                            { reference_number: { $regex: search, $options: 'i' } },
                            { status: { $regex: search, $options: 'i' } },
                            { order_status: { $regex: search, $options: 'i' } },
                            { received_status: { $regex: search, $options: 'i' } },
                            { billed_status: { $regex: search, $options: 'i' } },
                            { vendor_name: { $regex: search, $options: 'i' } },
                        ],
                        $and: [
                            ...attrFilter
                        ]
                    }
                };
            }
            else {
                query = {
                    where: {
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } },
                            { customerName: { $regex: search, $options: 'i' } },
                            { purchaseorder_number: { $regex: search, $options: 'i' } },
                            { date: { $regex: search, $options: 'i' } },
                            { reference_number: { $regex: search, $options: 'i' } },
                            { status: { $regex: search, $options: 'i' } },
                            { order_status: { $regex: search, $options: 'i' } },
                            { received_status: { $regex: search, $options: 'i' } },
                            { billed_status: { $regex: search, $options: 'i' } },
                            { vendor_name: { $regex: search, $options: 'i' } },
                        ]
                    }
                };
            }
            let result;
            if (user.roles) {
                if (user.roles.includes(prodoRoles_constants_1.UserRole.PRODO_ADMIN)) {
                    let query1 = {
                        where: {
                            $or: [
                                { name: { $regex: search, $options: 'i' } },
                                { description: { $regex: search, $options: 'i' } },
                                { customerName: { $regex: search, $options: 'i' } },
                                { purchaseorder_number: { $regex: search, $options: 'i' } },
                                { date: { $regex: search, $options: 'i' } },
                                { reference_number: { $regex: search, $options: 'i' } },
                                { status: { $regex: search, $options: 'i' } },
                                { order_status: { $regex: search, $options: 'i' } },
                                { received_status: { $regex: search, $options: 'i' } },
                                { billed_status: { $regex: search, $options: 'i' } },
                                { vendor_name: { $regex: search, $options: 'i' } },
                            ]
                        }
                    };
                    let attrFilter1 = [];
                    if (status) {
                        attrFilter1.push({
                            "status": status
                        });
                        let query1 = {
                            where: {
                                $or: [
                                    { name: { $regex: search, $options: 'i' } },
                                    { description: { $regex: search, $options: 'i' } },
                                    { customerName: { $regex: search, $options: 'i' } },
                                    { purchaseorder_number: { $regex: search, $options: 'i' } },
                                    { date: { $regex: search, $options: 'i' } },
                                    { reference_number: { $regex: search, $options: 'i' } },
                                    { status: { $regex: search, $options: 'i' } },
                                    { order_status: { $regex: search, $options: 'i' } },
                                    { received_status: { $regex: search, $options: 'i' } },
                                    { billed_status: { $regex: search, $options: 'i' } },
                                    { vendor_name: { $regex: search, $options: 'i' } },
                                ],
                                $and: [
                                    ...attrFilter1
                                ]
                            }
                        };
                        result = yield this.internalBillService.findAll(query1);
                    }
                    else {
                        result = yield this.internalBillService.findAll(query1);
                    }
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Orders", count: result.count, limit: limit, page: page, data: result.data };
                }
                else {
                    result = yield this.internalBillService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Orders", count: result.count, limit: limit, page: page, data: result.data };
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid User",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    zohoAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let page = 1;
            let result = [];
            for (let page = 1; page > 0; page++) {
                let data = yield this.internalBillService.zohoAll(page);
                if (data.count) {
                    result = result.concat(data.data);
                }
                else {
                    break;
                }
            }
            return { statusCode: 200, message: "All Orders From zoho", count: result.length, data: result };
        });
    }
    zohoOneBill(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.internalBillService.InventoryByID(id);
            return { statusCode: 200, message: "Bill Details from zoho mapped", data: data };
        });
    }
    getAttachmentBill(purchaseOrderId, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw new common_2.HttpException({
                status: common_2.HttpStatus.NOT_IMPLEMENTED,
                error: 'NOT_IMPLEMENTED',
                message: "NOT_IMPLEMENTED",
            }, common_2.HttpStatus.NOT_IMPLEMENTED);
            var attachment = yield this.internalBillService.getAttachment(billId);
            if (attachment) {
                attachment.pipe(res);
                return res;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'Attachment not found',
                    message: "Attachment not found",
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    SummaryBill(billId, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var Summary = yield this.internalBillService.Summary(billId);
            if (Summary) {
                Summary.pipe(res);
                return res;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'Summary not found',
                    message: "Summary not found",
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    findAllPo(req, search = "", status = "", limit = 500, page = 1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            limit = limit > 500 ? 500 : limit;
            let start = (page - 1) * limit;
            let end = page * limit;
            let user = req.user;
            const attrFilter = [];
            if (status) {
                attrFilter.push({
                    "status": status
                });
            }
            let query;
            if (attrFilter.length > 0) {
                query = {
                    where: {
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } },
                            { customerName: { $regex: search, $options: 'i' } },
                            { purchaseorder_number: { $regex: search, $options: 'i' } },
                            { date: { $regex: search, $options: 'i' } },
                            { reference_number: { $regex: search, $options: 'i' } },
                            { status: { $regex: search, $options: 'i' } },
                            { order_status: { $regex: search, $options: 'i' } },
                            { received_status: { $regex: search, $options: 'i' } },
                            { billed_status: { $regex: search, $options: 'i' } },
                            { vendor_name: { $regex: search, $options: 'i' } },
                        ],
                        $and: [
                            ...attrFilter
                        ]
                    }
                };
            }
            else {
                query = {
                    where: {
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } },
                            { customerName: { $regex: search, $options: 'i' } },
                            { purchaseorder_number: { $regex: search, $options: 'i' } },
                            { date: { $regex: search, $options: 'i' } },
                            { reference_number: { $regex: search, $options: 'i' } },
                            { status: { $regex: search, $options: 'i' } },
                            { order_status: { $regex: search, $options: 'i' } },
                            { received_status: { $regex: search, $options: 'i' } },
                            { billed_status: { $regex: search, $options: 'i' } },
                            { vendor_name: { $regex: search, $options: 'i' } },
                        ]
                    }
                };
            }
            let result;
            if (user.roles) {
                if (user.roles.includes(prodoRoles_constants_1.UserRole.PRODO_ADMIN)) {
                    let query1 = {
                        where: {
                            $or: [
                                { name: { $regex: search, $options: 'i' } },
                                { description: { $regex: search, $options: 'i' } },
                                { customerName: { $regex: search, $options: 'i' } },
                                { purchaseorder_number: { $regex: search, $options: 'i' } },
                                { date: { $regex: search, $options: 'i' } },
                                { reference_number: { $regex: search, $options: 'i' } },
                                { status: { $regex: search, $options: 'i' } },
                                { order_status: { $regex: search, $options: 'i' } },
                                { received_status: { $regex: search, $options: 'i' } },
                                { billed_status: { $regex: search, $options: 'i' } },
                                { vendor_name: { $regex: search, $options: 'i' } },
                            ]
                        }
                    };
                    let attrFilter1 = [];
                    if (status) {
                        attrFilter1.push({
                            "status": status
                        });
                        let query1 = {
                            where: {
                                $or: [
                                    { name: { $regex: search, $options: 'i' } },
                                    { description: { $regex: search, $options: 'i' } },
                                    { customerName: { $regex: search, $options: 'i' } },
                                    { purchaseorder_number: { $regex: search, $options: 'i' } },
                                    { date: { $regex: search, $options: 'i' } },
                                    { reference_number: { $regex: search, $options: 'i' } },
                                    { status: { $regex: search, $options: 'i' } },
                                    { order_status: { $regex: search, $options: 'i' } },
                                    { received_status: { $regex: search, $options: 'i' } },
                                    { billed_status: { $regex: search, $options: 'i' } },
                                    { vendor_name: { $regex: search, $options: 'i' } },
                                ],
                                $and: [
                                    ...attrFilter1
                                ]
                            }
                        };
                        result = yield this.internalPurchaseOrderService.findAll(query1);
                    }
                    else {
                        result = yield this.internalPurchaseOrderService.findAll(query1);
                    }
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Orders", count: result.count, limit: limit, page: page, data: result.data };
                }
                else {
                    result = yield this.internalPurchaseOrderService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Orders", count: result.count, limit: limit, page: page, data: result.data };
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid User",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    bySalesOrderNumber(id = "") {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result = yield this.internalPurchaseOrderService.findAll({ where: { reference_number: id } });
            return { statusCode: 200, message: "All Purchase Orders by salesOrder Number", data: result.data };
        });
    }
    GetData(item, batchesItems) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let obj = yield batchesItems.filter(o => (o.sku == item.sku));
            if (obj.length) {
                item.batchDetails = obj;
                item.occupiedQuantity = 0;
                for (let i of obj) {
                    item.occupiedQuantity = item.occupiedQuantity + i.quantity;
                }
                item.leftQuantity = item.quantity - item.occupiedQuantity;
                return item;
            }
            else {
                item.batchDetails = [];
                item.leftQuantity = item.quantity;
                item.occupiedQuantity = 0;
                return item;
            }
        });
    }
    poItemDetails(id = "") {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result = yield this.internalPurchaseOrderService.findAll({ where: { purchaseorder_id: id } });
            if (result.count) {
                result = result.data[0];
                let batchesItems = yield this.batchItemService.findAll({ where: { purchaseOrderId: id } });
                batchesItems = batchesItems.data;
                const promises = result.line_items.map(a => this.GetData(a, batchesItems));
                result.line_items = yield Promise.all(promises);
                return { statusCode: 200, message: "Purchase Orders Full details", data: result };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'EXPECTATION_FAILED',
                    message: "Purchase Order not found",
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    zohoAllPo() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let page = 1;
            let result = [];
            for (let page = 1; page > 0; page++) {
                let data = yield this.internalPurchaseOrderService.zohoAllPo(page);
                if (data.count) {
                    result = result.concat(data.data);
                }
                else {
                    break;
                }
            }
            return { statusCode: 200, message: "All Orders From zoho", count: result.length, data: result };
        });
    }
    zohoOnePo(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.internalPurchaseOrderService.InventoryPorByID(id);
            return { statusCode: 200, message: "Order Details from zoho mapped", data: data };
        });
    }
    getAttachmentPo(purchaseOrderId, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            throw new common_2.HttpException({
                status: common_2.HttpStatus.NOT_IMPLEMENTED,
                error: 'NOT_IMPLEMENTED',
                message: "NOT_IMPLEMENTED",
            }, common_2.HttpStatus.NOT_IMPLEMENTED);
            var attachment = yield this.internalPurchaseOrderService.getAttachment(purchaseOrderId);
            if (attachment) {
                attachment.pipe(res);
                return res;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'Attachment not found',
                    message: "Attachment not found",
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    POrderSummary(purchaseOrderId, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var OrderSummary = yield this.internalPurchaseOrderService.OrderSummary(purchaseOrderId);
            if (OrderSummary) {
                OrderSummary.pipe(res);
                return res;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'OrderSummary not found',
                    message: "OrderSummary not found",
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    findAllSo(req, search = "", status = "NA", limit = 100, byOrganization = "NA", byCompany = "NA", byEntity = "NA", page = 1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            limit = limit > 200 ? 200 : limit;
            let start = (page - 1) * limit;
            let end = page * limit;
            let user = req.user;
            const attrFilter = [];
            if (status != "NA") {
                attrFilter.push({
                    "status": status
                });
            }
            if (byOrganization != "NA") {
                attrFilter.push({
                    "organization_id": byOrganization
                });
            }
            if (byCompany != "NA") {
                attrFilter.push({
                    "companyId": byCompany
                });
            }
            if (byEntity != "NA") {
                attrFilter.push({
                    "entityId": byEntity
                });
            }
            let query;
            if (attrFilter.length > 0) {
                query = {
                    where: {
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } },
                            { customerName: { $regex: search, $options: 'i' } },
                            { referenceNumber: { $regex: search, $options: 'i' } },
                            { companyName: { $regex: search, $options: 'i' } },
                            { salesorderNumber: { $regex: search, $options: 'i' } },
                            { status: { $regex: search, $options: 'i' } },
                            { salespersonName: { $regex: search, $options: 'i' } },
                            { salesorderId: { $regex: search, $options: 'i' } },
                            { date: { $regex: search, $options: 'i' } },
                        ],
                        $and: [
                            ...attrFilter
                        ]
                    }
                };
            }
            else {
                query = {
                    where: {
                        $or: [
                            { name: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } },
                            { customerName: { $regex: search, $options: 'i' } },
                            { referenceNumber: { $regex: search, $options: 'i' } },
                            { companyName: { $regex: search, $options: 'i' } },
                            { salesorderNumber: { $regex: search, $options: 'i' } },
                            { status: { $regex: search, $options: 'i' } },
                            { salespersonName: { $regex: search, $options: 'i' } },
                            { salesorderId: { $regex: search, $options: 'i' } },
                            { date: { $regex: search, $options: 'i' } },
                        ]
                    }
                };
            }
            let result;
            if (user.roles) {
                if (user.roles.includes(prodoRoles_constants_1.UserRole.PRODO_ADMIN)) {
                    let query1 = {
                        where: {
                            $or: [
                                { name: { $regex: search, $options: 'i' } },
                                { description: { $regex: search, $options: 'i' } },
                                { customerName: { $regex: search, $options: 'i' } },
                                { referenceNumber: { $regex: search, $options: 'i' } },
                                { companyName: { $regex: search, $options: 'i' } },
                                { salesorderNumber: { $regex: search, $options: 'i' } },
                                { status: { $regex: search, $options: 'i' } },
                                { salespersonName: { $regex: search, $options: 'i' } },
                                { salesorderId: { $regex: search, $options: 'i' } },
                                { date: { $regex: search, $options: 'i' } },
                            ]
                        }
                    };
                    result = yield this.internalSalesOrderService.findAll(query1);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Orders", count: result.count, limit: limit, page: page, data: result.data };
                }
                else {
                    result = yield this.internalSalesOrderService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Orders", count: result.count, limit: limit, page: page, data: result.data };
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid User",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    OneSo(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = req.user;
            if (user.roles) {
                if (user.roles.includes(prodoRoles_constants_1.UserRole.PRODO_ADMIN)) {
                    let data = yield this.internalSalesOrderService.findOne(id);
                    if (data) {
                        return { statusCode: 200, message: "Order Details", data: data };
                    }
                    else {
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.NOT_FOUND,
                            error: 'salesorder not found',
                            message: "Please check your id",
                        }, common_2.HttpStatus.NOT_FOUND);
                    }
                }
                else {
                    let data = yield this.internalSalesOrderService.findOne(id);
                    if (data) {
                        return { statusCode: 200, message: "Order Details ", data: data };
                    }
                    else {
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.NOT_FOUND,
                            error: 'salesorder not found',
                            message: "Please check your id",
                        }, common_2.HttpStatus.NOT_FOUND);
                    }
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid User",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    zohoAllSo() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let page = 1;
            let result = [];
            for (let page = 1; page > 0; page++) {
                let data = yield this.internalSalesOrderService.zohoAllSo(page);
                if (data.count) {
                    result = result.concat(data.data);
                }
                else {
                    break;
                }
            }
            return { statusCode: 200, message: "All Orders From zoho", count: result.length, data: result };
        });
    }
    getAttachmentSO(salesOrderId, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var attachment = yield this.internalSalesOrderService.getAttachment(salesOrderId);
            if (attachment) {
                attachment.pipe(res);
                return res;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'Attachment not found',
                    message: "Attachment not found",
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    SOrderSummary(salesOrderId, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var OrderSummary = yield this.internalSalesOrderService.OrderSummary(salesOrderId);
            if (OrderSummary) {
                OrderSummary.pipe(res);
                return res;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'OrderSummary not found',
                    message: "OrderSummary not found",
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    salesOrderPackages(packageIds, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var salesOrderPackages = yield this.internalSalesOrderService.salesOrderPackages(packageIds);
            if (salesOrderPackages) {
                salesOrderPackages.pipe(res);
                return res;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'salesOrderPackages not found',
                    message: "salesOrderPackages not found",
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    allProducts(page = 1, limit = 10, search = "") {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log('q', page);
            limit = limit > 100 ? 100 : limit;
            if (search) {
                const query = {
                    where: {
                        $or: [
                            { productName: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } },
                            { seo: { $regex: search, $options: 'i' } },
                            { sku: { $regex: search, $options: 'i' } },
                            { zohoBooksProductId: { $regex: search, $options: 'i' } }
                        ]
                    },
                    take: 10,
                };
                const query1 = {
                    where: {
                        $or: [
                            { productName: { $regex: search, $options: 'i' } },
                            { description: { $regex: search, $options: 'i' } },
                            { seo: { $regex: search, $options: 'i' } },
                            { sku: { $regex: search, $options: 'i' } },
                            { zohoBooksProductId: { $regex: search, $options: 'i' } }
                        ]
                    }
                };
                let items = yield typeorm_1.getMongoRepository(product_entity_1.Product).find(query);
                let total = yield typeorm_1.getMongoRepository(product_entity_1.Product).find(query1);
                let result = {
                    items: items,
                    meta: {
                        "totalItems": total.length,
                        "itemCount": 10,
                        "itemsPerPage": 10,
                        "totalPages": total.length % 10 ? ((total.length - total.length % 10) / 10) + 1 : (total.length / 10 ? total.length / 10 : 1),
                        "currentPage": 1
                    },
                    links: {
                        "first": "/products?limit=10",
                        "previous": "",
                        "next": "/products?page=2&limit=10",
                        "last": "/products?page=137&limit=10"
                    }
                };
                return result;
            }
            else {
                return this.internalProductService.paginate({
                    page,
                    limit,
                    route: '/products',
                });
            }
        });
    }
    allProductsFlitered(page = 1, limit = 10, category = "", search = "", fPriceMin = 0, fPriceMax = 100000, fType = "", fAttr = "", order = 1, zohoBooksProduct, readyProduct, madeToOrder, whiteLabeling) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log('category', category);
            console.log('search', search);
            console.log('order', order);
            console.log('fPriceMin', fPriceMin);
            console.log('fPriceMax', fPriceMax);
            console.log('fType', fType);
            console.log('fAttr', fAttr);
            console.log('readyProduct', Boolean(readyProduct));
            console.log('madeToOrder', madeToOrder);
            console.log('whiteLabeling', whiteLabeling);
            console.log('zohoBooksProduct', zohoBooksProduct);
            limit = limit > 100 ? 100 : limit;
            const attrFilter = [];
            if (readyProduct) {
                attrFilter.push({
                    "readyProduct": Boolean(readyProduct)
                });
            }
            if (madeToOrder) {
                attrFilter.push({
                    "madeToOrder": Boolean(madeToOrder)
                });
            }
            if (whiteLabeling) {
                attrFilter.push({
                    "whiteLabeling": Boolean(whiteLabeling)
                });
            }
            if (category) {
                attrFilter.push({
                    "categoryId": category
                });
            }
            attrFilter.push({ zohoBooksProduct: { $eq: false } });
            attrFilter.push({ isVisible: { $eq: true } });
            const query = {
                where: {
                    $or: [
                        { productName: { $regex: search, $options: 'i' } },
                        { description: { $regex: search, $options: 'i' } },
                        { seo: { $regex: search, $options: 'i' } }
                    ],
                    $and: [
                        { price: { $gte: fPriceMin } },
                        { price: { $lte: fPriceMax } },
                        ...attrFilter
                    ],
                },
                order: {
                    price: order,
                },
                skip: (page - 1) * limit,
                take: limit,
            };
            return typeorm_1.getMongoRepository(product_entity_1.Product).findAndCount(query);
        });
    }
    reviewProduct(data, req) {
        data.userId = req.user.id;
        return this.internalProductService.productRating(data);
    }
    getRatingProduct(zohoId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.internalProductService.getProductRating(zohoId);
        });
    }
    getReviewProduct(id, req) {
        return this.internalProductService.getUserReview(id, req.user.id);
    }
    getProductBySku(sku) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.internalProductService.getProductBySku(sku);
        });
    }
    pimAllProducts() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let pimAllProducts = yield this.internalProductService.pimAllProducts();
            return pimAllProducts;
        });
    }
    productByCategory(page = 1, limit = 10, categoryId) {
        limit = limit > 100 ? 100 : limit;
        return this.internalProductService.findByCategory({
            page,
            limit,
            route: `/products/category/${categoryId}`,
        }, categoryId);
    }
};
tslib_1.__decorate([
    common_1.Get('invoice'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__param(1, common_1.Query('search', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(2, common_1.Query('status', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(3, common_1.Query('limit', new common_1.DefaultValuePipe(500), common_1.ParseIntPipe)),
    tslib_1.__param(4, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "findAllInvoice", null);
tslib_1.__decorate([
    common_1.Get('invoice/zohoAll'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "zohoAllInvoice", null);
tslib_1.__decorate([
    common_1.Get('invoice/zohoOne/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "zohoOneInvoice", null);
tslib_1.__decorate([
    common_1.Get('invoice/getAttachment/:invoiceId'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=Attachment.pdf'),
    tslib_1.__param(0, common_1.Param('invoiceId')), tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "getAttachmentInvoice", null);
tslib_1.__decorate([
    common_1.Get('invoice/Summary/:invoiceId'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=Summary.pdf'),
    tslib_1.__param(0, common_1.Param('invoiceId')), tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "SummaryInvoice", null);
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Get('bills'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__param(1, common_1.Query('search', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(2, common_1.Query('status', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(3, common_1.Query('limit', new common_1.DefaultValuePipe(500), common_1.ParseIntPipe)),
    tslib_1.__param(4, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "findAllBill", null);
tslib_1.__decorate([
    common_1.Get('bills/zohoAll'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "zohoAll", null);
tslib_1.__decorate([
    common_1.Get('bills/zohoOne/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "zohoOneBill", null);
tslib_1.__decorate([
    common_1.Get('bills/getAttachment/:billId'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=Attachment.pdf'),
    tslib_1.__param(0, common_1.Param('billId')), tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "getAttachmentBill", null);
tslib_1.__decorate([
    common_1.Get('bills/Summary/:billId'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=Summary.pdf'),
    tslib_1.__param(0, common_1.Param('billId')), tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "SummaryBill", null);
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Get('po'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__param(1, common_1.Query('search', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(2, common_1.Query('status', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(3, common_1.Query('limit', new common_1.DefaultValuePipe(500), common_1.ParseIntPipe)),
    tslib_1.__param(4, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "findAllPo", null);
tslib_1.__decorate([
    common_1.Get('po/bySalesOrderNumber'),
    tslib_1.__param(0, common_1.Query('id', new common_1.DefaultValuePipe(''))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "bySalesOrderNumber", null);
tslib_1.__decorate([
    common_1.Get('po/poItemDetails'),
    tslib_1.__param(0, common_1.Query('id', new common_1.DefaultValuePipe(''))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "poItemDetails", null);
tslib_1.__decorate([
    common_1.Get('po/zohoAll'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "zohoAllPo", null);
tslib_1.__decorate([
    common_1.Get('po/zohoOne/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "zohoOnePo", null);
tslib_1.__decorate([
    common_1.Get('po/getAttachment/:purchaseOrderId'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=Attachment.pdf'),
    tslib_1.__param(0, common_1.Param('purchaseOrderId')), tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "getAttachmentPo", null);
tslib_1.__decorate([
    common_1.Get('po/Summary/:purchaseOrderId'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=OrderSummary.pdf'),
    tslib_1.__param(0, common_1.Param('purchaseOrderId')), tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "POrderSummary", null);
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Get('so'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__param(1, common_1.Query('search', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(2, common_1.Query('status', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__param(3, common_1.Query('limit', new common_1.DefaultValuePipe(100), common_1.ParseIntPipe)),
    tslib_1.__param(4, common_1.Query('byOrganization', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__param(5, common_1.Query('byCompany', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__param(6, common_1.Query('byEntity', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__param(7, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, Number, String, String, String, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "findAllSo", null);
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Get('so/:id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "OneSo", null);
tslib_1.__decorate([
    common_1.Get('so/zohoAll'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "zohoAllSo", null);
tslib_1.__decorate([
    common_1.Get('so/getAttachment/:salesOrderId'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=Attachment.pdf'),
    tslib_1.__param(0, common_1.Param('salesOrderId')), tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "getAttachmentSO", null);
tslib_1.__decorate([
    common_1.Get('so/Summary/:salesOrderId'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=OrderSummary.pdf'),
    tslib_1.__param(0, common_1.Param('salesOrderId')), tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "SOrderSummary", null);
tslib_1.__decorate([
    common_1.Get('so/Packages/:packageIds'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=Packages.pdf'),
    tslib_1.__param(0, common_1.Param('packageIds')), tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "salesOrderPackages", null);
tslib_1.__decorate([
    common_1.Get('products'),
    tslib_1.__param(0, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__param(1, common_1.Query('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    tslib_1.__param(2, common_1.Query('search', new common_1.DefaultValuePipe(''))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "allProducts", null);
tslib_1.__decorate([
    common_1.Get('products/filteredAll'),
    tslib_1.__param(0, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__param(1, common_1.Query('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    tslib_1.__param(2, common_1.Query('category', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(3, common_1.Query('search', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(4, common_1.Query('f-price-min', new common_1.DefaultValuePipe(0), common_1.ParseIntPipe)),
    tslib_1.__param(5, common_1.Query('f-price-max', new common_1.DefaultValuePipe(1000000), common_1.ParseIntPipe)),
    tslib_1.__param(6, common_1.Query('f-type', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(7, common_1.Query('f-attr', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(8, common_1.Query('orderPrice', new common_1.DefaultValuePipe(1))),
    tslib_1.__param(9, common_1.Query('zohoBooksProduct', new common_1.DefaultValuePipe(false))),
    tslib_1.__param(10, common_1.Query('readyProduct')),
    tslib_1.__param(11, common_1.Query('madeToOrder')),
    tslib_1.__param(12, common_1.Query('whiteLabeling')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number, String, String, Number, Number, String, String, Object, Boolean, Boolean, Boolean, Boolean]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "allProductsFlitered", null);
tslib_1.__decorate([
    common_1.Post('products/review'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], zohoDataController.prototype, "reviewProduct", null);
tslib_1.__decorate([
    common_1.Get('products/rating/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "getRatingProduct", null);
tslib_1.__decorate([
    common_1.Get('products/review/:id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], zohoDataController.prototype, "getReviewProduct", null);
tslib_1.__decorate([
    common_1.Get('products/BySku/:sku'),
    tslib_1.__param(0, common_1.Param('sku')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "getProductBySku", null);
tslib_1.__decorate([
    common_1.Get('products/Pimcore-All-Products'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "pimAllProducts", null);
tslib_1.__decorate([
    common_1.Get('products/ByCategory/:categoryId'),
    tslib_1.__param(0, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__param(1, common_1.Query('limit', new common_1.DefaultValuePipe(10), common_1.ParseIntPipe)),
    tslib_1.__param(2, common_1.Param('categoryId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoDataController.prototype, "productByCategory", null);
zohoDataController = tslib_1.__decorate([
    common_1.Controller('internal/zohoData'),
    tslib_1.__metadata("design:paramtypes", [prodoRoles_service_1.prodoRolesService,
        zohoEmployee_service_1.zohoEmployeeService,
        userRoles_service_1.userRolesService,
        salesOrder_service_1.internalSalesOrderService,
        bill_service_1.internalBillService,
        invoice_service_1.internalInvoiceService,
        purchaseOrder_service_1.internalPurchaseOrderService,
        product_service_1.internalProductService,
        batchItem_service_1.batchItemService])
], zohoDataController);
exports.zohoDataController = zohoDataController;
//# sourceMappingURL=data.controller.js.map