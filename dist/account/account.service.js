"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const account_entity_1 = require("./account.entity");
let AccountService = class AccountService {
    constructor(accountRepository) {
        this.accountRepository = accountRepository;
    }
    updatePassword(id, accountUpdateDto) {
        throw new Error('Method not implemented.');
    }
    save(accountCreateDto) {
        throw new Error('Method not implemented.');
    }
    findAll() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.accountRepository.find();
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.accountRepository.findOne(id);
        });
    }
    create(accountCreateDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const account = new account_entity_1.Account();
            account.name = accountCreateDto.name;
            return yield this.accountRepository.save(account);
        });
    }
    update(id, accountUpdateDto) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const account = yield this.accountRepository.findOne(id);
            account.name = accountUpdateDto.name;
            return yield this.accountRepository.save(account);
        });
    }
    delete(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const account = yield this.accountRepository.findOne(id);
            return yield this.accountRepository.remove(account);
        });
    }
    findByName(name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.accountRepository.findOne({ name: name });
        });
    }
};
AccountService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(account_entity_1.Account)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], AccountService);
exports.AccountService = AccountService;
//# sourceMappingURL=account.service.js.map