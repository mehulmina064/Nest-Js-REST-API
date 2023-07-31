import { Column, CreateDateColumn, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { Tracking } from '../tracking/tracking.entity';
import { OrganizationModel } from '../common/org-model.entity';

@Entity('orders')
export class Order extends OrganizationModel {

  @ApiModelProperty()
  @ObjectIdColumn()
  id!: ObjectID;

  @ApiModelProperty()
  @Column()
  userId!: string;

  @ApiModelProperty()
  @Column()
  billingAddressId!: string;

  @ApiModelProperty()
  @Column()
  shippingAddressId!: string;

  @ApiModelProperty()
  @Column()
  products!: []; // productId, productVariant, quantity, price, totalPrice
 // productId, productVariant, quantity, price, totalPrice

  @ApiModelProperty()
  @Column()
  orderStatus!: string;

  @ApiModelPropertyOptional()
  @Column()
  paymentGatewayDetails?: any;

  @ApiModelPropertyOptional()
  @Column()
  purchaseOrderPath?: string;

  @ApiModelPropertyOptional()
  @Column(type => Tracking)
  tracking!: Tracking;
  
  @ApiModelPropertyOptional()
  @Column()
  trackingId!: string;

  @ApiModelPropertyOptional()
  @Column()
  invoiceFiles?: [];
  
}