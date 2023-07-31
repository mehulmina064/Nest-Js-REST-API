import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../common/base-app.entity';
@Entity('Team')
export class Team extends BaseAppEntity {

  @ApiModelProperty()
  @ObjectIdColumn()
  id: ObjectID;

  @ApiModelProperty()
  @Column()
  name: string;

  @ApiModelPropertyOptional()
  @Column()
  mails: string[]= [];

  @ApiModelPropertyOptional()
  @Column()
  admins: string[]= [];

  @ApiModelPropertyOptional()
  @Column()
  users: string[]= [];

  @ApiModelProperty()
  @Column()
  description: string;
}
