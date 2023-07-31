


import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseCreateDto,BaseUpdateDto } from '../../common/base-app.dto';
import { IsBoolean, IsNotEmpty,IsEmpty,IsArray, IsLowercase, IsEnum } from 'class-validator';

export enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
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
        enum: Status,
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


export class CreatePTypeDto extends BaseCreateDto {
  @IsNotEmpty()
  @IsLowercase()
  name: string;
  @IsNotEmpty()
  displayName?: string | "";
  status: Status | Status.ACTIVE;
  description?: string | "";
  @IsEmpty()
  fields?: Fields[] | [];
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdatePTypeDto extends BaseUpdateDto {
    @IsEmpty()
    name: string;
    displayName?: string | "";

    @IsEnum(Status)
    @IsNotEmpty()
    status: Status | Status.ACTIVE;
    @IsBoolean()
    isDefault?: boolean;
    @IsEmpty()
    fields?: Fields[] | [];
    description?: string | "";
  }


