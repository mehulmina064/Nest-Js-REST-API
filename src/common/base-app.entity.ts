import { AdditionalFields, AdditionalFieldsGroup } from './additional-fields.interface';
import { ApiModelProperty } from "@nestjs/swagger";
import { Column, CreateDateColumn, Unique, UpdateDateColumn } from "typeorm";

export class BaseAppEntity {
    @ApiModelProperty()
    @Column()
    additionalData:[];
    
    @ApiModelProperty()
    @CreateDateColumn()
    createdAt: Date;

    @ApiModelProperty()
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiModelProperty()
    @Column()
    deletedAt: Date;

    @ApiModelProperty()
    @Column()
    attachments: String[];


    @ApiModelProperty()
    @Column()
    createdBy: string | undefined;

    @ApiModelProperty()
    @Column()
    updatedBy: string | undefined;

    @ApiModelProperty()
    @Column()
    deletedBy: string | undefined;

}