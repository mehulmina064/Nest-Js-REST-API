import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

@Entity('wishlist')
export class Wishlist {

  @ApiModelProperty()
  @ObjectIdColumn()
  id: ObjectID;

  @ApiModelPropertyOptional()
  @Column()
  userId: string;

  @ApiModelProperty()
  @Column()
  productIds: string;
}
