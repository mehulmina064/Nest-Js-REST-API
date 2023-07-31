import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Product } from '../product/product.entity';
import { UserRole } from '../users/user.entity';
enum Status {
  Pending = 'Pending',
  Approved = 'Approved',
  Rejected = 'Rejected',
}

@Entity('white-labeling-or-rfq')
export class WhiteLabelingOrRfq {

  @ApiModelProperty()
  @ObjectIdColumn()
  id: ObjectID;

  @ApiModelPropertyOptional()
  @Column()
  userId?: string;

  @ApiModelProperty()
  @Column()
  type: string; // white-labeling | rfq

  @ApiModelProperty()
  @Column()
  name: string;

  @ApiModelProperty()
  @Column()
  mobileNumber: string;

  @ApiModelProperty()
  @Column()
  workEmail: string;

  @ApiModelProperty()
  @Column()
  organisation: string;

  @ApiModelPropertyOptional()
  @Column()
  gstin?: string;

  @ApiModelProperty()
  @Column()
  city: string;

  @ApiModelPropertyOptional()
  @Column()
  pinCode?: string;

  @ApiModelProperty()
  @Column()
  products: []; // name, quantity

  @ApiModelProperty()
  @Column()
  file: string;

  @ApiModelProperty()
  @Column()
  additionalDetails: string;

  @ApiModelProperty()
  @Column()
  rfqStatus: RoleStatus[]; // pending | approved | rejected

}

// create rolestatus dto
 export class RoleStatus {
  status: Status; // pending | approved | rejected
  role: UserRole; // admin | user}
 }

