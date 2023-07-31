


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
    @ApiModelProperty()
    name: string;

    @IsNotEmpty()
    @IsLowercase()
    @ApiModelProperty()
    apiName: string;

    @IsEnum(DataType)
    @IsNotEmpty()
    @ApiModelProperty({enum:DataType})
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
  export class CreateBatchDto extends BaseCreateDto {
    @IsNotEmpty()
    @IsLowercase()
    @ApiModelProperty({required:true})
    name: string;

    @IsNotEmpty()
    @ApiModelProperty({required:true})
    salesOrderId?: string | "";

    @IsEnum(Status)
    @IsNotEmpty()
    @ApiModelProperty({enum:Status})
    status: Status | undefined;

    @IsNotEmpty()
    @ApiModelProperty({required:true})
    assignedTo?: string | "";

    @IsNotEmpty()
    @ApiModelProperty({required:true})
    dueDate?: string | "";


    @IsEmpty()
    @ApiModelProperty({required:false})
    completionDate?: string | "";


    @IsNotEmpty()
    @ApiModelProperty({required:true})
    description?: string | "";

    @IsNotEmpty()
    @ApiModelProperty({required:true,description:"Must be array",type:Fields,isArray:true})
    fields?: Fields[] | [];

    
  }
  
  export class UpdateBatchDto extends BaseUpdateDto {
    @IsEmpty()
    salesOrderId: string;

    @ApiModelProperty()
    name?: string | "";

    @ApiModelProperty({enum:Status})
    status: Status | undefined;

    @ApiModelProperty()
    assignedTo?: string | "";

    @ApiModelProperty()
    dueDate?: string | "";

    @ApiModelProperty()
    completionDate?: string | "";

    @ApiModelProperty()
    description?: string | "";

  }

//TestProcess connection
export class CreateBatchItemConnectionDto extends BaseCreateDto {
    @IsNotEmpty()
    @ApiModelProperty()
    batchId: string;
    @IsNotEmpty()
    @ApiModelProperty()
    batchItemId: string;
  }

  export class UpdateBatchItemConnectionDto extends BaseCreateDto {
    @IsNotEmpty()
    @ApiModelProperty()
    batchId: string;
    @IsNotEmpty()
    @ApiModelProperty()
    batchItemId: string;

  }
