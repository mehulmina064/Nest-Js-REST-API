import { Injectable } from '@nestjs/common';
import { UserService } from '../users/user.service';

import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';

@Injectable()
export class AuthenticationService {
  constructor(private userService: UserService, private jwtService: JwtService) {
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.login({ email, password });
    // console.log("in validate",user)
    if (user && user.status === 'success') {
      return user.user;
    }
    return null;
  }

  async login(user: any): Promise<any> {
    // console.log("in old user ",user);
    
    const payload = { id: user.id, roles: user.roles, organization_id: user.organization_id, accountId: user.accountId, territory_id : user.territory_id };
    return {
      status: 'success',
      access_token: this.jwtService.sign(payload), 
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
        territory_id : user.territory_id,
        organization_id: user.organization_id,
        accountId: user.accountId,
        status: user.status,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
      };
      }   


}
