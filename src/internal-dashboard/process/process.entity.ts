import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../../common/base-app.entity';



export enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
  }


export enum ImportanceLevel {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
  }


  export enum DataType {
    //add all data types
    STRING = 'STRING',
    NUMBER = 'NUMBER',
    BOOLEAN = 'BOOLEAN',
    DATE = 'DATE',
    ANY= 'ANY',
    FILE="FILE"

  }

  export class Fields{
    @ApiModelProperty()
    @Column()
    name?: string | "";

    @ApiModelProperty()
    @Column()
    apiName?: string | "";

    @ApiModelProperty()
    @Column({
        type: 'enum',
        enum: DataType,
        default: DataType.STRING,
    })
    dataType: DataType | undefined;

    @ApiModelProperty()
    @Column()
    value?: any | any;

    @ApiModelProperty()
    @Column()
    isEnabled?: boolean | false;

    @ApiModelProperty()
    createdAt?: Date;

    @ApiModelProperty()
    updatedAt?: Date;

}


@Entity('Process')
export class process extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    name?: string | "";

    @ApiModelProperty()
    @Column()
    displayName?: string | "";

    @ApiModelProperty()
    @Column()
    minTime?: string | "";

    @ApiModelProperty()
    @Column()
    mostFrequentTime?: string | "";

    @ApiModelProperty()
    @Column()
    maxTime?: string | "";


    @ApiModelProperty()
    @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE,
    })
    status: Status | undefined;

    @ApiModelProperty()
    @Column()
    isDefault?: boolean | false;

    @ApiModelProperty()
    @Column()
    fields?: Fields[] | [];
    

    @ApiModelProperty()
    @Column()
    description?: string | "";

    

    //add created by updated by and also edited by

}



//PSkuProcess

@Entity('PSkuProcess')
export class PSkuProcess extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    pSkuId?: string | "";

    @ApiModelProperty()
    @Column()
    processId?: string | "";

}
