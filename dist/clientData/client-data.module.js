"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const client_data_entity_1 = require("./client-data.entity");
const client_data_service_1 = require("./client-data.service");
const client_data_controller_1 = require("./client-data.controller");
const authentication_module_1 = require("../authentication/authentication.module");
const passport_1 = require("@nestjs/passport");
let ClientDataModule = class ClientDataModule {
};
ClientDataModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            authentication_module_1.AuthenticationModule,
            typeorm_1.TypeOrmModule.forFeature([client_data_entity_1.ClientData]),
            passport_1.PassportModule
        ],
        providers: [client_data_service_1.ClientDataService],
        controllers: [client_data_controller_1.ClientDataController],
        exports: [client_data_service_1.ClientDataService],
    })
], ClientDataModule);
exports.ClientDataModule = ClientDataModule;
//# sourceMappingURL=client-data.module.js.map