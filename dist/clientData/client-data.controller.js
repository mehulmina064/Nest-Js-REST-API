"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const jwt_auth_guard_1 = require("./../authentication/jwt-auth.guard");
const common_1 = require("@nestjs/common");
const client_data_service_1 = require("./client-data.service");
const client_data_entity_1 = require("./client-data.entity");
const client_data_dto_1 = require("./client-data.dto");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const file_utils_1 = require("../files/file.utils");
const typeorm_1 = require("typeorm");
const utils_1 = require("../common/utils");
let ClientDataController = class ClientDataController {
    constructor(clientDataService) {
        this.clientDataService = clientDataService;
    }
    findAll(req, query) {
        return utils_1.filterAllData(this.clientDataService, req.user);
    }
    getLineItems(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let clientsData = yield this.findAll(req);
            let lineItems = [];
            if (clientsData) {
                clientsData.forEach((client) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    if (client.line_items) {
                        let foundLineItems = yield this.clientDataService.getLineItems(client.id);
                        lineItems.push(foundLineItems);
                    }
                }));
                return lineItems;
            }
            return null;
        });
    }
    clearData() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = yield typeorm_1.getRepository(client_data_entity_1.ClientData).find({
                where: {
                    createdAt: {
                        $gte: new Date(new Date().setDate(new Date().getDate() - 1))
                    }
                }
            });
            return data;
        });
    }
    getDashboardData(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let items = yield this.findAll(req);
            let data = {
                orders: {
                    total: 0,
                    completed: 0,
                    inProgress: 0,
                    cancelled: 0
                },
                payments: {
                    total: 0,
                    paid: 0,
                    due: 0,
                },
                pieChart: [],
                barChart: []
            };
            if (items) {
                items.forEach((item) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    data.payments.paid += Number(item.amount_received) || 0;
                    ;
                    data.payments.total += Number(item.invoice_amount_ex_gst) || 0;
                    let due_amount = Number(item.invoice_amount_ex_gst) || 0 - Number(item.amount_received) || 0;
                    data.payments.due += due_amount;
                    if (item.status === 'Delivered') {
                        data.orders.completed++;
                    }
                    else {
                        data.orders.inProgress++;
                    }
                    let found = data.pieChart.find(element => element.name === item.category_of_products);
                    if (found) {
                        found.value += Number(item.invoice_amount_ex_gst) || 0;
                    }
                    else if (item.category_of_products && item.invoice_amount_ex_gst && item.invoice_amount_ex_gst > 0) {
                        data.pieChart.push({ name: item.category_of_products, value: Number(item.invoice_amount_ex_gst) });
                    }
                    let date = new Date(item.po_date);
                    let month = date.toLocaleString('default', { month: 'short', year: 'numeric' });
                    let foundBar = data.barChart.find(element => element.name === month);
                    if (foundBar) {
                        foundBar.value += Number(item.invoice_amount_ex_gst) || 0;
                    }
                    else if (month && item.invoice_amount_ex_gst && item.invoice_amount_ex_gst > 0) {
                        data.barChart.push({ name: month, value: Number(item.invoice_amount_ex_gst) });
                    }
                }));
                data.orders.total = items.length;
            }
            return data;
        });
    }
    filter(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.clientDataService.filter(req.query);
        });
    }
    download() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.clientDataService.updateDataBase();
        });
    }
    findOne(id) {
        return this.clientDataService.findOne(id);
    }
    save(clientData) {
        return this.clientDataService.save(clientData);
    }
    update(id, clientData) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.clientDataService.update(id, clientData);
        });
    }
    delete(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.clientDataService.remove(id);
        });
    }
    bulkUploadFromExcel(file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.clientDataService.bulkUploadFromExcel(file);
        });
    }
    attachFile(id, file, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const document_name = req.body.document_name;
            return yield this.clientDataService.attachFile(id, file, document_name);
        });
    }
    getAttachedFiles(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.clientDataService.getAttachedFiles(id);
        });
    }
    removeFile(id, file_name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.clientDataService.removeFile(id, file_name);
        });
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__param(0, common_1.Request()), tslib_1.__param(1, common_1.Query()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", void 0)
], ClientDataController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get('line-items'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ClientDataController.prototype, "getLineItems", null);
tslib_1.__decorate([
    common_1.Get('clear-data'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ClientDataController.prototype, "clearData", null);
tslib_1.__decorate([
    common_1.Get('dashboard-data'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ClientDataController.prototype, "getDashboardData", null);
tslib_1.__decorate([
    common_1.Get('filter'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ClientDataController.prototype, "filter", null);
tslib_1.__decorate([
    common_1.Get('updateData'),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], ClientDataController.prototype, "download", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], ClientDataController.prototype, "findOne", null);
tslib_1.__decorate([
    common_1.Post(),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [client_data_dto_1.ClientDataDto]),
    tslib_1.__metadata("design:returntype", void 0)
], ClientDataController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Put('update/:id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, client_data_dto_1.ClientDataDto]),
    tslib_1.__metadata("design:returntype", Promise)
], ClientDataController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete('delete/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ClientDataController.prototype, "delete", null);
tslib_1.__decorate([
    common_1.Post('bulk-upload'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file', {
        storage: multer_1.diskStorage({
            destination: './files',
            filename: file_utils_1.editFileName,
        }),
    })),
    tslib_1.__param(0, common_1.UploadedFile()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ClientDataController.prototype, "bulkUploadFromExcel", null);
tslib_1.__decorate([
    common_1.Post('attach-file/:id'),
    common_1.UseInterceptors(platform_express_1.FileInterceptor('file', {
        storage: multer_1.diskStorage({
            destination: './files',
            filename: file_utils_1.editFileName,
        }),
    })),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.UploadedFile()), tslib_1.__param(2, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], ClientDataController.prototype, "attachFile", null);
tslib_1.__decorate([
    common_1.Get('attach-file/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], ClientDataController.prototype, "getAttachedFiles", null);
tslib_1.__decorate([
    common_1.Delete('attach-file/:id/:file_name'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Param('file_name')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], ClientDataController.prototype, "removeFile", null);
ClientDataController = tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Controller('client-data'),
    tslib_1.__metadata("design:paramtypes", [client_data_service_1.ClientDataService])
], ClientDataController);
exports.ClientDataController = ClientDataController;
//# sourceMappingURL=client-data.controller.js.map