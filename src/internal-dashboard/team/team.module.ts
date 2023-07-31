import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from "@nestjs/typeorm";
import { zohoToken } from '../../sms/token.entity';
import {zohoEmployeeModule} from '../zohoEmployee/zohoEmployee.module';

import { internalTeam } from './team.entity';
import { UserAndTeam } from './EmployeeAndTeam.entity';
import { internalTeamService } from './team.service';
import { prodoRolesController } from './team.controller';
import { userTeamController } from './userTeam.controller';
import { userTeamService } from './userTeam.service';
import { roleMiddleware } from '../authentication/middleware';

@Module({
  imports: [
      TypeOrmModule.forFeature([zohoToken,internalTeam,UserAndTeam]),zohoEmployeeModule
  ],
  controllers: [prodoRolesController,userTeamController],
  providers: [internalTeamService,userTeamService],
  exports:[internalTeamService,userTeamService]
})
export class InternalTeamModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(roleMiddleware)
      .exclude(
        // { path: 'internal/employee/profile', method: RequestMethod.PATCH },
        // 'employee/(.*)',                                                                        //* will check in the future*/
      )
      .forRoutes(prodoRolesController,userTeamController);
  }

} 

