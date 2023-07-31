"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const inventory_entity_1 = require("./../inventory/entities/inventory.entity");
const warehouse_entity_1 = require("./../inventory/entities/warehouse.entity");
const address_entity_1 = require("./../addresses/address.entity");
let xlsx = require('xlsx');
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const territory_entity_1 = require("./territory.entity");
const roles_constants_1 = require("../users/roles.constants");
const crypto = require('crypto');
let TerritoryService = class TerritoryService {
    constructor(territoryRepository) {
        this.territoryRepository = territoryRepository;
    }
    findAll(user) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (user.roles.includes(roles_constants_1.UserRole.PRODO)) {
                return yield this.territoryRepository.find();
            }
            let filter = {
                id: "nothing"
            };
            if (user.roles.includes(roles_constants_1.UserRole.UnimoveSuperAdmin) || user.roles.includes(roles_constants_1.UserRole.ADMIN)) {
                return yield this.territoryRepository.find({ where: { organization_id: user.organization_id } });
            }
            if (user.roles.includes(roles_constants_1.UserRole.UnimoveAdmin) || user.roles.includes(roles_constants_1.UserRole.UnimoveStoreManager)) {
                console.log("user.territory", user.territory_id);
                const repo = this.territoryRepository;
                function getHubs(ids) {
                    return tslib_1.__awaiter(this, void 0, void 0, function* () {
                        let hubs = [];
                        yield Promise.all(ids.map((hubId) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                            const response = yield repo.findOne(hubId);
                            hubs.push(response);
                            console.log(response);
                        })));
                        return hubs;
                    });
                }
                const hubs = yield getHubs(user.territory_id);
                console.log("hubs", hubs);
                return hubs;
            }
            return [];
        });
    }
    findOne(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryRepository.findOne(id);
        });
    }
    findByCode(code) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryRepository.findOne({ code: code });
        });
    }
    findByName(name) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryRepository.findOne({ name: name });
        });
    }
    findById(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryRepository.findOne({ id: id });
        });
    }
    findByParent(parent) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryRepository.find({ parent: parent });
        });
    }
    findByLevel(level) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryRepository.find({ level: level });
        });
    }
    save(territory) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryRepository.save(territory);
        });
    }
    delete(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            yield this.territoryRepository.delete(id);
        });
    }
    update(id, territory) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryRepository.update(id, territory);
        });
    }
    getChildren(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const territory = yield this.territoryRepository.findOne(id);
            if (territory !== undefined) {
                return yield this.territoryRepository.findDescendantsTree(territory);
            }
            return [];
        });
    }
    findAncestors(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const territory = yield this.territoryRepository.findOne(id);
            if (territory !== undefined) {
                return yield this.territoryRepository.findAncestorsTree(territory);
            }
            return [];
        });
    }
    findParent(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const territory = yield this.territoryRepository.findOne(id);
            if (territory !== undefined && territory.parent !== undefined) {
                return yield this.territoryRepository.findAncestors(territory);
            }
            return { "message": "No Parent" };
        });
    }
    getLevel(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const territory = yield this.territoryRepository.findOne(id);
            if (territory !== undefined) {
                return yield this.territoryRepository.createDescendantsQueryBuilder('territory', 'closure-table', territory).getCount();
            }
            return 0;
        });
    }
    getTerritoryTree() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryRepository.findTrees();
        });
    }
    findRoots() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return yield this.territoryRepository.findRoots();
        });
    }
    findDescendants(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const territory = yield this.territoryRepository.findOne(id);
            if (territory !== undefined) {
                return yield this.territoryRepository.findDescendants(territory);
            }
            return [];
        });
    }
    findAncestorsTree(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const territory = yield this.territoryRepository.findOne(id);
            if (territory !== undefined) {
                return yield this.territoryRepository.findAncestorsTree(territory);
            }
            return [];
        });
    }
    findDescendantsTree(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const territory = yield this.territoryRepository.findOne(id);
            if (territory !== undefined) {
                return yield this.territoryRepository.findDescendantsTree(territory);
            }
            return [];
        });
    }
    findSiblings(id) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const territory = yield this.territoryRepository.findOne(id);
            if (territory !== undefined) {
                return yield this.territoryRepository.find({ where: { parent: territory.parent } });
            }
            return [];
        });
    }
    uploadUnimoveHubs(file) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const data = yield xlsx.readFile(file.path);
            const sheet = data.Sheets[data.SheetNames[0]];
            const unimoveHubs = xlsx.utils.sheet_to_json(sheet);
            console.log(unimoveHubs);
            unimoveHubs.forEach((unimoveHub) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                const territory = new territory_entity_1.Territory();
                territory.name = unimoveHub['Hub Name'];
                territory.code = unimoveHub['Hub Code'];
                territory.type = unimoveHub['Type'];
                const address = new address_entity_1.Address();
                address.addressLine1 = unimoveHub['Hub Address'];
                address.organization_id = '6268d5d11e192b13a6dd09f2';
                address.city = unimoveHub['Hub City'];
                address.addressType = 'shipping';
                address.country = 'India';
                address.state = unimoveHub['Hub State'];
                address.zipCode = unimoveHub['Hub Pincode'];
                const savedAddress = yield typeorm_2.getRepository(address_entity_1.Address).save(address);
                territory.address_id = String(address.id);
                territory.organization_id = '6268d5d11e192b13a6dd09f2';
                const savedTerritory = yield this.territoryRepository.save(territory);
                console.log(savedTerritory);
                const warehouse = new warehouse_entity_1.Warehouse();
                warehouse.name = unimoveHub['Hub Name'];
                warehouse.code = unimoveHub['Hub Code'];
                warehouse.territory_id.push(String(savedTerritory.id));
                warehouse.organization_id = '6268d5d11e192b13a6dd09f2';
                warehouse.address_id = String(savedAddress.id);
                const savedWarehouse = yield typeorm_2.getRepository(warehouse_entity_1.Warehouse).save(warehouse);
                console.log(savedWarehouse);
                const bag_id = '6267970ab05883604010289e';
                const seal_id = '625d46484d1db7278d8ba88e';
                const bagInventory = new inventory_entity_1.Inventory();
                bagInventory.warehouse_id = String(savedWarehouse.id);
                bagInventory.item_id = bag_id;
                bagInventory.organization_id = '6268d5d11e192b13a6dd09f2';
                bagInventory.current_qty = 0;
                bagInventory.territory_id.push(String(savedTerritory.id));
                const savedBagInventory = yield typeorm_2.getRepository(inventory_entity_1.Inventory).save(bagInventory);
                console.log(savedBagInventory);
                const sealInventory = new inventory_entity_1.Inventory();
                sealInventory.warehouse_id = String(savedWarehouse.id);
                sealInventory.item_id = seal_id;
                sealInventory.organization_id = '6268d5d11e192b13a6dd09f2';
                sealInventory.current_qty = 0;
                sealInventory.territory_id.push(String(savedTerritory.id));
                const savedSealInventory = yield typeorm_2.getRepository(inventory_entity_1.Inventory).save(sealInventory);
                console.log(savedSealInventory);
            }));
            return {
                status: 'success',
                message: 'Unimove Hubs Uploaded Successfully'
            };
        });
    }
    deleteTerritories() {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const date = new Date('2022-04-27T09:14:05.095+00:00');
            console.log(date);
            const territories = yield this.territoryRepository.find({
                where: {
                    createdAt: {
                        $lt: date
                    }
                }
            });
            console.log(territories);
            territories.forEach((territory) => tslib_1.__awaiter(this, void 0, void 0, function* () {
                yield this.territoryRepository.remove(territory);
            }));
            return {
                status: 'success',
                message: 'Territories Deleted Successfully'
            };
        });
    }
};
TerritoryService = tslib_1.__decorate([
    common_1.Injectable(),
    tslib_1.__param(0, typeorm_1.InjectRepository(territory_entity_1.Territory)),
    tslib_1.__metadata("design:paramtypes", [typeorm_2.TreeRepository])
], TerritoryService);
exports.TerritoryService = TerritoryService;
//# sourceMappingURL=territory.service.js.map