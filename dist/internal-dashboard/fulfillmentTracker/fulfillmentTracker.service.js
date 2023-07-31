"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const fulfillmentTracker_entity_1 = require("./fulfillmentTracker.entity");
const token_entity_1 = require("../../sms/token.entity");
const common_2 = require("@nestjs/common");
const node_fetch_1 = require("node-fetch");
let fulfillmentTrackerService = class fulfillmentTrackerService {
    constructor(fulfillmentRepository, zohoTokenRepository) {
        this.fulfillmentRepository = fulfillmentRepository;
        this.zohoTokenRepository = zohoTokenRepository;
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let team = yield this.fulfillmentRepository.findOne(id);
            if (team) {
                return team;
            }
            else {
                return Promise.reject(new common_2.HttpException('FulfillmentTracker not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    save(role) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            role.status = fulfillmentTracker_entity_1.Status.NotStarted;
            role.completionDate = "";
            role.fields = [];
            return yield this.fulfillmentRepository.save(role);
        });
    }
    softRemove(id, userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let role = yield this.fulfillmentRepository.findOne(id);
            if (role) {
                let del = yield this.fulfillmentRepository.delete(id);
                if (del) {
                    return "Deleted successfully";
                }
                else {
                    return Promise.reject(new common_2.HttpException('FulfillmentTracker not Deleted', common_2.HttpStatus.INTERNAL_SERVER_ERROR));
                }
            }
            else {
                return Promise.reject(new common_2.HttpException('FulfillmentTracker not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    update(id, updateRole) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let role = yield this.fulfillmentRepository.findOne(id);
            if (role) {
                let data = yield this.fulfillmentRepository.update(id, updateRole);
                let saveRole = yield this.fulfillmentRepository.findOne(id);
                return saveRole;
            }
            else {
                return Promise.reject(new common_2.HttpException('FulfillmentTracker not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    findAll(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (query) {
                console.log(query);
                let data = yield this.fulfillmentRepository.findAndCount(query);
                return { data: data[0], count: data[1] };
            }
            else {
                let data = yield this.fulfillmentRepository.findAndCount();
                return { data: data[0], count: data[1] };
            }
        });
    }
    check(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let check = yield this.fulfillmentRepository.findOne(id).then((res1) => {
                return res1;
            }).catch((err) => {
                return false;
            });
            return check;
        });
    }
    addFields(id, userId, fields) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let PG = yield this.fulfillmentRepository.findOne(id);
            if (PG) {
                for (let i = 0; i < fields.length; i++) {
                    let perm = fields[i];
                    let obj = PG.fields.find(o => o.apiName === perm.apiName);
                    if (!obj) {
                        perm.createdAt = new Date();
                        perm.updatedAt = new Date();
                        PG.fields.push(perm);
                    }
                    else {
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.BAD_REQUEST,
                            error: 'This Field already in FulfillmentTracker' + perm.moduleName,
                            message: 'This Field already in FulfillmentTracker' + ",Please update from the editField",
                        }, common_2.HttpStatus.BAD_REQUEST);
                    }
                }
                PG.updatedBy = userId;
                PG.updatedAt = new Date();
                yield this.fulfillmentRepository.update(PG.id, PG);
                return PG;
            }
            else {
                return Promise.reject(new common_2.HttpException('FulfillmentTracker not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    editFields(id, userId, fields) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let PG = yield this.fulfillmentRepository.findOne(id);
            if (PG) {
                for (let i = 0; i < fields.length; i++) {
                    let perm = fields[i];
                    let obj = PG.fields.find(o => o.apiName === perm.apiName);
                    if (obj) {
                        perm.createdAt = new Date();
                        perm.updatedAt = new Date();
                        fields[i] = perm;
                    }
                    else {
                        throw new common_2.HttpException({
                            status: common_2.HttpStatus.BAD_REQUEST,
                            error: 'This Field not in this FulfillmentTracker' + perm.apiName,
                            message: 'This Field not in this FulfillmentTracker' + ",Please add from the addField",
                        }, common_2.HttpStatus.BAD_REQUEST);
                    }
                }
                PG.fields = yield PG.fields.map(obj => fields.find(o => o.apiName === obj.apiName) || obj);
                PG.updatedBy = userId;
                PG.updatedAt = new Date();
                return PG;
            }
            else {
                return Promise.reject(new common_2.HttpException('FulfillmentTracker not found', common_2.HttpStatus.BAD_REQUEST));
            }
        });
    }
    findBySalesOrder(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let team = yield this.fulfillmentRepository.findOne({ where: { salesOrderId: id } });
            if (team) {
                return team;
            }
            else {
                return false;
            }
        });
    }
    saveBySalesOrder(salesOrder) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log("new FulfillmentTracker");
            let fulfillmentTracker = new fulfillmentTracker_entity_1.FulfillmentTracker();
            fulfillmentTracker.name = 'FT-' + salesOrder.salesorderNumber;
            fulfillmentTracker.salesOrderId = salesOrder.salesorderId;
            fulfillmentTracker.salesOrderNumber = salesOrder.salesorderNumber;
            fulfillmentTracker.businessLead = salesOrder.orderDetails.salesperson_id;
            fulfillmentTracker.customerName = salesOrder.customerName;
            fulfillmentTracker.companyName = salesOrder.companyName;
            fulfillmentTracker.clientPurchaseOrderDate = salesOrder.date;
            fulfillmentTracker.productionDate = salesOrder.shipmentDate;
            fulfillmentTracker.fulfillmentDate = String(new Date());
            fulfillmentTracker.status = fulfillmentTracker_entity_1.Status.NotStarted;
            fulfillmentTracker.description = "";
            fulfillmentTracker.fields = [];
            return yield this.fulfillmentRepository.save(fulfillmentTracker);
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
};
fulfillmentTrackerService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(fulfillmentTracker_entity_1.FulfillmentTracker)),
    tslib_1.__param(1, typeorm_1.InjectRepository(token_entity_1.zohoToken)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], fulfillmentTrackerService);
exports.fulfillmentTrackerService = fulfillmentTrackerService;
//# sourceMappingURL=fulfillmentTracker.service.js.map