"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const typeorm_1 = require("typeorm");
const common_1 = require("@nestjs/common");
const address_service_1 = require("./address.service");
const address_entity_1 = require("./address.entity");
const user_entity_1 = require("../users/user.entity");
const typeorm_2 = require("@nestjs/typeorm");
const typeorm_3 = require("typeorm");
const jwt_auth_guard_1 = require("../authentication/jwt-auth.guard");
let AddressController = class AddressController {
    constructor(addressService, userRepository) {
        this.addressService = addressService;
        this.userRepository = userRepository;
    }
    findAll(req) {
        return this.addressService.findAll(req.user);
    }
    findAllUserAddresses(userId) {
        return this.addressService.findAllUserAddresses(userId);
    }
    findByOrg(id) {
        return this.addressService.findByOrg(id);
    }
    save(address, req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let user = yield this.userRepository.findOne(req.user.id);
            if (!user) {
                throw new common_1.HttpException({
                    status: common_1.HttpStatus.NOT_FOUND,
                    error: 'NOT_FOUND',
                    message: "User Not Found",
                }, common_1.HttpStatus.NOT_FOUND);
            }
            else {
                address.companyIds = [user.companyId];
                address.entityIds = [user.entityId];
                return this.addressService.save(address);
            }
        });
    }
    update(id, address) {
        return this.addressService.update(id, address);
    }
    delete(id) {
        return this.addressService.remove(id);
    }
    getAddressAsString(id) {
        return this.addressService.getAddressAsString(id);
    }
    fixAddress(req) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            console.log('req', req.user);
            return yield typeorm_1.getRepository(address_entity_1.Address).find({ where: { organization_id: req.user.organization_id } }).then(addresses => {
                addresses.forEach((address) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                    address.addressType = 'shipping';
                    address.country = 'India';
                    yield this.addressService.save(address);
                }));
            });
        });
    }
    findOne(id) {
        return this.addressService.findOne(id);
    }
};
tslib_1.__decorate([
    common_1.Get(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AddressController.prototype, "findAll", null);
tslib_1.__decorate([
    common_1.Get('user/:userId'),
    tslib_1.__param(0, common_1.Param('userId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], AddressController.prototype, "findAllUserAddresses", null);
tslib_1.__decorate([
    common_1.Get('byorg/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], AddressController.prototype, "findByOrg", null);
tslib_1.__decorate([
    common_1.Post(),
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    tslib_1.__param(0, common_1.Body()), tslib_1.__param(1, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [address_entity_1.Address, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AddressController.prototype, "save", null);
tslib_1.__decorate([
    common_1.Patch(':id'),
    tslib_1.__param(0, common_1.Param('id')), tslib_1.__param(1, common_1.Body()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, address_entity_1.Address]),
    tslib_1.__metadata("design:returntype", void 0)
], AddressController.prototype, "update", null);
tslib_1.__decorate([
    common_1.Delete(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", void 0)
], AddressController.prototype, "delete", null);
tslib_1.__decorate([
    common_1.Get('address-as-string/:id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], AddressController.prototype, "getAddressAsString", null);
tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Get('fixAddress/'),
    tslib_1.__param(0, common_1.Request()),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], AddressController.prototype, "fixAddress", null);
tslib_1.__decorate([
    common_1.Get(':id'),
    tslib_1.__param(0, common_1.Param('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", void 0)
], AddressController.prototype, "findOne", null);
AddressController = tslib_1.__decorate([
    common_1.UseGuards(jwt_auth_guard_1.JwtAuthGuard),
    common_1.Controller('addresses'),
    tslib_1.__param(1, typeorm_2.InjectRepository(user_entity_1.User)),
    tslib_1.__metadata("design:paramtypes", [address_service_1.AddressService,
        typeorm_3.Repository])
], AddressController);
exports.AddressController = AddressController;
//# sourceMappingURL=address.controller.js.map