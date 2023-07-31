"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const order_entity_1 = require("./order.entity");
let OrderRepository = class OrderRepository extends typeorm_1.Repository {
    getTotalOrderValue(orderId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const order = yield this.findOne(orderId);
            if (!order) {
                throw new Error('Order not found.');
            }
            return totalOrderValue(order);
        });
    }
};
OrderRepository = tslib_1.__decorate([
    typeorm_1.EntityRepository(order_entity_1.Order)
], OrderRepository);
exports.OrderRepository = OrderRepository;
function totalOrderValue(order) {
    let totalPrice = 0;
    if (order.products) {
        let products = order.products;
        for (let j = 0; j < products.length; j++) {
            const productTotal = products[j].quantity * products[j].price;
            totalPrice += productTotal;
        }
    }
    return totalPrice;
}
//# sourceMappingURL=order.repository.js.map