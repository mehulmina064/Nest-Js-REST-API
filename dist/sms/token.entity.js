"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_app_entity_1 = require("./../common/base-app.entity");
let zohoToken = class zohoToken extends base_app_entity_1.BaseAppEntity {
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", typeorm_1.ObjectID)
], zohoToken.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], zohoToken.prototype, "token", void 0);
zohoToken = tslib_1.__decorate([
    typeorm_1.Entity('zohoToken')
], zohoToken);
exports.zohoToken = zohoToken;
//# sourceMappingURL=token.entity.js.map