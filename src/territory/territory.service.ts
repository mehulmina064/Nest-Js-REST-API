import { Inventory } from './../inventory/entities/inventory.entity';
import { Warehouse } from './../inventory/entities/warehouse.entity';
import { Address } from './../addresses/address.entity';
let xlsx = require('xlsx');
import { User } from 'src/users/user.entity';
// Create Teritory  Service for Territory
// Language: typescript
// Path: ../territory/territory.service.ts
// Compare this snippet from ../territory/territory.entity.ts:
// Allow Territory to get the country list, and get the country by code, and get the country by name, and get the country by id, and get the country by parent, and get the country by level, and get the country by created_on, and get the country by updated_on, and get the country by created_by, and get the country by updated_by

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnimoveFilter } from '../inventory/unimove.filter';
import { TreeRepository, getRepository, LessThan } from 'typeorm';
import { Territory } from './territory.entity';
import { UserRole } from '../users/roles.constants';
import { callbackify } from 'util';
// tslint:disable-next-line:no-var-requires
const crypto = require('crypto');


@Injectable()
export class TerritoryService {

    constructor(
        @InjectRepository(Territory)
        private readonly territoryRepository: TreeRepository<Territory>,
    ) {
    }
    
// Tree repository Service to access Territory Entity

    async findAll(user:User) {
        if (user.roles.includes(UserRole.PRODO)) {
            return await this.territoryRepository.find();
        }
        let filter = {
            id:"nothing"
        }
        if (user.roles.includes(UserRole.UnimoveSuperAdmin) || user.roles.includes(UserRole.ADMIN)) {
            return await this.territoryRepository.find(
                    {where:{organization_id: user.organization_id}}
            );
        }
       
        if (user.roles.includes(UserRole.UnimoveAdmin) || user.roles.includes(UserRole.UnimoveStoreManager)) {
            console.log("user.territory",user.territory_id);
            const repo =  this.territoryRepository
            async function getHubs (ids:[])  {
                let hubs:Territory[] = [];
                await Promise.all(ids.map(async hubId => {
                  const response = await repo.findOne(hubId);
                  hubs.push(response);
                  console.log(response);
                }))
                return hubs;
              }
            const hubs = await getHubs(user.territory_id);
            console.log("hubs",hubs);
            return hubs

              

            
        }
        return [];}
    async findOne(id: string): Promise<Territory> {
        return await this.territoryRepository.findOne(id);
    }
    async findByCode(code: string): Promise<Territory> {
        return await this.territoryRepository.findOne({ code: code });
    }
    async findByName(name: string): Promise<Territory> {
        return await this.territoryRepository.findOne({ name: name });
    }
    async findById(id: string): Promise<Territory> {
        return await this.territoryRepository.findOne({ id: id });
    }
    async findByParent(parent: string): Promise<Territory[]> {
        return await this.territoryRepository.find({ parent: parent });
    }
    async findByLevel(level: number): Promise<Territory[]> {
        return await this.territoryRepository.find({ level: level });
    }
    async save(territory: Territory): Promise<Territory> {
        return await this.territoryRepository.save(territory);
    }
    async delete(id: string): Promise<void> {
        await this.territoryRepository.delete(id);
    }
    async update(id: string, territory: any): Promise<Territory> {
        return await this.territoryRepository.update(id, territory);
    }
    async getChildren(id: string) {
        const territory = await this.territoryRepository.findOne(id);
        if (territory !== undefined) {
            return await this.territoryRepository.findDescendantsTree(territory);
        }
        return [];
    }
    async findAncestors(id: string){
        const territory = await this.territoryRepository.findOne(id);
        if (territory !== undefined) {
            return await this.territoryRepository.findAncestorsTree(territory);
        }
        return [];
    }
    async findParent(id: string) {
        const territory = await this.territoryRepository.findOne(id);
        if (territory !== undefined && territory.parent !== undefined) {
            return await this.territoryRepository.findAncestors(territory);
        }
        return {"message": "No Parent"};
    }

    async getLevel(id: string): Promise<number> {
        const territory = await this.territoryRepository.findOne(id);
        if (territory !== undefined) {
        return await this.territoryRepository.createDescendantsQueryBuilder( 'territory','closure-table',territory).getCount();
        }
        return 0;
    }
    async getTerritoryTree(): Promise<Territory[]> {
        return await this.territoryRepository.findTrees();

    }
   
