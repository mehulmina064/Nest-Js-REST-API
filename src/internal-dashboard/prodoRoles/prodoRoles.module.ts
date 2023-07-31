import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { zohoToken } from '../../sms/token.entity';
import {zohoEmployeeModule} from './../zohoEmployee/zohoEmployee.module';
import { prodoRoles } from './prodoRoles.entity';
import { UserAndRoles } from './EmployeeAndRoles.entity';

import { prodoRolesService } from './prodoRoles.service';
import { prodoRolesController } from './prodoRoles.controller';
import { userRolesController } from './userRoles.controller';
import { userRolesService } from './userRoles.service';

//permission module import
import { RolesAndPermission } from '../prodoPermissionAndGroup/prodoRolesAndPermissionGroups.entity';
import { prodoPermissionGroup } from '../prodoPermissionAndGroup/prodoPermissionGroup.entity';
import { prodoPermissionService } from '../prodoPermissionAndGroup/prodoPermission.service';
import { rolesPermissionGroupService } from '../prodoPermissionAndGroup/rolesPermission.service';
import { roleMiddleware } from '../authentication/middleware';



@Module({
  imports: [
      TypeOrmModule.forFeature([zohoToken,prodoRoles,UserAndRoles,RolesAndPermission,prodoPermissionGroup]),zohoEmployeeModule
  ],
  controllers: [prodoRolesController,userRolesController],
  providers: [prodoRolesService,userRolesService,rolesPermissionGroupService,prodoPermissionService],
  exports:[prodoRolesService,userRolesService,rolesPermissionGroupService,prodoPermissionService]
})
export class prodoRolesModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(roleMiddleware)
      .exclude(
        // { path: 'internal/employee/profile', method: RequestMethod.PATCH },
        // 'employee/(.*)',                                                                        //* will check in the future*/
      )
      .forRoutes(prodoRolesController,userRolesController);
  }

} 

