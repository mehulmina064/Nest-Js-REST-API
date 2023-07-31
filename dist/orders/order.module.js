"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_entity_1 = require("./order.entity");
const order_service_1 = require("./order.service");
const order_controller_1 = require("./order.controller");
const user_module_1 = require("../users/user.module");
const address_module_1 = require("../addresses/address.module");
const mail_module_1 = require("../mail/mail.module");
const mailTrigger_module_1 = require("../mailTrigger/mailTrigger.module");
let OrderModule = class OrderModule {
};
OrderModule = tslib_1.__decorate([
    common_1.Module({
        imports: [address_module_1.AddressModule, user_module_1.UserModule, mail_module_1.MailModule, typeorm_1.TypeOrmModule.forFeature([order_entity_1.Order]), mailTrigger_module_1.MailTriggerModule],
        providers: [order_service_1.OrderService],
        controllers: [order_controller_1.OrderController],
    })
], OrderModule);
exports.OrderModule = OrderModule;
//# sourceMappingURL=order.module.js.map