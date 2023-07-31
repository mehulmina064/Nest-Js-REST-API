


import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseCreateDto,BaseUpdateDto } from '../../common/base-app.dto';
import { IsBoolean, IsNotEmpty,IsEmpty,IsArray, IsLowercase, IsEnum } from 'class-validator';

export enum Status {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    DELETED = 'DELETED',
  }

export class CreateLogisticDto extends BaseCreateDto {
  @IsNotEmpty()
  @IsLowercase()
  name: string;
  @IsNotEmpty()
  displayName?: string | "";
  status: Status | Status.ACTIVE;
  description?: string | "";
  @IsNotEmpty()
  apiUrl?: string | "";
  @IsNotEmpty()
  trackingUrl?: string | "";
  @IsNotEmpty()
  rating?: Number;
}

export class UpdateLogisticDto extends BaseUpdateDto {
    @IsEmpty()
    name: string;
    displayName?: string | "";
    @IsEnum(Status)
    status: Status | Status.ACTIVE;
    description?: string | "";
    apiUrl?: string | "";
    trackingUrl?: string | "";
    rating?: Number;

}
