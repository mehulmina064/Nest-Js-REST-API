import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { OrganizationModel } from '../common/org-model.entity';
@Entity('addresses')
export class Address extends OrganizationModel{

  @ApiModelProperty()
  @ObjectIdColumn()
  id!: ObjectID;

  @ApiModelProperty()
  @Column()
  userId!: string;

  @ApiModelProperty()
  @Column({ default: 'Shipping' })
  addressType!: string;

  @ApiModelProperty()
  @Column()
  name!: string;

  @ApiModelProperty()
  @Column()
  contactNumber!: string;

  @ApiModelProperty()
  @Column()
  companyName!: string;

  @ApiModelProperty()
  @Column()
  gstin!: string;

  @ApiModelProperty()
  @Column()
  addressLine1!: string;

  @ApiModelPropertyOptional()
  @Column()
  addressLine2!: string;

  @ApiModelPropertyOptional()
  @Column()
  addressLine3!: string;

  @ApiModelProperty()
  @Column()
  city!: string;

  @ApiModelProperty()
  @Column()
  state!: string;

  @ApiModelProperty()
  @Column()
  country!: string;

  @ApiModelProperty()
  @Column()
  zipCode!: string;

  @ApiModelProperty()
  @Column()
  companyIds?: string [] = [] ;

  @ApiModelProperty()
  @Column()
  entityIds?: string[] =[];
}
