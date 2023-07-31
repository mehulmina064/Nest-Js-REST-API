import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity('settings')
export class Setting {

  @ApiModelProperty()
  @ObjectIdColumn()
  id: ObjectID;

  @ApiModelProperty()
  @Column()
  owner_id: string;

  @ApiModelProperty()
  @Column()
  owner_type: string;

  @ApiModelProperty()
  @Column()
  key: string;

  @ApiModelProperty()
  @Column()
  value: string;

  @ApiModelProperty()
  @Column()
  description: string;

  @ApiModelProperty()
  @Column()
  isActive: boolean;

  @ApiModelProperty()
  @Column()
  isSystem: boolean;

}
