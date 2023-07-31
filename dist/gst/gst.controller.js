"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const gst_service_1 = require("./gst.service");
const gst_entity_1 = require("./gst.entity");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const file_utils_1 = require("../files/file.utils");
let GstController = class GstController {
    constructor(gstService) {
        this.gstService = gstService;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.gstService.findAll();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.gstService.findOne(id);
        });
    }
    save(gst) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.gstService.save(gst);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.gstService.remove(id);
        });
    }
    update(id, gst) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.gstService.update(id, gst);
        });
    }
    bulkUploadFromExcel(file, type) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (type === 'gst') {
                return yield this.gstService.bulkInsertFromExcelGST(file);
            }
            if (type === 'hsnsac') {
                return yield this.gstService.bulkInsertFromExcelHSNSAC(file);
            }
            return { "message": 'Invalid Type' };
        });
    }
    searchHSNCode(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (query.description) {
                return yield this.gstService.SearchHSNSACCodeByDescription(query.description);
            }
            if (query.hsnCode) {
                return yield this.gstService.SearchDescriptionFromHsnCode(query.hsnCode);
            }
            return { "message": 'Invalid Query' };
        });
    }
    getGSTCode(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (query.hsnCode) {
                return yield this.gstService.findByHSNCode(query.hsnCode);
            }
            return { "message": 'Invalid Query' };
        });
    }
};
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], GstController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('byid/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], GstController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Post(),
    common_1.HttpCode(201),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [gst_entity_1.Gst]),
    tslib_1.__metadata("design:returntype", Promise)
], GstController.prototype, "save", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], GstController.prototype, "remove", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Put(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, gst_entity_1.Gst]),
    tslib_1.__metadata("design:returntype", Promise)
], GstController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Post(':type/bulk-upload'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file', {
        storage: multer_1.diskStorage({
            destination: './files',
            filename: file_utils_1.editFileName,
        }),
    })),
    tslib_1.__param(0, common_1.UploadedFile()), tslib_1.__param(1, common_1.Param('type')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], GstController.prototype, "bulkUploadFromExcel", null);
tslib_1.__decorate([
    common_1.Get('gethsnsaccodes'),
    tslib_1.__param(0, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], GstController.prototype, "searchHSNCode", null);
tslib_1.__decorate([
    common_1.Get('get-gst-from-hsn-code'),
    tslib_1.__param(0, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], GstController.prototype, "getGSTCode", null);
GstController = tslib_1.__decorate([
    common_1.Controller('gst'),
    tslib_1.__metadata("design:paramtypes", [gst_service_1.GstService])
], GstController);
exports.GstController = GstController;
//# sourceMappingURL=gst.controller.js.map