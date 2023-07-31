import { Module } from '@nestjs/common';
import { entitiesService } from './entities.service';
import { entitiesController } from './entities.controller';
import { Entitie } from './entity.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/user.entity';
import { Organization } from '../organization/organization.entity';
import { Company } from '../company/company.entity';

@Module({
  controllers: [entitiesController],
  providers: [entitiesService],
  imports : [TypeOrmModule.forFeature([Entitie,User,Organization,Company])],
  exports: [ entitiesService , TypeOrmModule.forFeature([Entitie])],

})
export class entitiesModule {}
