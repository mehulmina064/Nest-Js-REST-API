import { forwardRef, Module } from '@nestjs/common';
import { AuthenticationService } from './authentication.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './local.strategy';
import { ILocalStrategy } from './internal-local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';
import { JwtStrategy } from './jwt.strategy';
import { IJwtStrategy } from './internal-jwt.strategy';
import { UserModule } from '../users/user.module';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    forwardRef(() => UserModule), 
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthenticationService, LocalStrategy, JwtStrategy,ILocalStrategy,IJwtStrategy, {
  // providers: [AuthenticationService, LocalStrategy, JwtStrategy,{
    provide: 'AUTH_GUARD',
    useClass: RolesGuard, 
  }],
  exports: [AuthenticationService],
})
export class AuthenticationModule {
}
