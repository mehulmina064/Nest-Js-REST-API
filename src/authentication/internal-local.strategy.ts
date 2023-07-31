import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { zohoEmployee } from '../internal-dashboard/zohoEmployee/zohoEmployee.entity';
import { User } from '../users/user.entity';

@Injectable()
export class ILocalStrategy extends PassportStrategy(Strategy,'internal') {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'email',
    });
  }

  // async validate(email: string, password: string): Promise<User> {
  //   console.log("new")
  //   return this.authenticationService.validateUser(email, password);
  // }

  async validate(email: string, password: string): Promise<zohoEmployee> {
    console.log("employee - strategy")

    return this.authenticationService.IvalidateUser(email, password);
  }
  
}
