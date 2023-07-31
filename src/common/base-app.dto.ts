
import { IsBoolean, IsNotEmpty,IsEmpty,IsArray,IsDate,IsString } from 'class-validator';

export class BaseCreateDto {

    additionalData:[];

    createdAt: Date;

    updatedAt: Date;

    deletedAt: Date;

    createdBy: string | undefined;

    updatedBy: string | undefined;

    deletedBy: string | undefined;
}

export class BaseUpdateDto {
    additionalData:[];

    createdAt: Date;

    updatedAt: Date;

    deletedAt: Date;

    createdBy: string | undefined;

    updatedBy: string | undefined;

    deletedBy: string | undefined;
    
  }
  

