import { Entity, ObjectIdColumn,ObjectID, Column, Index } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { OrganizationModel } from '../common/org-model.entity';
import { BaseAppEntity } from './../common/base-app.entity';


@Entity('SmsTemplate')
export class SmsTemplate extends BaseAppEntity {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID
    
    @ApiModelProperty()
    @Column()
    mobile: string;

    @ApiModelProperty()
    @Column()
    template_id: string;


    @ApiModelProperty()
    @Column()
    authkey: string;
   
}

