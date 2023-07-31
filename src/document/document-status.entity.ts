import { OrganizationModel } from './../common/org-model.entity';
import { BaseAppEntity } from './../common/base-app.entity';
import { Entity, ObjectIdColumn, ObjectID, Column, Index } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { DocumentType,DocumentAction } from './document.entity';
// Create Entity for Document Status

@Entity('documentStatus')
export class DocumentStatus extends BaseAppEntity {
    @ObjectIdColumn()
    id: ObjectID 
    @Column()
    status: string;
    @Column()
    description: string;
    @Column()
    code: string;
    @Column()
    type: string;
    @Column()
    index: number;
    @Column()
    is_active: boolean = false;
    @Column()
    is_default: boolean = false;
    @Column()
    is_system: boolean = false;
    @Column()
    location: string;
    @Column()
    timestamp: Date;

    @Column()
    actionAvailable!: { from: []; to: []; };

}

@Entity('statusTemplate')
export class StatusTemplate extends BaseAppEntity {
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID
    @ApiModelProperty()
    @Column()
    statuses: DocumentStatus[] = [];
    @ApiModelProperty()
    @Column()
    type: DocumentType = "RFQ";
}

