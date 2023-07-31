
import { Column, Entity, ObjectID, ObjectIdColumn,Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseCreateDto,BaseUpdateDto } from '../../../common/base-app.dto';
import { IsBoolean, IsNotEmpty,IsEmpty,IsArray,IsLowercase,IsString, IsNumber,IsInstance,IsEnum } from 'class-validator';

//PSkuProcess connection
export class CreateProductPSkuDto extends BaseCreateDto {
    @IsNotEmpty()
    pSkuId: string;
    @IsNotEmpty()
    productSku: string;
  }

  export class UpdateProductPSkuDto extends BaseCreateDto {
    @IsNotEmpty()
    pSkuId: string;
    @IsNotEmpty()
    productSku: string;
  }