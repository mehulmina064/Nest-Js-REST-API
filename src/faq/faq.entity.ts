import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

@Entity('faq')
export class Faq {

  @ApiModelProperty()
  @ObjectIdColumn()
  id: ObjectID;

  @ApiModelProperty()
  @Column()
  type: string;

  @ApiModelProperty()
  @Column()
  question: string;

  @ApiModelProperty()
  @Column()
  answer: string;
}
