


import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseCreateDto,BaseUpdateDto } from '../../common/base-app.dto';
import { IsBoolean, IsNotEmpty,IsEmpty,IsArray,IsLowercase,IsString, IsNumber,IsInstance,IsEnum } from 'class-validator';

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

//Fields
export class CreateFieldDto extends BaseCreateDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    @IsLowercase()
    apiName: string;
    @IsEnum(DataType)
    @IsNotEmpty()
    dataType: DataType ;
    @IsNotEmpty()
    value: any;
  }

  export class UpdateFieldDto extends BaseCreateDto {
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    @IsLowercase()
    apiName: string;
    @IsEmpty()
    dataType: DataType ;
    @IsNotEmpty()
    value: any;
  }



//Batch
  export class CreateBatchItemDto extends BaseCreateDto {
    @IsNotEmpty()
    @IsLowercase()
    name: string | "";

    @IsNotEmpty()
    itemId?: string | "";

    @IsNotEmpty()
    @ApiModelProperty({required:true})
    batchId?: string | "";

    @IsNotEmpty()
    @ApiModelProperty({required:true})
    purchaseOrderId?: string | "";

    @IsNotEmpty()
    @ApiModelProperty({required:true})
    sku?: string | "";


    @IsEnum(Status)
    @IsNotEmpty()
    status: Status | undefined;

    @IsNotEmpty()
    assignedTo?: string | "";

    @IsNotEmpty()
    dueDate?: string | "";

    @IsEmpty()
    completionDate?: string | "";

    @IsNotEmpty()
    description?: string | "";

    @IsNotEmpty()
    @IsNumber()
    quantity?: Number | "";

    @IsEmpty()
    fields?: Fields[] | [];
  }
  
  export class UpdateBatchItemDto extends BaseUpdateDto {
    @IsEmpty()
    itemId?: string | "";

    purchaseOrderId?: string | "";

    batchId?: string | "";

    sku?: string | "";


    name?: string | "";

    status: Status | undefined;

    assignedTo?: string | "";

    dueDate?: string | "";

    completionDate?: string | "";

    quantity?: Number | "";

    description?: string | "";

  }

//BatchItemProcess connection
export class CreateBatchItemProcessDto extends BaseCreateDto {
    @IsNotEmpty()
    @ApiModelProperty()
    batchItemId: string;
    @IsNotEmpty()
    @ApiModelProperty()
    processId: string;
    @IsEnum(Status)
    @IsNotEmpty()
    @ApiModelProperty({enum:Status})
    status: Status | undefined;

    @IsNotEmpty()
    @ApiModelProperty()
    assignedTo?: string | "";

    @IsNotEmpty()
    @ApiModelProperty()
    dueDate?: string | "";


    @IsEmpty()
    @ApiModelProperty()
    completionDate?: string | "";

    @IsNotEmpty()
    @ApiModelProperty({isArray:true,description:"string of link",type:String})
    documents?: String[] | [];


    @IsNotEmpty()
    @ApiModelProperty()
    description?: string | "";

    @IsNotEmpty()
    @ApiModelProperty()
    details: {} = {}; //clone of process
  }

  export class UpdateBatchItemProcessDto extends BaseCreateDto {
    @IsNotEmpty()
    @ApiModelProperty()
    batchItemId: string; 
    @IsNotEmpty() 
    @ApiModelProperty()
    processId: string;

    @ApiModelProperty()
    status: Status | undefined;

    @ApiModelProperty()
    assignedTo?: string | "";

    @ApiModelProperty()
    dueDate?: string | "";

    @ApiModelProperty()
    completionDate?: string | "";

    @ApiModelProperty({isArray:true})
    documents?: String[] | [];

    @ApiModelProperty()
    description?: string | "";

    @ApiModelProperty()
    details: {} = {}; //clone of process


  }
