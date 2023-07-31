"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const organization_entity_1 = require("./organization.entity");
const company_service_1 = require("./../company/company.service");
const entities_service_1 = require("./../entities/entities.service");
const organization_entity_2 = require("../organization/organization.entity");
const common_2 = require("@nestjs/common");
var ObjectId = require('mongodb').ObjectID;
common_1.Injectable();
let OrganizationService = class OrganizationService {
    constructor(organizationRepository, companyService, entitiesService) {
        this.organizationRepository = organizationRepository;
        this.companyService = companyService;
        this.entitiesService = entitiesService;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.organizationRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.organizationRepository.findOne(id);
        });
    }
    filter(filter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.organizationRepository.find(filter);
        });
    }
    update(id, organization) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.organizationRepository.update(id, organization);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const organization = this.organizationRepository.findOne(id).then(result => {
                this.organizationRepository.delete(result);
            });
        });
    }
    save(organization) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundOrganization = yield this.organizationRepository.findOne(organization.id);
            if (foundOrganization) {
                let m = yield this.organizationRepository.update(foundOrganization.id, organization);
                return organization;
            }
            else {
                return yield this.organizationRepository.save(organization);
            }
        });
    }
    fixOldData(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const foundOrganization = yield this.organizationRepository.findOne(id);
            if (foundOrganization) {
                foundOrganization.customerId = `${foundOrganization.id}`;
                let m = yield this.organizationRepository.save(foundOrganization);
                return foundOrganization;
            }
            else {
                throw new common_1.NotFoundException(`No Organization Found on Id- ${id}`);
            }
        });
    }
    newOrgSave(organization, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (type == "Old") {
                console.log("in Old FLow");
                organization.status = organization_entity_2.OrganizationStatus.ACTIVE;
                let foundOrganization = yield this.organizationRepository.findOne(organization.id);
                if (foundOrganization) {
                    organization.id = foundOrganization.id;
                    organization.customerId = `${foundOrganization.id}`;
                    organization.account_id = `${foundOrganization.account_id}`;
                    let m = yield this.organizationRepository.save(organization);
                }
                else {
                    foundOrganization = yield this.organizationRepository.save(organization);
                    foundOrganization.customerId = `${foundOrganization.id}`;
                    let y = yield this.organizationRepository.save(foundOrganization);
                    console.log(foundOrganization);
                    organization = foundOrganization;
                }
                let gstNo = organization.id;
                let zipCode = organization.id;
                let otherData = yield this.companyService.create(organization.id, gstNo, zipCode);
                if (organization.companyIds.includes(otherData.companyId)) {
                    console.log("Allready have that Company in Organization");
                    if (organization.entityIds.includes(otherData.entityId)) {
                        console.log("Allready have that entity in Organization");
                    }
                    else {
                        organization.entityIds.push(otherData.entityId);
                        yield this.organizationRepository.update(organization.id, organization);
                    }
                }
                else {
                    organization.companyIds.push(otherData.companyId);
                    if (organization.entityIds.includes(otherData.entityId)) {
                        console.log("Allready have that entity in Organization");
                        yield this.organizationRepository.update(organization.id, organization);
                    }
                    else {
                        organization.entityIds.push(otherData.entityId);
                        yield this.organizationRepository.update(organization.id, organization);
                    }
                }
                otherData.organization = organization;
                return otherData;
            }
            else if (type == "New") {
                console.log("in New Flow");
                const foundOrganization = yield this.organizationRepository.findOne({ where: { customerId: organization.customerId } });
                if (foundOrganization) {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.BAD_REQUEST,
                        error: 'Bad request',
                        message: "Allready have that customer id organization",
                    }, common_2.HttpStatus.BAD_REQUEST);
                }
                else {
                    console.log("in new organization creation");
                    let saveData = {
                        "companyIds": [],
                        "entityIds": [],
                        "name": organization.name,
                        "type": organization.type,
                        "account_id": organization.account_id,
                        "customerId": organization.customerId,
                        "status": organization_entity_2.OrganizationStatus.ACTIVE,
                        "domains": [organization_entity_2.OrganizationDomain.PROCUREMENT, organization_entity_2.OrganizationDomain.ECOMMERCE, organization_entity_2.OrganizationDomain.INVENTORY]
                    };
                    if (saveData.type === organization_entity_2.OrganizationType.LOGISTICS) {
                        saveData.domains.push(organization_entity_2.OrganizationDomain.LOGISTICS);
                    }
                    if (saveData.type == organization_entity_2.OrganizationType.MANUFACTURER) {
                        saveData.domains.push(organization_entity_2.OrganizationDomain.SUPPLIER, organization_entity_2.OrganizationDomain.MANUFACTURER);
                    }
                    organization = yield this.organizationRepository.save(saveData);
                    return organization;
                }
            }
        });
    }
    findOrganizations(ids) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let filterData = [];
            for (let i = 0; i < ids.length; i++) {
                filterData.push({ _id: ObjectId(ids[i]) });
            }
            let filter = {
                $or: filterData
            };
            const organizations = yield this.organizationRepository.find({ where: filter });
            return organizations;
        });
    }
    addStatus() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let out = [];
            let orgs = yield this.organizationRepository.find();
            for (let o of orgs) {
                o.status = organization_entity_2.OrganizationStatus.ACTIVE;
                let o1 = yield this.organizationRepository.update(o.id, o);
                out.push({ id: o.id, update: o1 });
            }
            return out;
        });
    }
    mapOrganization(customer) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!customer.contact_id) {
                return false;
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.FAILED_DEPENDENCY,
                    error: 'Error from zoho fields in organization',
                    message: "Field error customer id",
                }, common_2.HttpStatus.FAILED_DEPENDENCY);
            }
            let organization = new organization_entity_1.Organization();
            organization.companyIds = [];
            organization.entityIds = [];
            organization.account_id = "";
            organization.createdBy = "ZOHO SYNC";
            organization.createdAt = String(new Date());
            organization.updatedAt = String(new Date());
            organization.customerId = customer.contact_id;
            organization.name = customer.contact_name ? customer.contact_name : "None";
            organization.business_website = customer.website ? customer.website : "";
            organization.payment_terms = customer.payment_terms ? customer.payment_terms : "";
            organization.credit_limit = customer.credit_limit ? customer.credit_limit : "";
            organization.status = organization_entity_2.OrganizationStatus.ACTIVE;
            organization.business_pan = customer.pan_no ? customer.pan_no : "";
            organization.gst_treatment = customer.gst_treatment ? customer.gst_treatment : "";
            organization.created_time = customer.created_time ? customer.created_time : "";
            organization.created_date = customer.created_date ? customer.created_date : "";
            organization.last_modified_time = customer.last_modified_time ? customer.last_modified_time : "";
            organization.created_by_name = customer.created_by_name ? customer.created_by_name : "ZOHO-BOOKS-SYNC";
            return organization;
        });
    }
    zohoCustomerOrganization(organization) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let find = yield this.organizationRepository.findOne({ where: { customerId: organization.customerId } });
            if (find) {
                organization.createdAt = find.createdAt ? find.createdAt : (organization.createdAt ? organization.createdAt : String(new Date()));
                yield this.organizationRepository.update(find.id, organization);
                organization.id = find.id;
                return organization;
            }
            else {
                return yield this.organizationRepository.save(organization);
            }
        });
    }
};
OrganizationService = tslib_1.__decorate([
    tslib_1.__param(0, typeorm_1.InjectRepository(organization_entity_1.Organization)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        company_service_1.companyService,
        entities_service_1.entitiesService])
], OrganizationService);
exports.OrganizationService = OrganizationService;
//# sourceMappingURL=organization.service.js.map