import { Injectable } from '@nestjs/common';
import { ApiModelProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseAppEntity } from '../common/common.entity';
import { Column, Entity, Generated, ObjectID, ObjectIdColumn, Unique } from 'typeorm';

@Entity('SupplyChainFeedItem')
export class SupplyChainFeedItem extends BaseAppEntity {
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID | undefined;

    // Auto Increment Field
    @ApiModelProperty()
    @Column({ type: 'int', nullable: true })
    @Generated('increment')
    index: number | undefined;

    @ApiModelProperty()
    @Column()
    documentId!: string;

    @ApiModelProperty()
    @Column()
    action!: string;

    @ApiModelProperty()
    @Column()
    actionDate!: Date;

    @ApiModelProperty()
    @Column()
    actor!: string;


}