"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const account_service_1 = require("./account.service");
const account_dto_1 = require("./account.dto");
let AccountController = class AccountController {
    constructor(accountService) {
        this.accountService = accountService;
    }
    findAll() {
        return this.accountService.findAll();
    }
    save(accountCreateDto) {
        return this.accountService.save(accountCreateDto);
    }
    update(id, accountUpdateDto) {
        return this.accountService.update(id, accountUpdateDto);
    }
    delete(id) {
        return this.accountService.delete(id);
    }
};
tslib_1.__decorate([
    common_1.Get(),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], AccountController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Post(),
    common_1.UsePipes(common_1.ValidationPipe),
    tslib_1.__param(0, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [account_dto_1.AccountCreateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    common_1.UsePipes(common_1.ValidationPipe),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, account_dto_1.AccountUpdateDto]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AccountController.prototype, "delete", null);
AccountController = tslib_1.__decorate([
    common_1.Controller('accounts'),
    tslib_1.__metadata("design:paramtypes", [account_service_1.AccountService])
], AccountController);
exports.AccountController = AccountController;
//# sourceMappingURL=account.controller.js.map