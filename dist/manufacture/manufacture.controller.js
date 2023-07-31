"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const manufacture_service_1 = require("./manufacture.service");
const common_2 = require("@nestjs/common");
let ManufactureController = class ManufactureController {
    constructor(manufactureService) {
        this.manufactureService = manufactureService;
    }
    prodoData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.manufactureService.findAll();
            if (data) {
                return { message: "succes", status: 200, data: data };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'NOT FOUND',
                    message: "NOT FOUND"
                }, common_2.HttpStatus.NOT_FOUND);
            }
        });
    }
    gstVerify(gstNo) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.manufactureService.findByGstNo(gstNo);
            if (!data) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.NOT_FOUND,
                    error: 'NOT_FOUND',
                    message: "Please provide correct GST NO",
                }, common_2.HttpStatus.NOT_FOUND);
            }
            else {
                return { message: "succes", status: 200, data: data.enrichment_details };
            }
        });
    }
    singleManufacturer(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.manufactureService.findOne(id);
            return data;
        });
    }
    zohoData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.manufactureService.zohoManufacturerData();
            if (data) {
                return { message: "succes", status: 200, data: data };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "EXPECTATION_FAILED"
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    zohosingleData(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.manufactureService.singleZohoManufacturerData(id);
            if (data) {
                return { message: "succes", status: 200, data: data };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "EXPECTATION_FAILED"
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    pimcoreData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.manufactureService.pimcoreManufacturerData();
            if (data) {
                return { message: "succes", status: 200, data: data };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "EXPECTATION_FAILED"
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    saveManufacturerToZohoBooks(data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.manufactureService.saveManufacturerToZohoBooks(data);
        });
    }
    updateManufacturerToZohoBooks(id, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.manufactureService.updateManufacturerToZohoBooks(data, id);
        });
    }
    saveToProdo() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.manufactureService.pimcoreManufacturerData();
            return yield this.manufactureService.saveToProdo(data);
        });
    }
    saveToZoho() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data = yield this.manufactureService.findAll();
            return yield this.manufactureService.saveToZoho(data);
        });
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ManufactureController.prototype, "prodoData", null);
tslib_1.__decorate([
    common_1.Get("gstVerify/:gstNo"),
    tslib_1.__param(0, common_1.Param("gstNo")),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ManufactureController.prototype, "gstVerify", null);
tslib_1.__decorate([
    common_1.Get("details/:id"),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ManufactureController.prototype, "singleManufacturer", null);
tslib_1.__decorate([
    common_1.Get("zohoData"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ManufactureController.prototype, "zohoData", null);
tslib_1.__decorate([
    common_1.Get("zohoData/:id"),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ManufactureController.prototype, "zohosingleData", null);
tslib_1.__decorate([
    common_1.Get("pimcoreData"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ManufactureController.prototype, "pimcoreData", null);
tslib_1.__decorate([
    common_1.Post('singlePostToZoho'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ManufactureController.prototype, "saveManufacturerToZohoBooks", null);
tslib_1.__decorate([
    common_1.Patch("zohoData/:id"),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ManufactureController.prototype, "updateManufacturerToZohoBooks", null);
tslib_1.__decorate([
    common_1.Post('saveToProdo'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ManufactureController.prototype, "saveToProdo", null);
tslib_1.__decorate([
    common_1.Post('saveToZoho'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ManufactureController.prototype, "saveToZoho", null);
ManufactureController = tslib_1.__decorate([
    common_1.Controller('manufacture'),
    tslib_1.__metadata("design:paramtypes", [manufacture_service_1.ManufactureService])
], ManufactureController);
exports.ManufactureController = ManufactureController;
//# sourceMappingURL=manufacture.controller.js.map