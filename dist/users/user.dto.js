"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_entity_1 = require("./user.entity");
const account_entity_1 = require("../account/account.entity");
const organization_entity_1 = require("../organization/organization.entity");
class UserCreateDto {
    constructor() {
        this.user = new user_entity_1.User();
        this.account = new account_entity_1.Account();
        this.organization = new organization_entity_1.Organization();
    }
}
exports.UserCreateDto = UserCreateDto;
class UserUpdateDto {
}
exports.UserUpdateDto = UserUpdateDto;
class UserDeleteDto {
}
exports.UserDeleteDto = UserDeleteDto;
class UserDto {
}
exports.UserDto = UserDto;
//# sourceMappingURL=user.dto.js.map