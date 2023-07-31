"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const swagger_1 = require("@nestjs/swagger");
const base_app_entity_1 = require("../../common/base-app.entity");
var teamStatus;
(function (teamStatus) {
    teamStatus["ACTIVE"] = "ACTIVE";
    teamStatus["INACTIVE"] = "INACTIVE";
    teamStatus["DELETED"] = "DELETED";
})(teamStatus = exports.teamStatus || (exports.teamStatus = {}));
let internalTeam = class internalTeam extends base_app_entity_1.BaseAppEntity {
};
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.ObjectIdColumn(),
    tslib_1.__metadata("design:type", Object)
], internalTeam.prototype, "id", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], internalTeam.prototype, "teamName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], internalTeam.prototype, "teamDisplayName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column({
        type: 'enum',
        enum: teamStatus,
        default: teamStatus.ACTIVE,
    }),
    tslib_1.__metadata("design:type", Object)
], internalTeam.prototype, "status", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", Boolean)
], internalTeam.prototype, "isDefault", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    typeorm_1.Column(),
    tslib_1.__metadata("design:type", String)
], internalTeam.prototype, "teamDescription", void 0);
internalTeam = tslib_1.__decorate([
    typeorm_1.Entity('InternalTeam')
], internalTeam);
exports.internalTeam = internalTeam;
//# sourceMappingURL=team.entity.js.map