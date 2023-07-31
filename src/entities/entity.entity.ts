// export class Entity {}
import { Column, Entity, ObjectID, ObjectIdColumn, Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import {OrganizationModel} from './../common/org-model.entity';

export enum entityStatus {
  // Organization Status
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}



@Entity('entities')
export class Entitie extends OrganizationModel {
 
  @ApiModelProperty()
  @ObjectIdColumn()
  id: ObjectID | undefined;

  @Unique(['zipCode'])
  @ApiModelProperty()
  @Column()
  zipCode?: string | "";

  @ApiModelProperty()
  @Column()
  entityName?: string | "";

  @ApiModelProperty()
  @Column()
  description?: string | "";

  @ApiModelProperty()
  @Column({
      type: 'enum',
      enum: entityStatus,
      default: entityStatus.ACTIVE,
  })
  status: entityStatus | undefined;

  @ApiModelProperty()
  @Column()
  billingAddress?: string | "";

  @ApiModelProperty()
  @Column()
  shippingAddress?: string | "";   //adress+street2+city from zoho data

  @ApiModelProperty()
  @Column()
  entityContactNumber?: string | "";

  @ApiModelProperty()
  @Column({ default: 'IN' })
  entityCountry?: string | "IN";

  @ApiModelProperty()
  @Column()
  entityState?: string | "";

  @ApiModelProperty()
  @Column()
  entityCity?: string | "";

  @ApiModelProperty()
  @Column()
  companyId?: string | "";
  

  @ApiModelProperty()
  @Column()
  branches?: []|[];

  

  
}



