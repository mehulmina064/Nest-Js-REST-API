import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../../common/base-app.entity';



export enum Status {
    NotStarted='NotStarted',
    InProgress='InProgress',
    OnHold='OnHold',
    OverDue='OverDue',
    Complete='Complete',
    NeedsReview='NeedsReview'
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


@Entity('BatchItem')
export class BatchItem extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    name?: string | "";

    @ApiModelProperty()
    @Column()
    itemId?: string | "";

    @ApiModelProperty()
    @Column()
    batchId?: string | "";

    @ApiModelProperty()
    @Column()
    purchaseOrderId?: string | "";


    @ApiModelProperty()
    @Column()
    sku?: string | "";

    @ApiModelProperty()
    @Column()
    assignedTo?: string | "";

    @ApiModelProperty()
    @Column()
    completionDate?: string | "";//add two items with same name when same item come from two different purchase orders
    
    @ApiModelProperty()
    @Column()
    quantity?: Number | 0;

    @ApiModelProperty()
    @Column()
    dueDate?: string | undefined; //children ids


    @ApiModelProperty()
    @Column({
        type: 'enum',
        enum: Status,
        default: Status.NotStarted,
    })
    status: Status | undefined;


    @ApiModelProperty()
    @Column()
    fields?: Fields[] | [];


    @ApiModelProperty()
    @Column()
    description?: string | "";

    

    //add created by updated by and also edited by

}


//TestProcess

@Entity('BatchItemProcess')
export class BatchItemProcess extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    batchItemId?: string | "";

    @ApiModelProperty()
    @Column()
    processId?: string | "";

    @ApiModelProperty()
    @Column()
    assignedTo?: string | "";

    @ApiModelProperty()
    @Column()
    dueDate?: string | "";

    @ApiModelProperty()
    @Column({
        type: 'enum',
        enum: Status,
        default: Status.NotStarted,
    })
    status: Status | undefined;

    @ApiModelProperty()
    @Column()
    completionDate?: string | "";//add two items with same name when same item come from two different purchase orders

    @ApiModelProperty()
    @Column()
    documents?: string[] | [];

    @ApiModelProperty()
    @Column()
    description?: string | "";

    @ApiModelProperty()
    @Column()
    details: {} = {}; //clone of process
    
}