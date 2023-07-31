import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../../common/base-app.entity';
import { UserRole } from './prodoRoles.constants';


export class EmailId{
    @ApiModelProperty()
    @Column()
    email?: string | "";

    @ApiModelProperty()
    @Column()
    is_selected?: boolean | false;

}

export enum ZohoEmployeeStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    DELETED = 'deleted',
  }

// export enum YourStatus {
//     AVAILABLE = 'AVAILABLE',
//     BUSY = 'BUSY',
//     DND = 'DND',
//     AWAY = 'AWAY',
//   }

export enum UserType {
    "ZOHO" = "zoho",
    "PRODO" = "prodo",
  }


@Entity('ZohoEmployee')
export class zohoEmployee extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    lastLoginAt?: Date;

    @Unique(['zohoUserId'])
    @ApiModelProperty()
    @Column()
    zohoUserId?: string | "";  

    // @Unique(['prodoUserId'])
    // @ApiModelProperty()
    // @Column()
    // prodoUserId?: string | "";  

    @ApiModelProperty()
    @Column({
    type: 'enum',
    enum: UserRole,
    default: [UserRole.USER, UserRole.CLIENT],
     })
    roles!: UserRole[];

    // @ApiModelProperty()
    // @Column()
    // employeeId?: string | ""; 

    @ApiModelProperty()
    @Column()
    contactNumber?: string | ""; 

    @ApiModelProperty()
    @Column()
    password?: string | ""; 

    @ApiModelProperty()
    @Column()
    name?: string | "";

    @ApiModelProperty()
    @Column()
    otp: string | undefined;
  
    @ApiModelProperty()
    @Column()
    emailIds?: EmailId[] | [];

    @ApiModelProperty()
    @Column({
        type: 'enum',
        enum: ZohoEmployeeStatus,
        default: ZohoEmployeeStatus.ACTIVE,
    })
    status: ZohoEmployeeStatus | undefined;

    // @ApiModelProperty()
    // @Column()
    // userRoles?: [] | [];//{id: string,name: string}

    @ApiModelPropertyOptional()
    @Column()
    teams?: string[] = []; //{id: string,name: string}

    @ApiModelProperty()
    @Column()
    designation?: string | "";
    
    @ApiModelProperty()
    @Column({
        type: 'enum',
        enum: UserType,
        default: UserType.ZOHO,
    })
    type: UserType | undefined;

    @ApiModelProperty()
    @Column()
    profile?: string | "https://prodo-files-upload.s3.ap-south-1.amazonaws.com/files/profile-pic.jpeg";

    @ApiModelProperty()
    @Column()
    dateOfBerth?: string | "";

    @ApiModelProperty()
    @Column()
    isEmployee?: boolean | false;

    @ApiModelProperty()
    @Column()
    email?: string | ""; //selected email

    @ApiModelProperty()
    @Column()
    associatedClients?: [] | [];//{zohoId: string,email: string}

    
    //add created by updated by and also edited by

}
