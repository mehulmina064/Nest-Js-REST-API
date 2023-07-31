"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const rfqBid_service_1 = require("./rfqBid.service");
const common_2 = require("@nestjs/common");
let rfqBidController = class rfqBidController {
    constructor(rfqBidService) {
        this.rfqBidService = rfqBidService;
    }
    getAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.rfqBidService.getAll();
        });
    }
    getManufacturersSheetDetails() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.rfqBidService.getManufacturersDetails();
        });
    }
    sendMailManufacturersSurvery() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.rfqBidService.sendMailManufacturersSurvery();
        });
    }
    sendMailManufacturersWithTemplate(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!body.templateName) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please Provide template Name"
                }, common_2.HttpStatus.BAD_REQUEST);
            }
            if (!body.subject) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please Provide subject "
                }, common_2.HttpStatus.BAD_REQUEST);
            }
            return yield this.rfqBidService.sendMailManufacturersWithTemplate(body.templateName, body.subject);
        });
    }
    sendWhatsappMessaageManufacturersWithTemplate(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!body.templateName) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please Provide template Name"
                }, common_2.HttpStatus.BAD_REQUEST);
            }
            if (!body.image_link) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please Provide image_link "
                }, common_2.HttpStatus.BAD_REQUEST);
            }
            return yield this.rfqBidService.sendWhatsappMessaageManufacturersWithTemplate(body.templateName, body.image_link);
        });
    }
    getAllRfqDetails() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.rfqBidService.getAllRfqDetails();
        });
    }
    getAllRfqBidsDetails() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.rfqBidService.getAllRfqBidsDetails();
        });
    }
    getOneRfqBidsDetails(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.rfqBidService.getOneRfqBidsDetails(id);
        });
    }
    getAnySheetDetails(id, range) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (id && range) {
                return yield this.rfqBidService.getAnySheetDetails(id, range);
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please Provide Correct Data of id,range"
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    RfqDetails(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            id = "352461" + id;
            return yield this.rfqBidService.RfqDetails(id);
        });
    }
    getRfqDetails(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            id = "352461" + id;
            return yield this.rfqBidService.RfqDetails(id);
        });
    }
    getRfqBidDetails(id, data) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            id = "352461" + id;
            let rfq = yield this.rfqBidService.RfqDetails(id);
            if (rfq && data.manufacturePhone && data.manufactureGstNo && data.lineItems.length > 0) {
                delete rfq['message'];
                delete rfq['statusCode'];
                data.rfqId = id;
                let sheetSave = yield this.rfqBidService.sheetBidSave(rfq, data);
                let formSave = yield this.rfqBidService.saveRfqBid(data);
                return { FormData: formSave, rfqDetails: rfq.data, sheetSaveDetails: sheetSave, statusCode: 200, message: "succes" };
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please Fill the at least One Item detail"
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    getRfqSheetDetails(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let range = "RFQ (BD)";
            return yield this.rfqBidService.getRfqSheetDetails(id, range);
        });
    }
    rfqSendToManufacturers(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let rId = id;
            id = "352461" + id;
            let k = yield this.rfqBidService.RfqDetails(id);
            if (k) {
                let data = yield this.rfqBidService.rfqSendToManufacturers(k.data.lineItems);
                let out = [];
                for (const itemData of data) {
                    out.push({ email: yield this.rfqBidService.sendMail(itemData, rId) });
                    out.push({ wahtsapp: yield this.rfqBidService.sendWhatsappBid(rId) });
                }
                return out;
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'BAD_REQUEST',
                    message: "Please Fill the at least One Item detail"
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    rfqSendWhstappInstruction() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.rfqBidService.sendWhatsappInstruction();
        });
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], rfqBidController.prototype, "getAll", null);
tslib_1.__decorate([
    common_1.Get('manufacturers'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], rfqBidController.prototype, "getManufacturersSheetDetails", null);
tslib_1.__decorate([
    common_1.Post('Send-Mail-Manufacturers-Survey'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], rfqBidController.prototype, "sendMailManufacturersSurvery", null);
tslib_1.__decorate([
    common_1.Post('Send-Mail-Manufacturers'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], rfqBidController.prototype, "sendMailManufacturersWithTemplate", null);
tslib_1.__decorate([
    common_1.Post('Send-Whatsapp-Manufacturers'),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], rfqBidController.prototype, "sendWhatsappMessaageManufacturersWithTemplate", null);
tslib_1.__decorate([
    common_1.Get('allRfqs'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], rfqBidController.prototype, "getAllRfqDetails", null);
tslib_1.__decorate([
    common_1.Get('crmAllRfqBids'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], rfqBidController.prototype, "getAllRfqBidsDetails", null);
tslib_1.__decorate([
    common_1.Get('crmOneRfqBid'),
    tslib_1.__param(0, common_1.Body('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], rfqBidController.prototype, "getOneRfqBidsDetails", null);
tslib_1.__decorate([
    common_1.Post('getAnySheet'),
    tslib_1.__param(0, common_1.Body('id')), tslib_1.__param(1, common_1.Body('range')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], rfqBidController.prototype, "getAnySheetDetails", null);
tslib_1.__decorate([
    common_1.Get('rfq/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], rfqBidController.prototype, "RfqDetails", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], rfqBidController.prototype, "getRfqDetails", null);
tslib_1.__decorate([
    common_1.Post(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], rfqBidController.prototype, "getRfqBidDetails", null);
tslib_1.__decorate([
    common_1.Get('rfqSheet/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], rfqBidController.prototype, "getRfqSheetDetails", null);
tslib_1.__decorate([
    common_1.Post('rfqSendMail/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], rfqBidController.prototype, "rfqSendToManufacturers", null);
tslib_1.__decorate([
    common_1.Post('whatsapp/Instruction'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], rfqBidController.prototype, "rfqSendWhstappInstruction", null);
rfqBidController = tslib_1.__decorate([
    common_1.Controller('rfqBid'),
    tslib_1.__metadata("design:paramtypes", [rfqBid_service_1.rfqBidService])
], rfqBidController);
exports.rfqBidController = rfqBidController;
//# sourceMappingURL=rfqBid.controller.js.map