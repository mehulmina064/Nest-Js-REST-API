import { UserService } from '../users/user.service';
import { zohoEmployeeService } from '../internal-dashboard/zohoEmployee/zohoEmployee.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthenticationService {
    private userService;
    private zohoEmployeeService;
    private jwtService;
    constructor(userService: UserService, zohoEmployeeService: zohoEmployeeService, jwtService: JwtService);
    validateUser(email: string, password: string): Promise<any>;
    login(user: any): Promise<any>;
    IvalidateUser(email: string, password: string): Promise<any>;
    Ilogin(user: any): Promise<any>;
}
