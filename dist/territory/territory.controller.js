"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const multer_1 = require("multer");
const file_utils_1 = require("./../files/file.utils");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_auth_guard_1 = require("./../authentication/jwt-auth.guard");
const common_1 = require("@nestjs/common");
const utils_1 = require("../common/utils");
const territory_service_1 = require("./territory.service");
let TerritoryController = class TerritoryController {
    constructor(territoryService) {
        this.territoryService = territoryService;
    }
    findAll(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryService.findAll(req.user);
        });
    }
    filter(query) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryService.filter(query);
        });
    }
    findOne(id, req) {
        return this.territoryService.findOne(id);
    }
    findOneByName(name, req) {
        return utils_1.filterSingleObject(this.territoryService, req.user);
    }
    save(territory, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            territory.createdBy = req.user.id;
            return yield this.territoryService.save(territory);
        });
    }
    update(territory, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            territory.updatedBy = req.user.id;
            return yield this.territoryService.update(territory.id, territory);
        });
    }
    delete(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryService.delete(id);
        });
    }
    findTree(organizationId, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryService.getTerritoryTree();
        });
    }
    findByParent(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryService.findByParent(id);
        });
    }
    findByName(name, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryService.findByName(name);
        });
    }
    findByCode(code, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryService.findByCode(code);
        });
    }
    findByAncestors(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryService.findAncestors(id);
        });
    }
    findByDescendants(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryService.getChildren(id);
        });
    }
    uploadUnimoveHubs(req, file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryService.uploadUnimoveHubs(file);
        });
    }
    deleteUnimoveHubs() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryService.deleteTerritories();
        });
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TerritoryController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get('filter'),
    tslib_1.__param(0, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TerritoryController.prototype, "filter", null);
tslib_1.__decorate([
    common_1.Get('territorybyid/:id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], TerritoryController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Get('territorybyname/:name'),
    tslib_1.__param(0, common_1.Param('name')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], TerritoryController.prototype, "findOneByName", null);
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TerritoryController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Patch('update'),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TerritoryController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TerritoryController.prototype, "delete", null);
tslib_1.__decorate([
    common_1.Get('tree/'),
    tslib_1.__param(0, common_1.Param('organizationId')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TerritoryController.prototype, "findTree", null);
tslib_1.__decorate([
    common_1.Get('parent/:id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TerritoryController.prototype, "findByParent", null);
tslib_1.__decorate([
    common_1.Get('territorybyname/:name'),
    tslib_1.__param(0, common_1.Param('name')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TerritoryController.prototype, "findByName", null);
tslib_1.__decorate([
    common_1.Get('territorybycode/:code'),
    tslib_1.__param(0, common_1.Param('code')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TerritoryController.prototype, "findByCode", null);
tslib_1.__decorate([
    common_1.Get('ancestors/:id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TerritoryController.prototype, "findByAncestors", null);
tslib_1.__decorate([
    common_1.Get('descendants/:id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TerritoryController.prototype, "findByDescendants", null);
tslib_1.__decorate([
    common_1.Post('upload-unimove-hubs'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file', {
        storage: multer_1.diskStorage({
            destination: './files',
            filename: file_utils_1.editFileName,
        }),
    })),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.UploadedFile()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], TerritoryController.prototype, "uploadUnimoveHubs", null);
tslib_1.__decorate([
    common_1.Get('delete-unimove-hubs'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], TerritoryController.prototype, "deleteUnimoveHubs", null);
TerritoryController = tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Controller('territories'),
    tslib_1.__metadata("design:paramtypes", [territory_service_1.TerritoryService])
], TerritoryController);
exports.TerritoryController = TerritoryController;
//# sourceMappingURL=territory.controller.js.map