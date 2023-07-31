import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity('prodo-partner')
export class ProdoPartner {

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

  @ApiModelProperty()
  @Column()
  productDetails: string;

  @ApiModelProperty()
  @Column()
  capacity: string;

  @ApiModelProperty()
  @Column()
  unitLocations: string;
}
