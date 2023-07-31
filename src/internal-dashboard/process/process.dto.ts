


import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseCreateDto,BaseUpdateDto } from '../../common/base-app.dto';
import { IsBoolean, IsNotEmpty,IsEmpty,IsArray,IsLowercase,IsString, IsNumber,IsInstance,IsEnum } from 'class-validator';

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


export class CreateProcessDto extends BaseCreateDto {
  @IsNotEmpty()
  @IsLowercase()
  name: string;

  @IsNotEmpty()
  displayName?: string | "";

  @IsEnum(Status)
  @IsNotEmpty()
  status: Status |undefined;

  @IsNotEmpty()
  description?: string | "";

  @IsNotEmpty()
  minTime?: string | "";

  @IsNotEmpty()
  mostFrequentTime?: string | "";

  @IsNotEmpty()
  maxTime?: string | "";

  @IsEmpty()
  fields?: Fields[] | [];

  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateProcessDto extends BaseUpdateDto {
    @IsEmpty()
    name: string;
    displayName?: string | "";
    status: Status | Status.ACTIVE;
    minTime?: string | "";
    mostFrequentTime?: string | "";
    maxTime?: string | "";
    isDefault?: boolean;
    fields?: Fields[] | [];
    description?: string | "";
  }

//processTest
  export class CreateProcessTestDto extends BaseCreateDto {
    @IsNotEmpty()
    @IsLowercase()
    name: string;

    @IsNotEmpty()
    displayName?: string | "";

    @IsEnum(Status)
    @IsNotEmpty()
    status: Status | undefined;

    @IsNotEmpty()
    reason?: string | "";

    @IsNotEmpty()
    method?: string | "";

    @IsArray()
    @IsNotEmpty()
    instrumentUsed?: string[] | "";

    @IsArray()
    @IsNotEmpty()
    children?: string[] | "";

    @IsNotEmpty()
    maxTime?: string | "";

    @IsNotEmpty()
    formulaUsed?: string | "";

    @IsNotEmpty()
    description?: string | "";

    @IsEnum(ImportanceLevel)
    @IsNotEmpty()
    @ApiModelProperty({enum:ImportanceLevel})
    importanceLevel: ImportanceLevel | undefined;

    @IsEmpty()
    fields?: Fields[] | [];

    @IsNumber()
    @IsEmpty()
    numberOfIterations?: Number;

    @IsBoolean()
    isDefault?: boolean;
  }
  
  export class UpdateProcessTestDto extends BaseUpdateDto {
    @IsEmpty()
    name: string;

    displayName?: string | "";

    status: Status | undefined;

    reason?: string | "";

    method?: string | "";

    instrumentUsed?: string[] | "";

    children?: string[] | "";

    maxTime?: string | "";

    formulaUsed?: string | "";

    description?: string | "";

    importanceLevel: ImportanceLevel | undefined;

    @IsEmpty()
    fields?: Fields[] | [];

    numberOfIterations?: Number;

    isDefault?: boolean;
  }



//PSkuProcess connection
export class CreatePSkuProcessDto extends BaseCreateDto {
    @IsNotEmpty()
    pSkuId: string;
    @IsNotEmpty()
    processId: string;
  }

  export class UpdatePSkuProcessDto extends BaseCreateDto {
    @IsNotEmpty()
    pSkuId: string;
    @IsNotEmpty()
    processId: string;
  }
