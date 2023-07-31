import { Column } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

export class ProductVariant {
  @ApiModelProperty()
  @Column()
  name: string;

  @ApiModelProperty()
  @Column()
  price: string;

  @ApiModelProperty()
  @Column()
  images: [];
}
