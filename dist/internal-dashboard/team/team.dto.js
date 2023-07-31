"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const swagger_1 = require("@nestjs/swagger");
const base_app_dto_1 = require("../../common/base-app.dto");
const class_validator_1 = require("class-validator");
var teamStatus;
(function (teamStatus) {
    teamStatus["ACTIVE"] = "ACTIVE";
    teamStatus["INACTIVE"] = "INACTIVE";
    teamStatus["DELETED"] = "DELETED";
})(teamStatus = exports.teamStatus || (exports.teamStatus = {}));
class CreateTeamDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    class_validator_1.IsLowercase(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], CreateTeamDto.prototype, "teamName", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], CreateTeamDto.prototype, "teamDisplayName", void 0);
tslib_1.__decorate([
    class_validator_1.IsEnum(teamStatus),
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], CreateTeamDto.prototype, "status", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", Boolean)
], CreateTeamDto.prototype, "isDefault", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], CreateTeamDto.prototype, "teamDescription", void 0);
exports.CreateTeamDto = CreateTeamDto;
class UpdateTeamDto extends base_app_dto_1.BaseUpdateDto {
}
tslib_1.__decorate([
    class_validator_1.IsEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateTeamDto.prototype, "teamName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateTeamDto.prototype, "teamDisplayName", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty({ enum: teamStatus }),
    tslib_1.__metadata("design:type", String)
], UpdateTeamDto.prototype, "status", void 0);
tslib_1.__decorate([
    class_validator_1.IsBoolean(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", Boolean)
], UpdateTeamDto.prototype, "isDefault", void 0);
tslib_1.__decorate([
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateTeamDto.prototype, "teamDescription", void 0);
exports.UpdateTeamDto = UpdateTeamDto;
class CreateUserTeamDto extends base_app_dto_1.BaseCreateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], CreateUserTeamDto.prototype, "teamId", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], CreateUserTeamDto.prototype, "userId", void 0);
exports.CreateUserTeamDto = CreateUserTeamDto;
class UpdateUserTeamDto extends base_app_dto_1.BaseUpdateDto {
}
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateUserTeamDto.prototype, "teamId", void 0);
tslib_1.__decorate([
    class_validator_1.IsNotEmpty(),
    swagger_1.ApiModelProperty(),
    tslib_1.__metadata("design:type", String)
], UpdateUserTeamDto.prototype, "userId", void 0);
exports.UpdateUserTeamDto = UpdateUserTeamDto;
//# sourceMappingURL=team.dto.js.map