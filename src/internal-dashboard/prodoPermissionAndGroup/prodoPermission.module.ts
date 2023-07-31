import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { prodoPermissionGroup } from './prodoPermissionGroup.entity';
import { prodoPermissionService } from './prodoPermission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailModule } from '../../mail/mail.module';
import { MailTriggerModule } from '../../mailTrigger/mailTrigger.module';
import { prodoPermissionController } from './prodoPermission.controller';
import { zohoToken } from '../../sms/token.entity'; 
import {zohoEmployeeModule} from './../zohoEmployee/zohoEmployee.module';
import { RolesAndPermission } from './prodoRolesAndPermissionGroups.entity';
import { rolesPermissionGroupService } from './rolesPermission.service';
import { userRolesController } from './rolePermission.controller';
import { prodoRolesService } from '../prodoRoles/prodoRoles.service';
import { prodoRoles } from '../prodoRoles/prodoRoles.entity';
import { roleMiddleware } from '../authentication/middleware';




@Module({
  controllers: [prodoPermissionController,userRolesController],
  providers: [prodoPermissionService,rolesPermissionGroupService,prodoRolesService],
  imports : [TypeOrmModule.forFeature([prodoPermissionGroup,zohoToken,RolesAndPermission,prodoRoles]),MailModule,MailTriggerModule,zohoEmployeeModule],
  exports: [ prodoPermissionService,rolesPermissionGroupService,prodoRolesService , TypeOrmModule.forFeature([prodoPermissionGroup])],
})
export class prodoPermissionAndGroupModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(roleMiddleware)
      .exclude(
        // { path: 'internal/employee/profile', method: RequestMethod.PATCH },
        // 'employee/(.*)',                                                                        //* will check in the future*/
      )
      .forRoutes(prodoPermissionController,userRolesController);
  }

} 
