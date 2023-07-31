import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../../common/base-app.entity';


//Not Started, In Progress, On hold, Over Due, Complete, Needs Review
export enum Status {
    NotStarted='NotStarted',
    InProgress='InProgress',
    OnHold='OnHold',
    OverDue='OverDue',
    Complete='Complete',
    NeedsReview='NeedsReview',
    Pending='Pending'
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



@Entity('FulfillmentTracker')
export class FulfillmentTracker extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    @ApiModelProperty()
    @Column()
    name?: string | "";

    @ApiModelProperty()
    @Column()
    customerName?: string | "";

    @ApiModelProperty()
    @Column()
    companyName?: string | "";

    @ApiModelProperty()
    @Column()
    salesOrderId?: string | "";

    @ApiModelProperty()
    @Column()
    salesOrderNumber?: string | "";

    @ApiModelProperty()
    @Column()
    businessLead?: string | "";

    @ApiModelProperty()
    @Column()
    fulfillmentLead?: string | "";

    @ApiModelProperty()
    @Column()
    productionDate?: string | "";

    @ApiModelProperty()
    @Column()
    fulfillmentDate?: string | "";

    @ApiModelProperty()
    @Column()
    clientPurchaseOrderDate?: string | "";


    @ApiModelProperty()
    @Column()
    completionDate?: string | "";


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


