// Create Supply Chain Entity 

import { Injectable } from '@nestjs/common';
import { ApiModelProperty } from '@nestjs/swagger';
import { InjectRepository } from '@nestjs/typeorm';
import { OrganizationModel } from '../common/org-model.entity';
import { Column, Entity, ObjectID, ObjectIdColumn, Repository, Unique } from 'typeorm';
import { SupplyChainFeedItem } from './supply-chain-item.entity';
export enum SupplyChainType {
    //Supply chain type
    PurchaseOrder = "PurchaseOrder",
    ECOMMERCE = "ECOMMERCE",
    RFQ = "RFQ",
    Other = "Other",
}
@Entity('SupplyChain')
export class SupplyChain extends OrganizationModel {
    @ApiModelProperty()
    @ObjectIdColumn()
    id: ObjectID;

    @ApiModelProperty()
    @Column( { enum: SupplyChainType, nullable: true } )
    supplychainType: SupplyChainType;

    @ApiModelProperty()
    @Column({unique: true})
    supplychainSerialNumber: string;

    @ApiModelProperty()
    @Column()
    supplychainName: string;

    @ApiModelProperty()
    @Column()
    supplychainDescription: string;

    @ApiModelProperty()
    @Column()
    supplychainStatus: string;

    @ApiModelProperty()
    @Column()
    supplychainStartDate: Date;

    @ApiModelProperty()
    @Column()
    supplychainEndDate: Date;

    @ApiModelProperty()
    @Column()
    supplychainItems: SupplyChainFeedItem[];

}
