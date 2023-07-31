"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const user_entity_1 = require("./../users/user.entity");
const common_1 = require("@nestjs/common");
const sms_service_1 = require("./sms.service");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_service_1 = require("./../users/user.service");
const token_entity_1 = require("./token.entity");
const zohoSalesOrder_service_1 = require("./zohoSalesOrder.service");
const typeorm_3 = require("typeorm");
const node_fetch_1 = require("node-fetch");
var request = require('request');
const fs = require('fs');
const http = require("https");
const console = require("console");
const zohoSalesOrder_entity_1 = require("./zohoSalesOrder.entity");
const zohoSalesOrderByUser_entity_1 = require("./zohoSalesOrderByUser.entity");
const product_service_1 = require("./../product/product.service");
let zohoSalesOrderController = class zohoSalesOrderController {
    constructor(userRepository, zohoTokenRepository, zohoSalesOrderRepository, zohoSalesOrderByUserRepository, SmsService, userService, productService, zohoSalesOrderService) {
        this.userRepository = userRepository;
        this.zohoTokenRepository = zohoTokenRepository;
        this.zohoSalesOrderRepository = zohoSalesOrderRepository;
        this.zohoSalesOrderByUserRepository = zohoSalesOrderByUserRepository;
        this.SmsService = SmsService;
        this.userService = userService;
        this.productService = productService;
        this.zohoSalesOrderService = zohoSalesOrderService;
    }
    AddressBySo() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let allSo = yield this.zohoSalesOrderService.findall();
            let out = [];
            for (let so of allSo) {
                if (!so.orderDetails.details.shipping_address.zip) {
                    out.push(so.orderDetails.salesorder_number);
                }
            }
            return out;
        });
    }
    updateSalesOrder(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let id = body.salesorder ? (body.salesorder.salesorder_id ? body.salesorder.salesorder_id : "false") : "false";
            if (id) {
                return yield this.update_order(id);
            }
            else {
                return "false";
            }
        });
    }
    updatePocDashboard(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let id = body.salesorder ? (body.salesorder.salesorder_id ? body.salesorder.salesorder_id : "false") : "false";
            if (id) {
                if (body.type == "new") {
                    let mails = [];
                    let so = yield this.InventorySalesOrderByID(id);
                    if (body.poc1 ? body.poc1 : "") {
                        mails.push(yield this.sync_data(body.poc1, so));
                    }
                    if (body.poc2 ? body.poc2 : "") {
                        mails.push(yield this.sync_data(body.poc2, so));
                    }
                    if (body.poc3 ? body.poc3 : "") {
                        mails.push(yield this.sync_data(body.poc3, so));
                    }
                    if (body.poc4 ? body.poc4 : "") {
                        mails.push(yield this.sync_data(body.poc4, so));
                    }
                    return mails;
                }
                else {
                    let mails = [];
                    console.log("else");
                    let so = yield this.InventorySalesOrderByID(id);
                    if (body.poc1 ? body.poc1 : "") {
                        mails.push(yield this.sync_data(body.poc1, so));
                    }
                    if (body.poc2 ? body.poc2 : "") {
                        mails.push(yield this.sync_data(body.poc2, so));
                    }
                    if (body.poc3 ? body.poc3 : "") {
                        mails.push(yield this.sync_data(body.poc3, so));
                    }
                    if (body.poc4 ? body.poc4 : "") {
                        mails.push(yield this.sync_data(body.poc4, so));
                    }
                    return mails;
                }
            }
            else {
                return "false";
            }
        });
    }
    saveOrder(id, sales) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.newTokenForReorder();
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
            let orders = [];
            console.log("kill", kill);
            let salesOrder = kill.salesorders;
            if (salesOrder == undefined) {
                console.log("No Data saved in prodo");
                return ["no data saved in prodo"];
            }
            if (!(salesOrder.length > 0)) {
                return "NO_DATA saved in prodo";
            }
            for (let i = 0; i < salesOrder.length; i++) {
                if (salesOrder[i].salesorder_id == id) {
                    salesOrder[i].details = sales;
                    let data = {
                        orderDetails: salesOrder[i],
                        zohoId: id
                    };
                    console.log("data", data);
                    let k = yield this.zohoSalesOrderRepository.findOne({ zohoId: data.zohoId });
                    if (k) {
                        console.log("find data");
                        let id = data.zohoId;
                        yield this.zohoSalesOrderRepository.update(k.id, data);
                        data.status = "update";
                        yield this.updatePocOnSalesOrder(id, data.orderDetails);
                        orders.push(data);
                    }
                    else {
                        console.log("new data");
                        let m = yield this.zohoSalesOrderRepository.save(data);
                        let id1 = data.zohoId;
                        orders.push(m);
                        yield this.updatePocOnSalesOrder(id1, data.orderDetails);
                    }
                    return orders;
                }
            }
        });
    }
    updatePocOnSalesOrder(id, salesOrder) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("id in poc");
            let res = [];
            let cf_1_email = salesOrder.cf_client_poc_1_email ? (salesOrder.cf_client_poc_1_email == "" ? "NA" : salesOrder.cf_client_poc_1_email) : "NA";
            let cf_2_email = salesOrder.cf_client_poc_2_email ? (salesOrder.cf_client_poc_2_email == "" ? "NA" : salesOrder.cf_client_poc_2_email) : "NA";
            let cf_3_email = salesOrder.cf_client_poc_3_email ? (salesOrder.cf_client_poc_3_email == "" ? "NA" : salesOrder.cf_client_poc_3_email) : "NA";
            let cf_4_email = salesOrder.cf_client_poc_4_email ? (salesOrder.cf_client_poc_4_email == "" ? "NA" : salesOrder.cf_client_poc_4_email) : "NA";
            if (cf_1_email != "NA") {
                let userdata = yield this.zohoSalesOrderByUserRepository.findOne({ email: cf_1_email });
                if (userdata) {
                    console.log("poc1");
                    if (userdata.orderIds.includes(id)) {
                        userdata.orderIds = [...new Set(userdata.orderIds)];
                        res.push(yield this.zohoSalesOrderByUserRepository.update(userdata.id, userdata));
                    }
                    else {
                        userdata.orderIds.push(id);
                        yield this.sync_data(cf_1_email, salesOrder);
                    }
                }
                else {
                    let kill = {
                        email: cf_1_email,
                        orderIds: [id]
                    };
                    res.push(yield this.zohoSalesOrderByUserRepository.save(kill));
                    yield this.sync_data(cf_1_email, salesOrder);
                }
            }
            if (cf_2_email != "NA") {
                let userdata = yield this.zohoSalesOrderByUserRepository.findOne({ email: cf_2_email });
                if (userdata) {
                    console.log("poc2");
                    if (userdata.orderIds.includes(id)) {
                        userdata.orderIds = [...new Set(userdata.orderIds)];
                        res.push(yield this.zohoSalesOrderByUserRepository.update(userdata.id, userdata));
                    }
                    else {
                        userdata.orderIds.push(id);
                        yield this.sync_data(cf_2_email, salesOrder);
                    }
                }
                else {
                    let kill = {
                        email: cf_2_email,
                        orderIds: [id]
                    };
                    res.push(yield this.zohoSalesOrderByUserRepository.save(kill));
                    yield this.sync_data(cf_2_email, salesOrder);
                }
            }
            if (cf_3_email != "NA") {
                let userdata = yield this.zohoSalesOrderByUserRepository.findOne({ email: cf_3_email });
                if (userdata) {
                    console.log("poc3");
                    if (userdata.orderIds.includes(id)) {
                        userdata.orderIds = [...new Set(userdata.orderIds)];
                        res.push(yield this.zohoSalesOrderByUserRepository.update(userdata.id, userdata));
                    }
                    else {
                        userdata.orderIds.push(id);
                        yield this.sync_data(cf_3_email, salesOrder);
                    }
                }
                else {
                    let kill = {
                        email: cf_3_email,
                        orderIds: [id]
                    };
                    res.push(yield this.zohoSalesOrderByUserRepository.save(kill));
                    yield this.sync_data(cf_3_email, salesOrder);
                }
            }
            if (cf_4_email != "NA") {
                let userdata = yield this.zohoSalesOrderByUserRepository.findOne({ email: cf_4_email });
                if (userdata) {
                    console.log("poc4", userdata.orderIds.includes(id), userdata.orderIds, id);
                    userdata.orderIds = yield userdata.orderIds.toString().split(",");
                    console.log("poc4-2", userdata.orderIds.includes(String(id)), userdata.orderIds);
                    if (userdata.orderIds.includes(String(id))) {
                    }
                    else {
                        userdata.orderIds.push(id);
                        console.log("in else");
                    }
                }
                else {
                    let kill = {
                        email: cf_4_email,
                        orderIds: [id]
                    };
                    res.push(yield this.zohoSalesOrderByUserRepository.save(kill));
                    yield this.sync_data(cf_4_email, salesOrder);
                }
            }
            return res;
        });
    }
    sync_data(email, salesOrder) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("in sync data email", email);
            let user = yield this.userService.findByEmail(email);
            if (user) {
                return yield this.sync_dashboard(user, salesOrder);
            }
            else
                return false;
        });
    }
    update_order(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let so = yield this.InventorySalesOrderByID(id);
            return yield this.saveOrder(id, so);
        });
    }
    sync_dashboard(user, salesOrder) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let req = {
                user: user
            };
            let k = yield this.userService.userdashboardData(req.user);
            if (k == "NA") {
                let orders = [salesOrder];
                let res = yield this.userService.calDashboardData(req.user, orders);
                console.log("res dashboard data", res);
                return res;
            }
            else {
                let orders = [salesOrder];
                let res = yield this.userService.calDashboardData(req.user, orders);
                console.log("res dashboard data", res);
                return res;
            }
        });
    }
    zohoInventorySalesOrder(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (req.user.roles.includes('PRODO_ADMIN')) {
                let p = yield this.zohoSalesOrderRepository.find();
                let orders = [];
                for (let i = 0; i < p.length; i++) {
                    let order = p[i];
                    let orderDetails = order.orderDetails;
                    orders.push(orderDetails);
                }
                return orders;
            }
            let user = yield this.userRepository.findOne(req.user.id);
            let userEmail = user.email;
            let salesOrder_list1 = yield this.zohoSalesOrderByUserRepository.find({ email: userEmail });
            if (salesOrder_list1[0]) {
                const attrFilter = [];
                let salesOrder_list = salesOrder_list1[0].orderIds;
                for (let j = 0; j < salesOrder_list.length; j++) {
                    attrFilter.push({ _id: salesOrder_list[j] });
                }
                const query = {
                    where: {
                        $or: [
                            ...attrFilter
                        ]
                    }
                };
                let ui = yield typeorm_3.getMongoRepository(zohoSalesOrder_entity_1.zohoSalesOrder).find(query);
                let orders = [];
                for (let i = 0; i < ui.length; i++) {
                    let order = ui[i];
                    let orderDetails = order.orderDetails;
                    orders.push(orderDetails);
                }
                return orders;
            }
            else {
                return [];
            }
        });
    }
    newTokenForReorder() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
            return token;
        });
    }
    zohoBookTokenFarji() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let zohoToken = yield this.zohoTokenRepository.findOne('62dfec85d3baa58e51c2fc65');
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
                token = yield this.newZohoBookTokenFarji();
                return token;
            }
            return token;
        });
    }
    newZohoBookTokenFarji() {
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
            let kill = yield this.zohoTokenRepository.save(zohoToken);
            return token;
        });
    }
    InventorySalesOrderByID(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookTokenFarji();
            let kill;
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
                token = yield this.zohoBookTokenFarji();
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/salesorders/${id}?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
                let salesOrder1 = kill.salesorder;
                if (salesOrder1 == undefined) {
                    console("No Data-in error", kill);
                    return [];
                }
                let lineItems = salesOrder1.line_items;
                let k1 = salesOrder1.packages;
                let packages1 = {};
                for (let ii = 0; ii < lineItems.length; ii++) {
                    lineItems[ii].package_id = [];
                }
                lineItems = yield this.itemStatus(lineItems, salesOrder1);
                if (k1.length > 0) {
                    for (let j = 0; j < k1.length; j++) {
                        let data = yield this.packageDetails(k1[j].package_id);
                        packages1[k1[j].package_id] = data;
                        for (let k = 0; k < lineItems.length; k++) {
                            let p_id = yield this.itemDetails(lineItems[k], data);
                            if (p_id == "NA") {
                            }
                            else {
                                lineItems[k].package_id.push(p_id);
                            }
                        }
                    }
                    salesOrder1.package_list = packages1;
                    console.log("items in  error");
                    lineItems = yield this.setItemPrice(lineItems, salesOrder1.date);
                    lineItems = yield this.calShipment(lineItems, packages);
                    salesOrder1.line_items = lineItems;
                    return salesOrder1;
                }
                else {
                    console.log("items in  error");
                    lineItems = yield this.setItemPrice(lineItems, salesOrder1.date);
                    lineItems = yield this.calShipment(lineItems, packages);
                    salesOrder1.line_items = lineItems;
                    salesOrder.package_list = packages;
                    return salesOrder;
                }
            }
            let salesOrder = kill.salesorder;
            if (salesOrder == undefined) {
                console.log("No Data-without", kill, id);
                return [];
            }
            let lineItems2 = salesOrder.line_items;
            let k = salesOrder.packages;
            let packages = {};
            for (let ii = 0; ii < lineItems2.length; ii++) {
                lineItems2[ii].package_id = [];
            }
            lineItems2 = yield this.itemStatus(lineItems2, salesOrder);
            if (k.length > 0) {
                for (let j = 0; j < k.length; j++) {
                    let data1 = yield this.packageDetails(k[j].package_id);
                    packages[k[j].package_id] = data1;
                    for (let k = 0; k < lineItems2.length; k++) {
                        let p_id = yield this.itemDetails(lineItems2[k], data1);
                        if (p_id == "NA") {
                        }
                        else {
                            lineItems2[k].package_id.push(p_id);
                        }
                    }
                }
                salesOrder.package_list = packages;
                lineItems2 = yield this.setItemPrice(lineItems2, salesOrder.date);
                lineItems2 = yield this.calShipment(lineItems2, packages);
                salesOrder.line_items = lineItems2;
                return salesOrder;
            }
            else {
                lineItems2 = yield this.setItemPrice(lineItems2, salesOrder.date);
                lineItems2 = yield this.calShipment(lineItems2, packages);
                salesOrder.line_items = lineItems2;
                salesOrder.package_list = packages;
                return salesOrder;
            }
        });
    }
    setItemPrice(lineItems, date) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
    calShipment(lineItems, packages) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
    packageDetails(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookTokenFarji();
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
                token = yield this.newZohoBookTokenFarji();
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/packages/${id}?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
                return kill.package;
            }
            return kill.package;
        });
    }
};
tslib_1.__decorate([
    common_1.Get('AddressBySo'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "AddressBySo", null);
tslib_1.__decorate([
    common_1.Post('sales-order-update'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "updateSalesOrder", null);
tslib_1.__decorate([
    common_1.Post('sync-dashboard'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "updatePocDashboard", null);
tslib_1.__decorate([
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], zohoSalesOrderController.prototype, "zohoInventorySalesOrder", null);
zohoSalesOrderController = tslib_1.__decorate([
    common_1.Controller('zohoSalesOrder'),
    tslib_1.__param(0, typeorm_2.InjectRepository(user_entity_1.User)),
    tslib_1.__param(1, typeorm_2.InjectRepository(token_entity_1.zohoToken)),
    tslib_1.__param(2, typeorm_2.InjectRepository(zohoSalesOrder_entity_1.zohoSalesOrder)),
    tslib_1.__param(3, typeorm_2.InjectRepository(zohoSalesOrderByUser_entity_1.zohoSalesOrderByUser)),
    tslib_1.__metadata("design:paramtypes", [typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        typeorm_1.Repository,
        sms_service_1.SmsService,
        user_service_1.UserService,
        product_service_1.ProductService,
        zohoSalesOrder_service_1.zohoSalesOrderService])
], zohoSalesOrderController);
exports.zohoSalesOrderController = zohoSalesOrderController;
//# sourceMappingURL=zohoSalesOrder.controller.js.map