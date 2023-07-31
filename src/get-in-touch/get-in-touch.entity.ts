import { BaseAppEntity } from './../common/base-app.entity';
import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

@Entity('get-in-touch')
export class GetInTouch extends BaseAppEntity {

  @ApiModelProperty()
  @ObjectIdColumn()
  id: ObjectID;

  @ApiModelProperty()
  @Column()
  name: string;

  @ApiModelProperty()
  @Column()
  mobileNumber: string;

  @ApiModelProperty()
  @Column()
  email: string;

  @ApiModelPropertyOptional()
  @Column()
  organisation?: string;

  @ApiModelProperty()
  @Column()
  message: string;

  @ApiModelProperty()
  @Column()
  formName: string;

  @ApiModelProperty()
  @Column()
  formType: string;

  @ApiModelProperty()
  @Column()
  formId: string;

  @ApiModelProperty()
  @Column()
  formData: {};

  @ApiModelProperty()
  @Column()
  formIP: string;

  @ApiModelProperty()
  @Column()
  formUserAgent: string;

  @ApiModelProperty()
  @Column()
  formSubmittedBy: string;

}
