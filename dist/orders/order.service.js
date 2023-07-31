"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const order_repository_1 = require("./order.repository");
const order_entity_1 = require("./order.entity");
const user_service_1 = require("../users/user.service");
const address_service_1 = require("../addresses/address.service");
const mail_service_1 = require("../mail/mail.service");
const mailTrigger_service_1 = require("./../mailTrigger/mailTrigger.service");
var DomParser = require('dom-parser');
const crypto = require('crypto');
let OrderService = class OrderService {
    constructor(orderRepository, userService, addressService, mailservice, mailTriggerService) {
        this.orderRepository = orderRepository;
        this.userService = userService;
        this.addressService = addressService;
        this.mailservice = mailservice;
        this.mailTriggerService = mailTriggerService;
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const orders = yield this.orderRepository.find();
            return orders;
        });
    }
    findAllByUser(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const orders = yield this.orderRepository.find({ userId });
            for (let i = 0; i < orders.length; i++) {
                const user = yield this.userService.findOne(orders[i].userId);
                orders[i].userName = user.firstName;
                orders[i].billingAddress = yield this.addressService.findOne(orders[i].billingAddressId);
                orders[i].shippingAddress = yield this.addressService.findOne(orders[i].shippingAddressId);
                orders[i].totalAmount = totalOrderValue(orders[i]);
            }
            return orders;
        });
    }
    getSummeryByUser(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const orders = yield this.orderRepository.find({ userId });
            let orderCount = 0;
            let activeOrders = 0;
            let totalOrdersValue = 0;
            let inTransitOrders = 0;
            let pendingOrders = 0;
            let deliveredOrders = 0;
            for (let i = 0; i < orders.length; i++) {
                let totalAmount = totalOrderValue(orders[i]);
                orderCount += 1;
                totalOrdersValue += totalAmount;
                if (orders[i].orderStatus !== 'Completed' && orders[i].orderStatus !== 'Cancelled' && orders[i].orderStatus !== 'Delivered') {
                    activeOrders += 1;
                }
                if (orders[i].orderStatus === "In Transit") {
                    inTransitOrders += 1;
                }
                if (orders[i].orderStatus === "Delivered" || orders[i].orderStatus === "Completed") {
                    deliveredOrders += 1;
                }
                if (orders[i].orderStatus === "Order Received" || orders[i].orderStatus === "Cancellation Requested") {
                    pendingOrders += 1;
                }
            }
            return { orderCount: orderCount,
                totalOrdersValue: totalOrdersValue,
                activeOrders: activeOrders,
                inTransitOrders: inTransitOrders,
                pendingOrders: pendingOrders,
                deliveredOrders: deliveredOrders
            };
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const order = yield this.orderRepository.findOne(id);
            const user = yield this.userService.findOne(order.userId);
            order.userName = user.firstName;
            order.billingAddress = yield this.addressService.findOne(order.billingAddressId);
            order.shippingAddress = yield this.addressService.findOne(order.shippingAddressId);
            order.totalAmount = totalOrderValue(order);
            return order;
        });
    }
    save(order) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            order.orderStatus = 'Order Received';
            let createdOrder = yield this.orderRepository.save(order);
            const user = yield this.userService.findOne(order.userId);
            const shippingAdress = yield this.addressService.findOne(createdOrder.shippingAddressId);
            let mailOptions = {
                TriggerName: 'newOrder',
                doc: user,
                templatevars: {
                    name: user.firstName,
                    companyName: user.companyName,
                    orderNumber: createdOrder.id,
                    date: createdOrder.createdAt,
                    shopMoreUrl: 'https://prodo.in',
                    total: yield totalOrderValue(createdOrder),
                    products: order.products,
                    shippingAdress: shippingAdress
                }
            };
            this.mailTriggerService.SendMail(mailOptions);
            return createdOrder;
        });
    }
    update(id, order) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.orderRepository.update(id, order);
            return yield this.findOne(id);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const order = yield this.orderRepository.findOne(id);
            yield this.orderRepository.delete(id);
            return order;
        });
    }
};
OrderService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(order_entity_1.Order)),
    tslib_1.__metadata("design:paramtypes", [order_repository_1.OrderRepository,
        user_service_1.UserService,
        address_service_1.AddressService,
        mail_service_1.MailService,
        mailTrigger_service_1.MailTriggerService])
], OrderService);
exports.OrderService = OrderService;
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
//# sourceMappingURL=order.service.js.map