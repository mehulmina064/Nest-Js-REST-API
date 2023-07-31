//Create Account Service File

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Account } from './account.entity';
import { AccountCreateDto, AccountDto, AccountUpdateDto,AccountDeleteDto } from './account.dto';


@Injectable()
export class AccountService {
    updatePassword(id: string, accountUpdateDto: AccountUpdateDto): Promise<Account> {
        throw new Error('Method not implemented.');
    }
    save(accountCreateDto: AccountCreateDto): Promise<Account> {
        throw new Error('Method not implemented.');
    }

    constructor(
        @InjectRepository(Account)
        private readonly accountRepository: Repository<Account>,
    ) { }

    async findAll(): Promise<Account[]> {
        return await this.accountRepository.find();
    }

    async findOne(id: string): Promise<any>  {
        return await this.accountRepository.findOne(id);
    }

    async create(accountCreateDto: AccountCreateDto): Promise<Account> {
        const account = new Account();
        account.name = accountCreateDto.name;
        return await this.accountRepository.save(account);
    }

    async update(id: string, accountUpdateDto: AccountUpdateDto): Promise<Account> {
        const account : any = await this.accountRepository.findOne(id);
        account.name = accountUpdateDto.name;
        return await this.accountRepository.save(account);
    }

    async delete(id: string): Promise<any> {
        const account: any = await this.accountRepository.findOne(id);
        return await this.accountRepository.remove(account);
    }

    async findByName(name: string): Promise<any> {
        return await this.accountRepository.findOne({ name: name });
    }
}
