import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from './user.entity';
import { UserController } from './user.controller';
import { MailModule } from '../mail/mail.module';
import { AuthenticationModule } from '../authentication/authentication.module';
import { Organization } from '../organization/organization.entity';
import { OrganizationService } from './../organization/organization.service';


@Module({
    imports: [forwardRef(() => AuthenticationModule),TypeOrmModule.forFeature([User]), MailModule, TypeOrmModule.forFeature([ Organization])],
    providers: [UserService,OrganizationService],
    controllers: [UserController],
    exports: [UserService],
  })
  export class UserModule {}
