// Nest Js Controller File for Account Entity

import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './account.entity';
import { AccountCreateDto, AccountDto, AccountUpdateDto, AccountDeleteDto } from './account.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('accounts')
export class AccountController {

    constructor(private readonly accountService: AccountService) { }

    @Get()
    findAll(): Promise<Account[]> {
        return this.accountService.findAll();
    }


    @Post()
    @UsePipes(ValidationPipe)
    save(@Body() accountCreateDto: AccountCreateDto): Promise<Account> {
        return this.accountService.save(accountCreateDto);
    }

    @Patch(':id')
    @UsePipes(ValidationPipe)
    update(@Param('id') id: string, @Body() accountUpdateDto: AccountUpdateDto): Promise<Account> {
        return this.accountService.update(id, accountUpdateDto);
    }

   

    @Delete(':id')
    delete(@Param('id') id: string): Promise<Account> {
        return this.accountService.delete(id);
    }



}
