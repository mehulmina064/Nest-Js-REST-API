import { AccountService } from './account.service';
import { Account } from './account.entity';
import { AccountCreateDto, AccountUpdateDto } from './account.dto';
export declare class AccountController {
    private readonly accountService;
    constructor(accountService: AccountService);
    findAll(): Promise<Account[]>;
    save(accountCreateDto: AccountCreateDto): Promise<Account>;
    update(id: string, accountUpdateDto: AccountUpdateDto): Promise<Account>;
    delete(id: string): Promise<Account>;
}
