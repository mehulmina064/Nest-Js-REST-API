"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const category_service_1 = require("./category.service");
const category_entity_1 = require("./category.entity");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
let CategoryController = class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }
    findAll() {
        return this.categoryService.findAll();
    }
    findOne(id) {
        return this.categoryService.findOne(id);
    }
    save(category) {
        return this.categoryService.save(category);
    }
    update(id, category) {
        return this.categoryService.update(id, category);
    }
    delete(id) {
        return this.categoryService.remove(id);
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], CategoryController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], CategoryController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [category_entity_1.Category]),
    tslib_1.__metadata("design:returntype", void 0)
], CategoryController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, category_entity_1.Category]),
    tslib_1.__metadata("design:returntype", void 0)
], CategoryController.prototype, "update", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], CategoryController.prototype, "delete", null);
CategoryController = tslib_1.__decorate([
    common_1.Controller('categories'),
    tslib_1.__metadata("design:paramtypes", [category_service_1.CategoryService])
], CategoryController);
exports.CategoryController = CategoryController;
//# sourceMappingURL=category.controller.js.map