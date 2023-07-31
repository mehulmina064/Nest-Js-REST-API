import { Column, Entity, ObjectID, ObjectIdColumn, Index } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../common/base-app.entity';
import { OrganizationModel } from '../common/org-model.entity';

@Entity('MailTrigger')
export class MailTrigger extends BaseAppEntity {

  @ApiModelProperty()
  @ObjectIdColumn()
  id: ObjectID;

  @ApiModelProperty()
  @Column()
  name: string;

  @ApiModelPropertyOptional()
  @Column()
  teams: string[];

  @ApiModelProperty()
  @Column()
  description: string;

  @ApiModelProperty()
  @Column()
  type: string;//user or admin

  @ApiModelProperty()
  @Column()
  templateName: string;//user or admin

  @ApiModelProperty()
  @Column()
  from: string;//user or admin

  @ApiModelProperty()
  @Column()
  subject: {
      text1: string,
      text2: string,
      text3: string
  }

  @ApiModelProperty()
  @Column()
  templatevars: {
      subjectVar: {
            var1: string,
            var2: string
      },
      bodyVar: {
      }
   }
}
