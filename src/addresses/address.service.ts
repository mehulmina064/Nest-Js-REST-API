import { UserRole } from './../users/roles.constants';
import { UnimoveFilter } from '../inventory/unimove.filter';
import { User } from './../users/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Address } from './address.entity';
// tslint:disable-next-line:no-var-requires
const crypto = require('crypto');

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepository: Repository<Address>,
  ) {
  }

  async findAll(user:User): Promise<Address[]> {
    if (user.roles.includes(UserRole.PRODO)) {
    return await this.addressRepository.find();
    }
    let filter = {};
    filter = UnimoveFilter(user);
    return await this.addressRepository.find({where:filter});

  }

  async findOne(id: string): Promise<Address> {
    return await this.addressRepository.findOne(id);
  }

  async save(address: Address) {
    return await this.addressRepository.save(address);
  }
  async findByOrg(orgId:String): Promise<Address[]> {
    return await this.addressRepository.find({ where: { organization_id : orgId } });
  }

  async update(id, address: Address) {
    await this.addressRepository.update(id, address);
    return this.findOne(id);
  }

  async remove(id) {
    const user = this.addressRepository.findOne(id).then(result => {
      this.addressRepository.delete(result);
    });
  }

  async findAllUserAddresses(userId): Promise<Address[]> {
    return await this.addressRepository.find({ userId });
  }

  async getAddressAsString(address: Address): Promise<string> {
    const addressString = `${address.companyName},${address.addressLine1},${address.addressLine2},${address.addressLine3}, ${address.city}, ${address.state}, ${address.zipCode}, ${address.country}`;
    return addressString;
  }
}
