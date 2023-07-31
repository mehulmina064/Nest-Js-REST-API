import { BaseCreateDto } from '../../common/base-app.dto';
export declare class CreateEmployeeDto extends BaseCreateDto {
    contactNumber: string;
    password: string;
    name: string;
    designation: string;
    email: string;
}
