"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const user_entity_1 = require("./../users/user.entity");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
const common_2 = require("@nestjs/common");
const roles_constants_1 = require("./../users/roles.constants");
const typeorm_2 = require("@nestjs/typeorm");
var request = require('request');
const fs = require('fs');
const http = require("https");
const zohoSalesOrder_service_1 = require("./zohoSalesOrder.service");
let zohoSalesOrderController = class zohoSalesOrderController {
    constructor(userRepository, zohoSalesOrderService) {
        this.userRepository = userRepository;
        this.zohoSalesOrderService = zohoSalesOrderService;
    }
    findAll(req, search = "", status = "NA", all = "false", limit = 500, byOrganization = "true", byCompany = "NA", byEntity = "NA", page = 1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            limit = limit > 500 ? 500 : limit;
            let start = (page - 1) * limit;
            let end = page * limit;
            let user = yield this.userRepository.findOne(req.user.id);
            if (!user) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "User Not Found",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            const attrFilter = [];
            if (status != "NA") {
                attrFilter.push({
                    "status": status
                });
            }
            if (byOrganization != "NA") {
                if (byOrganization == "true") {
                    attrFilter.push({
                        "organization_id": user.organization_id
                    });
                }
            }
            if (byCompany != "NA") {
                if (byCompany == "true") {
                    attrFilter.push({
                        "companyId": user.companyId
                    });
                }
            }
            if (byEntity != "NA") {
                if (byEntity == "true") {
                    attrFilter.push({
                        "entityId": user.entityId
                    });
                }
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
                if (user.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
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
                    if (all == "true") {
                        result = yield this.zohoSalesOrderService.findAll(query);
                    }
                    else {
                        result = yield this.zohoSalesOrderService.findAll(query1);
                    }
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Orders", count: result.count, limit: limit, page: page, data: result.data };
                }
                else {
                    result = yield this.zohoSalesOrderService.findAll(query);
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
    orderHistory(req, search = "", status = "NA", all = "false", limit = 100, byOrganization = "true", byCompany = "NA", byEntity = "NA", page = 1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            limit = limit > 200 ? 200 : limit;
            let start = (page - 1) * limit;
            let end = page * limit;
            let user = yield this.userRepository.findOne(req.user.id);
            if (!user) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "User Not Found",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            const attrFilter = [];
            if (status != "NA") {
                attrFilter.push({
                    "status": status
                });
            }
            if (byOrganization != "NA") {
                if (byOrganization == "true") {
                    attrFilter.push({
                        "organization_id": user.organization_id
                    });
                }
            }
            if (byCompany != "NA") {
                if (byCompany == "true") {
                    attrFilter.push({
                        "companyId": user.companyId
                    });
                }
            }
            if (byEntity != "NA") {
                if (byEntity == "true") {
                    attrFilter.push({
                        "entityId": user.entityId
                    });
                }
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
                if (user.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
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
                    if (all == "true") {
                        result = yield this.zohoSalesOrderService.findAll(query);
                    }
                    else {
                        result = yield this.zohoSalesOrderService.findAll(query1);
                    }
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Orders", count: result.count, limit: limit, page: page, data: result.data };
                }
                else {
                    result = yield this.zohoSalesOrderService.findAll(query);
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
    notYetShipped(req, search = "", status = "NA", all = "false", limit = 100, byOrganization = "true", byCompany = "NA", byEntity = "NA", page = 1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            limit = limit > 200 ? 200 : limit;
            let start = (page - 1) * limit;
            let end = page * limit;
            let user = yield this.userRepository.findOne(req.user.id);
            if (!user) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "User Not Found",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            const attrFilter = [];
            if (status != "NA") {
                attrFilter.push({
                    "status": status
                });
            }
            if (byOrganization != "NA") {
                if (byOrganization == "true") {
                    attrFilter.push({
                        "organization_id": user.organization_id
                    });
                }
            }
            if (byCompany != "NA") {
                if (byCompany == "true") {
                    attrFilter.push({
                        "companyId": user.companyId
                    });
                }
            }
            if (byEntity != "NA") {
                if (byEntity == "true") {
                    attrFilter.push({
                        "entityId": user.entityId
                    });
                }
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
                if (user.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
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
                    if (all == "true") {
                        result = yield this.zohoSalesOrderService.findAll(query);
                    }
                    else {
                        result = yield this.zohoSalesOrderService.findAll(query1);
                    }
                    result = yield this.zohoSalesOrderService.notYetShipped(result);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Not Yet Shipped products", count: result.count, limit: limit, page: page, data: result.data };
                }
                else {
                    result = yield this.zohoSalesOrderService.findAll(query);
                    result = yield this.zohoSalesOrderService.notYetShipped(result);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Not Yet Shipped products", count: result.count, limit: limit, page: page, data: result.data };
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
            let user = yield this.userRepository.findOne(req.user.id);
            if (!user) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "User Not Found",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            if (user.roles) {
                if (user.roles.includes(roles_constants_1.UserRole.PRODO_ADMIN)) {
                    let data = yield this.zohoSalesOrderService.findOne(id);
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
                    let data = yield this.zohoSalesOrderService.findOne(id);
                    if (data) {
                        if (user.orgIds.includes(data.organization_id)) {
                            return { statusCode: 200, message: "Order Details ", data: data };
                        }
                        else if (user.companyIds.includes(data.companyId)) {
                            return { statusCode: 200, message: "Order Details", data: data };
                        }
                        else if (user.entityIds.includes(data.entityId)) {
                            return { statusCode: 200, message: "Order Details", data: data };
                        }
                        else {
                            throw new common_2.HttpException({
                                status: common_2.HttpStatus.BAD_REQUEST,
                                error: 'You are not authorized to check this order Details',
                                message: "You are not authorized to check this order Details",
                            }, common_2.HttpStatus.BAD_REQUEST);
                        }
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
    all_data(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let d_data = {
                orders: {
                    total: 0,
                    completed: 0,
                    inProgress: 0,
                    submitted: 0,
                    cancelled: 0
                },
                rfq: {
                    approved: 0,
                    rejected: 0,
                    inProgress: 0,
                    total_submitted: 0,
                },
                payments: {
                    total: 0,
                    paid: 0,
                    due: 0,
                },
                pieChart: [],
                barChart: []
            };
            let orders = yield this.findAll(req);
            orders = orders.data;
            if (orders.length > 0) {
                return yield this.zohoSalesOrderService.calDashboardData(d_data, orders);
            }
            else {
                return d_data;
            }
        });
    }
    updateSalesOrder(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (id) {
                let result = yield this.zohoSalesOrderService.saveFromZohoId(id);
                return { statusCode: 200, message: "successfully saved data for this salesOrder", data: result };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'SalesOrderID not found',
                    message: "id not found in Request",
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    updSalesOrder(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let so = yield this.zohoSalesOrderService.ByReferenceNumber(id);
            if (so) {
                let result = yield this.zohoSalesOrderService.saveFromZohoId(so.salesorderId);
                return { statusCode: 200, message: "successfully saved data for this salesOrder", data: result };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'SalesOrderID not found',
                    message: "id not found in Request",
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    updateSalesOrders(start) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let result = [];
            let page = 1;
            if (start > 200) {
                if (start % 200) {
                    page = ((start - start % 200) / 200) + 1;
                    start = start % 200;
                }
                else {
                    page = start / 200;
                }
            }
            for (page; page > 0; page++) {
                let data = yield this.zohoSalesOrderService.zohoAllSo(page);
                if (data.count) {
                    let Orders = data.data;
                    for (let i = start; i < Orders.length; i++) {
                        let order = Orders[i];
                        let out = yield this.zohoSalesOrderService.saveFromZohoId(order.salesorder_id, page);
                        console.log("syncing order-", order.salesorder_id, "   ", "no-", i, "page-", page);
                        if (out) {
                            result.push({ salesorder_id: order.salesorder_id, response: out, statusCode: 200, message: "success", number: i, page: page });
                        }
                        else {
                            result.push({ salesorder_id: order.salesorder_id, error: "Error", statusCode: 500, message: "Data invalid", number: i, page: page });
                        }
                    }
                    start = 0;
                }
                else {
                    break;
                }
            }
            return result;
        });
    }
    zohoAllSo() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let page = 1;
            let result = [];
            for (let page = 1; page > 0; page++) {
                let data = yield this.zohoSalesOrderService.zohoAllSo(page);
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
    zohoOneSo(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.zohoSalesOrderService.InventorySalesOrderByID(id);
            return { statusCode: 200, message: "Order Details from zoho mapped", data: data };
        });
    }
    getAttachment(salesOrderId, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var attachment = yield this.zohoSalesOrderService.getAttachment(salesOrderId);
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
    OrderSummary(salesOrderId, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var OrderSummary = yield this.zohoSalesOrderService.OrderSummary(salesOrderId);
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
            var salesOrderPackages = yield this.zohoSalesOrderService.salesOrderPackages(packageIds);
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
    salesOrderBill(billId, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var salesOrderBill = yield this.zohoSalesOrderService.salesOrderBill(billId);
            if (salesOrderBill) {
                salesOrderBill.pipe(res);
                return res;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'salesOrderBill not found',
                    message: "salesOrderBill not found",
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    salesOrderInvoice(invoiceId, res) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            var salesOrderInvoice = yield this.zohoSalesOrderService.salesOrderInvoice(invoiceId);
            if (salesOrderInvoice) {
                salesOrderInvoice.pipe(res);
                return res;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'salesOrderInvoice not found',
                    message: "salesOrderInvoice not found",
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    invoiceAllDetails(orderIds, purchaseOrder) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (orderIds.length > 0) {
                if (orderIds.length > 10) {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.NOT_IMPLEMENTED,
                        error: 'exceeds maximum number of orders No-' + String(orderIds.length),
                        message: "please provide maximum number of 10 orders",
                    }, common_2.HttpStatus.NOT_IMPLEMENTED);
                }
                let result = [];
                const promises = orderIds.map(a => this.zohoSalesOrderService.invoiceAllDetails(a, purchaseOrder));
                const result1 = yield Promise.all(promises);
                for (let i = 0; i < result1.length; i++) {
                    result = result.concat(result1[i]);
                }
                return { statusCode: 200, message: "All sales order invoice details ", count: result.length, data: result };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'SalesOrderID not found',
                    message: "id not found in Request please provide atleast one",
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
};
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__param(1, common_1.Query('search', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(2, common_1.Query('status', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__param(3, common_1.Query('all', new common_1.DefaultValuePipe('false'))),
    tslib_1.__param(4, common_1.Query('limit', new common_1.DefaultValuePipe(500), common_1.ParseIntPipe)),
    tslib_1.__param(5, common_1.Query('byOrganization', new common_1.DefaultValuePipe('true'))),
    tslib_1.__param(6, common_1.Query('byCompany', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__param(7, common_1.Query('byEntity', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__param(8, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, String, Number, String, String, String, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('orderHistory'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__param(1, common_1.Query('search', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(2, common_1.Query('status', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__param(3, common_1.Query('all', new common_1.DefaultValuePipe('false'))),
    tslib_1.__param(4, common_1.Query('limit', new common_1.DefaultValuePipe(100), common_1.ParseIntPipe)),
    tslib_1.__param(5, common_1.Query('byOrganization', new common_1.DefaultValuePipe('true'))),
    tslib_1.__param(6, common_1.Query('byCompany', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__param(7, common_1.Query('byEntity', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__param(8, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, String, Number, String, String, String, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "orderHistory", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('notYetShipped'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__param(1, common_1.Query('search', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(2, common_1.Query('status', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__param(3, common_1.Query('all', new common_1.DefaultValuePipe('false'))),
    tslib_1.__param(4, common_1.Query('limit', new common_1.DefaultValuePipe(100), common_1.ParseIntPipe)),
    tslib_1.__param(5, common_1.Query('byOrganization', new common_1.DefaultValuePipe('true'))),
    tslib_1.__param(6, common_1.Query('byCompany', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__param(7, common_1.Query('byEntity', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__param(8, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, String, Number, String, String, String, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "notYetShipped", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('bySalesOrderId/:id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "OneSo", null);
tslib_1.__decorate([
    common_1.Get('salesDashboardData'),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "all_data", null);
tslib_1.__decorate([
    common_1.Post('syncOneOrder'),
    tslib_1.__param(0, common_1.Body('salesorder_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "updateSalesOrder", null);
tslib_1.__decorate([
    common_1.Post('syncOneOrderByNumber'),
    tslib_1.__param(0, common_1.Body('salesorder_number')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "updSalesOrder", null);
tslib_1.__decorate([
    common_1.Post('syncAllOrder/:start'),
    tslib_1.__param(0, common_1.Param('start')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "updateSalesOrders", null);
tslib_1.__decorate([
    common_1.Get('zohoAllSo'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "zohoAllSo", null);
tslib_1.__decorate([
    common_1.Get('zohoOneSo/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "zohoOneSo", null);
tslib_1.__decorate([
    common_1.Get('getAttachment/:salesOrderId'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=Attachment.pdf'),
    tslib_1.__param(0, common_1.Param('salesOrderId')), tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "getAttachment", null);
tslib_1.__decorate([
    common_1.Get('OrderSummary/:salesOrderId'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=OrderSummary.pdf'),
    tslib_1.__param(0, common_1.Param('salesOrderId')), tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "OrderSummary", null);
tslib_1.__decorate([
    common_1.Get('salesOrderPackages/:packageIds'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=Packages.pdf'),
    tslib_1.__param(0, common_1.Param('packageIds')), tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "salesOrderPackages", null);
tslib_1.__decorate([
    common_1.Get('salesOrderBill/:billId'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=Bill.pdf'),
    tslib_1.__param(0, common_1.Param('billId')), tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "salesOrderBill", null);
tslib_1.__decorate([
    common_1.Get('salesOrderInvoice/:invoiceId'),
    common_1.Header('Content-Type', 'application/pdf'),
    common_1.Header('Content-Disposition', 'attachment; filename=Invoice.pdf'),
    tslib_1.__param(0, common_1.Param('invoiceId')), tslib_1.__param(1, common_1.Response()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "salesOrderInvoice", null);
tslib_1.__decorate([
    common_1.Post('invoiceAllDetails'),
    tslib_1.__param(0, common_1.Body('orderIds')),
    tslib_1.__param(1, common_1.Query('purchaseOrder', new common_1.DefaultValuePipe(false))),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Boolean]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "invoiceAllDetails", null);
zohoSalesOrderController = tslib_1.__decorate([
    common_1.Controller('zohoSalesOrder'),
    tslib_1.__param(0, typeorm_2.InjectRepository(user_entity_1.User)),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.Repository,
        zohoSalesOrder_service_1.zohoSalesOrderService])
], zohoSalesOrderController);
exports.zohoSalesOrderController = zohoSalesOrderController;
//# sourceMappingURL=zohoSalesOrder.controller.js.map