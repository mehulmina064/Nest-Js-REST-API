import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

@Entity('contact-form')
export class ContactForm {

  @ApiModelProperty()
  @ObjectIdColumn()
  id: ObjectID;

  @ApiModelProperty()
  @Column()
  type: string;

  @ApiModelProperty()
  @Column()
  name: string;

  @ApiModelProperty()
  @Column()
  mobileNumber: string;

  @ApiModelProperty()
  @Column()
  email: string;

  @ApiModelProperty()
  @Column()
  linkedin: string;

  @ApiModelProperty()
  @Column()
  file: string;
  
}
