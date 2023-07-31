import { ApiModelProperty } from "@nestjs/swagger";
import { Column } from "typeorm";

export class BaseAppEntity {
    @ApiModelProperty()
    @Column()
    public_id!: string;
    
    @ApiModelProperty()
    @Column()
    createdAt: string | undefined;

    @ApiModelProperty()
    @Column()
    updatedAt: string | undefined;

    @ApiModelProperty()
    @Column()
    deletedAt: string | undefined;


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