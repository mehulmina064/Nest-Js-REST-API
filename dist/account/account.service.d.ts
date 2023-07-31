import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { AccountCreateDto, AccountUpdateDto } from './account.dto';
export declare class AccountService {
    private readonly accountRepository;
    updatePassword(id: string, accountUpdateDto: AccountUpdateDto): Promise<Account>;
    save(accountCreateDto: AccountCreateDto): Promise<Account>;
    constructor(accountRepository: Repository<Account>);
    findAll(): Promise<Account[]>;
    findOne(id: string): Promise<any>;
    create(accountCreateDto: AccountCreateDto): Promise<Account>;
    update(id: string, accountUpdateDto: AccountUpdateDto): Promise<Account>;
    delete(id: string): Promise<any>;
    findByName(name: string): Promise<any>;
}
