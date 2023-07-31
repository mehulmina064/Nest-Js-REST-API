"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const company_entity_1 = require("./company.entity");
const entities_service_1 = require("./../entities/entities.service");
const common_1 = require("@nestjs/common");
var ObjectId = require('mongodb').ObjectID;
let companyService = class companyService {
    constructor(companyRepository, entitiesService) {
        this.companyRepository = companyRepository;
        this.entitiesService = entitiesService;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.companyRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.companyRepository.findOne(id);
        });
    }
    filter(filter) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.companyRepository.find(filter);
        });
    }
    save(orgId, companyData) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            orgId = String(orgId);
            let find = yield this.companyRepository.findOne({ where: { gstNo: companyData.gstNo, organization_id: orgId } });
            if (find) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.BAD_REQUEST,
                    error: 'Bad request',
                    message: "Company Already exist in this organization",
                }, common_1.HttpStatus.BAD_REQUEST);
            }
            else {
                let company = yield new company_entity_1.Company;
                company.gstNo = companyData.gstNo;
                company.companyName = companyData.companyName;
                company.companyContactNumber = companyData.companyContactNumber ? companyData.companyContactNumber : "";
                company.companyCountry = companyData.companyCountry ? companyData.companyCountry : "IN";
                company.companyState = companyData.companyState ? companyData.companyState : "";
                company.description = companyData.description ? companyData.description : "";
                company.status = company_entity_1.companyStatus.ACTIVE;
                company.organization_id = `${orgId}`;
                company = yield this.companyRepository.save(company);
                if (company) {
                    return company;
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
    update(id, company) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.companyRepository.update(id, company);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const company = this.companyRepository.findOne(id).then(result => {
                this.companyRepository.delete(result);
            });
        });
    }
    create(orgId, gstNo, zipCode) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            orgId = String(orgId);
            gstNo = String(gstNo);
            zipCode = String(zipCode);
            let data = {
                orgId: orgId,
                gstNo: gstNo,
                zipCode: zipCode,
                companyId: "",
                entityId: ""
            };
            let find = yield this.companyRepository.findOne({ where: { gstNo: gstNo, organization_id: orgId } });
            if (find) {
                console.log("allready existed gstno company");
                let companyId = String(find.id);
                let entity = yield this.entitiesService.create(orgId, companyId, zipCode);
                let entityId = String(entity.id);
                data.companyId = companyId;
                data.entityId = entityId;
                if (find.entityIds.includes(entityId)) {
                    console.log("Allready have that entity");
                }
                else {
                    find.entityIds.push(entityId);
                    yield this.companyRepository.save(find);
                }
                data.company = find;
                data.entity = entity;
                return data;
            }
            else {
                let company = yield new company_entity_1.Company;
                company.gstNo = gstNo;
                company.companyName = "";
                company.companyContactNumber = "";
                company.companyCountry = "IN";
                company.companyState = "";
                company.description = "";
                company.organization_id = `${orgId}`;
                company.status = company_entity_1.companyStatus.ACTIVE;
                company = yield this.companyRepository.save(company);
                if (company) {
                    let companyId = String(company.id);
                    let entity = yield this.entitiesService.create(orgId, companyId, zipCode);
                    let entityId = String(entity.id);
                    data.companyId = companyId;
                    data.entityId = entityId;
                    company.entityIds.push(entityId);
                    yield this.companyRepository.save(company);
                    data.company = company;
                    data.entity = entity;
                    return data;
                }
                else {
                    throw new common_1.HttpException({
                        status: common_1.HttpStatus.BAD_REQUEST,
                        error: 'Forbidden',
                        message: "Error in Saving Data"
                    }, common_1.HttpStatus.BAD_REQUEST);
                }
            }
        });
    }
    findCompanies(ids) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let filterData = [];
            for (let i = 0; i < ids.length; i++) {
                filterData.push({ _id: ObjectId(ids[i]) });
            }
            let filter = {
                $or: filterData
            };
            const companies = yield this.companyRepository.find({ where: filter });
            return companies;
        });
    }
    addStatus() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let out = [];
            let comps = yield this.companyRepository.find();
            for (let o of comps) {
                o.status = company_entity_1.companyStatus.ACTIVE;
                let o1 = yield this.companyRepository.update(o.id, o);
                out.push({ id: o.id, update: o1 });
            }
            return out;
        });
    }
    mapCompany(salesOrder, customer) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!salesOrder.gst_no) {
                return false;
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.FAILED_DEPENDENCY,
                    error: 'Error from zoho fields in company',
                    message: "Field error gstNo",
                }, common_1.HttpStatus.FAILED_DEPENDENCY);
            }
            let compDetails = customer.tax_info_list.find(i => i.tax_registration_no == salesOrder.gst_no);
            let company = new company_entity_1.Company();
            company.entityIds = [];
            company.organization_id = "";
            company.gstNo = salesOrder.gst_no ? salesOrder.gst_no : "";
            company.status = company_entity_1.companyStatus.ACTIVE;
            company.companyState = salesOrder.place_of_supply ? salesOrder.place_of_supply : "None";
            company.companyName = salesOrder.customer_name ? salesOrder.customer_name : "None";
            company.companyCountry = "IN";
            company.description = "";
            company.createdBy = "ZOHO SYNC";
            company.createdAt = new Date();
            company.updatedAt = new Date();
            return company;
        });
    }
    zohoCustomerCompany(company) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let find = yield this.companyRepository.findOne({ where: { gstNo: company.gstNo, organization_id: company.organization_id } });
            if (find) {
                company.createdAt = find.createdAt ? find.createdAt : (company.createdAt ? company.createdAt : new Date());
                company.id = find.id;
                yield this.companyRepository.save(company);
                return company;
            }
            else {
                return yield this.companyRepository.save(company);
            }
        });
    }
};
companyService = tslib_1.__decorate([
    tslib_1.__param(0, typeorm_1.InjectRepository(company_entity_1.Company)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository,
        entities_service_1.entitiesService])
], companyService);
exports.companyService = companyService;
//# sourceMappingURL=company.service.js.map