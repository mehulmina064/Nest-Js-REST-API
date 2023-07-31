"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const address_entity_1 = require("./address.entity");
const address_service_1 = require("./address.service");
const address_controller_1 = require("./address.controller");
const user_entity_1 = require("./../users/user.entity");
let AddressModule = class AddressModule {
};
AddressModule = tslib_1.__decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([address_entity_1.Address, user_entity_1.User])],
        providers: [address_service_1.AddressService],
        controllers: [address_controller_1.AddressController],
        exports: [address_service_1.AddressService],
    })
], AddressModule);
exports.AddressModule = AddressModule;
//# sourceMappingURL=address.module.js.map