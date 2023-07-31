import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseAppEntity } from '../common/base-app.entity';

export enum Status {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}
@Entity('categories')
export class Category extends BaseAppEntity {

  @ApiModelProperty()
  @ObjectIdColumn()
  id: ObjectID;

  @ApiModelPropertyOptional()
  @Column()
  parentCategoryId: string;

  @ApiModelProperty()
  @Column()
  categoryName: string;

  @ApiModelPropertyOptional()
  @Column()
  categoryImages: string[];

  @ApiModelPropertyOptional()
  @Column()
  categoryBanners: [];

  @ApiModelProperty()
  @Column()
  description: string;

  @ApiModelProperty()
  @Column({
        type: 'enum',
        enum: Status,
        default: Status.ACTIVE,
    })
    status: Status | undefined;
}
