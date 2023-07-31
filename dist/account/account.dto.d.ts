export declare class AccountDto {
    id: string;
    account_no: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    createdBy: string;
    updatedBy: string;
    deletedBy: string;
}
export declare class AccountCreateDto {
    name: string;
    account_no: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string;
    createdBy: string;
    updatedBy: string;
    deletedBy: string;
}
export declare class AccountUpdateDto {
    status: string;
    updatedAt: string;
    deletedAt: string;
    updatedBy: string;
    deletedBy: string;
}
export declare class AccountDeleteDto {
    id: string;
}
