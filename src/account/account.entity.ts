// Account Entity File
// NestJS TypeORM Entity File
// Language: typescript
import { Column, Entity, ObjectID, ObjectIdColumn, Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from "@nestjs/swagger";
import { BaseAppEntity } from '../common/common.entity';

export enum AccountType {
    // Account Type
    "INTERNAL" = "INTERNAL",
    "EXTERNAL" = "EXTERNAL",
  }
  
@Entity("accounts")
export class Account extends BaseAppEntity {
    @ApiModelPropertyOptional()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    account_no: string | undefined;

    @ApiModelProperty()
    @Column({
        type: 'enum',
        enum: AccountType,
        default: AccountType.EXTERNAL,
    })
    type: AccountType | undefined;

    @ApiModelProperty()
    @Column()
    email: string | undefined;

    @ApiModelProperty()
    @Column()
    status: string | undefined;

    }
