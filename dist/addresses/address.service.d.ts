import { User } from './../users/user.entity';
import { Repository } from 'typeorm';
import { Address } from './address.entity';
export declare class AddressService {
    private readonly addressRepository;
    constructor(addressRepository: Repository<Address>);
    findAll(user: User): Promise<Address[]>;
    findOne(id: string): Promise<Address>;
    save(address: Address): Promise<Address>;
    findByOrg(orgId: String): Promise<Address[]>;
    update(id: any, address: Address): Promise<Address>;
    remove(id: any): Promise<void>;
    findAllUserAddresses(userId: any): Promise<Address[]>;
    getAddressAsString(address: Address): Promise<string>;
}
