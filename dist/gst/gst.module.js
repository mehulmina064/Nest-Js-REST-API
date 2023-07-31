"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const gst_service_1 = require("./gst.service");
const gst_controller_1 = require("./gst.controller");
const typeorm_1 = require("@nestjs/typeorm");
const gst_entity_1 = require("./gst.entity");
const mail_module_1 = require("../mail/mail.module");
const authentication_module_1 = require("../authentication/authentication.module");
const hsn_entity_1 = require("./hsn.entity");
const sac_entity_1 = require("./sac.entity");
let GstModule = class GstModule {
};
GstModule = tslib_1.__decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([gst_entity_1.Gst, hsn_entity_1.HSNCode, sac_entity_1.SACCode]),
            mail_module_1.MailModule,
            authentication_module_1.AuthenticationModule,
        ],
        controllers: [gst_controller_1.GstController],
        providers: [gst_service_1.GstService],
        exports: [gst_service_1.GstService, typeorm_1.TypeOrmModule.forFeature([gst_entity_1.Gst, hsn_entity_1.HSNCode, sac_entity_1.SACCode])],
    })
], GstModule);
exports.GstModule = GstModule;
//# sourceMappingURL=gst.module.js.map