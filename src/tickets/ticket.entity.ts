import { ApiModelProperty } from "@nestjs/swagger";
import { Long } from "long";
import { Entity, ObjectIdColumn, ObjectID, Column } from "typeorm";

@Entity('Ticket')
export class Ticket  {
 
  @ApiModelProperty()
  @ObjectIdColumn()
  id: ObjectID ;

  @ApiModelProperty()
  @Column()
  subject: string;

  @ApiModelProperty()
  @Column()
  departmentid: Long;

  @ApiModelProperty()
  @Column()
  companyName: string ;

  @ApiModelProperty()
  @Column()
  email: string ;

  @ApiModelProperty()
  @Column()
  phone: string ;

  @ApiModelProperty()
  @Column()
  status : string ;


  
}
