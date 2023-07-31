import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

@Entity('products')
export class Product {

  @ApiModelProperty()
  @ObjectIdColumn()
  id!: ObjectID;

  @ApiModelProperty()
  @Column()
  categoryId!: string;

  @ApiModelProperty()
  @Column()
  productName!: string;

  @ApiModelProperty()
  @Column()
  sku!: string;

  @ApiModelPropertyOptional()
  @Column()
  seo?: string;

  @ApiModelPropertyOptional()
  @Column()
  subTitle?: string;

  @ApiModelProperty()
  @Column({ default: false })
  prodoExclusive: boolean = false;

  @ApiModelProperty()
  @Column()
  paymentTerms!: string;

  @ApiModelProperty()
  @Column({ default: false })
  greenProduct: boolean = false;

  @ApiModelProperty()
  @Column()
  description!: string;

  @ApiModelProperty()
  @Column()
  productImages: [] = [];

  @ApiModelProperty()
  @Column()
  price!: number;

  @ApiModelProperty()
  @Column()
  leadTime!: string;

  @ApiModelProperty()
  @Column()
  moq!: string;

  @ApiModelProperty()
  @Column({ default: false })
  readyProduct: boolean = false;

  @ApiModelProperty()
  @Column({ default: false })
  madeToOrder: boolean = false;

  @ApiModelProperty()
  @Column({ default: false })
  whiteLabeling: boolean = false;

  @ApiModelProperty()
  @Column({ default: false })
  ecoFriendly: boolean = false;

  @ApiModelProperty()
  @Column()
  protectionLevel!: string;

  @ApiModelProperty()
  @Column()
  variants: [] = [];

  @ApiModelProperty()
  @Column()
  similarProductIds: [] = [];

  @ApiModelProperty()
  @Column()
  productType!: string;

  @ApiModelProperty()
  @Column()
  productStatus!: string;

  @ApiModelProperty()
  @Column()
  productStatusValue!: string;

  @ApiModelProperty()
  @Column()
  hsnCode!: string;

  @ApiModelProperty()
  @Column()
  zohoBooksProduct: boolean = false ;

  @ApiModelProperty()
  @Column()
  zohoBooksProductId: string = '';

  @ApiModelProperty()
  @Column()
  date: string = '2022-08-02' ;

  @ApiModelProperty()
  @Column()
  isVisible: boolean = true;



}
