"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const common_entity_1 = require("../common/common.entity");
var AccountType;
(function (AccountType) {
    AccountType["INTERNAL"] = "INTERNAL";
    AccountType["EXTERNAL"] = "EXTERNAL";
})(AccountType = exports.AccountType || (exports.AccountType = {}));
let Account = class Account extends common_entity_1.BaseAppEntity {
};
tslib_1.__decorate([
    swagger_1.ApiModelPropertyOptional(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", Object)
], Account.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Account.prototype, "account_no", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({
        type: 'enum',
        enum: AccountType,
        default: AccountType.EXTERNAL,
    }),
    tslib_1.__metadata("design:type", Object)
], Account.prototype, "type", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Account.prototype, "email", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Object)
], Account.prototype, "status", void 0);
Account = tslib_1.__decorate([
    typeorm_1.Entity("accounts")
], Account);
exports.Account = Account;
//# sourceMappingURL=account.entity.js.map