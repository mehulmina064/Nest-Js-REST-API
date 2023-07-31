import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity('employeeOtp')
export class employeeOtp {

  @ApiModelProperty()
  @ObjectIdColumn()
  id: ObjectID| undefined;

  @ApiModelProperty()
  @Column()
  contactNumber: string| undefined;

  @ApiModelProperty()
  @Column()
  email: string| undefined;

  @ApiModelProperty()
  @Column()
  userId: string| undefined;

  @ApiModelProperty()
  @Column()
  otp: string| undefined;
}

