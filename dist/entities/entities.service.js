"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const entity_entity_1 = require("./entity.entity");
const common_1 = require("@nestjs/common");
var ObjectId = require('mongodb').ObjectID;
let entitiesService = class entitiesService {
    constructor(entityRepository) {
        this.entityRepository = entityRepository;
    }
    save(orgId, companyId, entityData) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            orgId = String(orgId);
            let find = yield this.entityRepository.findOne({ where: { zipCode: entityData.zipCode, companyId: companyId, organization_id: orgId } });
            if (find) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'Bad request',
                    message: "Entity Already exist in this company",
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            else {
                let entity = yield new entity_entity_1.Entitie;
                entity.zipCode = entityData.zipCode;
                entity.entityName = entityData.entityName ? entityData.entityName : "None";
                entity.entityState = entityData.entityState ? entityData.entityState : "None";
                entity.entityCountry = entityData.entityCountry ? entityData.entityCountry : "IN";
                entity.shippingAddress = entityData.shippingAddress ? entityData.shippingAddress : "None";
                entity.description = entityData.description ? entityData.description : "None";
                entity.entityContactNumber = entityData.entityContactNumber ? entityData.entityContactNumber : "None";
                entity.entityCity = entityData.entityCity ? entityData.entityCity : "None";
                entity.status = entity_entity_1.entityStatus.ACTIVE;
                entity.companyId = `${companyId}`;
                entity.organization_id = `${orgId}`;
                entity = yield this.entityRepository.save(entity);
                if (entity) {
                    return entity;
                }
                else {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Forbidden',
                        message: "Error in Saving Data"
                    }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        });
    }
    create(orgId, companyId, zipCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            orgId = String(orgId);
            companyId = String(companyId);
            zipCode = String(zipCode);
            let find = yield this.entityRepository.findOne({ where: { companyId: companyId, organization_id: orgId, zipCode: zipCode } });
            if (find) {
                console.log("allready existed zipcode on this company");
                return find;
            }
            else {
                let entity = yield new entity_entity_1.Entitie;
                entity.entityName = "";
                entity.companyId = `${companyId}`;
                entity.organization_id = `${orgId}`;
                entity.zipCode = `${zipCode}`;
                entity.billingAddress = "";
                entity.shippingAddress = "";
                entity.description = "";
                entity.entityContactNumber = "";
                entity.entityCountry = "IN";
                entity.entityState = "";
                entity.entityCity = "";
                entity.status = entity_entity_1.entityStatus.ACTIVE;
                return yield this.entityRepository.save(entity);
            }
        });
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.entityRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let find = yield this.entityRepository.findOne({ _id: ObjectId(`${id}`) });
            return find;
        });
    }
    update(id, data) {
        return `This action updates a #${id} entity`;
    }
    remove(id) {
        return `This action removes a #${id} entity`;
    }
    findEntities(ids) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let filterData = [];
            for (let i = 0; i < ids.length; i++) {
                filterData.push({ _id: ObjectId(ids[i]) });
            }
            let filter = {
                $or: filterData
            };
            const entities = yield this.entityRepository.find({ where: filter });
            return entities;
        });
    }
    addStatus() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let out = [];
            let entitys = yield this.entityRepository.find();
            for (let o of entitys) {
                o.status = entity_entity_1.entityStatus.ACTIVE;
                let o1 = yield this.entityRepository.update(o.id, o);
                out.push({ id: o.id, update: o1 });
            }
            return out;
        });
    }
    mapEntity(salesOrder) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let entity = new entity_entity_1.Entitie();
            let entityDetails = salesOrder.shipping_address;
            if (!entityDetails.zip) {
                return false;
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.FAILED_DEPENDENCY,
                    error: 'Error from zoho fields in entity ',
                    message: "Field error zipcode",
                }, common_1.HttpStatus.FAILED_DEPENDENCY);
            }
            entity.companyId = "";
            entity.status = entity_entity_1.entityStatus.ACTIVE;
            entity.branches = [];
            entity.createdBy = "ZOHO SYNC";
            entity.zipCode = entityDetails.zip;
            entity.entityName = `${salesOrder.customer_name ? salesOrder.customer_name : "None"}-Entity`;
            entity.shippingAddress = entityDetails.address ? entityDetails.address : "None";
            entity.entityCity = entityDetails.city ? entityDetails.city : "None";
            entity.entityState = entityDetails.state ? entityDetails.state : (entityDetails.state_code ? entityDetails.state_code : "None");
            entity.entityCountry = entityDetails.country ? entityDetails.country : (entityDetails.country_code ? entityDetails.country_code : "IN");
            entity.entityContactNumber = entityDetails.phone ? entityDetails.phone : (entityDetails.fax ? entityDetails.fax : "None");
            entity.createdAt = new Date();
            entity.updatedAt = new Date();
            return entity;
        });
    }
    zohoCustomerEntity(entity) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let find = yield this.entityRepository.findOne({ where: { zipCode: entity.zipCode, companyId: entity.companyId } });
            if (find) {
                entity.createdAt = find.createdAt ? find.createdAt : (entity.createdAt ? entity.createdAt : new Date());
                entity.id = find.id;
                yield this.entityRepository.save(entity);
                return entity;
            }
            else {
                return yield this.entityRepository.save(entity);
            }
        });
    }
};
entitiesService = tslib_1.__decorate([
    tslib_1.__param(0, typeorm_1.InjectRepository(entity_entity_1.Entitie)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], entitiesService);
exports.entitiesService = entitiesService;
//# sourceMappingURL=entities.service.js.map