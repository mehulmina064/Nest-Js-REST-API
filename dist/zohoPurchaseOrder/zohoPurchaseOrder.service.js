"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const zohoPurchaseOrder_entity_1 = require("./zohoPurchaseOrder.entity");
const user_service_1 = require("./../users/user.service");
const token_entity_1 = require("./../sms/token.entity");
const product_service_1 = require("./../product/product.service");
const common_2 = require("@nestjs/common");
const entities_service_1 = require("./../entities/entities.service");
const organization_service_1 = require("./../organization/organization.service");
const company_service_1 = require("./../company/company.service");
const node_fetch_1 = require("node-fetch");
let zohoPurchaseOrderService = class zohoPurchaseOrderService {
    constructor(zohoPurchaseOrderRepository, zohoTokenRepository, userService, productService, entitiesService, organizationService, companyService) {
        this.zohoPurchaseOrderRepository = zohoPurchaseOrderRepository;
        this.zohoTokenRepository = zohoTokenRepository;
        this.userService = userService;
        this.productService = productService;
        this.entitiesService = entitiesService;
        this.organizationService = organizationService;
        this.companyService = companyService;
    }
    findAll(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (query) {
                console.log(query);
                let data = yield this.zohoPurchaseOrderRepository.findAndCount(query);
                return { data: data[0], count: data[1] };
            }
            else {
                let data = yield this.zohoPurchaseOrderRepository.findAndCount();
                return { data: data[0], count: data[1] };
            }
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
    InventoryPorByID(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let salesOrder;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/purchaseorders/${id}?organization_id=60015092519`, {
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
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/purchaseorders/${id}?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
            }
            salesOrder = kill.purchaseorder;
            if (salesOrder == undefined) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.UNAUTHORIZED,
                    error: 'Token Expire at inventory purchase order ',
                    response: kill,
                    message: "Zoho token issue contact admin Or check your id again ",
                }, common_2.HttpStatus.UNAUTHORIZED);
            }
            return salesOrder;
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
    zohoAllPo(page) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!page) {
                page = 1;
            }
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/purchaseorders?organization_id=60015092519&page=${page}`, {
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
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/purchaseorders?organization_id=60015092519&page=${page}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                    }
                })
                    .then(res => res.json())
                    .then(data => kill = data);
            }
            let purchaseorders = kill.purchaseorders;
            if (purchaseorders == undefined) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'No data found in zoho',
                    message: "Not Found Data",
                }, common_2.HttpStatus.NOT_FOUND);
            }
            return { count: purchaseorders.length, data: purchaseorders };
        });
    }
    saveZohoPurchaseOrder(salesOrder) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let find = yield this.zohoPurchaseOrderRepository.findOne({ where: { purchaseorder_id: salesOrder.purchaseorder_id } });
            if (find) {
                console.log("updating old po");
                salesOrder.createdAt = find.createdAt ? find.createdAt : (salesOrder.createdAt ? salesOrder.createdAt : new Date());
                salesOrder.id = find.id;
                return yield this.zohoPurchaseOrderRepository.save(salesOrder);
            }
            else {
                console.log("saving new po");
                return yield this.zohoPurchaseOrderRepository.save(salesOrder);
            }
        });
    }
    saveFromZohoId(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let so = yield this.InventoryPorByID(id);
            return yield this.saveZohoPurchaseOrder(so);
        });
    }
    getAttachment(orderId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let token = yield this.zohoBookToken();
            let kill;
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/purchaseorders/${orderId}/attachment?organization_id=60015092519`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `${token}`,
                    'Accept': '*/*'
                }
            })
                .then(data => kill = data.body);
            if (kill.message == "You are not authorized to perform this operation" || kill.message == "This user is not associated with the CompanyID/CompanyName:60015313630." || kill.code == 57) {
                token = yield this.zohoBookToken();
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/purchaseorders/${orderId}/attachment?organization_id=60015092519`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `${token}`,
                        'Accept': '*/*'
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
            let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/purchaseorders/${id}?organization_id=60015092519`, {
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
                let res = yield node_fetch_1.default(`https://inventory.zoho.in/api/v1/purchaseorders/${id}?organization_id=60015092519`, {
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
};
zohoPurchaseOrderService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(zohoPurchaseOrder_entity_1.zohoPurchaseOrder)),
    tslib_1.__param(1, typeorm_1.InjectRepository(token_entity_1.zohoToken)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        user_service_1.UserService,
        product_service_1.ProductService,
        entities_service_1.entitiesService,
        organization_service_1.OrganizationService,
        company_service_1.companyService])
], zohoPurchaseOrderService);
exports.zohoPurchaseOrderService = zohoPurchaseOrderService;
//# sourceMappingURL=zohoPurchaseOrder.service.js.map