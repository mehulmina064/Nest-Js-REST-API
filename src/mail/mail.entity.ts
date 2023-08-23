import { Entity, ObjectIdColumn,ObjectId, Column, Index } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { OrganizationModel } from '../common/org-model.entity';


@Entity('EmailTemplate')
export class EmailTemplate extends OrganizationModel {
    
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectId
    
    @ApiModelProperty()
    @Column()
    name: string;

    @ApiModelProperty()
    @Column()
    subject: string;

    @ApiModelProperty()
    @Column()
    body: string;

    @ApiModelProperty()
    @Column()
    isActive: boolean;

    @ApiModelProperty()
    @Column()
    isDefault: boolean;

    @ApiModelProperty()
    @Column()
    isSystem: boolean;

    @ApiModelProperty()
    @Column()
    actionAvailable: { from: []; to: []; };

    @ApiModelProperty()
    @Column()
    isHtml: boolean;
   
}

