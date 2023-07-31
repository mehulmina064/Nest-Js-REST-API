import { forwardRef, Module } from '@nestjs/common';
import { zohoEmployee } from './zohoEmployee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Otp } from '../../users/otp.entity';
import { salesOrderReview } from '../../users/salesOrderReview.entity';
import { AuthenticationModule } from '../../authentication/authentication.module';


import { MailModule } from '../../mail/mail.module';
import { MailTriggerModule } from '../../mailTrigger/mailTrigger.module';
import { zohoEmployeeService } from './zohoEmployee.service';
import { zohoEmployeeController } from './zohoEmployee.controller';
import { employeeOtp } from './employeeOtp.entity';

import { zohoToken } from '../../sms/token.entity'; 
import { Account } from '../../account/account.entity';

//import UserRoles
import { userRolesService } from '../prodoRoles/userRoles.service';
import { prodoRolesService } from '../prodoRoles/prodoRoles.service';
import { prodoRoles } from '../prodoRoles/prodoRoles.entity';
import { UserAndRoles } from '../prodoRoles/EmployeeAndRoles.entity';

//import UserTeams
import { internalTeamService } from '../team/team.service'
import { userTeamService } from '../team/userTeam.service'
import { internalTeam } from '../team/team.entity';
import { UserAndTeam } from '../team/EmployeeAndTeam.entity';

//middleware import
import { MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { roleMiddleware } from '../authentication/middleware';
import { RolesAndPermission } from '../prodoPermissionAndGroup/prodoRolesAndPermissionGroups.entity';
import { prodoPermissionGroup } from '../prodoPermissionAndGroup/prodoPermissionGroup.entity';
import { rolesPermissionGroupService } from '../prodoPermissionAndGroup/rolesPermission.service';
import { prodoPermissionService } from '../prodoPermissionAndGroup/prodoPermission.service'; 


@Module({
  imports : [TypeOrmModule.forFeature([zohoEmployee,zohoToken,employeeOtp,Otp,Account,salesOrderReview,prodoRoles,UserAndRoles,internalTeam,UserAndTeam,RolesAndPermission,prodoPermissionGroup]),MailModule,MailTriggerModule,AuthenticationModule],
  controllers: [zohoEmployeeController],
  providers: [zohoEmployeeService,userRolesService,userRolesService,prodoRolesService,internalTeamService,userTeamService,rolesPermissionGroupService,prodoPermissionService],
  exports: [ zohoEmployeeService,userRolesService,prodoRolesService,internalTeamService,userTeamService,prodoPermissionService,rolesPermissionGroupService, TypeOrmModule.forFeature([zohoEmployee])],
})
export class zohoEmployeeModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(roleMiddleware)
      .exclude(
        { path: 'internal/employee/profile', method: RequestMethod.PATCH },
        { path: 'internal/employee/setProfilePicture', method: RequestMethod.POST },
        { path: 'internal/employee/login', method: RequestMethod.POST },
        { path: 'internal/employee/forgotPassword', method: RequestMethod.POST },
        { path: 'internal/employee/resetPassword', method: RequestMethod.POST },
        { path: 'internal/employee/signUp', method: RequestMethod.POST },
        { path: 'internal/employee/profile', method: RequestMethod.PATCH },
        { path: 'internal/employee/profile', method: RequestMethod.GET },
        { path: 'internal/employee/profile/password', method: RequestMethod.PATCH },
        // { path: 'internal/employee/password/:id', method: RequestMethod.PATCH },


        // 'employee/(.*)',                                                                        //* will check in the future*/
      )
      .forRoutes(zohoEmployeeController);
  }

} 
