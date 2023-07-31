// Account Entity DTO

export class AccountDto {
    id!: string;
    account_no!: string;
    status!: string;
    createdAt!: string;
    updatedAt!: string;
    deletedAt!: string;
    createdBy!: string;
    updatedBy!: string;
    deletedBy!: string;
    }

export class AccountCreateDto {
    name!: string;
    account_no!: string;
    status!: string;
    createdAt!: string;
    updatedAt!: string;
    deletedAt!: string;
    createdBy!: string;
    updatedBy!: string;
    deletedBy!: string;    }


export class AccountUpdateDto {    
    status!: string;
    updatedAt!: string;
    deletedAt!: string;
    updatedBy!: string;
    deletedBy!: string;    }
    

export class AccountDeleteDto {
    id!: string;
    }

