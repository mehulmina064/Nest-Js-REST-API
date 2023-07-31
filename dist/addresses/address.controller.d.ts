import { AddressService } from './address.service';
import { Address } from './address.entity';
import { User } from '../users/user.entity';
import { Repository } from 'typeorm';
export declare class AddressController {
    private readonly addressService;
    private readonly userRepository;
    constructor(addressService: AddressService, userRepository: Repository<User>);
    findAll(req: any): Promise<Address[]>;
    findAllUserAddresses(userId: string): Promise<Address[]>;
    findByOrg(id: string): Promise<Address[]>;
    save(address: Address, req: any): Promise<Address>;
    update(id: string, address: Address): Promise<Address>;
    delete(id: any): Promise<void>;
    getAddressAsString(id: string): any;
    fixAddress(req: any): Promise<void>;
    findOne(id: string): Promise<Address>;
}
