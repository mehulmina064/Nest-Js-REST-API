import { Column, Entity, ObjectID, ObjectIdColumn, Unique } from 'typeorm';
import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import {OrganizationModel} from './../common/org-model.entity';

export enum companyStatus {
  // Organization Status
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  DELETED = 'DELETED',
}

@Entity('company')
export class Company extends OrganizationModel {
 
  @ApiModelProperty()
  @ObjectIdColumn()
  id: ObjectID | undefined;

  @Unique(['gstNo'])
  @ApiModelProperty()
  @Column()
  gstNo?: string | "";

  @ApiModelProperty()
  @Column({default: 'IN'})
  companyCountry?: string | 'IN';

  @ApiModelProperty()
  @Column()
  companyName?: string | "";

  @ApiModelProperty()
  @Column()
  description?: string | "";

  @ApiModelProperty()
  @Column({
      type: 'enum',
      enum: companyStatus,
      default: companyStatus.ACTIVE,
  })
  status: companyStatus | undefined;

  @ApiModelProperty()
  @Column()
  logo?: string | "";

  @ApiModelProperty()
  @Column()
  companyCin: string | undefined;

  @ApiModelProperty()
  @Column()
  companyCinImage: string | undefined;

  @ApiModelProperty()
  @Column()
  companyContactNumber?: string | "";

  @ApiModelProperty()
  @Column()
  companyState?: string | "";
    
  @ApiModelProperty()
  @Column()
  entityIds?: string [] =[];

}
