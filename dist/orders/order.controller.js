"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const order_service_1 = require("./order.service");
const order_entity_1 = require("./order.entity");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
let OrderController = class OrderController {
    constructor(orderService) {
        this.orderService = orderService;
    }
    findAll() {
        return this.orderService.findAll();
    }
    findAllByUser(userId) {
        return this.orderService.findAllByUser(userId);
    }
    getSummeryByUser(userId) {
        return this.orderService.getSummeryByUser(userId);
    }
    findOne(id) {
        return this.orderService.findOne(id);
    }
    save(category) {
        return this.orderService.save(category);
    }
    update(id, order) {
        return this.orderService.update(id, order);
    }
    requestCancellation(id) {
        return this.orderService.update(id, { orderStatus: 'Cancellation Requested' });
    }
    needHelp(id, message) {
        console.log(message);
    }
    delete(id) {
        return this.orderService.remove(id);
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], OrderController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get('user/:userId'),
    tslib_1.__param(0, common_1.Param('userId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrderController.prototype, "findAllByUser", null);
tslib_1.__decorate([
    common_1.Get('user-summery/:userId'),
    tslib_1.__param(0, common_1.Param('userId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], OrderController.prototype, "getSummeryByUser", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], OrderController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [order_entity_1.Order]),
    tslib_1.__metadata("design:returntype", void 0)
], OrderController.prototype, "save", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Patch(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, order_entity_1.Order]),
    tslib_1.__metadata("design:returntype", void 0)
], OrderController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Patch('cancel/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], OrderController.prototype, "requestCancellation", null);
tslib_1.__decorate([
    common_1.Patch('need-help/:id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", void 0)
], OrderController.prototype, "needHelp", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], OrderController.prototype, "delete", null);
OrderController = tslib_1.__decorate([
    common_1.Controller('orders'),
    tslib_1.__metadata("design:paramtypes", [order_service_1.OrderService])
], OrderController);
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map