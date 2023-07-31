import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { zohoEmployee } from '../internal-dashboard/zohoEmployee/zohoEmployee.entity';
import { User } from '../users/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authenticationService: AuthenticationService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string): Promise<User> {
    console.log("user - strategy")
    return this.authenticationService.validateUser(email, password);
  }

  
}
