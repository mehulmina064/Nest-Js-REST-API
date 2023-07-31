import { IsBoolean,IsNotEmpty,IsEmail } from 'class-validator';
import { BaseCreateDto,BaseUpdateDto } from '../../common/base-app.dto';


  export class CreateEmployeeDto extends BaseCreateDto {
    @IsNotEmpty()
    contactNumber: string;
    @IsNotEmpty()
    password: string; 
    @IsNotEmpty()
    name: string;
    @IsNotEmpty()
    designation: string;
    @IsEmail()
    email: string;
  }

