"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const category_entity_1 = require("./category.entity");
const category_service_1 = require("./category.service");
const category_controller_1 = require("./category.controller");
const authentication_module_1 = require("../authentication/authentication.module");
let CategoryModule = class CategoryModule {
};
CategoryModule = tslib_1.__decorate([
    common_1.Module({
        imports: [authentication_module_1.AuthenticationModule, typeorm_1.TypeOrmModule.forFeature([category_entity_1.Category])],
        providers: [category_service_1.CategoryService],
        controllers: [category_controller_1.CategoryController],
        exports: [category_service_1.CategoryService],
    })
], CategoryModule);
exports.CategoryModule = CategoryModule;
//# sourceMappingURL=category.module.js.map