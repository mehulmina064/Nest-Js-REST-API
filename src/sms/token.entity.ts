import { Entity, ObjectIdColumn,ObjectID, Column, Index } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { OrganizationModel } from '../common/org-model.entity';
import { BaseAppEntity } from './../common/base-app.entity';


@Entity('zohoToken')
export class zohoToken extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID
    
    @ApiModelProperty()
    @Column()
    token: string;

}
