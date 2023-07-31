"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const category_entity_1 = require("./category.entity");
const crypto = require('crypto');
const nestjs_typeorm_paginate_1 = require("nestjs-typeorm-paginate");
let CategoryService = class CategoryService {
    constructor(categoryRepository) {
        this.categoryRepository = categoryRepository;
    }
    paginate(options) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return (nestjs_typeorm_paginate_1.paginate(this.categoryRepository, options));
        });
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let allCategory = yield this.categoryRepository.find({ where: { status: category_entity_1.Status.ACTIVE } });
            for (var i = 0; i < allCategory.length; i++) {
                let s = allCategory[i];
                s.status = category_entity_1.Status.ACTIVE;
                yield this.categoryRepository.update(s.id, s);
            }
            return allCategory;
        });
    }
    findByParent(parent) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.categoryRepository.find({ parentCategoryId: parent });
        });
    }
    categoryName(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let data1 = yield this.categoryRepository.findOne(id);
            if (data1) {
                return data1.categoryName;
            }
            else {
                return 'Others';
            }
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.categoryRepository.findOne(id);
        });
    }
    findCategoryId(categoryName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let category = yield this.categoryRepository.findOne({
                where: { categoryName: categoryName },
            });
            if (!category) {
                category = new category_entity_1.Category();
                category.categoryName = categoryName;
                category = yield this.categoryRepository.save(category);
            }
            return category.id.toString();
        });
    }
    save(category) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.categoryRepository.save(category);
        });
    }
    update(id, category) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.categoryRepository.update(id, category);
            return yield this.findOne(id);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = this.categoryRepository.findOne(id).then(result => {
                this.categoryRepository.delete(result);
            });
        });
    }
    findByCategoryName(categoryName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let category = yield this.categoryRepository.findOne({
                where: { categoryName: categoryName },
            });
            if (!category) {
                return null;
            }
            return String(category.id);
        });
    }
};
CategoryService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(category_entity_1.Category)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], CategoryService);
exports.CategoryService = CategoryService;
//# sourceMappingURL=category.service.js.map