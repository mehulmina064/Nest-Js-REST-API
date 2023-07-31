"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const internal_jwt_auth_guard_1 = require("../../authentication/internal-jwt-auth.guard");
const common_2 = require("@nestjs/common");
const prodoRoles_constants_1 = require("../zohoEmployee/prodoRoles.constants");
const ProductPSku_dto_1 = require("./entity/ProductPSku.dto");
const productPSku_service_1 = require("./services/productPSku.service");
const parentSku_service_1 = require("../parentSku/parentSku.service");
const product_service_1 = require("./services/product.service");
const zohoEmployee_service_1 = require("../zohoEmployee/zohoEmployee.service");
const fs = require('fs');
const http = require("https");
let ProductPSkuController = class ProductPSkuController {
    constructor(parentSkuService, ProductPSkuService, internalProductService, zohoEmployeeService) {
        this.parentSkuService = parentSkuService;
        this.ProductPSkuService = ProductPSkuService;
        this.internalProductService = internalProductService;
        this.zohoEmployeeService = zohoEmployeeService;
    }
    findAll(req, search = "", status = "NA", limit = 100, page = 1) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            limit = limit > 200 ? 200 : limit;
            let start = (page - 1) * limit;
            let end = page * limit;
            let user = yield this.zohoEmployeeService.findOne(req.user.id);
            if (!user) {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "User Not Found",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
            let query = {
                where: {
                    $or: [
                        { pSkuId: { $regex: search, $options: 'i' } },
                        { productId: { $regex: search, $options: 'i' } },
                    ]
                }
            };
            let result;
            if (user.roles) {
                if (user.roles.includes(prodoRoles_constants_1.UserRole.PRODO_ADMIN)) {
                    result = yield this.ProductPSkuService.findAll(query);
                    result.data = result.data.slice(start, end);
                    return { statusCode: 200, message: "All Test Product PSku", count: result.count, limit: limit, page: page, data: result.data };
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.EXPECTATION_FAILED,
                        error: 'EXPECTATION_FAILED',
                        message: 'User does not have permission to perform this action',
                    }, common_2.HttpStatus.EXPECTATION_FAILED);
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.EXPECTATION_FAILED,
                    error: 'EXPECTATION_FAILED',
                    message: "Invalid User",
                }, common_2.HttpStatus.EXPECTATION_FAILED);
            }
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.ProductPSkuService.findOne(id);
        });
    }
    userRoles(pSkuId, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let query = { where: { pSkuId: pSkuId } };
            let result = yield this.ProductPSkuService.findAll(query);
            return { statusCode: 200, message: "Test PSku products", count: result.count, data: result.data };
        });
    }
    save(role, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let roleCheck = yield this.parentSkuService.check(role.pSkuId);
            let permissionCheck = yield this.internalProductService.check(role.productSku);
            if (roleCheck) {
                if (permissionCheck) {
                    role.updatedBy = req.user.id;
                    role.createdBy = req.user.id;
                    return yield this.ProductPSkuService.save(role);
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.BAD_REQUEST,
                        error: 'EXPECTATION_FAILED',
                        message: 'Product is not exist on this sku ',
                    }, common_2.HttpStatus.BAD_REQUEST);
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'EXPECTATION_FAILED',
                    message: 'pSkuId is not valid',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    update(id, role, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let roleCheck = yield this.parentSkuService.check(role.pSkuId);
            let permissionCheck = yield this.internalProductService.check(role.productId);
            if (roleCheck) {
                if (permissionCheck) {
                    role.updatedBy = req.user.id;
                    role.updatedAt = new Date();
                    return yield this.ProductPSkuService.update(id, role);
                }
                else {
                    throw new common_2.HttpException({
                        status: common_2.HttpStatus.BAD_REQUEST,
                        error: 'EXPECTATION_FAILED',
                        message: 'product is not valid',
                    }, common_2.HttpStatus.BAD_REQUEST);
                }
            }
            else {
                throw new common_2.HttpException({
                    status: common_2.HttpStatus.BAD_REQUEST,
                    error: 'EXPECTATION_FAILED',
                    message: 'pSkuId is not valid',
                }, common_2.HttpStatus.BAD_REQUEST);
            }
        });
    }
    softDelete(id, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.ProductPSkuService.softRemove(id, req.user.id);
        });
    }
};
tslib_1.__decorate([
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.Get(),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__param(1, common_1.Query('search', new common_1.DefaultValuePipe(''))),
    tslib_1.__param(2, common_1.Query('status', new common_1.DefaultValuePipe('NA'))),
    tslib_1.__param(3, common_1.Query('limit', new common_1.DefaultValuePipe(100), common_1.ParseIntPipe)),
    tslib_1.__param(4, common_1.Query('page', new common_1.DefaultValuePipe(1), common_1.ParseIntPipe)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String, String, Number, Number]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductPSkuController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductPSkuController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Get('pSkuProducts/:pSkuId'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('pSkuId')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductPSkuController.prototype, "userRoles", null);
tslib_1.__decorate([
    common_1.Post(),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [ProductPSku_dto_1.CreateProductPSkuDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductPSkuController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    common_1.UsePipes(new common_1.ValidationPipe({ transform: true })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()), tslib_1.__param(2, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, ProductPSku_dto_1.UpdateProductPSkuDto, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductPSkuController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    common_1.UseGuards(internal_jwt_auth_guard_1.IJwtAuthGuard),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ProductPSkuController.prototype, "softDelete", null);
ProductPSkuController = tslib_1.__decorate([
    common_1.Controller('internal/productPSku'),
    tslib_1.__metadata("design:paramtypes", [parentSku_service_1.parentSkuService,
        productPSku_service_1.ProductPSkuService,
        product_service_1.internalProductService,
        zohoEmployee_service_1.zohoEmployeeService])
], ProductPSkuController);
exports.ProductPSkuController = ProductPSkuController;
//# sourceMappingURL=productPSku.controller.js.map