import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity('otp')
export class Otp {

  @ApiModelProperty()
  @ObjectIdColumn()
  id: ObjectID;

  @ApiModelProperty()
  @Column()
  contactNumber: string;

  @ApiModelProperty()
  @Column()
  email: string;

  @ApiModelProperty()
  @Column()
  userId: string;

  @ApiModelProperty()
  @Column()
  otp: string;
}

