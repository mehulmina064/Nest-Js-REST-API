


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


  //testValues
  export class CreateTestValueDto extends BaseCreateDto {
    @IsNotEmpty()
    @IsLowercase()
    name: string;

    @IsNotEmpty()
    unit: string ;

    @IsNotEmpty()
    PositiveApprovalTolerance: string ;

    @IsNotEmpty()
    NegativeApprovalTolerance: string ;

    @IsNotEmpty()
    PositiveTolerableTolerance: string ;

    @IsNotEmpty()
    NegativeTolerableTolerance: string ;

    @IsNotEmpty()
    chronological_order: string ;

    @IsNotEmpty()
    createdBy: string ;

    @IsNotEmpty()
    updatedBy: string ;

    @IsNotEmpty()
    description: string;
  }

  export class UpdateTestValueDto extends BaseCreateDto {
    @IsNotEmpty()
    @IsLowercase()
    name: string;

    unit: string ;

    PositiveApprovalTolerance: string ;

    NegativeApprovalTolerance: string ;

    PositiveTolerableTolerance: string ;

    NegativeTolerableTolerance: string ;

    chronological_order: string ;

    createdBy: string ;

    updatedBy: string ;

    description: string;
  }


//Test
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

    @IsNotEmpty()
    importanceLevel: ImportanceLevel | undefined;

    @IsEmpty()
    // @IsArray()
    fields?: Fields[] | [];

    @IsEmpty()
    // @IsArray()
    testValues?: TestValues[] | [];

    @IsNumber()
    // @IsEmpty()
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

    @IsEmpty()
    testValues?: TestValues[] | [];

    numberOfIterations?: Number;

    isDefault?: boolean;
  }

//TestProcess connection
export class CreateTestProcessDto extends BaseCreateDto {
    @IsNotEmpty()
    testId: string;
    @IsNotEmpty()
    processId: string;
  }

  export class UpdateTestProcessDto extends BaseCreateDto {
    @IsNotEmpty()
    testId: string;
    @IsNotEmpty()
    processId: string;
  }
