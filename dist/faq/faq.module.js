"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const faq_entity_1 = require("./faq.entity");
const faq_service_1 = require("./faq.service");
const faq_controller_1 = require("./faq.controller");
let FaqModule = class FaqModule {
};
FaqModule = tslib_1.__decorate([
    common_1.Module({
        imports: [typeorm_1.TypeOrmModule.forFeature([faq_entity_1.Faq])],
        providers: [faq_service_1.FaqService],
        controllers: [faq_controller_1.FaqController],
    })
], FaqModule);
exports.FaqModule = FaqModule;
//# sourceMappingURL=faq.module.js.map