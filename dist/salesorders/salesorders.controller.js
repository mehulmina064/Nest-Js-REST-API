"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const salesorders_service_1 = require("./salesorders.service");
let SalesordersController = class SalesordersController {
    constructor(salesOrdersService) {
        this.salesOrdersService = salesOrdersService;
    }
    syncSalesData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.salesOrdersService.salesOrdersSheetDataSync();
        });
    }
    autoSyncSalesData(body) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.salesOrdersService.autuSyncShedule();
        });
    }
};
tslib_1.__decorate([
    common_1.Post("sync-data"),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], SalesordersController.prototype, "syncSalesData", null);
tslib_1.__decorate([
    common_1.Post("set-auto-sync-data"),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], SalesordersController.prototype, "autoSyncSalesData", null);
SalesordersController = tslib_1.__decorate([
    common_1.Controller('salesSheet'),
    tslib_1.__metadata("design:paramtypes", [salesorders_service_1.SalesordersService])
], SalesordersController);
exports.SalesordersController = SalesordersController;
//# sourceMappingURL=salesorders.controller.js.map