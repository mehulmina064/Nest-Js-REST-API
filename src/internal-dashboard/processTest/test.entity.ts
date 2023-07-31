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

export class TestValues  {
    
    @ApiModelProperty()
    @Column()
    name?: string | "";

    @ApiModelProperty()
    @Column()
    unit?: string | "";

    @ApiModelProperty()
    @Column()
    PositiveApprovalTolerance?: string | "";

    @ApiModelProperty()
    @Column()
    NegativeApprovalTolerance?: string | "";

    @ApiModelProperty()
    @Column()
    PositiveTolerableTolerance?: string | "";

    @ApiModelProperty()
    @Column()
    NegativeTolerableTolerance?: string | "";

    @ApiModelProperty()
    @Column()
    chronological_order?: string | "";

    @ApiModelProperty()
    @Column()
    description?: string | "";

    @ApiModelProperty()
    createdAt?: Date;

    @ApiModelProperty()
    updatedAt?: Date;

    @ApiModelProperty()
    @Column()
    createdBy: string | undefined;

    @ApiModelProperty()
    @Column()
    updatedBy: string | undefined;


}


@Entity('Tests')
export class Test extends BaseAppEntity {
    
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
    reason?: string | "";

    @ApiModelProperty()
    @Column()
    method?: string | "";

    @ApiModelProperty()
    @Column()
    instrumentUsed?: string[] | [];

    @ApiModelProperty()
    @Column()
    children?: string[] | []; //children ids

    @ApiModelProperty()
    @Column()
    numberOfIterations?: Number | 0;

    @ApiModelProperty()
    @Column()
    formulaUsed?: string | "";

    @ApiModelProperty()
    @Column({
        type: 'enum',
        enum: ImportanceLevel,
        default: ImportanceLevel.MEDIUM,
    })
    importanceLevel: ImportanceLevel | undefined;


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
    testValues?: TestValues[] | [];
    

    @ApiModelProperty()
    @Column()
    description?: string | "";

    

    //add created by updated by and also edited by

}


//TestProcess

@Entity('TestProcess')
export class TestProcess extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    testId?: string | "";

    @ApiModelProperty()
    @Column()
    processId?: string | "";

    
}