    async findRoots(): Promise<Territory[]> {
        return await this.territoryRepository.findRoots();
    }

    async findDescendants(id: string): Promise<Territory[]> {
        const territory = await this.territoryRepository.findOne(id);
        if (territory !== undefined) {
            return await this.territoryRepository.findDescendants(territory);
        }
        return [];
    }
    async findAncestorsTree(id: string): Promise<Territory[]> {
        const territory = await this.territoryRepository.findOne(id);
        if (territory !== undefined) {
            return await this.territoryRepository.findAncestorsTree(territory);
        }
        return [];
    }
    async findDescendantsTree(id: string): Promise<Territory[]> {
        const territory = await this.territoryRepository.findOne(id);
        if (territory !== undefined) {
            return await this.territoryRepository.findDescendantsTree(territory);
        }
        return [];
    }
    async findSiblings(id: string): Promise<Territory[]> {
        const territory = await this.territoryRepository.findOne(id);
        if (territory !== undefined) {
            return await this.territoryRepository.find({where:{parent:territory.parent}});
        }
        return [];
    }
    async uploadUnimoveHubs(file) {
        const data = await  xlsx.readFile(file.path);
        const sheet = data.Sheets[data.SheetNames[0]];
        const unimoveHubs = xlsx.utils.sheet_to_json(sheet);
        console.log(unimoveHubs);
        unimoveHubs.forEach(async (unimoveHub) => {
            // Type	Hub Code	Hub Name	Hub Address	Hub State	Hub City	Hub Pincode
            const territory  = new Territory();
            territory.name = unimoveHub['Hub Name'];
            territory.code = unimoveHub['Hub Code'];
            territory.type = unimoveHub['Type'];
            const address = new Address();
            address.addressLine1 = unimoveHub['Hub Address'];
            address.organization_id = '6268d5d11e192b13a6dd09f2'
            address.city = unimoveHub['Hub City'];
            address.addressType = 'shipping';
            address.country = 'India';
            address.state = unimoveHub['Hub State'];
            address.zipCode = unimoveHub['Hub Pincode'];
            const savedAddress = await getRepository(Address).save(address);
            territory.address_id = String(address.id);
            territory.organization_id = '6268d5d11e192b13a6dd09f2'
            const savedTerritory = await this.territoryRepository.save(territory);
            console.log(savedTerritory);
            const warehouse = new Warehouse();
            warehouse.name = unimoveHub['Hub Name'];
            warehouse.code = unimoveHub['Hub Code'];
            warehouse.territory_id.push(String(savedTerritory.id));
            warehouse.organization_id = '6268d5d11e192b13a6dd09f2'
            warehouse.address_id = String(savedAddress.id);
            const savedWarehouse = await getRepository(Warehouse).save(warehouse);
            console.log(savedWarehouse);
            const bag_id = '6267970ab05883604010289e'
            const seal_id = '625d46484d1db7278d8ba88e'
            const bagInventory = new Inventory();
            bagInventory.warehouse_id = String(savedWarehouse.id);
            bagInventory.item_id = bag_id;
            bagInventory.organization_id = '6268d5d11e192b13a6dd09f2'
            bagInventory.current_qty = 0;
            bagInventory.territory_id.push(String(savedTerritory.id));
            const savedBagInventory = await getRepository(Inventory).save(bagInventory);
            console.log(savedBagInventory);
            const sealInventory = new Inventory();
            sealInventory.warehouse_id = String(savedWarehouse.id);
            sealInventory.item_id = seal_id;
            sealInventory.organization_id = '6268d5d11e192b13a6dd09f2'
            sealInventory.current_qty = 0;
            sealInventory.territory_id.push(String(savedTerritory.id));
            const savedSealInventory = await getRepository(Inventory).save(sealInventory);
            console.log(savedSealInventory);
        });

        return {
            status : 'success',
            message: 'Unimove Hubs Uploaded Successfully'
        }


    }
    // Delete Territories Created before 2022-04-27T09:14:05.095+00:00
    async deleteTerritories() {
        const date = new Date('2022-04-27T09:14:05.095+00:00');
        console.log(date);
        const territories = await this.territoryRepository.find({
            where: {
                createdAt: {
                    $lt: date
                }
            }
        });
        console.log(territories);
        territories.forEach(async (territory) => {
            await this.territoryRepository.remove(territory);
        });
        return {
            status: 'success',
            message: 'Territories Deleted Successfully'
        }
    }
}