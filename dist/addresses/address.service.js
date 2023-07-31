"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const roles_constants_1 = require("./../users/roles.constants");
const unimove_filter_1 = require("../inventory/unimove.filter");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const address_entity_1 = require("./address.entity");
const crypto = require('crypto');
let AddressService = class AddressService {
    constructor(addressRepository) {
        this.addressRepository = addressRepository;
    }
    findAll(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (user.roles.includes(roles_constants_1.UserRole.PRODO)) {
                return yield this.addressRepository.find();
            }
            let filter = {};
            filter = unimove_filter_1.UnimoveFilter(user);
            return yield this.addressRepository.find({ where: filter });
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.addressRepository.findOne(id);
        });
    }
    save(address) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.addressRepository.save(address);
        });
    }
    findByOrg(orgId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.addressRepository.find({ where: { organization_id: orgId } });
        });
    }
    update(id, address) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.addressRepository.update(id, address);
            return this.findOne(id);
        });
    }
    remove(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const user = this.addressRepository.findOne(id).then(result => {
                this.addressRepository.delete(result);
            });
        });
    }
    findAllUserAddresses(userId) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.addressRepository.find({ userId });
        });
    }
    getAddressAsString(address) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const addressString = `${address.companyName},${address.addressLine1},${address.addressLine2},${address.addressLine3}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`;
            return addressString;
        });
    }
};
AddressService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(address_entity_1.Address)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.Repository])
], AddressService);
exports.AddressService = AddressService;
//# sourceMappingURL=address.service.js.map